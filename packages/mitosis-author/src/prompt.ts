import {
  compactComponentSpec,
  compactTokens,
  formatTokenClassesCatalog,
  type CompactComponentSpec,
  type CompactPropertyDef,
  type CompactToken,
} from './manifest.js';
import { SYSTEM_PROMPT, buildAuthorSystemPrompt } from './system-prompt.js';

export {
  SYSTEM_PROMPT,
  buildAuthorSystemPrompt,
  compactComponentSpec,
  compactTokens,
  formatTokenClassesCatalog,
  type CompactComponentSpec,
  type CompactPropertyDef,
  type CompactToken,
};

export interface PromptAuthorRequest {
  componentName?: string;
  componentSpec?: any;
  tokens?: any;
  tokenClasses?: string[];
  repairErrors?: string[];
  existingSource?: string;
  feedbackNotes?: string;
  existingComponentNames?: string[];
  components?: Array<{
    componentName?: string;
    name?: string;
    componentSpec?: any;
    existingSource?: string;
    repairErrors?: string[];
  }>;
}

function appendBatchComponentPrompts(parts: string[], items: NonNullable<PromptAuthorRequest['components']>) {
  parts.push(`Please author the following ${items.length} Mitosis component(s) in this session:\n`);
  for (const [index, item] of items.entries()) {
    const compName = item.componentName || item.name || `Component${index + 1}`;
    parts.push(`### Component ${index + 1}: ${compName}`);
    const rawSpec =
      item.componentSpec || ((item as any).node || (item as any).properties ? item : undefined);
    if (rawSpec) {
      const compact = compactComponentSpec(rawSpec);
      parts.push(`Specification (compact manifest):\n${JSON.stringify(compact, null, 2)}`);
      parts.push(
        `(Call readComponentDetails({ componentName: "${compName}" }) to inspect full Auto Layout, variant geometry, and visual styles on demand)`
      );
    }
    if (item.existingSource) {
      parts.push(`Existing Source:\n${item.existingSource}`);
    }
    if (item.repairErrors && item.repairErrors.length > 0) {
      parts.push(
        `Previous Compiler / Authoring Errors to Repair:\n${item.repairErrors.map((e) => `- ${e}`).join('\n')}`
      );
    }
    parts.push('');
  }
}

export function buildAuthorUserPrompt(req: PromptAuthorRequest): string {
  const parts: string[] = [];
  const isBatch = Array.isArray(req.components) && req.components.length > 0;

  if (isBatch) {
    appendBatchComponentPrompts(parts, req.components!);
  } else if (req.componentName) {
    parts.push(`Please author the Mitosis component: ${req.componentName}\n`);
    if (req.componentSpec) {
      const compact = compactComponentSpec(req.componentSpec);
      parts.push(`Component Specification (compact manifest):\n${JSON.stringify(compact, null, 2)}`);
      parts.push(
        `(Call readComponentDetails({ componentName: "${req.componentName}" }) to inspect full Auto Layout, variant geometry, and visual styles on demand)`
      );
    }
    if (req.existingSource) {
      parts.push(`Existing Source:\n${req.existingSource}`);
    }
    if (req.feedbackNotes) {
      parts.push(`User Feedback / Review Notes for Regeneration:\n${req.feedbackNotes}`);
    }
    if (req.repairErrors && req.repairErrors.length > 0) {
      parts.push(
        `Previous Compiler / Authoring Errors to Repair:\n${req.repairErrors.map((e) => `- ${e}`).join('\n')}`
      );
    }
    parts.push('');
  } else {
    parts.push('Please author the requested Mitosis component(s).\n');
  }

  if (req.existingComponentNames && req.existingComponentNames.length > 0) {
    parts.push(
      `Existing Components in Workspace (use readExistingComponent to inspect):\n${req.existingComponentNames.map((n) => `- ${n}`).join('\n')}\n`
    );
  }
  if (req.tokens) {
    const compact = compactTokens(req.tokens);
    parts.push(`Available Design Tokens Context:\n${JSON.stringify(compact, null, 2)}\n`);
  }
  if (req.tokenClasses && req.tokenClasses.length > 0) {
    parts.push(formatTokenClassesCatalog(req.tokenClasses) + '\n');
  }

  parts.push(
    `Engineering Workflow (Base-First AI Editing):
1. Inspect the Base Component Source (from templates/ds-repo/src) provided above (or via readExistingComponent).
2. Call readComponentDetails({ componentName }) to inspect the latest Figma Auto Layout, pre-compiled Tailwind blueprint, visible child hierarchy, and text defaults.
3. Compare the Base Component Source against the Figma specification: preserve the base headless helpers (./utils), ARIA attributes, and callbacks, and EDIT the JSX structure, child elements (e.g. header close button, icons, slots), Tailwind token classes, dimensions/spacing/radius/shadows, and default prop values to match the latest Figma design.
4. Prefer calling editComponent({ componentName, edits: [{ oldText, newText }], group }) to apply targeted edits (which auto-compiles across all 6 targets and saves when valid), or testCompile + saveComponent for full rewrites.
5. Call finishAuthoring when all requested components are saved.`
  );

  return parts.join('\n');
}
