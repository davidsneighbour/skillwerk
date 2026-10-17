// Return read-only checks so linting cannot invalidate accepted staged content.
export default (stagedFiles) => {
  const files = stagedFiles.filter(
    (file) => !file.split(/[\\/]/u).includes("scratch"),
  );
  const quote = (file) => `'${file.replaceAll("'", "'\\''")}'`;
  const commands = [];
  const code = files.filter((file) =>
    /\.(?:[cm]?[jt]sx?|jsonc?|css)$/u.test(file),
  );
  const markdown = files.filter(
    (file) => /\.mdx?$/u.test(file) && !file.endsWith("/CHANGELOG.md"),
  );
  if (code.length) commands.push(`biome check ${code.map(quote).join(" ")}`);
  if (markdown.length)
    commands.push(
      `markdownlint-cli2 --config ./node_modules/@dnbhq/markdownlint-config/.markdownlint-cli2.jsonc ${markdown.map(quote).join(" ")}`,
    );
  if (files.length) {
    commands.push(`cspell --no-progress ${files.map(quote).join(" ")}`);
    commands.push(
      `dnb-secretlint --secretlintignore .secretlintignore ${files.map(quote).join(" ")}`,
    );
  }
  if (files.some((file) => file.endsWith("/skill-reviews.json")))
    commands.push("npm run --silent validate:reviews");
  return commands;
};
