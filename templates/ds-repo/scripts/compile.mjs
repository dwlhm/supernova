#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const componentsDir = path.resolve(rootDir, 'src/components');
const distDir = path.resolve(rootDir, 'dist');

async function main() {
  console.log('[compile] Multi-framework compilation for Supernova Design System...');
  await fs.mkdir(distDir, { recursive: true });
}

main().catch((err) => {
  console.error('[compile] Error:', err);
  process.exit(1);
});
