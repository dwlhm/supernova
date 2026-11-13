import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CORE_MODULE_FILES = [
  'core-a11y.ts',
  'core-floating.ts',
  'core-collection.ts',
  'core-overlay.ts',
  'core-date.ts',
  'core-form.ts',
  'core-file.ts',
  'core-table.ts',
  'core-chart.ts',
  'core-virtual.ts',
  'core-chart-series.ts',
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
    path.resolve(__dirname, '../../../src/components'),
    path.resolve(process.cwd(), 'packages/mitosis-compiler/src'),
    path.resolve(process.cwd(), 'src/components'),
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
  const fallback = path.resolve(process.cwd(), 'src/components/utils.ts');
  if (fs.existsSync(fallback)) {
    cachedUtilsSource = fs.readFileSync(fallback, 'utf8');
    return cachedUtilsSource;
  }
  throw new Error('Canonical utils source modules not found');
}

let cachedReactRuntimeSource: string | null = null;
let cachedVue3RuntimeSource: string | null = null;

function resolveCompilerSrcDir(): string | null {
  const dirs = [
    path.resolve(__dirname, '../src'),
    path.resolve(process.cwd(), 'packages/mitosis-compiler/src'),
  ];
  for (const dir of dirs) {
    if (fs.existsSync(path.join(dir, 'runtime-react.ts'))) return dir;
  }
  return null;
}

export function getReactRuntimeSource(): string {
  if (cachedReactRuntimeSource) return cachedReactRuntimeSource;
  const srcDir = resolveCompilerSrcDir();
  if (!srcDir) throw new Error('Canonical runtime-react.ts source not found');
  const raw = fs.readFileSync(path.join(srcDir, 'runtime-react.ts'), 'utf8');
  cachedReactRuntimeSource = raw.replace(/from\s+['"]\.\/core-[^'"]+['"]/g, "from './utils.ts'");
  return cachedReactRuntimeSource;
}

export function getVue3RuntimeSource(): string {
  if (cachedVue3RuntimeSource) return cachedVue3RuntimeSource;
  const srcDir = resolveCompilerSrcDir();
  if (!srcDir) throw new Error('Canonical runtime-vue3.ts source not found');
  const raw = fs.readFileSync(path.join(srcDir, 'runtime-vue3.ts'), 'utf8');
  const rewritten = raw.replace(/from\s+['"]\.\/core-[^'"]+['"]/g, "from './utils.ts'");
  cachedVue3RuntimeSource =
    `import { shallowRef, onScopeDispose } from 'vue';\n\n` +
    rewritten +
    `\nexport const { useForm, useFormField, useTable, useOverlay } = createVue3Runtime({\n` +
    `  shallowRef,\n` +
    `  onScopeDispose,\n` +
    `});\n`;
  return cachedVue3RuntimeSource;
}
