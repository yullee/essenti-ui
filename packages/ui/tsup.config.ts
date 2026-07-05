import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    Button: 'src/Button/index.ts',
    Input: 'src/Input/index.ts',
    Field: 'src/Field/index.ts',
    Table: 'src/Table/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  treeshake: true,
});
