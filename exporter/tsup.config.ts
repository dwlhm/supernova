import { defineConfig } from 'tsup'
import { resolve } from 'node:path'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  bundle: true,
  sourcemap: false,
  minify: false,
  esbuildPlugins: [{ name: 'runtime-source', setup(build) {
    build.onResolve({ filter: /\.ts\?raw$/ }, args => ({ path: resolve(args.resolveDir, args.path.replace(/\?raw$/, '')), namespace: 'runtime-source' }))
    build.onLoad({ filter: /.*/, namespace: 'runtime-source' }, async (args) => ({ contents: await (await import('node:fs/promises')).readFile(args.path.replace(/\?raw$/, ''), 'utf8'), loader: 'text' }))
  } }],
  noExternal: [/.*/]
})
