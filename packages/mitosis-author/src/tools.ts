import * as fs from 'node:fs';
import * as path from 'node:path';
import { tool } from 'ai';
import { z } from 'zod';
import {
  compileMitosis,
  normalizeMitosisSource,
  COMPONENT_NAME_PATTERN,
} from '@supernova/mitosis-compiler';
import {
  executeReadComponentDetails,
  findFileRecursive,
  queryComponentTokens,
} from './tools-inspect.js';
import { loadAllBaselineSiblings } from './baseline.js';

export interface DiscoveredToken {
  name: string;
  type: string;
  value: any;
  description?: string;
}

export const COMPONENT_GROUPS = ['components', 'icons', 'examples'] as const;
export type ComponentGroup = (typeof COMPONENT_GROUPS)[number];

export function parseComponentGroup(raw: unknown): ComponentGroup {
  return COMPONENT_GROUPS.find((g) => g === raw) ?? 'components';
}

export interface AuthorToolContext {
  workspaceDir?: string;
  existingSources?: Record<string, string>;
  rawSpecs?: Record<string, any>;
  components: Record<string, string>;
  componentGroups: Record<string, ComponentGroup>;
  curatedDescriptions?: Record<string, string>;
  newTokens: DiscoveredToken[];
  finished: { value: boolean; summary?: string };
  abortController?: AbortController;
  lastCompiledSource?: Record<string, string>;
  lastAttemptedSource?: Record<string, string>;
  lastCompileErrors?: Record<string, string[]>;
  tokenClasses?: string[];
  rawTokens?: any;
}

async function readComponentFromWorkspace(componentName: string, context: AuthorToolContext) {
  if (context.existingSources?.[componentName]) {
    return { found: true, componentName, source: context.existingSources[componentName] };
  }
  const workspaceDir = context.workspaceDir || process.cwd();
  const targetFileName = `${componentName}.lite.tsx`;
  const directPath = path.resolve(workspaceDir, 'src', 'components', targetFileName);
  try {
    if (fs.existsSync(directPath)) {
      return { found: true, componentName, filePath: directPath, source: await fs.promises.readFile(directPath, 'utf8') };
    }
    const foundPath = await findFileRecursive(workspaceDir, targetFileName);
    if (foundPath) {
      return { found: true, componentName, filePath: foundPath, source: await fs.promises.readFile(foundPath, 'utf8') };
    }
  } catch (err: unknown) {
    return { found: false, componentName, error: `Error searching for component file: ${err instanceof Error ? err.message : String(err)}` };
  }
  return { found: false, componentName, error: `Component file ${targetFileName} not found in workspace (${workspaceDir})` };
}

async function executeTestCompile(componentName: string, source: string, context: AuthorToolContext) {
  const normalized = normalizeMitosisSource(source, componentName);
  if (context.lastAttemptedSource) context.lastAttemptedSource[componentName] = normalized;
  try {
    const res = await compileMitosis({
      componentName,
      source: normalized,
      targets: ['mitosis', 'react', 'svelte', 'vue3', 'vue2', 'angular'],
      allowedClasses: context.tokenClasses,
      siblingSources: loadAllBaselineSiblings(context.components),
      checks: { lint: true, render: true },
    });
    if (res.success) {
      if (context.lastCompiledSource) context.lastCompiledSource[componentName] = normalized;
      return { success: true, normalized, errors: [] };
    }
    if (context.lastCompileErrors) {
      context.lastCompileErrors[componentName] = res.errors.map((e) => `[${e.target || 'compiler'}] ${e.message}`);
    }
    return { success: false, normalized, errors: res.errors };
  } catch (err: unknown) {
    return { success: false, normalized, errors: [{ target: 'compiler', message: err instanceof Error ? err.message : String(err) }] };
  }
}

async function executeEditComponent(
  componentName: string,
  edits: Array<{ oldText: string; newText: string }>,
  group: ComponentGroup,
  context: AuthorToolContext
) {
  const existing =
    context.components[componentName] ||
    context.lastAttemptedSource?.[componentName] ||
    (await readComponentFromWorkspace(componentName, context)).source;
  if (!existing) {
    return { success: false, componentName, error: `Base component "${componentName}" not found to edit. Use saveComponent instead.` };
  }
  let updated = existing;
  for (const { oldText, newText } of edits) {
    if (!updated.includes(oldText)) {
      return { success: false, componentName, error: `oldText not found in ${componentName}: ${JSON.stringify(oldText.slice(0, 80))}` };
    }
    updated = updated.replace(oldText, () => newText);
  }
  const compiled = await executeTestCompile(componentName, updated, context);
  if (compiled.success) {
    context.components[componentName] = compiled.normalized;
    context.componentGroups[componentName] = group;
    return { success: true, componentName, group, source: compiled.normalized, errors: [] };
  }
  return { success: false, componentName, source: compiled.normalized, errors: compiled.errors };
}

export function createAuthorTools(context: AuthorToolContext) {
  const nameSchema = z.string().regex(COMPONENT_NAME_PATTERN, 'PascalCase identifier, letters and digits only');
  return {
    readExistingComponent: tool({
      description: 'Read an existing Mitosis component (.lite.tsx) from the workspace JIT for inspection or refactoring',
      parameters: z.object({ componentName: nameSchema.describe('The name of the component to read, e.g. Button') }),
      execute: async ({ componentName }) => readComponentFromWorkspace(componentName, context),
    }),
    readComponentDetails: tool({
      description: 'Read complete Figma Auto Layout parameters, visual styles, variant matrix, pre-compiled Tailwind blueprint, and child hierarchy for a component in a single consolidated call',
      parameters: z.object({ componentName: z.string().describe('Name of the component, e.g. ButtonPrimary') }),
      execute: async ({ componentName }) => executeReadComponentDetails(componentName, context.rawSpecs, context.rawTokens),
    }),
    readComponentTokens: tool({
      description: 'Read component-specific design tokens from the Figma document for a given component name',
      parameters: z.object({ componentName: z.string().describe('Name of the component, e.g. Button') }),
      execute: async ({ componentName }) => queryComponentTokens(componentName, context.rawTokens),
    }),
    testCompile: tool({
      description: 'Test compile Mitosis JSX source code in-memory to verify compatibility and catch syntax/type errors',
      parameters: z.object({
        componentName: z.string().describe('Name of the component, e.g. Button'),
        source: z.string().describe('The Mitosis .lite.tsx JSX code to compile and validate'),
      }),
      execute: async ({ componentName, source }) => {
        const res = await executeTestCompile(componentName, source, context);
        return { success: res.success, errors: res.errors };
      },
    }),
    registerNewToken: tool({
      description: 'Register a newly discovered design token needed for styling the component',
      parameters: z.object({
        name: z.string().describe('The name of the token, e.g. color/button-destructive-hover'),
        type: z.string().describe('The type of the token, e.g. color, spacing, borderRadius'),
        value: z.any().describe('The value of the token, e.g. "#e11d48" or "8px"'),
        description: z.string().optional().describe('Optional description of the token'),
      }),
      execute: async ({ name, type, value, description }) => {
        const token: DiscoveredToken = { name, type, value, description };
        context.newTokens.push(token);
        return { success: true, token, message: `Token "${name}" registered successfully.` };
      },
    }),
    editComponent: tool({
      description: 'Apply targeted search-and-replace edits to the base Mitosis component (.lite.tsx) from templates/ds-repo/src to align it with the latest Figma specification, auto-compile across all 6 targets, and save if valid',
      parameters: z.object({
        componentName: nameSchema.describe('The name of the component, e.g. AlertDialog'),
        edits: z
          .array(z.object({
            oldText: z.string().describe('Exact substring in the current component source to replace'),
            newText: z.string().describe('Replacement substring matching the latest Figma specification'),
          }))
          .min(1)
          .describe('Ordered list of targeted replacements to apply to the existing component source'),
        group: z.enum(COMPONENT_GROUPS).default('components').describe('Semantic group: "components", "icons" or "examples"'),
        curatedDescription: z.string().optional().describe('Optional curated developer-facing markdown description (summary, When to Use, and Usage Guidelines) cleaned of Figma layer-toggle noise'),
      }),
      execute: async ({ componentName, edits, group, curatedDescription }) => {
        const res = await executeEditComponent(componentName, edits, group, context);
        if (res.success && curatedDescription && context.curatedDescriptions) {
          context.curatedDescriptions[componentName] = curatedDescription;
        }
        return res;
      },
    }),
    saveComponent: tool({
      description: 'Save the authored Mitosis component source code',
      parameters: z.object({
        componentName: nameSchema.describe('The name of the component, e.g. Button'),
        source: z.string().describe('Complete, valid Mitosis .lite.tsx JSX source code'),
        group: z.enum(COMPONENT_GROUPS).describe('Semantic group: "components", "icons" or "examples"'),
        curatedDescription: z.string().optional().describe('Optional curated developer-facing markdown description (summary, When to Use, and Usage Guidelines) cleaned of Figma layer-toggle noise'),
      }),
      execute: async ({ componentName, source, group, curatedDescription }) => {
        const normalized = normalizeMitosisSource(source, componentName);
        context.components[componentName] = normalized;
        context.componentGroups[componentName] = group;
        if (curatedDescription && context.curatedDescriptions) {
          context.curatedDescriptions[componentName] = curatedDescription;
        }
        return { success: true, componentName, group, message: `Component "${componentName}" saved successfully in group "${group}".` };
      },
    }),
    finishAuthoring: tool({
      description: 'Signal that authoring of the requested component(s) is complete',
      parameters: z.object({ summary: z.string().optional().describe('Summary of the authoring work done') }),
      execute: async ({ summary }) => {
        context.finished.value = true;
        context.finished.summary = summary;
        if (context.abortController) context.abortController.abort();
        return { success: true, summary: summary || 'Authoring completed.' };
      },
    }),
  };
}
