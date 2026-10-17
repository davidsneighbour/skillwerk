import { spawnSync } from "node:child_process";
import fg from "fast-glob";
import { selectedCollection } from "./collections.ts";

const collection = selectedCollection(process.argv.slice(2));
const root = collection ? `collections/${collection}` : "collections";
const files = await fg([`${root}/**/*.test.ts`, "scripts/**/*.test.ts"], {
  ignore: ["**/scratch/**", "**/node_modules/**"],
});
if (files.length > 0) {
  const result = spawnSync(process.execPath, ["--test", ...files.sort()], {
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}
