import assert from "node:assert/strict";
import { test } from "node:test";
import {
  main,
  parseTarget,
  planTopics,
  type Run,
  resolveTarget,
} from "./manage-repo.ts";

const repository = {
  name: "demo",
  full_name: "owner/demo",
  html_url: "https://github.com/owner/demo",
  owner: { login: "owner", html_url: "https://github.com/owner" },
  archived: false,
  visibility: "private",
  topics: ["typescript"],
  fork: false,
};

function fixture(
  options: {
    archived?: boolean;
    concurrent?: boolean;
    redirect?: boolean;
    verifyFailure?: boolean;
  } = {},
) {
  let names = ["typescript"];
  let reads = 0;
  const writes: string[][] = [];
  const run: Run = (command, args, input) => {
    assert.equal(command, "gh");
    assert.equal(args[2], "github.com");
    const method = args[4];
    const path = args[5];
    if (path === "repos/owner/demo")
      return JSON.stringify({
        ...repository,
        archived: options.archived ?? false,
        full_name: options.redirect ? "owner/renamed" : "owner/demo",
      });
    assert.equal(path, "repos/owner/demo/topics");
    if (method === "PUT") {
      names = (JSON.parse(input as string) as { names: string[] }).names;
      writes.push(names);
      return JSON.stringify({ names });
    }
    reads += 1;
    return JSON.stringify({
      names:
        (options.concurrent && reads === 2) ||
        (options.verifyFailure && writes.length)
          ? ["changed"]
          : names,
    });
  };
  return { run, writes };
}

test("accept GitHub transports and reject other hosts or paths before API calls", () => {
  for (const value of [
    "owner/demo",
    "https://github.com/owner/demo.git",
    "git@github.com:owner/demo.git",
    "ssh://git@github.com/owner/demo.git",
  ])
    assert.equal(parseTarget(value), "owner/demo");
  for (const value of [
    "https://gitlab.com/owner/demo",
    "git@gitlab.com:owner/demo",
    "github.com/owner/demo",
    "/tmp/demo",
    "https://github.com.evil/owner/demo",
    "owner/..",
  ])
    assert.throws(
      () =>
        main([value], () => {
          throw new Error("Unexpected API call");
        }),
      /Expected a github.com/,
    );
});

test("bare name uses authenticated user and explicit target does not inspect Git", () => {
  assert.equal(
    resolveTarget("demo", (_command, args) => {
      assert.deepEqual(args, [
        "api",
        "--hostname",
        "github.com",
        "user",
        "--jq",
        ".login",
      ]);
      return "owner";
    }),
    "owner/demo",
  );
  assert.equal(
    resolveTarget("owner/demo", () => {
      throw new Error("Unexpected call");
    }),
    "owner/demo",
  );
});

test("origin takes precedence, non-GitHub origin fails, and multiple remotes are ambiguous", () => {
  const local =
    (origin: string, remotes = "origin\nupstream"): Run =>
    (_command, args) => {
      if (args[0] === "rev-parse") return "/tmp/demo";
      if (args.length === 1) return remotes;
      return args[3] === "origin" ? origin : "https://github.com/other/demo";
    };
  assert.equal(
    resolveTarget(undefined, local("git@github.com:owner/demo.git")),
    "owner/demo",
  );
  assert.throws(
    () => resolveTarget(undefined, local("git@gitlab.com:owner/demo.git")),
    /Expected/,
  );
  assert.throws(
    () =>
      resolveTarget(undefined, (_cmd, args) =>
        args[0] === "rev-parse"
          ? "/tmp"
          : args.length === 1
            ? "first\nsecond"
            : `https://github.com/${args[3]}/demo`,
      ),
    /Ambiguous/,
  );
  assert.throws(() => resolveTarget(undefined, local("", "")), /No Git remote/);
});

test("info renders links and status and adds only applicable fork parent", () => {
  const { run } = fixture();
  assert.match(main(["owner/demo"], run), /Status: Private/);
  assert.doesNotMatch(main(["info", "owner/demo"], run), /Fork:/);
  const fork: Run = () =>
    JSON.stringify({
      ...repository,
      archived: true,
      visibility: "public",
      fork: true,
      parent: {
        full_name: "upstream/demo",
        html_url: "https://github.com/upstream/demo",
      },
    });
  const info = main(["info", "owner/demo"], fork);
  assert.match(info, /Status: Archived \/ Public/);
  assert.match(
    info,
    /Fork: \[upstream\/demo\]\(https:\/\/github.com\/upstream\/demo\)/,
  );
});

test("topic changes default to dry run, preserve unrelated topics, and apply is explicit", () => {
  const { run, writes } = fixture();
  assert.match(
    main(["topics", "owner/demo", "--add", "dnb-kind-library"], run),
    /Dry run/,
  );
  assert.deepEqual(writes, []);
  assert.match(
    main(["topics", "owner/demo", "--add", "dnb-kind-library", "--apply"], run),
    /Applied and verified/,
  );
  assert.deepEqual(writes, [["dnb-kind-library", "typescript"]]);
});

test("invalid topics, conflicts, and limits fail", () => {
  assert.throws(() => planTopics([], ["Uppercase"], []), /Invalid/);
  assert.throws(() => planTopics([], ["a".repeat(51)], []), /Invalid/);
  assert.throws(() => planTopics([], ["same"], ["same"]), /same topic/);
  assert.throws(
    () =>
      planTopics(
        Array.from({ length: 20 }, (_, i) => `topic-${i}`),
        ["extra"],
        [],
      ),
    /20/,
  );
  assert.throws(
    () => planTopics(["dnb-stage-active"], ["dnb-stage-retired"], []),
    /explicitly remove/,
  );
  assert.deepEqual(
    planTopics(
      ["dnb-stage-active", "astro"],
      ["dnb-stage-maintenance"],
      ["dnb-stage-active"],
    ),
    ["astro", "dnb-stage-maintenance"],
  );
});

test("archived state, concurrent edits, and redirects prevent writes", () => {
  for (const options of [
    { archived: true },
    { concurrent: true },
    { redirect: true },
  ]) {
    const { run, writes } = fixture(options);
    assert.throws(() =>
      main(
        ["topics", "owner/demo", "--add", "dnb-kind-library", "--apply"],
        run,
      ),
    );
    assert.deepEqual(writes, []);
  }
});

test("failed post-write verification reports uncertainty without retry", () => {
  const { run, writes } = fixture({ verifyFailure: true });
  assert.throws(
    () =>
      main(
        ["topics", "owner/demo", "--add", "dnb-kind-library", "--apply"],
        run,
      ),
    /Post-write verification failed/,
  );
  assert.equal(writes.length, 1);
});

test("conflicting flags fail, no-op apply does not write, and API errors propagate", () => {
  assert.throws(
    () => main(["topics", "owner/demo", "--apply", "--dry-run"]),
    /Choose/,
  );
  assert.throws(() => main(["info", "owner/demo", "--apply"]), /require/);
  const { run, writes } = fixture();
  assert.match(
    main(["topics", "owner/demo", "--add", "typescript", "--apply"], run),
    /No changes needed/,
  );
  assert.deepEqual(writes, []);
  assert.throws(
    () =>
      main(["owner/demo"], () => {
        throw new Error("Permission denied");
      }),
    /Permission denied/,
  );
});
