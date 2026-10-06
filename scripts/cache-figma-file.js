#!/usr/bin/env node
const path = require('path');
const { loadEnvFile } = require('./figma-to-mitosis');
const { cacheFigmaFile } = require('./figma-snapshot');
loadEnvFile(path.resolve(__dirname, '..', '.env'));
async function run() {
  const args = process.argv.slice(2);
  const value = name => {
    const inline = args.find(arg => arg.startsWith(`--${name}=`));
    if (inline) return inline.slice(name.length + 3);
    const index = args.indexOf(`--${name}`);
    return index >= 0 ? args[index + 1] : undefined;
  };
  if (args.includes('--help')) {
    console.log('node scripts/cache-figma-file.js --file=<key> [--out=<cache.json>] [--refresh]\nFetches the complete file once; subsequent calls reuse the validated snapshot offline.');
    return;
  }
  const result = await cacheFigmaFile({ fileKey: value('file') || process.env.FIGMA_FILE_KEY, token: process.env.FIGMA_ACCESS_TOKEN, out: value('out'), refresh: args.includes('--refresh') });
  console.log(`${result.reused ? 'Reused' : 'Saved'} Figma snapshot: ${result.cachePath}`);
  console.log(`File version: ${result.snapshot.file.version}; scene nodes: ${result.snapshot.nodes.size}`);
}
run().catch(error => { console.error(error.message); process.exitCode = 1; });
