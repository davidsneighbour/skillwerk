import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  parseDotenv,
  readDotenvWithSources,
} from "../../posthaste-config/resources/dotenv.ts";
import {
  checkTargets,
  credentialRule,
  explainFailure,
  preflight,
} from "./credential-check.ts";

const cases: [string, string, string, string[], string[]][] = [
  [
    "mastodon",
    "host",
    "mas.to",
    ["mas.to:443"],
    [
      "https://mas.to",
      "mas.to/",
      "https://mas.to/",
      "mas.to/path",
      "mas.to?x=1",
    ],
  ],
  [
    "bluesky",
    "host",
    "bsky.social",
    ["pds.example.com"],
    [
      "https://bsky.social",
      "bsky.social/",
      "https://bsky.social/",
      "bsky.app",
      "BSKY.APP:443",
    ],
  ],
  [
    "bluesky",
    "identifier",
    "user.bsky.social",
    [
      "custom.example",
      "did:plc:abc",
      "did:web:example.com",
      "user@example.com",
    ],
    ["user", "@user.bsky.social", "https://example.com", "example.com/"],
  ],
  [
    "nostr",
    "relays",
    "wss://relay.example",
    ["wss://one.example,wss://two.example/"],
    [
      "https://relay.example",
      "ws://relay.example",
      "wss://",
      "wss://one.example,https://two.example",
    ],
  ],
  [
    "reddit",
    "subreddit",
    "typescript",
    ["some_name"],
    [
      "r/typescript",
      "/r/typescript",
      "https://reddit.com/r/typescript",
      "typescript/",
    ],
  ],
  [
    "tumblr",
    "blog_identifier",
    "my-blog",
    ["my-blog.tumblr.com"],
    [
      "https://my-blog.tumblr.com",
      "my-blog/",
      "https://my-blog.tumblr.com/",
      "my-blog/path",
    ],
  ],
];
for (const [network, key, valid, additional, invalid] of cases) {
  test(`${network} ${key}: format rules and dotenv quotes/export`, () => {
    for (const value of [valid, ...additional, ...invalid]) {
      for (const prefix of ["", "export "])
        for (const quote of ["", '"', "'"]) {
          const parsed =
            parseDotenv(`${prefix}KEY=${quote}${value}${quote}`).KEY ?? "";
          assert.equal(
            Boolean(credentialRule(network, key, parsed).error),
            invalid.includes(value),
          );
        }
    }
  });
}
test("Bluesky password format warns only", () => {
  assert.deepEqual(
    credentialRule("bluesky", "password", "xxxx-xxxx-xxxx-xxxx"),
    {},
  );
  for (const value of [
    "old-password",
    "https://secret",
    "secret/",
    "https://secret/",
  ]) {
    for (const prefix of ["", "export "])
      for (const quote of ["", '"', "'"]) {
        const result = credentialRule(
          "bluesky",
          "password",
          parseDotenv(`${prefix}KEY=${quote}${value}${quote}`).KEY ?? "",
        );
        assert.ok(result.warning);
        assert.equal(result.error, undefined);
        assert.ok(!result.warning.includes(value));
      }
  }
});
for (const [network, raw, expected] of [
  ["mastodon", "getaddrinfo EAI_AGAIN https", "Remove https://"],
  ["bluesky", "getaddrinfo ENOTFOUND https", "Remove https://"],
  ["mastodon", "getaddrinfo ENOTFOUND private-host", "network connection"],
  ["bluesky", "JSON.parse", "bare API host"],
  ["bluesky", "Unexpected token <", "bare API host"],
  ["bluesky", "401 : Failed to create session", "current full handle"],
  ["linkedin", "401 Failed to retrieve person URN", "renewal section"],
  ["mastodon", "401", "another instance"],
  ["threads", "401", "refresh-token skill"],
  ["tumblr", "403", "permissions"],
  ["reddit", "429", "rate limit"],
  ["nostr", "unknown private detail", "service availability"],
])
  test(`safe error mapping: ${network} ${raw}`, () => {
    const message = explainFailure(network ?? "", raw);
    assert.ok(message.includes(expected ?? ""));
    assert.ok(!message.includes("private-host"));
    assert.ok(!message.includes("private detail"));
  });
const response = (body: unknown, status = 200, type = "application/json") =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": type },
  });
test("Bluesky rejects HTML and 401 before session or publish", async () => {
  let calls = 0;
  const html: typeof fetch = async () => {
    calls++;
    return response({}, 200, "text/html");
  };
  await assert.rejects(
    preflight("bluesky", { host: "bsky.social" }, html),
    /non-JSON/,
  );
  assert.equal(calls, 1);
  const denied: typeof fetch = async (url) =>
    String(url).includes("describeServer") ? response({}) : response({}, 401);
  const failures = await checkTargets(
    [
      {
        network: "bluesky",
        credentials: {
          host: "bsky.social",
          identifier: "old.example",
          password: "secret",
        },
      },
      {
        network: "mastodon",
        credentials: { host: "mas.to", access_token: "secret" },
      },
    ],
    denied,
  );
  assert.equal(failures.length, 2);
  assert.ok(failures[0]?.includes("current full handle"));
  assert.ok(!JSON.stringify(failures).includes("secret"));
});
test("preflight uses read endpoints, validates account IDs, and attempts all targets", async () => {
  const urls: string[] = [];
  const mock: typeof fetch = async (url, init) => {
    urls.push(String(url));
    assert.equal(init?.redirect, "error");
    if (String(url).includes("createSession"))
      return response({ did: "did:plc:test", accessJwt: "fixture" });
    if (String(url).includes("user/info"))
      return response({
        response: { user: { blogs: [{ name: "my-blog", admin: true }] } },
      });
    return response({ id: "123", sub: "123" });
  };
  const targets = [
    "bluesky",
    "mastodon",
    "linkedin",
    "reddit",
    "threads",
    "tumblr",
  ].map((network) => ({
    network,
    credentials: {
      host: "api.example",
      access_token: "fixture",
      user_id: "123",
      blog_identifier: "my-blog",
    },
  }));
  assert.deepEqual(await checkTargets(targets, mock), []);
  assert.equal(urls.length, 7);
  assert.ok(urls.every((url) => !/submit|threads_publish|\/posts/.test(url)));
  await assert.rejects(preflight("threads", { user_id: "456" }, mock), /403/);
  await assert.rejects(
    preflight("tumblr", { blog_identifier: "other" }, mock),
    /403/,
  );
});
test("Reddit refresh credential path checks the resulting token without writing", async () => {
  const urls: string[] = [];
  const mock: typeof fetch = async (url) => {
    urls.push(String(url));
    return response(
      String(url).includes("access_token")
        ? { access_token: "fixture" }
        : { id: "123" },
    );
  };
  await preflight(
    "reddit",
    {
      client_id: "fixture",
      client_secret: "fixture",
      refresh_token: "fixture",
      user_agent: "fixture",
    },
    mock,
  );
  assert.equal(urls.length, 2);
});
test("dotenv sources preserve layer order and process precedence", async () => {
  const root = await mkdtemp(join(tmpdir(), "posthaste-sources-"));
  const home = join(root, "home");
  const cwd = join(root, "project");
  await mkdir(home);
  await mkdir(cwd);
  await writeFile(
    join(home, ".env"),
    "HOST=global\nPASSWORD=global\nTOKEN=global",
  );
  await writeFile(join(cwd, ".env"), "export HOST='project'");
  await writeFile(join(cwd, "selected.env"), "TOKEN=selected");
  const result = await readDotenvWithSources("selected.env", {
    home,
    cwd,
    environment: { PASSWORD: "process" },
  });
  assert.deepEqual(result.projectOverrides, ["HOST"]);
  assert.match(result.sources.HOST ?? "", /^project:/);
  assert.match(result.sources.TOKEN ?? "", /^--dotenv:/);
  assert.equal(result.sources.PASSWORD, "process environment");
  assert.equal(result.values.PASSWORD, "process");
});
