import * as svelte from 'svelte/compiler';
import * as sfc from '@vue/compiler-sfc';
import ts from 'typescript';
import { findUnwrappedVue3ComputedRefs } from './vue3-computed.js';
import type { CompiledArtifact, CompileError } from './types.js';

function parseTsDiagnostics(fileName: string, code: string, kind: ts.ScriptKind, target: 'react' | 'angular'): CompileError[] {
  const sf = ts.createSourceFile(fileName, code, ts.ScriptTarget.ESNext, true, kind);
  const diags = (sf as any).parseDiagnostics as ts.Diagnostic[] | undefined;
  if (!diags || diags.length === 0) return [];
  return diags.map((diag) => ({
    target,
    rule: 'target-invalid',
    message: ts.flattenDiagnosticMessageText(diag.messageText, '\n'),
  }));
}

function validateVueArtifact(artifact: CompiledArtifact): CompileError[] {
  const { descriptor, errors } = sfc.parse(artifact.code);
  if (errors.length > 0) {
    return errors.map((err) => ({
      target: artifact.target,
      rule: 'target-invalid',
      message: typeof err === 'string' ? err : err.message,
    }));
  }

  if (descriptor.scriptSetup || descriptor.script) {
    try {
      sfc.compileScript(descriptor, { id: 'v-check' });
    } catch (err: unknown) {
      return [{ target: artifact.target, rule: 'target-invalid', message: err instanceof Error ? err.message : String(err) }];
    }
  }

  if (descriptor.template) {
    try {
      const tRes = sfc.compileTemplate({
        source: descriptor.template.content,
        id: 'v-check',
        filename: artifact.fileName,
        compilerOptions: { isTS: true },
      });
      if (tRes.errors.length > 0) {
        return tRes.errors.map((err) => ({
          target: artifact.target,
          rule: 'target-invalid',
          message: typeof err === 'string' ? err : (err as Error).message,
        }));
      }
    } catch (err: unknown) {
      return [{ target: artifact.target, rule: 'target-invalid', message: err instanceof Error ? err.message : String(err) }];
    }
  }

  if (artifact.target === 'vue3') {
    const unwrapped = findUnwrappedVue3ComputedRefs(artifact.code);
    if (unwrapped.length > 0) {
      return unwrapped.map((name) => ({
        target: 'vue3',
        rule: 'target-invalid',
        message: `Vue 3 <script setup> references computed ref "${name}" without .value`,
      }));
    }
  }

  return [];
}

export async function validateArtifact(artifact: CompiledArtifact): Promise<CompileError[]> {
  switch (artifact.target) {
    case 'svelte': {
      try {
        const nonModule = artifact.code.replace(/<script[^>]*context=["']module["'][^>]*>[\s\S]*?<\/script>/, '');
        const instScript = nonModule.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] || '';
        const templatePart = nonModule.replace(/<script[^>]*>[\s\S]*?<\/script>/, '');
        if (/\bprops\b/.test(templatePart) && !/\blet\s+props\b|\$:\s*props\s*=/.test(instScript)) {
          return [{ target: 'svelte', rule: 'target-invalid', message: 'Svelte template references undeclared "props" identifier' }];
        }
        const pre = await svelte.preprocess(artifact.code, {
          script: ({ content }: { content: string }) => ({
            code: ts.transpileModule(content, {
              compilerOptions: {
                target: ts.ScriptTarget.ESNext,
                verbatimModuleSyntax: false,
                preserveValueImports: true,
              },
            }).outputText,
          }),
        });
        svelte.compile(pre.code, { generate: 'dom' });
        return [];
      } catch (err: unknown) {
        return [{ target: 'svelte', rule: 'target-invalid', message: err instanceof Error ? err.message : String(err) }];
      }
    }
    case 'vue3':
    case 'vue2':
      return validateVueArtifact(artifact);
    case 'react':
      return parseTsDiagnostics(artifact.fileName, artifact.code, ts.ScriptKind.TSX, 'react');
    case 'angular':
      return parseTsDiagnostics(artifact.fileName, artifact.code, ts.ScriptKind.TS, 'angular');
    case 'mitosis':
    default:
      return [];
  }
}
