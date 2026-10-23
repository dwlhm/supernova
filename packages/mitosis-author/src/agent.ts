import { generateText } from 'ai';
import {
  compileMitosis,
  generateNamespaceIndex,
  type CompiledArtifact,
  type TargetFramework,
} from '@supernova/mitosis-compiler';
import { getAuthorConfig, getAuthorModel } from './config.js';
import {
  createAuthorTools,
  type ComponentGroup,
  type DiscoveredToken,
} from './tools.js';
import { SYSTEM_PROMPT, buildAuthorUserPrompt } from './prompt.js';

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
  'mitosis',
  'react',
  'svelte',
  'vue3',
  'vue2',
  'angular',
];

export async function runAuthorAgent(
  req: AuthorAgentRequest
): Promise<AuthorAgentResponse> {
  const components: Record<string, string> = {};
  const componentGroups: Record<string, ComponentGroup> = {};
  const newTokens: DiscoveredToken[] = [];
  const finished = { value: false };
  const lastCompiledSource: Record<string, string> = {};

  try {
    const targets: TargetFramework[] =
      req.targets && req.targets.length > 0 ? req.targets : DEFAULT_TARGETS;

    if (req.compileOnly) {
      const compName =
        req.componentName ||
        (req.components &&
          req.components[0] &&
          (req.components[0].componentName || req.components[0].name));
      const source =
        req.existingSource ||
        (req.components && req.components[0] && req.components[0].existingSource);
      if (compName && source) {
        components[compName] = source;
        componentGroups[compName] = 'components';
        console.error(
          `[AGENT] Compile-only mode: using existing source for ${compName}`
        );
      }
    } else {
      const config = getAuthorConfig();
      const model = getAuthorModel(config);

    const existingSources: Record<string, string> = {};
    if (req.componentName && req.existingSource) {
      existingSources[req.componentName] = req.existingSource;
    }
    if (req.components) {
      for (const item of req.components) {
        const cName = item.componentName || item.name;
        if (cName && item.existingSource) {
          existingSources[cName] = item.existingSource;
        }
      }
    }

    const rawSpecs: Record<string, any> = {};
    if (req.componentName && req.componentSpec) {
      rawSpecs[req.componentName] = req.componentSpec;
    }
    if (req.components) {
      for (const item of req.components) {
        const cName = item.componentName || item.name;
        const spec =
          item.componentSpec ||
          ((item as any).node || (item as any).properties ? item : undefined);
        if (cName && spec) {
          rawSpecs[cName] = spec;
        }
      }
    }

    const abortController = new AbortController();
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
      tokenClasses: req.tokenClasses,
      rawTokens: req.tokens,
    });

    const userPrompt = buildAuthorUserPrompt(req);

    const requestedComponentNames: string[] = [];
    if (req.componentName) {
      requestedComponentNames.push(req.componentName);
    }
    if (req.components) {
      for (const item of req.components) {
        const name = item.componentName || item.name;
        if (name && !requestedComponentNames.includes(name)) {
          requestedComponentNames.push(name);
        }
      }
    }

    const componentCount =
      req.components && req.components.length > 0
        ? req.components.length
        : req.componentName
          ? 1
          : 1;
    const maxSteps = Math.max(30, componentCount * 6);

    console.error('[AGENT] Starting Mitosis component authoring session...');
    console.error(`[AGENT] Model: ${config.model} (${config.baseUrl})`);
    console.error(
      `[AGENT] Requested components (${requestedComponentNames.length}): ${
        requestedComponentNames.join(', ') || 'None specified'
      }`
    );
    console.error(`[AGENT] Target frameworks: ${targets.join(', ')}`);
    console.error(`[AGENT] Max allowed tool steps: ${maxSteps}`);

    let stepIndex = 0;
    try {
      await generateText({
        model,
        system: SYSTEM_PROMPT,
        prompt: userPrompt,
        tools,
        maxSteps,
        abortSignal: abortController.signal,
        onStepFinish: (step) => {
          stepIndex++;
          console.error(
            `[AGENT] Step ${stepIndex} (${step.stepType}) finished. Reason: ${step.finishReason}`
          );

          if (step.reasoning && step.reasoning.trim()) {
            const r = step.reasoning.trim();
            const preview = r.length > 300 ? r.slice(0, 300) + '...' : r;
            console.error(`[AGENT:THOUGHT] ${preview}`);
          } else if (step.text && step.text.trim()) {
            const t = step.text.trim();
            const preview = t.length > 300 ? t.slice(0, 300) + '...' : t;
            console.error(`[AGENT:THOUGHT] ${preview}`);
          }

          if (step.toolCalls && step.toolCalls.length > 0) {
            for (const call of step.toolCalls) {
              const argsStr = JSON.stringify((call as any).args ?? {});
              const argsPreview =
                argsStr.length > 200 ? argsStr.slice(0, 200) + '...' : argsStr;
              console.error(
                `[AGENT:TOOL-CALL] ${(call as any).toolName}(${argsPreview})`
              );
            }
          }

          if (finished.value) {
            abortController.abort();
          }
        },
      });
    } catch (genErr: any) {
      if (finished.value || genErr?.name === 'AbortError' || genErr?.message?.includes('aborted')) {
        console.error('[AGENT] Authoring loop concluded cleanly via finishAuthoring.');
      } else {
        throw genErr;
      }
    }
    }

    // Fallback: If no components were explicitly saved via saveComponent,
    // recover from last successful testCompile
    if (Object.keys(components).length === 0) {
      for (const [name, source] of Object.entries(lastCompiledSource)) {
        components[name] = source;
        componentGroups[name] = 'components';
      }
    }

    if (Object.keys(components).length === 0) {
      const errorMsg = 'No components were authored or saved during the session.';
      console.error(`[AGENT] Authoring failed: ${errorMsg}`);
      return {
        success: false,
        components: {},
        componentGroups: {},
        artifacts: [],
        newTokens,
        error: errorMsg,
      };
    }

    const artifacts: CompiledArtifact[] = [];
    const compileErrors: string[] = [];

    for (const [name, source] of Object.entries(components)) {
      const compileRes = await compileMitosis({
        componentName: name,
        source,
        targets,
        allowedClasses: req.tokenClasses,
        siblingSources: components,
        checks: { lint: true, render: true },
      });

      if (compileRes.success) {
        artifacts.push(...compileRes.artifacts);
      } else {
        const messages = compileRes.errors.map(
          (e) => `[${name}][${e.target || 'compiler'}] ${e.message}`
        );
        compileErrors.push(...messages);
      }
    }

    if (compileErrors.length > 0 && artifacts.length === 0) {
      const errorMsg = `Compilation failed for authored components: ${compileErrors.join('; ')}`;
      console.error(`[AGENT] Authoring failed: ${errorMsg}`);
      return {
        success: false,
        components,
        componentGroups,
        artifacts: [],
        newTokens,
        error: errorMsg,
      };
    }

    for (const target of targets) {
      const indexArtifact = generateNamespaceIndex(
        Object.keys(components),
        target
      );
      if (indexArtifact) {
        artifacts.push(indexArtifact);
      }
    }

    console.error(
      `[AGENT] Authoring session completed: ${
        Object.keys(components).length
      } component(s) authored, ${artifacts.length} artifact(s) generated, ${
        newTokens.length
      } new token(s) registered.`
    );

    return {
      success: true,
      components,
      componentGroups,
      artifacts,
      newTokens,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[AGENT] Authoring error: ${message}`);
    return {
      success: false,
      components,
      componentGroups,
      artifacts: [],
      newTokens,
      error: message,
    };
  }
}
