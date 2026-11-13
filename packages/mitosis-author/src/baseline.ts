import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveBaselineDirs(workspaceDir?: string): string[] {
  const roots = [
    ...(workspaceDir ? [path.resolve(workspaceDir)] : []),
    path.resolve(process.cwd()),
    path.resolve(__dirname, '../../..'),
  ];
  const uniqueRoots = [...new Set(roots)];
  const dirs: string[] = [];
  for (const root of uniqueRoots) {
    dirs.push(
      path.join(root, 'src/components'),
      path.join(root, 'src/icons'),
      path.join(root, 'src/examples')
    );
  }
  return dirs;
}

export function loadBaselineComponentSource(componentName: string, workspaceDir?: string): string | undefined {
  if (!componentName) return undefined;
  const fileName = `${componentName}.lite.tsx`;
  for (const dir of resolveBaselineDirs(workspaceDir)) {
    const candidate = path.join(dir, fileName);
    if (fs.existsSync(candidate)) {
      return fs.readFileSync(candidate, 'utf8');
    }
  }
  return undefined;
}

export function loadAllBaselineSiblings(
  overrides?: Record<string, string>,
  workspaceDir?: string
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const dir of resolveBaselineDirs(workspaceDir)) {
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir)) {
      if (!entry.endsWith('.lite.tsx')) continue;
      const name = entry.slice(0, -'.lite.tsx'.length);
      if (!map[name]) {
        map[name] = fs.readFileSync(path.join(dir, entry), 'utf8');
      }
    }
  }
  return overrides ? { ...map, ...overrides } : map;
}
