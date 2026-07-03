import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const tokensBuildDir = join(
  here,
  "../../../packages/tokens/build",
);
const srcDir = join(here, "../src");
const distDir = join(here, "../dist");

mkdirSync(distDir, { recursive: true });

const parts = [
  "primitive.css",
  "light.css",
  "dark.css",
].map((file) => readFileSync(join(tokensBuildDir, file), "utf8"));

parts.push(readFileSync(join(srcDir, "styles.css"), "utf8"));

writeFileSync(join(distDir, "styles.css"), parts.join("\n"));
