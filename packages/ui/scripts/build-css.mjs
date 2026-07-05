import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const tokensBuildDir = join(here, '../../../packages/tokens/build');
const srcDir = join(here, '../src');
const distDir = join(here, '../dist');

mkdirSync(distDir, { recursive: true });

const read = (path) => readFileSync(path, 'utf8');

// @essenti-ui/tokens ships unlayered custom-property declarations —
// wrap them here so they slot into the shared cascade layer order below.
const tokenLayerFiles = ['primitive.css', 'light.css', 'dark.css'].map(
  (file) => `@layer tokens {\n${read(join(tokensBuildDir, file))}}\n`,
);

const componentFiles = ['Button', 'Input', 'Field', 'Table'].map((name) =>
  read(join(srcDir, name, `${name}.css`)),
);

const parts = [
  '@layer reset, tokens, base, components, utilities;\n',
  ...tokenLayerFiles,
  read(join(srcDir, 'styles', 'tokens.css')),
  ...componentFiles,
];

writeFileSync(join(distDir, 'styles.css'), parts.join('\n'));
