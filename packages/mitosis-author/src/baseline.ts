import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveBaselineDirs(): string[] {
  return [
    path.resolve(__dirname, '../../../templates/ds-repo/src/components'),
    path.resolve(__dirname, '../../../templates/ds-repo/src/icons'),
    path.resolve(process.cwd(), 'templates/ds-repo/src/components'),
    path.resolve(process.cwd(), 'templates/ds-repo/src/icons'),
  ];
}

export function loadBaselineComponentSource(componentName: string): string | undefined {
  if (!componentName) return undefined;
  const fileName = `${componentName}.lite.tsx`;
  for (const dir of resolveBaselineDirs()) {
    const candidate = path.join(dir, fileName);
    if (fs.existsSync(candidate)) {
      return fs.readFileSync(candidate, 'utf8');
    }
  }
  return undefined;
}

let cachedBaselineMap: Record<string, string> | null = null;

export function loadAllBaselineSiblings(overrides?: Record<string, string>): Record<string, string> {
  if (!cachedBaselineMap) {
    const map: Record<string, string> = {};
    for (const dir of resolveBaselineDirs()) {
      if (!fs.existsSync(dir)) continue;
      for (const entry of fs.readdirSync(dir)) {
        if (!entry.endsWith('.lite.tsx')) continue;
        const name = entry.slice(0, -'.lite.tsx'.length);
        if (!map[name]) {
          map[name] = fs.readFileSync(path.join(dir, entry), 'utf8');
        }
      }
    }
    cachedBaselineMap = map;
  }
  return overrides ? { ...cachedBaselineMap, ...overrides } : { ...cachedBaselineMap };
}
