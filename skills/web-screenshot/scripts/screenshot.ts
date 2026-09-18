#!/usr/bin/env -S npx tsx

import { constants as fsConstants } from "node:fs";
import { access, mkdir, rename, rm } from "node:fs/promises";
import { basename, dirname, extname, resolve } from "node:path";
import { chromium, type Page } from "playwright";
import sharp from "sharp";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

type ScreenshotFormat = "png" | "jpg" | "webp";
type ColorScheme = "light" | "dark";
type ReducedMotion = "reduce" | "no-preference";
type AnimationMode = "allow" | "disabled";

interface ScreenshotOptions {
  animations?: AnimationMode;
  colorScheme?: ColorScheme;
  delay?: number;
  deviceScaleFactor?: number;
  force?: boolean;
  fullPage?: boolean;
  height?: number;
  output?: string;
  outputDir?: string;
  quality?: number;
  reducedMotion?: ReducedMotion;
  scrollDelay?: number;
  scrollStep?: number;
  selector?: string;
  settleMs?: number;
  timeout?: number;
  waitForSelector?: string;
  width?: number;
}

interface CLIArgs {
  animations: AnimationMode;
  aspect?: string;
  delay: number;
  force: boolean;
  format: ScreenshotFormat;
  fullPage: boolean;
  height?: number;
  output?: string;
  outputDir: string;
  quality?: number;
  reducedMotion: ReducedMotion;
  scale: number;
  scheme: ColorScheme;
  scrollDelay: number;
  scrollStep: number;
  selector?: string;
  settleMs: number;
  timeout: number;
  url: string;
  waitForSelector?: string;
  width: number;
}

// yargs infers its check-callback argument type from the literal option
// names given to .option(), not from their camelCase aliases, so hyphenated
// options such as "full-page" must be read with bracket notation here.
interface RawCliCheckArgs {
  aspect?: string;
  delay: number;
  format: ScreenshotFormat;
  "full-page": boolean;
  height?: number;
  quality?: number;
  scale: number;
  "scroll-delay": number;
  "scroll-step": number;
  selector?: string;
  "settle-ms": number;
  timeout: number;
  width: number;
}

interface WaitForSettledPageOptions {
  scrollDelay: number;
  scrollStep: number;
  settleMs: number;
  timeout: number;
  waitForSelector?: string;
}

const DEFAULT_HEIGHT = 800;
const DEFAULT_WIDTH = 1200;

/** Build and parse the CLI arguments. Only called when run as the entry script. */
function parseCliArgs(): CLIArgs {
  return yargs(hideBin(process.argv))
    .scriptName("screenshot")
    .usage("$0 --url <url> [options]")
    .option("url", {
      demandOption: true,
      describe: "URL to capture",
      type: "string",
    })
    .option("output", {
      describe: "Explicit output filename or path",
      type: "string",
    })
    .option("output-dir", {
      default: "screenshots",
      describe: "Directory for automatically named screenshots",
      type: "string",
    })
    .option("width", {
      default: DEFAULT_WIDTH,
      describe: "Viewport width in CSS pixels",
      type: "number",
    })
    .option("height", {
      describe: `Viewport height in CSS pixels (default: ${DEFAULT_HEIGHT})`,
      type: "number",
    })
    .option("aspect", {
      describe:
        "Aspect ratio as W:H, for example 16:9, used when --height is omitted",
      type: "string",
    })
    .option("full-page", {
      default: false,
      describe: "Capture the complete scrollable page",
      type: "boolean",
    })
    .option("selector", {
      describe: "Capture only the first element matching this selector",
      type: "string",
    })
    .option("format", {
      choices: ["png", "jpg", "webp"] as const,
      default: "webp" as const,
      describe: "Screenshot format",
    })
    .option("quality", {
      describe: "JPEG/WebP quality from 0 to 100",
      type: "number",
    })
    .option("delay", {
      default: 0,
      describe: "Extra delay in milliseconds before capture",
      type: "number",
    })
    .option("scheme", {
      choices: ["light", "dark"] as const,
      default: "light" as const,
      describe: "Preferred colour scheme",
    })
    .option("scale", {
      default: 1,
      describe: "Device scale factor, for example 2 for a high-DPI capture",
      type: "number",
    })
    .option("reduced-motion", {
      choices: ["reduce", "no-preference"] as const,
      default: "no-preference" as const,
      describe: "Preferred reduced-motion media setting",
    })
    .option("animations", {
      choices: ["allow", "disabled"] as const,
      default: "disabled" as const,
      describe: "Allow or disable CSS/Web animations during screenshot capture",
    })
    .option("wait-for-selector", {
      describe: "Wait for this selector to become visible before capture",
      type: "string",
    })
    .option("scroll-delay", {
      default: 250,
      describe: "Delay in milliseconds after each lazy-loading scroll step",
      type: "number",
    })
    .option("scroll-step", {
      default: 500,
      describe: "Scroll step in pixels used to trigger lazy-loaded content",
      type: "number",
    })
    .option("settle-ms", {
      default: 1000,
      describe: "Final visual settle delay in milliseconds",
      type: "number",
    })
    .option("timeout", {
      default: 120000,
      describe: "Timeout in milliseconds for navigation and readiness checks",
      type: "number",
    })
    .option("force", {
      default: false,
      describe: "Allow an explicit --output path to replace an existing file",
      type: "boolean",
    })
    .check((args: RawCliCheckArgs) => {
      if (
        args["full-page"] &&
        (args.height !== undefined || args.aspect !== undefined)
      ) {
        throw new Error(
          "--full-page cannot be used with --height or --aspect.",
        );
      }

      if (args.height !== undefined && args.aspect !== undefined) {
        throw new Error("--height and --aspect cannot be used together.");
      }

      if (args["full-page"] && args.selector) {
        throw new Error("--full-page and --selector cannot be used together.");
      }

      if (args.width <= 0) {
        throw new Error("--width must be greater than 0.");
      }

      if (args.height !== undefined && args.height <= 0) {
        throw new Error("--height must be greater than 0.");
      }

      if (args.scale <= 0) {
        throw new Error("--scale must be greater than 0.");
      }

      if (
        args.quality !== undefined &&
        (args.quality < 0 || args.quality > 100)
      ) {
        throw new Error("--quality must be between 0 and 100.");
      }

      if (args.quality !== undefined && args.format === "png") {
        throw new Error(
          "--quality is only valid with --format jpg or --format webp.",
        );
      }

      for (const [name, value] of [
        ["--delay", args.delay],
        ["--scroll-delay", args["scroll-delay"]],
        ["--scroll-step", args["scroll-step"]],
        ["--settle-ms", args["settle-ms"]],
        ["--timeout", args.timeout],
      ] as const) {
        if (value < 0) {
          throw new Error(`${name} must not be negative.`);
        }
      }

      return true;
    })
    .strict()
    .help()
    .alias("help", "h")
    .parseSync() as CLIArgs;
}

/** Ensure that a file exists and is readable. */
async function assertFileExists(filePath: string): Promise<void> {
  await access(filePath, fsConstants.F_OK | fsConstants.R_OK);
}

/** Return true when a filesystem path already exists. */
async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/** Ensure that the parent directory for a file path exists. */
async function ensureOutputDirectory(filePath: string): Promise<void> {
  await mkdir(dirname(resolve(filePath)), { recursive: true });
}

/** Convert a URL into a filesystem-safe base name. */
function normaliseUrlForFilename(url: string): string {
  const parsed = new URL(url);
  const raw = `${parsed.hostname}${parsed.pathname === "/" ? "" : parsed.pathname}`;
  const normalised = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalised || "screenshot";
}

/** Build the default filename for a capture variant. */
function buildDefaultFilename(
  finalUrl: string,
  format: ScreenshotFormat,
  options: Required<
    Pick<ScreenshotOptions, "colorScheme" | "fullPage" | "height" | "width">
  >,
): string {
  const size = options.fullPage
    ? `${options.width}-full`
    : `${options.width}x${options.height}`;
  return `${normaliseUrlForFilename(finalUrl)}-${options.colorScheme}-${size}.${format}`;
}

/** Ensure the output extension matches the requested screenshot format. */
function withFormatExtension(
  filePath: string,
  format: ScreenshotFormat,
): string {
  const expectedExtension = `.${format}`;
  const currentExtension = extname(filePath).toLowerCase();

  if (!currentExtension) {
    return `${filePath}${expectedExtension}`;
  }

  if (format === "jpg" && currentExtension === ".jpeg") {
    return filePath;
  }

  if (currentExtension !== expectedExtension) {
    throw new Error(
      `Output extension ${currentExtension} does not match --format ${format}. ` +
        `Use ${expectedExtension} or omit the extension.`,
    );
  }

  return filePath;
}

/** Find a non-existing numbered filename for automatically named captures. */
async function findAvailableOutput(filePath: string): Promise<string> {
  if (!(await pathExists(filePath))) {
    return filePath;
  }

  const extension = extname(filePath);
  const stem = filePath.slice(0, -extension.length);

  for (let index = 2; index < 10000; index += 1) {
    const candidate = `${stem}-${index}${extension}`;
    if (!(await pathExists(candidate))) {
      return candidate;
    }
  }

  throw new Error(
    `Could not find an available output filename near ${filePath}.`,
  );
}

/** Resolve an explicit or automatically generated output path. */
async function resolveOutputPath(
  finalUrl: string,
  format: ScreenshotFormat,
  options: ScreenshotOptions,
): Promise<string> {
  const width = options.width ?? DEFAULT_WIDTH;
  const height = options.height ?? DEFAULT_HEIGHT;
  const colorScheme = options.colorScheme ?? "light";
  const fullPage = options.fullPage ?? false;

  if (options.output) {
    const explicitOutput = resolve(withFormatExtension(options.output, format));

    if (!options.force && (await pathExists(explicitOutput))) {
      throw new Error(
        `Output file already exists: ${explicitOutput}. Use --force to replace an explicit output path.`,
      );
    }

    return explicitOutput;
  }

  const outputDir = resolve(options.outputDir ?? "screenshots");
  const filename = buildDefaultFilename(finalUrl, format, {
    colorScheme,
    fullPage,
    height,
    width,
  });

  return findAvailableOutput(resolve(outputDir, filename));
}

/** Wait until the page is ready for a visually stable screenshot. */
async function waitForSettledPage(
  page: Page,
  options: WaitForSettledPageOptions,
): Promise<void> {
  await page.waitForLoadState("domcontentloaded", { timeout: options.timeout });
  await page.waitForLoadState("load", { timeout: options.timeout });

  await page
    .waitForLoadState("networkidle", {
      timeout: Math.min(options.timeout, 10000),
    })
    .catch((error: unknown) => {
      console.warn(
        "[web-screenshot] Network did not become idle; continuing with visual readiness checks.",
      );
      if (error instanceof Error) {
        console.warn(`[web-screenshot] ${error.message}`);
      }
    });

  if (options.waitForSelector) {
    await page.locator(options.waitForSelector).first().waitFor({
      state: "visible",
      timeout: options.timeout,
    });
  }

  await page.evaluate(async () => {
    if ("fonts" in document) {
      await document.fonts.ready;
    }

    for (const image of document.images) {
      image.loading = "eager";
      image.decoding = "sync";
    }
  });

  await scrollPageToTriggerLazyLoading(
    page,
    options.scrollStep,
    options.scrollDelay,
  );
  await waitForImages(page, options.timeout);
  await waitForCssBackgroundImages(page, options.timeout);

  await page.evaluate(() => {
    window.scrollTo({ behavior: "instant", left: 0, top: 0 });
  });

  if (options.settleMs > 0) {
    await page.waitForTimeout(options.settleMs);
  }
}

/** Scroll through the document to trigger lazy-loaded and viewport-dependent content. */
async function scrollPageToTriggerLazyLoading(
  page: Page,
  scrollStep: number,
  scrollDelay: number,
): Promise<void> {
  const pageHeight = await page.evaluate(() =>
    Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
  );

  for (let top = 0; top <= pageHeight; top += scrollStep) {
    await page.evaluate((scrollTop: number) => {
      window.scrollTo({ behavior: "instant", left: 0, top: scrollTop });
    }, top);

    if (scrollDelay > 0) {
      await page.waitForTimeout(scrollDelay);
    }
  }

  await page.evaluate(() => {
    window.scrollTo({
      behavior: "instant",
      left: 0,
      top: Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      ),
    });
  });

  if (scrollDelay > 0) {
    await page.waitForTimeout(scrollDelay);
  }
}

/** Wait for HTML images to finish loading and decoding where possible. */
async function waitForImages(page: Page, timeout: number): Promise<void> {
  await page.waitForFunction(
    async () => {
      const images = Array.from(document.images);

      await Promise.allSettled(
        images.map(async (image) => {
          if (!image.complete) {
            await new Promise<void>((resolveImage) => {
              image.addEventListener("load", () => resolveImage(), {
                once: true,
              });
              image.addEventListener("error", () => resolveImage(), {
                once: true,
              });
            });
          }

          if (typeof image.decode === "function") {
            await image.decode().catch(() => undefined);
          }
        }),
      );

      return images.every((image) => image.complete);
    },
    undefined,
    { timeout },
  );
}

/** Wait for CSS background-image resources referenced by rendered elements. */
async function waitForCssBackgroundImages(
  page: Page,
  timeout: number,
): Promise<void> {
  await page.waitForFunction(
    async () => {
      const urls = Array.from(document.querySelectorAll<HTMLElement>("*"))
        .flatMap((element) => {
          const backgroundImage = getComputedStyle(element).backgroundImage;
          return Array.from(backgroundImage.matchAll(/url\(["']?(.*?)["']?\)/g))
            .map((match) => match[1])
            .filter(
              (url): url is string => typeof url === "string" && url.length > 0,
            );
        })
        .filter((url) => !url.startsWith("data:"));

      await Promise.allSettled(
        Array.from(new Set(urls)).map(
          (url) =>
            new Promise<void>((resolveImage) => {
              const image = new Image();
              image.onload = () => resolveImage();
              image.onerror = () => resolveImage();
              image.src = url;
            }),
        ),
      );

      return true;
    },
    undefined,
    { timeout },
  );
}

/** Capture a screenshot using Playwright and write the result atomically. */
export async function takeScreenshot(
  url: string,
  format: ScreenshotFormat,
  options: ScreenshotOptions = {},
): Promise<string> {
  const width = options.width ?? DEFAULT_WIDTH;
  const fullPage = options.fullPage ?? false;
  const height = fullPage ? DEFAULT_HEIGHT : (options.height ?? DEFAULT_HEIGHT);
  const timeout = options.timeout ?? 120000;

  const browser = await chromium.launch({ headless: true });
  let temporaryOutput: string | undefined;

  try {
    const context = await browser.newContext({
      colorScheme: options.colorScheme ?? "light",
      deviceScaleFactor: options.deviceScaleFactor ?? 1,
      reducedMotion: options.reducedMotion ?? "no-preference",
      viewport: { height, width },
    });

    const page = await context.newPage();
    await page.goto(url, { timeout, waitUntil: "domcontentloaded" });

    await waitForSettledPage(page, {
      scrollDelay: options.scrollDelay ?? 250,
      scrollStep: options.scrollStep ?? 500,
      settleMs: options.settleMs ?? 1000,
      timeout,
      waitForSelector: options.waitForSelector,
    });

    if ((options.delay ?? 0) > 0) {
      await page.waitForTimeout(options.delay ?? 0);
    }

    const finalUrl = page.url();
    const output = await resolveOutputPath(finalUrl, format, options);
    temporaryOutput = `${output}.tmp`;
    await ensureOutputDirectory(output);

    // Playwright's screenshot() only produces "png" or "jpeg" directly; a
    // requested WebP output is captured as PNG and converted afterwards.
    const capturesToWebp = format === "webp";
    const screenshotOptions: Parameters<Page["screenshot"]>[0] = {
      animations: options.animations ?? "disabled",
      type: capturesToWebp ? "png" : format === "jpg" ? "jpeg" : format,
      ...(capturesToWebp ? {} : { path: temporaryOutput }),
      ...(format === "jpg" ? { quality: options.quality ?? 100 } : {}),
    };

    let capturedBuffer: Buffer;

    if (options.selector) {
      const locator = page.locator(options.selector).first();
      await locator.waitFor({ state: "visible", timeout });
      capturedBuffer = await locator.screenshot(screenshotOptions);
    } else {
      capturedBuffer = await page.screenshot({
        ...screenshotOptions,
        fullPage,
      });
    }

    if (capturesToWebp) {
      await sharp(capturedBuffer)
        .webp({ quality: options.quality ?? 100 })
        .toFile(temporaryOutput);
    }

    await assertFileExists(temporaryOutput);
    await rename(temporaryOutput, output);
    temporaryOutput = undefined;

    console.log(`[web-screenshot] Saved: ${output}`);
    console.log(`[web-screenshot] Final URL: ${finalUrl}`);
    return output;
  } catch (error: unknown) {
    if (temporaryOutput) {
      await rm(temporaryOutput, { force: true });
    }

    if (error instanceof Error) {
      throw new Error(
        `[web-screenshot] Screenshot capture failed: ${error.message}`,
        { cause: error },
      );
    }

    throw new Error(
      "[web-screenshot] Screenshot capture failed with an unknown error.",
    );
  } finally {
    await browser.close();
  }
}

/** Convert an aspect-ratio string such as 16:9 into a pixel height. */
export function calculateAspectHeight(
  width: number,
  aspect?: string,
): number | undefined {
  if (!aspect) {
    return undefined;
  }

  if (!/^\d+(?:\.\d+)?:\d+(?:\.\d+)?$/.test(aspect)) {
    throw new Error("Invalid aspect ratio. Expected W:H, for example 16:9.");
  }

  const [widthPart, heightPart] = aspect.split(":");
  const ratioWidth = Number(widthPart);
  const ratioHeight = Number(heightPart);

  if (
    !Number.isFinite(ratioWidth) ||
    !Number.isFinite(ratioHeight) ||
    ratioWidth <= 0 ||
    ratioHeight <= 0
  ) {
    throw new Error(
      "Aspect ratio values must be finite numbers greater than 0.",
    );
  }

  return Math.round((width / ratioWidth) * ratioHeight);
}

function normaliseExplicitOutput(
  output: string | undefined,
): string | undefined {
  if (!output) {
    return undefined;
  }

  const trimmed = output.trim();
  if (!trimmed) {
    throw new Error("--output must not be empty.");
  }

  const name = basename(trimmed);
  if (name === "." || name === "..") {
    throw new Error("--output must reference a file, not a directory.");
  }

  return trimmed;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const argv = parseCliArgs();
    await takeScreenshot(argv.url, argv.format, {
      animations: argv.animations,
      colorScheme: argv.scheme,
      delay: argv.delay,
      deviceScaleFactor: argv.scale,
      force: argv.force,
      fullPage: argv.fullPage,
      height:
        argv.height ??
        calculateAspectHeight(argv.width, argv.aspect) ??
        DEFAULT_HEIGHT,
      output: normaliseExplicitOutput(argv.output),
      outputDir: argv.outputDir,
      quality: argv.quality,
      reducedMotion: argv.reducedMotion,
      scrollDelay: argv.scrollDelay,
      scrollStep: argv.scrollStep,
      selector: argv.selector,
      settleMs: argv.settleMs,
      timeout: argv.timeout,
      waitForSelector: argv.waitForSelector,
      width: argv.width,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(
        "[web-screenshot] Screenshot command failed with an unknown error.",
      );
    }

    process.exitCode = 1;
  }
}
