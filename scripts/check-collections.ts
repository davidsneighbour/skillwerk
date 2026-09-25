import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, normalize } from "node:path";
import { collections, selectedCollection } from "./collections.ts";
const selected = selectedCollection(process.argv.slice(2));
const targets = selected ? [selected] : collections;
let failures = 0;
for (const collection of targets) {
  const root = join("collections", collection);
  const skillsRoot = join(root, "skills");
  if (!existsSync(join(root, "README.md")) || !existsSync(skillsRoot)) { console.error(`FAIL ${collection}: missing README.md or skills directory`); failures++; continue; }
  const skills = readdirSync(skillsRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  for (const skill of skills) {
    const skillRoot = join(skillsRoot, skill.name);
    const skillFile = join(skillRoot, "SKILL.md");
    if (!existsSync(skillFile)) { console.error(`FAIL ${collection}/${skill.name}: missing SKILL.md`); failures++; continue; }
    const source = readFileSync(skillFile, "utf8");
    const frontmatter = /^---\n([\s\S]*?)\n---/m.exec(source)?.[1];
    if (!frontmatter || !/^name:\s*\S+/m.test(frontmatter) || !/^description:\s*\S+/m.test(frontmatter)) { console.error(`FAIL ${collection}/${skill.name}: incomplete front matter`); failures++; }
    for (const match of source.matchAll(/\]\(([^)]+)\)/g)) {
      const link = match[1];
      if (!link || /^(?:[a-z]+:|#)/i.test(link)) continue;
      const resolved = normalize(join(skillRoot, link));
      if (!resolved.startsWith(normalize(root))) { console.error(`FAIL ${collection}/${skill.name}: escaping link ${link}`); failures++; }
    }
  }
  console.log(`Checked ${collection}: ${skills.length} skills`);
}
if (failures > 0) process.exitCode = 1;
