import * as svelte from 'svelte/compiler';
import * as sfc from '@vue/compiler-sfc';
import ts from 'typescript';
import type { CompiledArtifact, CompileError } from './types.js';

export async function validateArtifact(
  artifact: CompiledArtifact
): Promise<CompileError[]> {
  switch (artifact.target) {
    case 'svelte': {
      try {
        const pre = await svelte.preprocess(artifact.code, {
          script: ({ content }: { content: string }) => {
            return {
              code: ts.transpileModule(content, {
                compilerOptions: {
                  target: ts.ScriptTarget.ESNext,
                  verbatimModuleSyntax: false,
                  preserveValueImports: true,
                },
              }).outputText,
            };
          },
        });
        svelte.compile(pre.code, { generate: 'dom' });
        return [];
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return [{ target: 'svelte', rule: 'target-invalid', message }];
      }
    }

    case 'vue3':
    case 'vue2': {
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
          const message = err instanceof Error ? err.message : String(err);
          return [{ target: artifact.target, rule: 'target-invalid', message }];
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
          const message = err instanceof Error ? err.message : String(err);
          return [{ target: artifact.target, rule: 'target-invalid', message }];
        }
      }

      return [];
    }

    case 'react': {
      const sf = ts.createSourceFile(
        artifact.fileName,
        artifact.code,
        ts.ScriptTarget.ESNext,
        true,
        ts.ScriptKind.TSX
      );
      const diags = (sf as any).parseDiagnostics as ts.Diagnostic[] | undefined;
      if (diags && diags.length > 0) {
        return diags.map((diag) => ({
          target: 'react',
          rule: 'target-invalid',
          message: ts.flattenDiagnosticMessageText(diag.messageText, '\n'),
        }));
      }
      return [];
    }

    case 'angular': {
      const sf = ts.createSourceFile(
        artifact.fileName,
        artifact.code,
        ts.ScriptTarget.ESNext,
        true,
        ts.ScriptKind.TS
      );
      const diags = (sf as any).parseDiagnostics as ts.Diagnostic[] | undefined;
      if (diags && diags.length > 0) {
        return diags.map((diag) => ({
          target: 'angular',
          rule: 'target-invalid',
          message: ts.flattenDiagnosticMessageText(diag.messageText, '\n'),
        }));
      }
      return [];
    }

    case 'mitosis':
    default:
      return [];
  }
}
