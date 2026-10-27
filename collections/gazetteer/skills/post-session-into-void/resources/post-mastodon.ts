#!/usr/bin/env node

import { spawn } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { loadEnvFile } from "node:process";

interface CliConfig {
  message?: string;
  messageFile?: string;
  image?: string;
  imageAlt?: string;
  minChars: number;
  maxChars: number;
  dotenvPath: string;
  dryRun: boolean;
}

interface CommandResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

const DEFAULT_MIN_CHARS = 300;
const DEFAULT_MAX_CHARS = 500;
const DEFAULT_DOTENV_PATH = "~/.env";

function printHelp(): void {
  console.log(`
Post a confirmed Mastodon message using @humanwhocodes/crosspost.

Usage:
  node post-mastodon.ts --message-file ./message.txt
  node post-mastodon.ts --message "Post text"
  node post-mastodon.ts --message-file ./message.txt --image ./image.jpg --image-alt "Image description"

Options:
  --message <text>          Message text to publish.
  --message-file <path>     File containing the message text.
  --image <path>            Optional image path.
  --image-alt <text>        Required when --image is used.
  --min-chars <number>      Minimum allowed message length. Default: ${DEFAULT_MIN_CHARS}.
  --max-chars <number>      Maximum allowed message length. Default: ${DEFAULT_MAX_CHARS}.
  --dotenv <path>           Dotenv path for Crosspost. Default: ${DEFAULT_DOTENV_PATH}.
  --dry-run                 Validate and print the command without publishing.
  --help                    Show this help text.

Required environment:
  MASTODON_ACCESS_TOKEN
  MASTODON_HOST

Notes:
  - This script publishes to Mastodon only.
  - It uses npx --yes @humanwhocodes/crosspost --mastodon.
  - CROSSPOST_DOTENV is set to ~/.env unless already present.
`);
}

function expandHomePath(input: string): string {
  if (input === "~") {
    return homedir();
  }

  if (input.startsWith("~/")) {
    return join(homedir(), input.slice(2));
  }

  return input;
}

function parseIntegerOption(name: string, value: string | undefined): number {
  if (!value) {
    throw new Error(`Missing value for ${name}.`);
  }

  const parsed = /^\d+$/.test(value) ? Number(value) : Number.NaN;

  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error(`Invalid value for ${name}: ${value}`);
  }

  return parsed;
}

function parseArgs(argv: string[]): CliConfig {
  const config: CliConfig = {
    minChars: DEFAULT_MIN_CHARS,
    maxChars: DEFAULT_MAX_CHARS,
    dotenvPath: DEFAULT_DOTENV_PATH,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    switch (arg) {
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
        break;

      case "--message":
        config.message = argv[++index];
        break;

      case "--message-file":
        config.messageFile = argv[++index];
        break;

      case "--image":
        config.image = argv[++index];
        break;

      case "--image-alt":
        config.imageAlt = argv[++index];
        break;

      case "--min-chars":
        config.minChars = parseIntegerOption(arg, argv[++index]);
        break;

      case "--max-chars":
        config.maxChars = parseIntegerOption(arg, argv[++index]);
        break;

      case "--dotenv":
        config.dotenvPath = argv[++index] ?? DEFAULT_DOTENV_PATH;
        break;

      case "--dry-run":
        config.dryRun = true;
        break;

      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  for (const option of [
    "--message",
    "--message-file",
    "--image",
    "--image-alt",
    "--dotenv",
  ]) {
    const index = argv.indexOf(option);
    if (
      index !== -1 &&
      (!argv[index + 1] || argv[index + 1]?.startsWith("--"))
    ) {
      throw new Error(`Missing value for ${option}.`);
    }
  }
  return config;
}

async function assertReadableFile(
  filePath: string,
  label: string,
): Promise<void> {
  try {
    await access(filePath, fsConstants.R_OK);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${label} is not readable: ${filePath}\n${message}`);
  }
}

async function readMessage(config: CliConfig): Promise<string> {
  if (config.message && config.messageFile) {
    throw new Error("Use either --message or --message-file, not both.");
  }

  if (!config.message && !config.messageFile) {
    throw new Error("Missing message. Use --message or --message-file.");
  }

  if (config.message) {
    return config.message;
  }

  const messageFile = resolve(expandHomePath(config.messageFile ?? ""));
  await assertReadableFile(messageFile, "Message file");

  const content = await readFile(messageFile, "utf8");
  return content;
}

function validateMessageLength(
  message: string,
  minChars: number,
  maxChars: number,
): void {
  const length = [...message].length;

  if (!message.trim()) throw new Error("Message must not be blank.");

  if (minChars > maxChars) {
    throw new Error(
      `Invalid length range: min ${minChars} is greater than max ${maxChars}.`,
    );
  }

  if (length < minChars) {
    throw new Error(
      `Message is too short: ${length} characters. Minimum is ${minChars}.`,
    );
  }

  if (length > maxChars) {
    throw new Error(
      `Message is too long: ${length} characters. Maximum is ${maxChars}.`,
    );
  }
}

function validateEnvironment(): void {
  const requiredVariables = ["MASTODON_ACCESS_TOKEN", "MASTODON_HOST"];
  const missing = requiredVariables.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

async function validateImage(config: CliConfig): Promise<void> {
  if (!config.image) {
    return;
  }

  if (!config.imageAlt || config.imageAlt.trim().length === 0) {
    throw new Error("--image-alt is required when --image is used.");
  }

  const imagePath = resolve(expandHomePath(config.image));
  await assertReadableFile(imagePath, "Image file");
}

function runCommand(
  command: string,
  args: string[],
  env: NodeJS.ProcessEnv,
): Promise<CommandResult> {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");

    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
    });

    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });

    child.on("error", (error) => {
      rejectPromise(new Error(`Failed to start ${command}: ${error.message}`));
    });

    child.on("close", (exitCode) => {
      resolvePromise({
        exitCode: exitCode ?? 1,
        stdout,
        stderr,
      });
    });
  });
}

function extractFirstUrl(output: string): string | undefined {
  const host = process.env.MASTODON_HOST?.replace(/^https?:\/\//u, "").replace(
    /\/$/u,
    "",
  );
  for (const match of output.matchAll(/https?:\/\/[^\s"'<>]+/gu)) {
    try {
      const url = new URL(match[0]);
      if (
        url.host === host &&
        /^\/(?:@[^/]+\/\d+|users\/[^/]+\/statuses\/\d+)$/u.test(url.pathname)
      )
        return url.href;
    } catch {
      /* Ignore non-URL output. */
    }
  }
  return undefined;
}

async function createTempMessageFile(
  message: string,
): Promise<{ path: string; cleanup: () => Promise<void> }> {
  const directory = await mkdtemp(join(tmpdir(), "gazetteer-mastodon-post-"));
  const filePath = join(directory, "message.txt");

  await writeFile(filePath, message, "utf8");

  return {
    path: filePath,
    cleanup: async () => {
      await rm(directory, {
        recursive: true,
        force: true,
      });
    },
  };
}

async function main(): Promise<void> {
  const config = parseArgs(process.argv.slice(2));

  const message = await readMessage(config);
  validateMessageLength(message, config.minChars, config.maxChars);
  if (!config.dryRun) {
    const dotenv = process.env.CROSSPOST_DOTENV ?? config.dotenvPath;
    const dotenvPath =
      dotenv === "1" ? resolve(".env") : resolve(expandHomePath(dotenv));
    try {
      loadEnvFile(dotenvPath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw new Error("Could not load the configured dotenv file.");
      }
    }
    validateEnvironment();
  }
  await validateImage(config);

  const tempMessage = await createTempMessageFile(message);

  try {
    const args = [
      "--yes",
      "@humanwhocodes/crosspost",
      "--mastodon",
      "--file",
      tempMessage.path,
    ];

    if (config.image) {
      args.push("--image", resolve(expandHomePath(config.image)));
      args.push("--image-alt", config.imageAlt ?? "");
    }

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      CROSSPOST_DOTENV:
        process.env.CROSSPOST_DOTENV ??
        resolve(expandHomePath(config.dotenvPath)),
    };

    if (config.dryRun) {
      console.log("Dry run. No post was published.");
      console.log(
        `Command: npx ${args.map((arg) => JSON.stringify(arg)).join(" ")}`,
      );
      console.log(`Characters: ${[...message].length}`);
      console.log(`CROSSPOST_DOTENV: ${env.CROSSPOST_DOTENV}`);
      return;
    }

    const result = await runCommand("npx", args, env);
    const combinedOutput = [result.stdout, result.stderr]
      .filter(Boolean)
      .join("\n")
      .trim();

    if (result.exitCode !== 0) {
      throw new Error(
        `Crosspost failed with exit code ${result.exitCode}. Check the account before retrying; delivery may be uncertain.`,
      );
    }

    const url = extractFirstUrl(combinedOutput);

    if (url) {
      console.log(`Published: ${url}`);
      return;
    }

    console.log(
      "Published, but no URL could be extracted from Crosspost output.",
    );
    console.log(
      "Check the account before retrying; no post URL was identified.",
    );
  } finally {
    await tempMessage.cleanup();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
