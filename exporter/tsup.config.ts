import { defineConfig } from 'tsup'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { transform } from 'esbuild'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  bundle: true,
  sourcemap: false,
  minify: false,
  esbuildPlugins: [{ name: 'typescript-pure-compiler', setup(build) {
    // AST construction and printing need no filesystem host. Pulsar exposes process
    // without CommonJS filename globals, so disable Node detection only in TypeScript.
    build.onLoad({ filter: /[\\/]typescript[\\/]lib[\\/]typescript\.js$/ }, async (args) => {
      const result = await transform(await readFile(args.path, 'utf8'), {
        loader: 'js', target: 'node18', define: { process: 'undefined' }
      })
      return { contents: result.code, loader: 'js' }
    })
  } }, { name: 'runtime-source', setup(build) {
    build.onResolve({ filter: /\.ts\?raw$/ }, args => ({ path: resolve(args.resolveDir, args.path.replace(/\?raw$/, '')), namespace: 'runtime-source' }))
    build.onLoad({ filter: /.*/, namespace: 'runtime-source' }, async (args) => ({ contents: await (await import('node:fs/promises')).readFile(args.path.replace(/\?raw$/, ''), 'utf8'), loader: 'text' }))
  } }],
  noExternal: [/.*/]
})
