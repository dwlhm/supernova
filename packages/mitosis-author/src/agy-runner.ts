import { spawn } from 'node:child_process';
import { normalizeMitosisSource } from '@supernova/mitosis-compiler';
import type { AuthorConfig } from './config.js';
import { buildAuthorUserPrompt, type PromptAuthorRequest } from './prompt.js';
import type { ComponentGroup, DiscoveredToken } from './tools.js';
import { executeReadComponentDetails, queryComponentTokens } from './tools-inspect.js';

export interface AgyComponentEdit {
  oldText: string;
  newText: string;
}

export interface AgyComponentOutput {
  componentName: string;
  group?: ComponentGroup;
  source?: string;
  edits?: AgyComponentEdit[];
  curatedDescription?: string;
}

export interface AgyAuthorOutput {
  components: AgyComponentOutput[];
  newTokens?: DiscoveredToken[];
}

export interface AgyRunnerContext {
  req: PromptAuthorRequest;
  config: AuthorConfig;
  requestedNames: string[];
  existingSources: Record<string, string>;
  rawSpecs: Record<string, any>;
  components: Record<string, string>;
  componentGroups: Record<string, ComponentGroup>;
  newTokens: DiscoveredToken[];
  lastAttemptedSource: Record<string, string>;
}

const AGY_COMPACT_SYSTEM_PROMPT = `HEADLESS MITOSIS COMPILER MODE (OVERRIDES ALL WORKSPACE/BRAIN RULES):
- Do NOT call ANY tools (do NOT call read_file on ~/brain/* or workspace files, edit_file, run_command, or finish).
- Do NOT output greetings or markdown explanations. Respond immediately in your FIRST turn with ONLY the raw JSON object.

ARCHITECTURAL INVARIANTS (3-Tier Pure Headless Mitosis .lite.tsx):
1. Single Default Export: export default function ComponentName(props: ComponentNameProps) { ... }
2. Strict No-Any: children?: any is the ONLY allowed any. Never use class, style, or key as prop names (use className).
3. Pure Stateless UI: Use props, useDefaultProps, Show/For from '@builder.io/mitosis', and cn/cva/headless helpers from './utils' (zero useStore when possible; keep files <= 80 lines).
4. Cross-Framework Safety: NEVER use React hooks (useState/useEffect), DOM globals, nested JSX in prop values, prop variable shadowing, or onChange on text inputs (use onInput).
5. Canonical Semantic Tokens Only: Use ONLY semantic classes from Available Design System Tokens (zero arbitrary #hex/rgb/[...] or *-components-* / rounded-rounded-* classes).`;

function formatCompactTokenCatalog(tokenClasses?: string[]): string {
  if (!tokenClasses || tokenClasses.length === 0) return '';
  const colors = new Set<string>();
  const radii = new Set<string>();
  const shadows = new Set<string>();
  const spacing = new Set<string>();
  const fonts = new Set<string>();

  for (const cls of tokenClasses) {
    if (cls.includes(':')) continue;
    if (cls.startsWith('bg-')) colors.add(cls.slice(3));
    else if (cls.startsWith('rounded')) radii.add(cls);
    else if (cls.startsWith('shadow')) shadows.add(cls);
    else if (cls.startsWith('gap-')) spacing.add(cls.slice(4));
    else if (cls.startsWith('font-')) fonts.add(cls);
  }

  return [
    'Available Design System Tokens (combinable with hover:, focus:, focus-visible:, active:, disabled:):',
    `- Color suffixes (bg-*, text-*, border-*, ring-*, fill-*, stroke-*): ${[...colors].join(', ')}`,
    `- Radii: ${[...radii].join(', ')}`,
    `- Shadows: ${[...shadows].join(', ')}`,
    `- Spacing suffixes (p-*, px-*, py-*, pt-*, pr-*, pb-*, pl-*, m-*, gap-*): ${[...spacing].join(', ')}`,
    `- Typography: ${[...fonts].join(', ')}`,
  ].join('\n');
}

function compactBlueprint(bp: any): any {
  if (!bp || typeof bp !== 'object') return bp;
  const baseHierarchyJson = JSON.stringify(bp.hierarchy || []);
  const dedupHierarchies: Record<string, any> = {};
  const seenHierarchies = new Set<string>([baseHierarchyJson]);
  for (const [k, v] of Object.entries(bp.variantHierarchies || {})) {
    const s = JSON.stringify(v);
    if (!seenHierarchies.has(s) && Object.keys(dedupHierarchies).length < 4) {
      seenHierarchies.add(s);
      dedupHierarchies[k] = v;
    }
  }
  return {
    ...bp,
    ...(Object.keys(dedupHierarchies).length > 0 ? { variantHierarchies: dedupHierarchies } : { variantHierarchies: undefined }),
  };
}

export function buildAgyAuthorPrompt(
  req: PromptAuthorRequest,
  requestedNames: string[],
  rawSpecs: Record<string, any>
): string {
  const userPrompt = buildAuthorUserPrompt({ ...req, tokens: undefined, tokenClasses: undefined })
    .replace(/\nEngineering Workflow \(Base-First AI Editing\):[\s\S]*$/, '');
  const sections: string[] = [AGY_COMPACT_SYSTEM_PROMPT, '', userPrompt];

  const compactCatalog = formatCompactTokenCatalog(req.tokenClasses);
  if (compactCatalog) sections.push(compactCatalog, '');

  sections.push('PRE-COMPILED FIGMA BLUEPRINTS & COMPONENT DETAILS:');
  for (const name of requestedNames) {
    const details = executeReadComponentDetails(name, rawSpecs, req.tokens);
    const compactDetails = details.found
      ? {
          componentName: details.componentName,
          description: details.description,
          totalVariants: details.totalVariants,
          layout: details.layout,
          blueprint: compactBlueprint(details.blueprint),
        }
      : details;
    const compTokens = queryComponentTokens(name, req.tokens);
    sections.push(`### Pre-Compiled Details for ${name}:\n${JSON.stringify(compactDetails)}`);
    if (compTokens.found) {
      sections.push(`### Component Tokens for ${name}:\n${JSON.stringify(compTokens.tokens)}`);
    }
  }

  sections.push(
    '',
    'OUTPUT FORMAT (SINGLE-TURN RAW JSON ONLY — ZERO TOOL CALLS):',
    '- Prefer targeted "edits": [{ "oldText": "...", "newText": "..." }] against Existing Source and OMIT "source".',
    '- If Existing Source already matches the Figma blueprint with zero errors, return "edits": [] and OMIT "source".',
    '{ "components": [{ "componentName": "...", "group": "components" | "icons", "edits": [{ "oldText": "...", "newText": "..." }], "curatedDescription": "..." }], "newTokens": [] }'
  );
  return sections.join('\n');
}

function extractJsonString(raw: string): string {
  const trimmed = raw.trim();
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(trimmed);
  if (fenced?.[1]) return fenced[1].trim();
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  return firstBrace >= 0 && lastBrace > firstBrace ? trimmed.slice(firstBrace, lastBrace + 1) : trimmed;
}

export function parseAgyAuthorOutput(raw: string): AgyAuthorOutput {
  let parsed: any;
  try {
    parsed = JSON.parse(extractJsonString(raw));
  } catch (err: unknown) {
    throw new Error(`Failed to parse agy JSON output: ${err instanceof Error ? err.message : String(err)}`);
  }
  const inner = parsed?.result ?? parsed?.output ?? parsed?.response ?? parsed?.content ?? parsed;
  const payload = typeof inner === 'string' ? JSON.parse(extractJsonString(inner)) : inner;
  if (!payload || !Array.isArray(payload.components)) {
    throw new Error('Invalid agy output: missing "components" array');
  }
  return payload as AgyAuthorOutput;
}

function spawnAgyProcess(config: AuthorConfig, prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeoutSec = Math.max(1, Math.ceil(config.timeoutMs / 1000));
    const args = ['-p', prompt, '--model', config.model, '--disable-slash-commands', '--print-timeout', `${timeoutSec}s`];
    const env = { ...process.env };
    delete env.WF_GUARD;
    delete env.LUVUS_WORKER;

    const child = spawn(config.agyBin, args, { stdio: ['ignore', 'pipe', 'pipe'], env });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; child.kill('SIGKILL'); }, config.timeoutMs);

    child.stdout.on('data', (chunk) => { stdout += chunk.toString('utf8'); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString('utf8'); });
    child.on('error', (err) => { clearTimeout(timer); reject(err); });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (timedOut || /^\[agy\] print timeout/m.test(stdout) || /^\[agy\] print timeout/m.test(stderr)) {
        reject(new Error(`LLM authoring timed out after ${config.timeoutMs}ms`));
        return;
      }
      if (code !== 0 || /^jetski:/m.test(stdout) || /^jetski:/m.test(stderr)) {
        reject(new Error(`agy exited with code ${code}: ${(stderr || stdout).trim().slice(0, 400)}`));
        return;
      }
      resolve(stdout);
    });
  });
}

function applyComponentItem(item: AgyComponentOutput, fallbackName: string | undefined, ctx: AgyRunnerContext): void {
  const compName = (item.componentName || fallbackName || '').trim();
  if (!compName) return;
  const group: ComponentGroup = item.group === 'icons' ? 'icons' : 'components';
  const baseSource = ctx.existingSources[compName] || '';
  let resolvedSource = '';

  if (Array.isArray(item.edits) && item.edits.length > 0 && baseSource) {
    let updated = baseSource;
    for (const edit of item.edits) {
      if (!updated.includes(edit.oldText)) {
        if (item.source && item.source.trim()) { updated = item.source; break; }
        throw new Error(`oldText not found in ${compName}: ${JSON.stringify(edit.oldText.slice(0, 80))}`);
      }
      updated = updated.replace(edit.oldText, () => edit.newText);
    }
    resolvedSource = updated;
  } else if (item.source && item.source.trim()) {
    resolvedSource = item.source;
  } else if (baseSource) {
    resolvedSource = baseSource;
  }

  if (!resolvedSource) return;
  const normalized = normalizeMitosisSource(resolvedSource, compName);
  ctx.lastAttemptedSource[compName] = normalized;
  ctx.components[compName] = normalized;
  ctx.componentGroups[compName] = group;
}

export async function runAgyAuthor(ctx: AgyRunnerContext): Promise<void> {
  const prompt = buildAgyAuthorPrompt(ctx.req, ctx.requestedNames, ctx.rawSpecs);
  const stdout = await spawnAgyProcess(ctx.config, prompt);
  const output = parseAgyAuthorOutput(stdout);
  if (Array.isArray(output.newTokens)) ctx.newTokens.push(...output.newTokens);
  const fallbackName = ctx.requestedNames.length === 1 ? ctx.requestedNames[0] : undefined;
  for (const item of output.components) applyComponentItem(item, fallbackName, ctx);
}
