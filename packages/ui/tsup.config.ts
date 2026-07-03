import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    Button: 'src/Button.tsx',
    Input: 'src/Input.tsx',
    Field: 'src/Field.tsx',
    Table: 'src/Table.tsx',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  treeshake: true,
});
