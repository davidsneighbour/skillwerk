import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const root = join("collections", "clerkwork");
const vocabulary = readFileSync(
  join(root, "resources", "vocabulary.md"),
  "utf8",
);
for (const entry of readdirSync(join(root, "skills"), {
  withFileTypes: true,
})) {
  if (!entry.isDirectory() || entry.name === "scratch") continue;
  const skillRoot = join(root, "skills", entry.name);
  if (!existsSync(join(skillRoot, "SKILL.md"))) continue;
  const resources = join(skillRoot, "resources");
  mkdirSync(resources, { recursive: true });
  writeFileSync(join(resources, "vocabulary.md"), vocabulary);
}
