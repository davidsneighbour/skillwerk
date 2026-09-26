import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { type Collection, collections } from "./collections.ts";

const configPath = join(".agents", "skills", "synchwork", "config.json");

const isCollection = (value: string): value is Collection =>
  collections.includes(value as Collection);

const [collection] = process.argv.slice(2);
if (!collection || !isCollection(collection))
  throw new Error(
    `Use: npm run synchwork:meld <collection> (one of ${collections.join(", ")})`,
  );

const config = JSON.parse(readFileSync(configPath, "utf8")) as {
  meld: Record<string, string[]>;
};
const members = config.meld[collection];
if (members?.length !== 3)
  throw new Error(`${configPath}: meld.${collection} must list 3 collections`);
for (const member of members)
  if (!isCollection(member))
    throw new Error(`${configPath}: unknown collection in meld: ${member}`);

const result = spawnSync(
  "meld",
  members.map((member) => join("collections", member)),
  { stdio: "inherit" },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
