import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadPosthasteConfig } from "../../posthaste-config/resources/config.ts";
import { crosspostEnvironment, selectNetworks } from "./post-crosspost.ts";

const RESOURCE_DIR = dirname(fileURLToPath(import.meta.url));
const POST_CROSSPOST = join(RESOURCE_DIR, "post-crosspost.ts");
const CHECK_POSTED_LOG = join(RESOURCE_DIR, "check-posted-log.ts");
const SECRET = "fixture-secret-value-do-not-print";

interface Sandbox {
  home: string;
  cwd: string;
  globalConfigPath: string;
  projectConfigPath: string;
}

async function sandbox(
  globalToml?: string,
  projectToml?: string,
  dotenv?: string,
): Promise<Sandbox> {
  const root = await mkdtemp(join(tmpdir(), "prepare-link-test-"));
  const home = join(root, "home");
  const cwd = join(root, "project");
  const globalConfigPath = join(home, ".config", "posthaste", "config.toml");
  const projectConfigPath = join(cwd, ".posthaste.toml");

  await mkdir(dirname(globalConfigPath), { recursive: true });
  await mkdir(cwd, { recursive: true });

  if (globalToml) {
    await writeFile(globalConfigPath, globalToml, "utf8");
  }

  if (projectToml) {
    await writeFile(projectConfigPath, projectToml, "utf8");
  }

  if (dotenv) {
    await writeFile(join(home, ".env"), dotenv, {
      encoding: "utf8",
      mode: 0o600,
    });
  }

  return { home, cwd, globalConfigPath, projectConfigPath };
}

function run(
  script: string,
  box: Sandbox,
  args: string[],
  env: Record<string, string> = {},
): { status: number | null; stdout: string; stderr: string } {
  // Start from an empty environment so real credentials never reach the script.
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: box.cwd,
    encoding: "utf8",
    env: { PATH: process.env.PATH ?? "", HOME: box.home, ...env },
  });

  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

test("--info reports config sources, provenance, and env names without values", async () => {
  const box = await sandbox(
    `
[posting]
default_networks = ["mastodon"]
`,
    `
[posting]
default_networks = ["mastodon", "linkedin"]

[networks.mastodon.env]
access_token = "POSTHASTE_MASTODON_TOKEN"
`,
    `LINKEDIN_ACCESS_TOKEN=${SECRET}\n`,
  );
  const result = run(POST_CROSSPOST, box, ["--info"], {
    POSTHASTE_MASTODON_TOKEN: SECRET,
    MASTODON_HOST: "mastodon.example",
  });

  assert.equal(result.status, 0, result.stderr);
  const info = JSON.parse(result.stdout) as Record<string, unknown> & {
    supportedNetworks: Record<
      string,
      { env: Record<string, string>; envProvenance: Record<string, string> }
    >;
  };

  assert.equal(info.globalConfigPath, box.globalConfigPath);
  assert.equal(info.globalConfigPresent, true);
  assert.equal(info.projectConfigPath, box.projectConfigPath);
  assert.equal(info.projectConfigPresent, true);
  assert.deepEqual(info.effectiveDefaultNetworks, ["mastodon", "linkedin"]);
  assert.equal(info.effectiveDefaultNetworksProvenance, "project");
  assert.equal(info.dotenvPath, join(box.home, ".env"));
  assert.equal(info.dotenvPathProvenance, "default");
  assert.equal(
    info.supportedNetworks.mastodon?.env.access_token,
    "POSTHASTE_MASTODON_TOKEN",
  );
  assert.equal(
    info.supportedNetworks.mastodon?.envProvenance.access_token,
    "project",
  );
  assert.deepEqual(info.configuredNetworks, ["mastodon", "linkedin"]);
  assert.doesNotMatch(result.stdout, new RegExp(SECRET, "u"));
  assert.doesNotMatch(result.stderr, new RegExp(SECRET, "u"));
});

test("--to overrides posting.default_networks", async () => {
  const box = await sandbox(`
[posting]
default_networks = ["mastodon"]
`);
  const result = run(
    POST_CROSSPOST,
    box,
    ["--dry-run", "--message", "Hello", "--to", "linkedin"],
    { LINKEDIN_ACCESS_TOKEN: SECRET },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Dry run for linkedin\./u);
  assert.doesNotMatch(result.stdout, /Dry run for mastodon\./u);
  assert.doesNotMatch(result.stdout, new RegExp(SECRET, "u"));
});

test("posting.default_networks selects networks when --to is absent", async () => {
  const box = await sandbox(`
[posting]
default_networks = ["linkedin"]
`);
  const result = run(POST_CROSSPOST, box, ["--dry-run", "--message", "Hi"], {
    LINKEDIN_ACCESS_TOKEN: SECRET,
    MASTODON_ACCESS_TOKEN: SECRET,
    MASTODON_HOST: "mastodon.example",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Dry run for linkedin\./u);
  assert.doesNotMatch(result.stdout, /Dry run for mastodon\./u);
});

test("--to with a disabled network fails before publishing", async () => {
  const box = await sandbox(`
[networks.linkedin]
enabled = false
`);
  const result = run(
    POST_CROSSPOST,
    box,
    ["--dry-run", "--message", "Hello", "--to", "linkedin"],
    { LINKEDIN_ACCESS_TOKEN: SECRET },
  );

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /explicit network selection includes disabled network linkedin; networks\.linkedin\.enabled is false \(from global\)/u,
  );
  assert.doesNotMatch(result.stdout, /Dry run for/u);
});

test("renamed Crosspost variables are mapped to the names Crosspost reads", async () => {
  const box = await sandbox(`
[networks.mastodon.env]
access_token = "POSTHASTE_MASTODON_TOKEN"
`);
  const result = run(
    POST_CROSSPOST,
    box,
    ["--dry-run", "--message", "Hello", "--to", "mastodon"],
    {
      POSTHASTE_MASTODON_TOKEN: SECRET,
      MASTODON_HOST: "mastodon.example",
    },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stdout,
    /Crosspost env mapping: POSTHASTE_MASTODON_TOKEN -> MASTODON_ACCESS_TOKEN/u,
  );
  assert.doesNotMatch(result.stdout, new RegExp(SECRET, "u"));
});

test("crosspostEnvironment copies renamed values and uses the effective dotenv path", async () => {
  const box = await sandbox(`
[paths]
dotenv = "~/custom.env"

[networks.mastodon.env]
access_token = "POSTHASTE_TEST_ONLY_MASTODON_TOKEN"
`);
  const config = await loadPosthasteConfig({
    cwd: box.cwd,
    globalConfigPath: box.globalConfigPath,
    projectConfigPath: box.projectConfigPath,
    knownNetworks: ["mastodon", "linkedin"],
  });
  const { env, renamed } = crosspostEnvironment(
    config,
    ["mastodon", "linkedin"],
    { POSTHASTE_TEST_ONLY_MASTODON_TOKEN: SECRET },
  );

  assert.equal(env.MASTODON_ACCESS_TOKEN, SECRET);
  assert.deepEqual(renamed, {
    POSTHASTE_TEST_ONLY_MASTODON_TOKEN: "MASTODON_ACCESS_TOKEN",
  });
  assert.match(env.CROSSPOST_DOTENV ?? "", /custom\.env$/u);
  assert.doesNotMatch(JSON.stringify(renamed), new RegExp(SECRET, "u"));
});

test("explicit --dotenv wins over CROSSPOST_DOTENV for Crosspost", async () => {
  const box = await sandbox();
  const explicitDotenv = join(box.cwd, "explicit.env");
  await writeFile(explicitDotenv, `LINKEDIN_ACCESS_TOKEN=${SECRET}\n`, "utf8");
  const result = run(
    POST_CROSSPOST,
    box,
    [
      "--dry-run",
      "--message",
      "Hello",
      "--to",
      "linkedin",
      "--dotenv",
      explicitDotenv,
    ],
    { CROSSPOST_DOTENV: join(box.home, "other.env") },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stdout,
    new RegExp(`CROSSPOST_DOTENV: ${explicitDotenv}`, "u"),
  );
});

test("selectNetworks prefers --to, then configured defaults, then credentials", async () => {
  const box = await sandbox(
    undefined,
    `
[posting]
default_networks = ["mastodon"]
`,
  );
  const config = await loadPosthasteConfig({
    cwd: box.cwd,
    globalConfigPath: box.globalConfigPath,
    projectConfigPath: box.projectConfigPath,
    knownNetworks: ["mastodon", "linkedin"],
  });

  assert.deepEqual(
    selectNetworks({ targetNetworks: ["linkedin"] }, config, {}),
    ["linkedin"],
  );
  assert.deepEqual(selectNetworks({ targetNetworks: [] }, config, {}), [
    "mastodon",
  ]);
});

test("check-posted-log reports against configured default networks", async () => {
  const box = await sandbox(`
[posting]
default_networks = ["mastodon", "bluesky"]
`);
  const result = run(CHECK_POSTED_LOG, box, [
    "--url",
    "https://example.com/post",
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout).missingNetworks, [
    "mastodon",
    "bluesky",
  ]);
});

test("broken session values block all publishing and do not leak credentials", async () => {
  for (const override of [
    'MASTODON_HOST="https://mas.to"',
    "export BLUESKY_HOST='bsky.social/'",
    "BLUESKY_HOST=bsky.app",
    "BLUESKY_IDENTIFIER=old.example",
  ]) {
    const box = await sandbox(
      undefined,
      undefined,
      `MASTODON_HOST=mas.to\nMASTODON_ACCESS_TOKEN=${SECRET}\nBLUESKY_HOST=bsky.social\nBLUESKY_IDENTIFIER=current.example\nBLUESKY_PASSWORD=xxxx-xxxx-xxxx-xxxx`,
    );
    await writeFile(join(box.cwd, ".env"), override);
    const mock = join(box.cwd, "mock.mjs");
    await writeFile(
      mock,
      `globalThis.fetch = async (url) => new Response(JSON.stringify(String(url).includes('createSession') ? {} : { id: '123' }), { status: String(url).includes('createSession') ? 401 : 200, headers: { 'content-type': 'application/json' } });`,
    );
    // An isolated PATH stub ensures a regression cannot invoke the real publisher.
    await writeFile(
      join(box.cwd, "npx"),
      "#!/bin/sh\necho PUBLISH_ATTEMPT >&2\nexit 99\n",
      { mode: 0o700 },
    );
    const result = spawnSync(
      process.execPath,
      [
        "--import",
        mock,
        POST_CROSSPOST,
        "--to",
        "mastodon,bluesky",
        "--message",
        "fixture",
        "--no-log",
      ],
      {
        cwd: box.cwd,
        encoding: "utf8",
        env: { HOME: box.home, PATH: box.cwd },
      },
    );
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Nothing published/);
    assert.ok(!result.stderr.includes("PUBLISH_ATTEMPT"));
    assert.ok(!result.stderr.includes(SECRET));
    assert.ok(!result.stderr.includes("old.example"));
    assert.match(result.stderr, /project:|current full handle/);
  }
});

test("--info shows credential sources and partial project override warning", async () => {
  const box = await sandbox(
    undefined,
    undefined,
    `BLUESKY_HOST=bsky.social\nBLUESKY_IDENTIFIER=current.example\nBLUESKY_PASSWORD=${SECRET}`,
  );
  await writeFile(join(box.cwd, ".env"), 'export BLUESKY_HOST="bsky.app"');
  const result = run(POST_CROSSPOST, box, ["--info", "--to", "bluesky"]);
  assert.equal(result.status, 0);
  const info = JSON.parse(result.stdout) as {
    credentialSources: { bluesky: Record<string, string> };
    credentialErrors: string[];
  };
  assert.match(info.credentialSources.bluesky.BLUESKY_HOST ?? "", /^project:/);
  assert.match(
    info.credentialSources.bluesky.BLUESKY_PASSWORD ?? "",
    /^global:/,
  );
  assert.equal(info.credentialErrors.length, 1);
  assert.match(result.stderr, /only some credential keys/);
  assert.ok(!`${result.stdout}${result.stderr}`.includes(SECRET));
});

test("--check needs no message and aggregates authentication failures", async () => {
  const box = await sandbox(
    undefined,
    undefined,
    `MASTODON_HOST=mas.to\nMASTODON_ACCESS_TOKEN=${SECRET}\nBLUESKY_HOST=bsky.social\nBLUESKY_IDENTIFIER=current.example\nBLUESKY_PASSWORD=xxxx-xxxx-xxxx-xxxx`,
  );
  const mock = join(box.cwd, "mock.mjs");
  await writeFile(
    mock,
    `globalThis.fetch = async () => new Response('{}', { status: 401, headers: { 'content-type': 'application/json' } });`,
  );
  const result = spawnSync(
    process.execPath,
    ["--import", mock, POST_CROSSPOST, "--check", "--to", "mastodon,bluesky"],
    { cwd: box.cwd, encoding: "utf8", env: { HOME: box.home, PATH: box.cwd } },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /mastodon:.*Token revoked/);
  assert.match(result.stderr, /bluesky:.*Session authentication failed/);
  assert.ok(!result.stderr.includes(SECRET));
});

test("Mastodon accepts 500 characters and rejects 501 before publishing", async () => {
  const box = await sandbox();
  const env = {
    MASTODON_ACCESS_TOKEN: SECRET,
    MASTODON_HOST: "mastodon.example",
  };
  // Include a URL, hashtags, and a non-BMP character in the complete message.
  const suffix = " https://example.com #test 🐘";
  const message = "a".repeat(500 - [...suffix].length) + suffix;
  const accepted = run(
    POST_CROSSPOST,
    box,
    ["--dry-run", "--message", message, "--to", "mastodon"],
    env,
  );
  assert.equal(accepted.status, 0, accepted.stderr);
  assert.match(accepted.stdout, /Dry run for mastodon\./u);
  assert.match(accepted.stdout, /Characters: 500/u);

  const rejected = run(
    POST_CROSSPOST,
    box,
    ["--dry-run", "--message", `${message}a`, "--to", "mastodon"],
    env,
  );
  assert.equal(rejected.status, 1);
  assert.match(rejected.stderr, /mastodon: 501\/500 characters/u);
  assert.doesNotMatch(rejected.stdout, /Dry run for mastodon/u);
});

test("--image-url passes the URL to pinned Crosspost and needs alt text", async () => {
  const box = await sandbox();
  const env = {
    MASTODON_ACCESS_TOKEN: SECRET,
    MASTODON_HOST: "mastodon.example",
  };
  const base = ["--dry-run", "--message", "fixture", "--to", "mastodon"];

  const accepted = run(
    POST_CROSSPOST,
    box,
    [
      ...base,
      "--image-url",
      "https://example.com/cover.jpg",
      "--image-alt",
      "Cover image",
    ],
    env,
  );
  assert.equal(accepted.status, 0, accepted.stderr);
  assert.match(accepted.stdout, /"@humanwhocodes\/crosspost@\^1\.1\.0"/u);
  assert.match(
    accepted.stdout,
    /"--image-url" "https:\/\/example\.com\/cover\.jpg" "--image-alt" "Cover image"/u,
  );
  assert.doesNotMatch(accepted.stdout, /"--image" /u);

  const noAlt = run(
    POST_CROSSPOST,
    box,
    [...base, "--image-url", "https://example.com/cover.jpg"],
    env,
  );
  assert.equal(noAlt.status, 1);
  assert.match(noAlt.stderr, /--image-alt is required when --image-url/u);

  const badProtocol = run(
    POST_CROSSPOST,
    box,
    [...base, "--image-url", "file:///tmp/cover.jpg", "--image-alt", "x"],
    env,
  );
  assert.equal(badProtocol.status, 1);
  assert.match(badProtocol.stderr, /must use http: or https:/u);

  await writeFile(join(box.cwd, "shot.png"), "fixture");
  const both = run(
    POST_CROSSPOST,
    box,
    [
      ...base,
      "--image",
      "shot.png",
      "--image-url",
      "https://example.com/cover.jpg",
      "--image-alt",
      "x",
    ],
    env,
  );
  assert.equal(both.status, 1);
  assert.match(both.stderr, /cannot be used together/u);
});

const PNG_BYTES = "0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a";
const WEBP_BYTES =
  "0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50";

test("--image-url is downloaded to a local file for Tumblr before publishing", async () => {
  const box = await sandbox();
  const mock = join(box.cwd, "mock.mjs");
  const stubLog = join(box.cwd, "stub.log");
  // The stub stands in for the direct Tumblr script and records whether the
  // downloaded image file exists while it runs.
  const stub = join(box.cwd, "node");
  await writeFile(
    stub,
    `#!/bin/sh
while [ $# -gt 0 ]; do
  if [ "$1" = "--image" ]; then
    [ "\${2%.png}" != "$2" ] || { echo "bad extension $2" >> "${stubLog}"; exit 2; }
    [ -s "$2" ] && printf "downloaded" >> "${stubLog}"
  fi
  shift
done
echo '{"url":"https://fixture.tumblr.com/post/1"}'
`,
    { mode: 0o700 },
  );
  const env = {
    HOME: box.home,
    PATH: box.cwd,
    TUMBLR_ACCESS_TOKEN: SECRET,
    TUMBLR_BLOG_IDENTIFIER: "fixture.tumblr.com",
  };
  const args = [
    "--import",
    mock,
    POST_CROSSPOST,
    "--message",
    "fixture",
    "--to",
    "tumblr",
    "--image-url",
    "https://example.com/cover",
    "--image-alt",
    "Cover image",
    "--no-log",
  ];

  await writeFile(
    mock,
    `globalThis.fetch = async () => new Response(new Uint8Array([${PNG_BYTES}]), { status: 200 });`,
  );
  const accepted = spawnSync(process.execPath, args, {
    cwd: box.cwd,
    encoding: "utf8",
    env,
  });
  assert.equal(accepted.status, 0, accepted.stderr);
  assert.match(accepted.stdout, /tumblr: https:\/\/fixture\.tumblr\.com/u);
  assert.equal(await readFile(stubLog, "utf8"), "downloaded");

  await writeFile(
    mock,
    `globalThis.fetch = async () => new Response("<html></html>", { status: 200, headers: { "content-type": "text/html" } });`,
  );
  await rm(stubLog, { force: true });
  const rejected = spawnSync(process.execPath, args, {
    cwd: box.cwd,
    encoding: "utf8",
    env,
  });
  assert.equal(rejected.status, 1);
  assert.match(rejected.stderr, /did not return an image/u);
  assert.match(rejected.stderr, /Published before failure: none/u);
  assert.ok(!existsSync(stubLog));
  assert.ok(!`${rejected.stdout}${rejected.stderr}`.includes(SECRET));
});

test("--image-url in WebP format stops Crosspost networks before publishing", async () => {
  const box = await sandbox();
  const mock = join(box.cwd, "mock.mjs");
  await writeFile(
    mock,
    `globalThis.fetch = async () => new Response(new Uint8Array([${WEBP_BYTES}]), { status: 200, headers: { "content-type": "image/webp" } });`,
  );
  // An isolated PATH stub ensures a regression cannot invoke the real publisher.
  await writeFile(
    join(box.cwd, "npx"),
    "#!/bin/sh\necho PUBLISH_ATTEMPT >&2\nexit 99\n",
    { mode: 0o700 },
  );
  const result = spawnSync(
    process.execPath,
    [
      "--import",
      mock,
      POST_CROSSPOST,
      "--message",
      "fixture",
      "--to",
      "mastodon",
      "--image-url",
      "https://example.com/cover.webp",
      "--image-alt",
      "Cover image",
      "--no-log",
    ],
    {
      cwd: box.cwd,
      encoding: "utf8",
      env: {
        HOME: box.home,
        PATH: box.cwd,
        MASTODON_ACCESS_TOKEN: SECRET,
        MASTODON_HOST: "mastodon.example",
      },
    },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /WEBP image\. Crosspost accepts only PNG/u);
  assert.ok(!result.stderr.includes("PUBLISH_ATTEMPT"));
  assert.ok(!result.stderr.includes(SECRET));
});
