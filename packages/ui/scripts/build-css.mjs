import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const tokensBuildDir = join(here, '../../../packages/tokens/build');
const srcDir = join(here, '../src');
const distDir = join(here, '../dist');

mkdirSync(distDir, { recursive: true });
mkdirSync(join(distDir, 'fonts'), { recursive: true });

const read = (path) => readFileSync(path, 'utf8');

['InterVariable.woff2', 'JetBrainsMono-Regular.woff2'].forEach((file) => {
  copyFileSync(join(srcDir, 'fonts', file), join(distDir, 'fonts', file));
});

// @essenti-ui/tokens ships unlayered custom-property declarations —
// wrap them here so they slot into the shared cascade layer order below.
// jade/sapphire are the data-accent-scoped brand accent options.
const tokenLayerFiles = [
  'primitive.css',
  'light.css',
  'dark.css',
  'jade.css',
  'sapphire.css',
].map((file) => `@layer tokens {\n${read(join(tokensBuildDir, file))}}\n`);

const componentFiles = ['Button', 'Input', 'Field', 'Table'].map((name) =>
  read(join(srcDir, name, `${name}.css`)),
);

const parts = [
  '@layer reset, tokens, base, components, utilities;\n',
  ...tokenLayerFiles,
  read(join(srcDir, 'styles', 'tokens.css')),
  read(join(srcDir, 'styles', 'base.css')),
  ...componentFiles,
];

writeFileSync(join(distDir, 'styles.css'), parts.join('\n'));
