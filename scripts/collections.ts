export const collections = ["apparatus", "clerkwork", "fettle", "gallimaufry", "gazetteer", "idiolect", "patternbook", "posthaste"] as const;
export type Collection = (typeof collections)[number];
export function selectedCollection(arguments_: string[]): Collection | undefined {
  const index = arguments_.indexOf("--collection");
  if (index === -1) return undefined;
  const value = arguments_[index + 1];
  if (!value || !collections.includes(value as Collection)) throw new Error(`Unknown collection: ${value ?? "missing"}`);
  return value as Collection;
}
