import * as fs from 'node:fs';
import * as path from 'node:path';
import { tool } from 'ai';
import { z } from 'zod';
import { compileMitosis } from '@supernova/mitosis-compiler';

export interface DiscoveredToken {
  name: string;
  type: string;
  value: any;
  description?: string;
}

export type ComponentGroup = 'components' | 'icons';

export interface AuthorToolContext {
  workspaceDir?: string;
  existingSources?: Record<string, string>;
  rawSpecs?: Record<string, any>;
  components: Record<string, string>;
  componentGroups: Record<string, ComponentGroup>;
  newTokens: DiscoveredToken[];
  finished: { value: boolean; summary?: string };
  lastCompiledSource?: Record<string, string>;
  tokenClasses?: string[];
  rawTokens?: any;
}

const IGNORED_SEARCH_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.turbo',
  '.next',
  '.cache',
]);

async function findFileRecursive(dir: string, targetFileName: string): Promise<string | null> {
  let entries: fs.Dirent[];
  try {
    entries = await fs.promises.readdir(dir, { withFileTypes: true });
  } catch {
    return null;
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORED_SEARCH_DIRS.has(entry.name)) {
        const found = await findFileRecursive(path.join(dir, entry.name), targetFileName);
        if (found) {
          return found;
        }
      }
    } else if (entry.isFile() && entry.name === targetFileName) {
      return path.join(dir, entry.name);
    }
  }

  return null;
}

function extractLayoutAndVisual(node: any): { layout: Record<string, any>; visual: Record<string, any> } | null {
  if (!node || typeof node !== 'object') return null;

  const layout: Record<string, any> = {};
  if (node.layoutMode && node.layoutMode !== 'NONE') {
    layout.layoutMode = node.layoutMode;
  }
  if (node.primaryAxisAlignItems) layout.primaryAxisAlignItems = node.primaryAxisAlignItems;
  if (node.counterAxisAlignItems) layout.counterAxisAlignItems = node.counterAxisAlignItems;
  if (node.itemSpacing !== undefined && node.itemSpacing !== 0) layout.itemSpacing = node.itemSpacing;

  const hasPadding =
    (node.paddingLeft !== undefined && node.paddingLeft !== 0) ||
    (node.paddingRight !== undefined && node.paddingRight !== 0) ||
    (node.paddingTop !== undefined && node.paddingTop !== 0) ||
    (node.paddingBottom !== undefined && node.paddingBottom !== 0);
  if (hasPadding) {
    layout.padding = {
      left: node.paddingLeft ?? 0,
      right: node.paddingRight ?? 0,
      top: node.paddingTop ?? 0,
      bottom: node.paddingBottom ?? 0,
    };
  }
  if (node.layoutSizingHorizontal) layout.layoutSizingHorizontal = node.layoutSizingHorizontal;
  if (node.layoutSizingVertical) layout.layoutSizingVertical = node.layoutSizingVertical;

  const visual: Record<string, any> = {};
  if (node.cornerRadius !== undefined && node.cornerRadius !== 0) {
    visual.cornerRadius = node.cornerRadius;
  }
  if (Array.isArray(node.rectangleCornerRadii)) {
    visual.rectangleCornerRadii = node.rectangleCornerRadii;
  }
  if (node.strokeWeight !== undefined && node.strokeWeight !== 0) {
    visual.strokeWeight = node.strokeWeight;
  }
  if (Array.isArray(node.fills) && node.fills.length > 0) {
    const visibleFills = node.fills.filter((f: any) => f && f.visible !== false);
    if (visibleFills.length > 0) {
      visual.fills = visibleFills.map((f: any) => ({
        type: f.type,
        color: f.color,
        opacity: f.opacity,
      }));
    }
  }
  if (Array.isArray(node.strokes) && node.strokes.length > 0) {
    const visibleStrokes = node.strokes.filter((s: any) => s && s.visible !== false);
    if (visibleStrokes.length > 0) {
      visual.strokes = visibleStrokes.map((s: any) => ({
        type: s.type,
        color: s.color,
        opacity: s.opacity,
      }));
    }
  }
  if (Array.isArray(node.effects) && node.effects.length > 0) {
    const visibleEffects = node.effects.filter((e: any) => e && e.visible !== false);
    if (visibleEffects.length > 0) {
      visual.effects = visibleEffects.map((e: any) => ({
        type: e.type,
        radius: e.radius,
        color: e.color,
        offset: e.offset,
      }));
    }
  }

  return { layout, visual };
}

function summarizeChildren(children: any[], maxDepth = 2, currentDepth = 0): any[] {
  if (!Array.isArray(children) || currentDepth >= maxDepth) return [];
  return children.map((c: any) => {
    const summary: Record<string, any> = {
      name: c.name,
      type: c.type,
    };
    if (c.characters) summary.textContent = c.characters;
    if (c.componentPropertyReferences) {
      summary.propertyReferences = c.componentPropertyReferences;
    }
    const lv = extractLayoutAndVisual(c);
    if (lv) {
      if (Object.keys(lv.layout).length > 0) summary.layout = lv.layout;
      if (Object.keys(lv.visual).length > 0) summary.visual = lv.visual;
    }
    if (Array.isArray(c.children) && c.children.length > 0) {
      summary.children = summarizeChildren(c.children, maxDepth, currentDepth + 1);
    }
    return summary;
  });
}

export function createAuthorTools(context: AuthorToolContext) {
  return {
    readExistingComponent: tool({
      description:
        'Read an existing Mitosis component (.lite.tsx) from the workspace JIT for inspection or refactoring',
      parameters: z.object({
        componentName: z.string().describe('The name of the component to read, e.g. Button'),
      }),
      execute: async ({ componentName }) => {
        console.error(`[AGENT:TOOL] readExistingComponent: querying "${componentName}"...`);
        if (context.existingSources && context.existingSources[componentName]) {
          console.error(`[AGENT:TOOL] readExistingComponent: found "${componentName}" (in-memory)`);
          return {
            found: true,
            componentName,
            source: context.existingSources[componentName],
          };
        }

        const workspaceDir = context.workspaceDir || process.cwd();
        const targetFileName = `${componentName}.lite.tsx`;

        const directPath = path.resolve(workspaceDir, 'src', 'components', targetFileName);
        try {
          if (fs.existsSync(directPath)) {
            const source = await fs.promises.readFile(directPath, 'utf8');
            console.error(`[AGENT:TOOL] readExistingComponent: found "${componentName}" at ${directPath}`);
            return {
              found: true,
              componentName,
              filePath: directPath,
              source,
            };
          }
        } catch {
          // Fall through to recursive search
        }

        try {
          const foundPath = await findFileRecursive(workspaceDir, targetFileName);
          if (foundPath) {
            const source = await fs.promises.readFile(foundPath, 'utf8');
            console.error(`[AGENT:TOOL] readExistingComponent: found "${componentName}" at ${foundPath}`);
            return {
              found: true,
              componentName,
              filePath: foundPath,
              source,
            };
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          console.error(`[AGENT:TOOL] readExistingComponent: error searching for "${componentName}": ${message}`);
          return {
            found: false,
            componentName,
            error: `Error searching for component file: ${message}`,
          };
        }

        console.error(`[AGENT:TOOL] readExistingComponent: "${componentName}" not found in workspace (${workspaceDir})`);
        return {
          found: false,
          componentName,
          error: `Component file ${targetFileName} not found in workspace (${workspaceDir})`,
        };
      },
    }),

    readComponentDetails: tool({
      description:
        'Read complete Figma Auto Layout parameters, visual styles (fills, strokes, corner radius), variant matrix, and child slot hierarchy for a component in a single consolidated call',
      parameters: z.object({
        componentName: z
          .string()
          .describe('Name of the component, e.g. ButtonPrimary'),
      }),
      execute: async ({ componentName }) => {
        console.error(
          `[AGENT:TOOL] readComponentDetails: querying "${componentName}"...`
        );

        if (!context.rawSpecs) {
          console.error(
            `[AGENT:TOOL] readComponentDetails: no rawSpecs present in context`
          );
          return {
            found: false,
            componentName,
            error: `No raw specifications available in context.`,
          };
        }

        const spec =
          context.rawSpecs[componentName] ||
          Object.entries(context.rawSpecs).find(
            ([k]) => k.toLowerCase() === componentName.toLowerCase()
          )?.[1];

        if (!spec) {
          const available = Object.keys(context.rawSpecs).join(', ') || 'none';
          console.error(
            `[AGENT:TOOL] readComponentDetails: "${componentName}" not found. Available: ${available}`
          );
          return {
            found: false,
            componentName,
            error: `Component specification for "${componentName}" not found. Available specifications: ${available}`,
          };
        }

        const rootNode = spec.node || spec.document || spec;
        const rawProps =
          spec.properties ||
          spec.componentPropertyDefinitions ||
          rootNode.componentPropertyDefinitions ||
          {};

        // Detect variants
        const isComponentSet =
          rootNode.type === 'COMPONENT_SET' ||
          (Array.isArray(rootNode.children) &&
            rootNode.children.some((c: any) => c.type === 'COMPONENT'));
        const variantNodes: any[] = isComponentSet && Array.isArray(rootNode.children)
          ? rootNode.children
          : [];

        // Base layout and visual from default variant or root
        const defaultTarget = variantNodes.length > 0 ? variantNodes[0] : rootNode;
        const lv = extractLayoutAndVisual(defaultTarget);
        const childSlots = summarizeChildren(defaultTarget.children || []);

        // Build a compact, informative variant matrix sample (up to 6 distinct variants)
        const variantMatrix: Array<{
          name: string;
          layout?: Record<string, any>;
          visual?: Record<string, any>;
        }> = [];

        const seenStyles = new Set<string>();
        for (const v of variantNodes) {
          const vName = v.name || '';
          // Extract key differentiator from variant name (e.g. Style=solid, State=default)
          const keyParts = vName.split(',').map((p: string) => p.trim());
          const styleKey = keyParts.slice(0, 2).join(', ');
          if (!seenStyles.has(styleKey) && variantMatrix.length < 8) {
            seenStyles.add(styleKey);
            const vLv = extractLayoutAndVisual(v);
            variantMatrix.push({
              name: vName,
              layout: vLv?.layout,
              visual: vLv?.visual,
            });
          }
        }

        console.error(
          `[AGENT:TOOL] readComponentDetails: returned complete layout & variant matrix for "${componentName}" (${variantNodes.length} variants available, ${variantMatrix.length} samples summarized)`
        );

        return {
          found: true,
          componentName,
          description: spec.description,
          properties: rawProps,
          totalVariants: variantNodes.length,
          layout: lv?.layout || {},
          visual: lv?.visual || {},
          childSlots,
          variantMatrix,
        };
      },
    }),

    readComponentTokens: tool({
      description:
        'Read component-specific design tokens from the Figma document for a given component name (e.g. Button)',
      parameters: z.object({
        componentName: z
          .string()
          .describe('Name of the component, e.g. Button'),
      }),
      execute: async ({ componentName }) => {
        console.error(
          `[AGENT:TOOL] readComponentTokens: querying tokens for "${componentName}"...`
        );

        if (!context.rawTokens) {
          console.error(
            `[AGENT:TOOL] readComponentTokens: no rawTokens present in context`
          );
          return {
            found: false,
            componentName,
            tokens: [],
            error: `No raw tokens available in context.`,
          };
        }

        const tokensList: any[] = [];
        if (Array.isArray(context.rawTokens)) {
          tokensList.push(...context.rawTokens);
        } else if (
          typeof context.rawTokens === 'object' &&
          context.rawTokens !== null
        ) {
          for (const [key, val] of Object.entries(context.rawTokens)) {
            if (val && typeof val === 'object') {
              tokensList.push({
                name: (val as any).name || key,
                ...(val as any),
              });
            } else {
              tokensList.push({ name: key, value: val });
            }
          }
        }

        const lowerComp = componentName.toLowerCase();
        const kebabComp = componentName
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .toLowerCase();

        const matchedTokens = tokensList.filter((t) => {
          const tName = String(t?.name || t?.id || '').toLowerCase();
          return (
            tName.includes(`components/${lowerComp}`) ||
            tName.includes(`components/${kebabComp}`) ||
            tName.includes(`/${lowerComp}/`) ||
            tName.includes(`/${kebabComp}/`) ||
            tName.includes(lowerComp) ||
            tName.includes(kebabComp)
          );
        });

        console.error(
          `[AGENT:TOOL] readComponentTokens: found ${matchedTokens.length} tokens matching "${componentName}"`
        );

        return {
          found: matchedTokens.length > 0,
          componentName,
          tokens: matchedTokens,
          totalTokens: matchedTokens.length,
        };
      },
    }),

    testCompile: tool({
      description:
        'Test compile Mitosis JSX source code in-memory to verify compatibility and catch syntax/type errors',
      parameters: z.object({
        componentName: z.string().describe('Name of the component, e.g. Button'),
        source: z.string().describe('The Mitosis .lite.tsx JSX code to compile and validate'),
      }),
      execute: async ({ componentName, source }) => {
        console.error(`[AGENT:TOOL] testCompile: compiling "${componentName}" (${source.length} chars)...`);
        try {
          const res = await compileMitosis({
            componentName,
            source,
            targets: ['mitosis', 'react', 'svelte', 'vue3', 'vue2', 'angular'],
            allowedClasses: context.tokenClasses,
            siblingSources: context.components,
            checks: { lint: true, render: true },
          });

          if (res.success) {
            if (context.lastCompiledSource) {
              context.lastCompiledSource[componentName] = source;
            }
            console.error(
              `[AGENT:TOOL] testCompile: "${componentName}" compiled successfully across 6 targets (mitosis, react, svelte, vue3, vue2, angular)`
            );
            return {
              success: true,
              errors: [],
            };
          }

          console.error(
            `[AGENT:TOOL] testCompile: "${componentName}" compilation failed with ${res.errors.length} error(s):`
          );
          for (const err of res.errors) {
            console.error(`[AGENT:TOOL]   - [${err.target || 'compiler'}] ${err.message}`);
          }

          return {
            success: false,
            errors: res.errors,
          };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          console.error(`[AGENT:TOOL] testCompile: "${componentName}" compiler exception: ${message}`);
          return {
            success: false,
            errors: [{ target: 'compiler', message }],
          };
        }
      },
    }),

    registerNewToken: tool({
      description:
        'Register a newly discovered design token that is needed for styling the component',
      parameters: z.object({
        name: z.string().describe('The name of the token, e.g. color/button-destructive-hover'),
        type: z.string().describe('The type of the token, e.g. color, spacing, borderRadius'),
        value: z.any().describe('The value of the token, e.g. "#e11d48" or "8px"'),
        description: z.string().optional().describe('Optional description of the token'),
      }),
      execute: async ({ name, type, value, description }) => {
        console.error(
          `[AGENT:TOOL] registerNewToken: "${name}" (${type}) = ${JSON.stringify(value)}${
            description ? ` (${description})` : ''
          }`
        );
        const token: DiscoveredToken = { name, type, value, description };
        context.newTokens.push(token);
        return {
          success: true,
          token,
          message: `Token "${name}" registered successfully.`,
        };
      },
    }),

    saveComponent: tool({
      description: 'Save the authored Mitosis component source code',
      parameters: z.object({
        componentName: z.string().describe('The name of the component, e.g. Button'),
        source: z.string().describe('Complete, valid Mitosis .lite.tsx JSX source code'),
        group: z
          .enum(['components', 'icons'])
          .describe('Semantic group: "components" or "icons"'),
      }),
      execute: async ({ componentName, source, group }) => {
        console.error(
          `[AGENT:TOOL] saveComponent: saving "${componentName}" (group: "${group}", ${source.length} chars)...`
        );
        context.components[componentName] = source;
        context.componentGroups[componentName] = group;
        console.error(
          `[AGENT:TOOL] saveComponent: "${componentName}" saved successfully in group "${group}"`
        );
        return {
          success: true,
          componentName,
          group,
          message: `Component "${componentName}" saved successfully in group "${group}".`,
        };
      },
    }),

    finishAuthoring: tool({
      description: 'Signal that authoring of the requested component(s) is complete',
      parameters: z.object({
        summary: z
          .string()
          .optional()
          .describe('Summary of the authoring work done'),
      }),
      execute: async ({ summary }) => {
        console.error(
          `[AGENT:TOOL] finishAuthoring: ${summary || 'Work marked as completed.'}`
        );
        context.finished.value = true;
        context.finished.summary = summary;
        return {
          success: true,
          summary: summary || 'Authoring completed.',
        };
      },
    }),
  };
}
