// Turns compiled Vue 2 SFCs and Angular components into browser modules for the live preview.
// A component that fails (or imports one that fails) is skipped with a diagnostic instead of failing the build.
import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const MAX_DIAGNOSTIC_CHARS = 1200;
const stripAnsi = (text) => text.replace(/\x1b\[[0-9;]*m/g, '');

/** Adds every component that (transitively) imports a failed one, recording why. */
export function withDependents(sources, errors) {
  let changed = true;
  while (changed) {
    changed = false;
    for (const [name, code] of sources) {
      if (errors[name]) continue;
      const dep = [...code.matchAll(/from\s+["']\.\/([A-Za-z0-9]+)(?:\.vue)?["']/g)].map((m) => m[1]).find((d) => errors[d]);
      if (!dep) continue;
      errors[name] = `Depends on ${dep}, which failed to build.`;
      changed = true;
    }
  }
  return errors;
}

const transpile = (code) =>
  ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;

/** Vue 2 SFC (options API) -> ES module with `render`/`staticRenderFns`; sibling `.vue` imports point at `.js`. */
export function vue2SfcToModule(source, filename, { parse, compileTemplate }) {
  const { template, script, errors } = parse({ source, filename });
  if (errors?.length) throw new Error(errors.join('; '));
  if (!template) throw new Error('missing <template>');
  const tpl = compileTemplate({ source: template.content, filename, isProduction: true });
  if (tpl.errors.length) throw new Error(tpl.errors.join('; '));
  const scriptJs = transpile(script?.content ?? 'export default {}').replace(/export default\s*/, 'const __sfc__ = ');
  return `${scriptJs}\n${tpl.code}\n__sfc__.render = render;\n__sfc__.staticRenderFns = staticRenderFns;\nexport default __sfc__;\n`.replace(
    /(from\s+["']\.\/[A-Za-z0-9]+)\.vue(["'])/g,
    '$1.js$2'
  );
}

export async function buildVue2Preview(sfcs, outDir) {
  const compiler = await import('vue2/compiler-sfc');
  await fs.mkdir(outDir, { recursive: true });
  const errors = {};
  const modules = new Map();
  for (const [name, code] of sfcs) {
    try {
      modules.set(name, vue2SfcToModule(code, `${name}.vue`, compiler));
    } catch (err) {
      errors[name] = String(err?.message || err).slice(0, MAX_DIAGNOSTIC_CHARS);
    }
  }
  withDependents(sfcs, errors);
  const built = new Set();
  for (const [name, code] of modules) {
    if (errors[name]) continue;
    await fs.writeFile(path.join(outDir, `${name}.js`), code, 'utf-8');
    built.add(name);
  }
  return { built, errors };
}

function diagnosticsByComponent(ngc, diagnostics, srcDir) {
  const grouped = {};
  for (const d of diagnostics) {
    if (d.category !== ts.DiagnosticCategory.Error) continue;
    const file = d.file?.fileName ? path.relative(srcDir, d.file.fileName) : '';
    const name = file.endsWith('.ts') ? file.slice(0, -3) : '*';
    (grouped[name] ||= []).push(d);
  }
  const host = { getCurrentDirectory: () => srcDir, getCanonicalFileName: (f) => f, getNewLine: () => '\n' };
  return Object.fromEntries(
    Object.entries(grouped).map(([name, diags]) => [name, stripAnsi(ngc.formatDiagnostics(diags, host)).slice(0, MAX_DIAGNOSTIC_CHARS)])
  );
}

async function writeAngularWorkspace(sources, utilsSource, workDir) {
  const srcDir = path.join(workDir, 'src');
  await fs.rm(workDir, { recursive: true, force: true });
  await fs.mkdir(srcDir, { recursive: true });
  await fs.writeFile(path.join(srcDir, 'utils.ts'), utilsSource, 'utf-8');
  for (const [name, code] of sources) await fs.writeFile(path.join(srcDir, `${name}.ts`), code, 'utf-8');
  const tsconfig = {
    compilerOptions: {
      target: 'ES2022', module: 'ES2022', moduleResolution: 'bundler', lib: ['ES2022', 'DOM'],
      experimentalDecorators: true, strict: false, skipLibCheck: true, declaration: false,
      rootDir: './src', outDir: './dist',
    },
    include: ['src/**/*.ts'],
    angularCompilerOptions: { fullTemplateTypeCheck: true },
  };
  await fs.writeFile(path.join(workDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2), 'utf-8');
  return srcDir;
}

/** AOT-compiles Angular components with `ngc` in two passes: collect diagnostics, then emit the healthy set. */
export async function buildAngularPreview(sources, { workDir, outDir, utilsSource }) {
  const ngc = await import('@angular/compiler-cli');
  const srcDir = await writeAngularWorkspace(sources, utilsSource, workDir);
  const config = ngc.readConfiguration(path.join(workDir, 'tsconfig.json'));
  const rootFor = (names) => [path.join(srcDir, 'utils.ts'), ...names.map((n) => path.join(srcDir, `${n}.ts`))];

  const check = ngc.performCompilation({ rootNames: rootFor([...sources.keys()]), options: { ...config.options, noEmit: true } });
  const errors = diagnosticsByComponent(ngc, check.diagnostics, srcDir);
  if (errors.utils || errors['*']) {
    const reason = `Angular build failed globally:\n${errors.utils || errors['*']}`;
    return { built: new Set(), errors: Object.fromEntries([...sources.keys()].map((n) => [n, reason])) };
  }
  withDependents(sources, errors);

  const healthy = [...sources.keys()].filter((n) => !errors[n]);
  const emit = ngc.performCompilation({ rootNames: rootFor(healthy), options: config.options });
  const emitErrors = diagnosticsByComponent(ngc, emit.diagnostics, srcDir);
  for (const n of healthy) if (emitErrors[n]) errors[n] = emitErrors[n];

  await fs.mkdir(outDir, { recursive: true });
  const built = new Set();
  for (const name of healthy.filter((n) => !errors[n])) {
    await fs.copyFile(path.join(workDir, 'dist', `${name}.js`), path.join(outDir, `${name}.js`));
    built.add(name);
  }
  return { built, errors };
}
