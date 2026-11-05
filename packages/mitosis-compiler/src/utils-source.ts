import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CORE_MODULE_FILES = [
  'core-a11y.ts',
  'core-overlay.ts',
  'core-date.ts',
  'core-form.ts',
  'core-file.ts',
  'core-table.ts',
  'core-chart.ts',
  'core-icons.ts',
  'core-views.ts',
  'core-views-nav.ts',
  'core-views-data.ts',
  'core-controller.ts',
];

let cachedUtilsSource: string | null = null;

function resolveCoreDir(): string | null {
  const dirs = [
    path.resolve(__dirname, '../src'),
    path.resolve(__dirname, '../../../templates/ds-repo/src/components'),
    path.resolve(process.cwd(), 'packages/mitosis-compiler/src'),
    path.resolve(process.cwd(), 'templates/ds-repo/src/components'),
  ];
  for (const dir of dirs) {
    if (fs.existsSync(path.join(dir, 'core-a11y.ts'))) return dir;
  }
  return null;
}

export function getUtilsSource(): string {
  if (cachedUtilsSource) return cachedUtilsSource;
  const coreDir = resolveCoreDir();
  if (coreDir) {
    const chunks: string[] = [];
    for (const file of CORE_MODULE_FILES) {
      const filePath = path.join(coreDir, file);
      if (!fs.existsSync(filePath)) continue;
      const raw = fs.readFileSync(filePath, 'utf8');
      const stripped = raw.replace(/^import\s+[\s\S]*?from\s+['"]\.\/core-[^'"]+['"];?\s*$/gm, '').trim();
      chunks.push(stripped);
    }
    cachedUtilsSource = chunks.join('\n\n') + '\n';
    return cachedUtilsSource;
  }
  const fallback = path.resolve(process.cwd(), 'templates/ds-repo/src/components/utils.ts');
  if (fs.existsSync(fallback)) {
    cachedUtilsSource = fs.readFileSync(fallback, 'utf8');
    return cachedUtilsSource;
  }
  throw new Error('Canonical utils source modules not found');
}
