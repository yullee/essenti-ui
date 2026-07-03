import StyleDictionary from "style-dictionary";

const primitiveSource = ["src/primitive/**/*.json"];
const prefix = "essenti";

const cssBase = {
  transformGroup: "css",
  prefix,
  buildPath: "build/",
};

const semanticRoots = ["surface", "text", "border", "accent", "status"];
const isPrimitive = (token) => !semanticRoots.includes(token.path[0]);
const isSemantic = (token) => semanticRoots.includes(token.path[0]);

// 1. Primitive tokens → :root
const sdPrimitive = new StyleDictionary({
  usesDtcg: true,
  source: primitiveSource,
  platforms: {
    css: {
      ...cssBase,
      files: [
        {
          destination: "primitive.css",
          format: "css/variables",
          options: { selector: ":root" },
        },
      ],
    },
  },
});

// 2. Light semantic tokens → [data-theme="light"]
const sdLight = new StyleDictionary({
  usesDtcg: true,
  source: [...primitiveSource, "src/semantic/light.json"],
  platforms: {
    css: {
      ...cssBase,
      files: [
        {
          destination: "light.css",
          format: "css/variables",
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
  source: [...primitiveSource, "src/semantic/dark.json"],
  platforms: {
    css: {
      ...cssBase,
      files: [
        {
          destination: "dark.css",
          format: "css/variables",
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

// 4. Typed TS export from light semantic (canonical token names)
const sdTs = new StyleDictionary({
  usesDtcg: true,
  source: [...primitiveSource, "src/semantic/light.json"],
  platforms: {
    ts: {
      transformGroup: "js",
      prefix,
      buildPath: "build/",
      files: [
        {
          destination: "tokens.js",
          format: "javascript/es6",
          filter: isSemantic,
        },
        {
          destination: "tokens.d.ts",
          format: "typescript/es6-declarations",
          filter: isSemantic,
        },
      ],
    },
  },
});

await sdPrimitive.buildAllPlatforms();
await sdLight.buildAllPlatforms();
await sdDark.buildAllPlatforms();
await sdTs.buildAllPlatforms();
