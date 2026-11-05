import { generateText } from 'ai';
import {
  compileMitosis,
  generateNamespaceIndex,
  normalizeMitosisSource,
  type CompiledArtifact,
  type TargetFramework,
} from '@supernova/mitosis-compiler';
import { getAuthorConfig, getAuthorModel } from './config.js';
import { runAgyAuthor } from './agy-runner.js';
import {
  createAuthorTools,
  type ComponentGroup,
  type DiscoveredToken,
} from './tools.js';
import { SYSTEM_PROMPT, buildAuthorUserPrompt } from './prompt.js';
import { loadAllBaselineSiblings, loadBaselineComponentSource } from './baseline.js';

export interface ComponentRequestItem {
  componentName?: string;
  name?: string;
  componentSpec?: any;
  existingSource?: string;
  repairErrors?: string[];
}

export interface AuthorAgentRequest {
  componentName?: string;
  componentSpec?: any;
  tokens?: any;
  tokenClasses?: string[];
  repairErrors?: string[];
  existingSource?: string;
  feedbackNotes?: string;
  components?: ComponentRequestItem[];
  existingComponentNames?: string[];
  workspaceDir?: string;
  targets?: TargetFramework[];
  compileOnly?: boolean;
}

export interface AuthorAgentResponse {
  success: boolean;
  components: Record<string, string>;
  componentGroups: Record<string, string>;
  artifacts: CompiledArtifact[];
  newTokens: DiscoveredToken[];
  error?: string;
}

const DEFAULT_TARGETS: TargetFramework[] = [
  'mitosis', 'react', 'svelte', 'vue3', 'vue2', 'angular',
];

function resolvePreferredBaseSource(provided: string | undefined, compName: string): string | undefined {
  const baseline = loadBaselineComponentSource(compName);
  if (!provided) return baseline;
  if (baseline && /-(?:components|primitive)-|rounded-rounded-/.test(provided)) {
    return baseline;
  }
  return provided;
}

function collectContextMaps(req: AuthorAgentRequest) {
  const existingSources: Record<string, string> = {};
  const rawSpecs: Record<string, any> = {};
  const requestedNames: string[] = [];

  if (req.componentName) {
    requestedNames.push(req.componentName);
    const baseline = resolvePreferredBaseSource(req.existingSource, req.componentName);
    if (baseline) {
      existingSources[req.componentName] = baseline;
      req.existingSource = baseline;
    }
    if (req.componentSpec) rawSpecs[req.componentName] = req.componentSpec;
  }
  if (req.components) {
    for (const item of req.components) {
      const cName = item.componentName || item.name;
      if (!cName) continue;
      if (!requestedNames.includes(cName)) requestedNames.push(cName);
      const baseline = resolvePreferredBaseSource(item.existingSource || req.existingSource, cName);
      if (baseline) {
        existingSources[cName] = baseline;
        item.existingSource = baseline;
      }
      const spec = item.componentSpec || ((item as any).node || (item as any).properties ? item : undefined);
      if (spec) rawSpecs[cName] = spec;
    }
  }
  return { existingSources, rawSpecs, requestedNames };
}

function recoverMissingComponents(
  req: AuthorAgentRequest,
  components: Record<string, string>,
  componentGroups: Record<string, ComponentGroup>,
  lastCompiledSource: Record<string, string>,
  lastAttemptedSource: Record<string, string>
) {
  if (Object.keys(components).length === 0) {
    const fallbackMap =
      Object.keys(lastCompiledSource).length > 0 ? lastCompiledSource : lastAttemptedSource;
    for (const [name, source] of Object.entries(fallbackMap)) {
      components[name] = normalizeMitosisSource(source, name);
      componentGroups[name] = 'components';
    }
  }
  // Enforce canonical component name if single component was requested but saved under alias
  if (req.componentName && !components[req.componentName]) {
    const savedEntries = Object.entries(components);
    if (savedEntries.length === 1) {
      const [savedName, savedSource] = savedEntries[0]!;
      const canonicalSource = normalizeMitosisSource(savedSource, req.componentName);
      components[req.componentName] = canonicalSource;
      componentGroups[req.componentName] = componentGroups[savedName] || 'components';
    }
  }
}

export async function runAuthorAgent(
  req: AuthorAgentRequest
): Promise<AuthorAgentResponse> {
  const components: Record<string, string> = {};
  const componentGroups: Record<string, ComponentGroup> = {};
  const newTokens: DiscoveredToken[] = [];
  const finished = { value: false };
  const lastCompiledSource: Record<string, string> = {};
  const lastAttemptedSource: Record<string, string> = {};
  const lastCompileErrors: Record<string, string[]> = {};

  try {
    const targets = req.targets && req.targets.length > 0 ? req.targets : DEFAULT_TARGETS;

    if (req.compileOnly) {
      const compName =
        req.componentName ||
        (req.components?.[0] && (req.components[0].componentName || req.components[0].name));
      const rawSource = req.existingSource || req.components?.[0]?.existingSource;
      const source = compName ? resolvePreferredBaseSource(rawSource, compName) : rawSource;
      if (compName && source) {
        components[compName] = normalizeMitosisSource(source, compName);
        componentGroups[compName] = 'components';
      }
    } else {
      const config = getAuthorConfig();
      const { existingSources, rawSpecs, requestedNames } = collectContextMaps(req);

      if (config.provider === 'agy') {
        await runAgyAuthor({
          req,
          config,
          requestedNames,
          existingSources,
          rawSpecs,
          components,
          componentGroups,
          newTokens,
          lastAttemptedSource,
        });
      } else {
        const model = getAuthorModel(config);
        const abortController = new AbortController();
        const timeoutSignal = AbortSignal.timeout(config.timeoutMs);

        const tools = createAuthorTools({
          workspaceDir: req.workspaceDir || process.cwd(),
          existingSources,
          rawSpecs,
          components,
          componentGroups,
          newTokens,
          finished,
          abortController,
          lastCompiledSource,
          lastAttemptedSource,
          lastCompileErrors,
          tokenClasses: req.tokenClasses,
          rawTokens: req.tokens,
        });

        const componentCount = req.components?.length || 1;
        const maxSteps = Math.max(30, componentCount * 6);

        try {
          await generateText({
            model,
            system: SYSTEM_PROMPT,
            prompt: buildAuthorUserPrompt(req),
            tools,
            maxSteps,
            abortSignal: AbortSignal.any([abortController.signal, timeoutSignal]),
            onStepFinish: () => {
              if (finished.value) abortController.abort();
            },
          });
        } catch (genErr: any) {
          if (timeoutSignal.aborted && !finished.value) {
            throw new Error(`LLM authoring timed out after ${config.timeoutMs}ms`);
          }
          if (!finished.value && genErr?.name !== 'AbortError' && !genErr?.message?.includes('aborted')) {
            throw genErr;
          }
        }
      }
    }

    recoverMissingComponents(
      req,
      components,
      componentGroups,
      lastCompiledSource,
      lastAttemptedSource
    );

    if (Object.keys(components).length === 0) {
      return {
        success: false, components: {}, componentGroups: {}, artifacts: [], newTokens,
        error: 'No components were authored or saved during the session.',
      };
    }

    const artifacts: CompiledArtifact[] = [];
    const compileErrors: string[] = [];

    const siblingSources = loadAllBaselineSiblings(components);
    for (const [name, source] of Object.entries(components)) {
      const compileRes = await compileMitosis({
        componentName: name, source, targets, allowedClasses: req.tokenClasses,
        siblingSources, checks: { lint: true, render: true }, normalize: true,
      });
      if (compileRes.success) {
        artifacts.push(...compileRes.artifacts);
      } else {
        compileErrors.push(...compileRes.errors.map((e) => `[${name}][${e.target || 'compiler'}] ${e.message}`));
      }
    }

    if (compileErrors.length > 0 && artifacts.length === 0) {
      return {
        success: false, components, componentGroups, artifacts: [], newTokens,
        error: `Compilation failed for authored components: ${compileErrors.join('; ')}`,
      };
    }

    for (const target of targets) {
      const indexArtifact = generateNamespaceIndex(Object.keys(components), target);
      if (indexArtifact) artifacts.push(indexArtifact);
    }

    return { success: true, components, componentGroups, artifacts, newTokens };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, components, componentGroups, artifacts: [], newTokens, error: message };
  }
}
