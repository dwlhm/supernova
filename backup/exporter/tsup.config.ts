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
    // without CommonJS filename globals; this dependency-scoped transform neutralizes
    // both process and the filename globals so TypeScript's Node detection stays off.
    build.onLoad({ filter: /[\\/]typescript[\\/]lib[\\/]typescript\.js$/ }, async (args) => {
      const result = await transform(await readFile(args.path, 'utf8'), {
        loader: 'js', target: 'node18', define: { process: 'undefined', __filename: '"pulsar-exporter-bundle.js"', __dirname: '"."' }
      })
      return { contents: result.code, loader: 'js' }
    })
  } }, { name: 'runtime-source', setup(build) {
    build.onResolve({ filter: /\.ts\?raw$/ }, args => {
      const absolute = resolve(args.resolveDir, args.path.replace(/\?raw$/, ''))
      // Return the bare specifier as the resolved path: esbuild writes a
      // `// <namespace>:<path>` header into the bundle, so an absolute path would
      // bake the build machine into the executable. The specifier is stable across
      // machines, and pluginData carries the real location for onLoad to read.
      return { path: args.path.replace(/\?raw$/, ''), namespace: 'runtime-source', pluginData: { absolute } }
    })
    build.onLoad({ filter: /.*/, namespace: 'runtime-source' }, async args => ({ contents: await readFile(args.pluginData.absolute, 'utf8'), loader: 'text' }))
  } }],
  noExternal: [/.*/]
})
