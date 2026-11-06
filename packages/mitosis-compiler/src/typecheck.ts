import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import type { CompileError } from './types.js';
import { getUtilsSource } from './utils-source.js';

/** Virtual files live under this package so `@builder.io/mitosis` resolves from its node_modules. */
const VIRTUAL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '__typecheck__');

const OPTIONS: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.Preserve,
  jsxImportSource: '@builder.io/mitosis',
  lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'],
  strict: false,
  noEmit: true,
  skipLibCheck: true,
};

/**
 * Mitosis' JSX typings for native elements are incomplete (`scope`, camelCase SVG attributes, `data-*`), so
 * assignments to native attribute types are not authoring errors. Component props and helper members are.
 */
const NATIVE_ATTRIBUTE_TYPE_RE = /\b\w*(HTML|SVG)Attributes<|SvgSVGAttributes/;

/** Sources sit side by side here, so example imports (`../components/X.lite`) are flattened to `./X.lite`. */
const flatten = (source: string) => source.replace(/(["'])\.\.\/(?:components|icons)\//g, '$1./');

function createHost(files: Map<string, string>): ts.CompilerHost {
  const host = ts.createCompilerHost(OPTIONS);
  const { fileExists, readFile, getSourceFile, directoryExists } = host;
  host.fileExists = (f) => files.has(f) || fileExists.call(host, f);
  host.readFile = (f) => files.get(f) ?? readFile.call(host, f);
  host.directoryExists = (d) => d === VIRTUAL_DIR || (directoryExists ? directoryExists.call(host, d) : true);
  host.realpath = (f) => f;
  host.getSourceFile = (f, lang, ...rest) =>
    files.has(f) ? ts.createSourceFile(f, files.get(f)!, lang, true, ts.ScriptKind.TSX) : getSourceFile.call(host, f, lang, ...rest);
  return host;
}

/** Type-checks a `.lite.tsx` source against `./utils` and its siblings (props passed, helper members used). */
export function typecheckSource(componentName: string, source: string, siblingSources: Record<string, string> = {}): CompileError[] {
  const file = path.join(VIRTUAL_DIR, `${componentName}.lite.tsx`);
  const files = new Map<string, string>([[path.join(VIRTUAL_DIR, 'utils.ts'), getUtilsSource()]]);
  for (const [name, code] of Object.entries(siblingSources)) {
    files.set(path.join(VIRTUAL_DIR, `${name.replace(/^\.\//, '').replace(/\.lite(\.tsx)?$/, '')}.lite.tsx`), flatten(code));
  }
  files.set(file, flatten(source));

  const program = ts.createProgram([file], OPTIONS, createHost(files));
  const sf = program.getSourceFile(file)!;
  return [...program.getSyntacticDiagnostics(sf), ...program.getSemanticDiagnostics(sf)]
    .map((d) => ({ d, message: ts.flattenDiagnosticMessageText(d.messageText, ' ') }))
    .filter(({ message }) => !NATIVE_ATTRIBUTE_TYPE_RE.test(message))
    .map(({ d, message }) => ({
      target: 'types',
      rule: `TS${d.code}`,
      line: d.start !== undefined ? sf.getLineAndCharacterOfPosition(d.start).line + 1 : undefined,
      message,
    }));
}
