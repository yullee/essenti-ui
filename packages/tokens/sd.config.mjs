import StyleDictionary from 'style-dictionary';

const primitiveSource = ['src/primitive/**/*.json'];
const prefix = 'essenti';

const cssBase = {
  transformGroup: 'css',
  prefix,
  buildPath: 'build/',
};

const semanticRoots = ['surface', 'text', 'border', 'accent', 'status'];
const isPrimitive = (token) => !semanticRoots.includes(token.path[0]);
const isSemantic = (token) => semanticRoots.includes(token.path[0]);
const isAccentScale = (token) =>
  token.path[0] === 'color' && token.path[1] === 'accent';

// Brand accent is a swappable indirection: color.accent.* aliases whichever
// palette (jade/sapphire) is active. jade.json is the default — included
// wherever `color.accent.*` needs to resolve (primitive.css's unscoped
// default, and light/dark's `accent.solid` etc aliases) so consumers who
// never set data-accent keep the original jade look.
const accentDefaultSource = 'src/accent/jade.json';

// 1. Primitive tokens → :root (jade is the default accent)
const sdPrimitive = new StyleDictionary({
  usesDtcg: true,
  source: [...primitiveSource, accentDefaultSource],
  platforms: {
    css: {
      ...cssBase,
      files: [
        {
          destination: 'primitive.css',
          format: 'css/variables',
          options: { selector: ':root' },
        },
      ],
    },
  },
});

// 2. Light semantic tokens → [data-theme="light"]
const sdLight = new StyleDictionary({
  usesDtcg: true,
  source: [...primitiveSource, accentDefaultSource, 'src/semantic/light.json'],
  platforms: {
    css: {
      ...cssBase,
      files: [
        {
          destination: 'light.css',
          format: 'css/variables',
          filter: isSemantic,
          options: {
            selector: '[data-theme="light"]',
            outputReferences: true,
          },
        },
      ],
    },
  },
});

// 3. Dark semantic tokens → [data-theme="dark"]
const sdDark = new StyleDictionary({
  usesDtcg: true,
  source: [...primitiveSource, accentDefaultSource, 'src/semantic/dark.json'],
  platforms: {
    css: {
      ...cssBase,
      files: [
        {
          destination: 'dark.css',
          format: 'css/variables',
          filter: isSemantic,
          options: {
            selector: '[data-theme="dark"]',
            outputReferences: true,
          },
        },
      ],
    },
  },
});

// 4. Accent theme scales → [data-accent="jade"] / [data-accent="sapphire"]
const sdAccentJade = new StyleDictionary({
  usesDtcg: true,
  source: [...primitiveSource, 'src/accent/jade.json'],
  platforms: {
    css: {
      ...cssBase,
      files: [
        {
          destination: 'jade.css',
          format: 'css/variables',
          filter: isAccentScale,
          options: { selector: '[data-accent="jade"]' },
        },
      ],
    },
  },
});

const sdAccentSapphire = new StyleDictionary({
  usesDtcg: true,
  source: [...primitiveSource, 'src/accent/sapphire.json'],
  platforms: {
    css: {
      ...cssBase,
      files: [
        {
          destination: 'sapphire.css',
          format: 'css/variables',
          filter: isAccentScale,
          options: { selector: '[data-accent="sapphire"]' },
        },
      ],
    },
  },
});

// 5. Typed TS export from light semantic (canonical token names)
const sdTs = new StyleDictionary({
  usesDtcg: true,
  source: [...primitiveSource, accentDefaultSource, 'src/semantic/light.json'],
  platforms: {
    ts: {
      transformGroup: 'js',
      prefix,
      buildPath: 'build/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
          filter: isSemantic,
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
          filter: isSemantic,
        },
      ],
    },
  },
});

await sdPrimitive.buildAllPlatforms();
await sdLight.buildAllPlatforms();
await sdDark.buildAllPlatforms();
await sdAccentJade.buildAllPlatforms();
await sdAccentSapphire.buildAllPlatforms();
await sdTs.buildAllPlatforms();
