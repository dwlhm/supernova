import * as fs from 'node:fs';
import * as path from 'node:path';
import { buildComponentBlueprint, extractVariantNodes } from './blueprint.js';

const IGNORED_SEARCH_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.turbo', '.next', '.cache',
]);

export async function findFileRecursive(dir: string, targetFileName: string): Promise<string | null> {
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
        if (found) return found;
      }
    } else if (entry.isFile() && entry.name === targetFileName) {
      return path.join(dir, entry.name);
    }
  }
  return null;
}

export function extractLayoutAndVisual(
  node: any
): { layout: Record<string, any>; visual: Record<string, any> } | null {
  if (!node || typeof node !== 'object') return null;

  const nodeLayout = node.layout || node;
  const layout: Record<string, any> = {};
  if (nodeLayout.layoutMode && nodeLayout.layoutMode !== 'NONE') {
    layout.layoutMode = nodeLayout.layoutMode;
  }
  if (nodeLayout.primaryAxisAlignItems) layout.primaryAxisAlignItems = nodeLayout.primaryAxisAlignItems;
  if (nodeLayout.counterAxisAlignItems) layout.counterAxisAlignItems = nodeLayout.counterAxisAlignItems;
  if (nodeLayout.itemSpacing !== undefined && nodeLayout.itemSpacing !== 0) {
    layout.itemSpacing = nodeLayout.itemSpacing;
  }

  const hasPadding =
    (nodeLayout.paddingLeft !== undefined && nodeLayout.paddingLeft !== 0) ||
    (nodeLayout.paddingRight !== undefined && nodeLayout.paddingRight !== 0) ||
    (nodeLayout.paddingTop !== undefined && nodeLayout.paddingTop !== 0) ||
    (nodeLayout.paddingBottom !== undefined && nodeLayout.paddingBottom !== 0);
  if (hasPadding) {
    layout.padding = {
      left: nodeLayout.paddingLeft ?? 0,
      right: nodeLayout.paddingRight ?? 0,
      top: nodeLayout.paddingTop ?? 0,
      bottom: nodeLayout.paddingBottom ?? 0,
    };
  }
  if (nodeLayout.layoutSizingHorizontal) layout.layoutSizingHorizontal = nodeLayout.layoutSizingHorizontal;
  if (nodeLayout.layoutSizingVertical) layout.layoutSizingVertical = nodeLayout.layoutSizingVertical;

  const visual = extractVisualStyles(node, nodeLayout);
  return { layout, visual };
}

function extractVisualStyles(node: any, nodeLayout: any): Record<string, any> {
  const visual: Record<string, any> = {};
  if (nodeLayout.cornerRadius !== undefined && nodeLayout.cornerRadius !== 0) {
    visual.cornerRadius = nodeLayout.cornerRadius;
  }
  if (Array.isArray(node.rectangleCornerRadii)) visual.rectangleCornerRadii = node.rectangleCornerRadii;
  if (node.strokeWeight !== undefined && node.strokeWeight !== 0) visual.strokeWeight = node.strokeWeight;
  if (node.boundVariables) visual.boundVariables = node.boundVariables;
  if (node.typography) visual.typography = node.typography;

  if (Array.isArray(node.fills)) {
    const visibleFills = node.fills.filter((f: any) => f && f.visible !== false);
    if (visibleFills.length > 0) {
      visual.fills = visibleFills.map((f: any) => ({
        type: f.type, color: f.color, opacity: f.opacity, boundVariables: f.boundVariables,
      }));
    }
  }
  if (Array.isArray(node.strokes)) {
    const visibleStrokes = node.strokes.filter((s: any) => s && s.visible !== false);
    if (visibleStrokes.length > 0) {
      visual.strokes = visibleStrokes.map((s: any) => ({
        type: s.type, color: s.color, opacity: s.opacity, weight: s.weight,
        align: s.align, dashes: s.dashes, boundVariables: s.boundVariables,
      }));
    }
  }
  if (Array.isArray(node.effects)) {
    const visibleEffects = node.effects.filter((e: any) => e && e.visible !== false);
    if (visibleEffects.length > 0) {
      visual.effects = visibleEffects.map((e: any) => ({
        type: e.type, radius: e.radius, color: e.color, offset: e.offset,
        spread: e.spread, boundVariables: e.boundVariables,
      }));
    }
  }
  return visual;
}

export function summarizeChildren(children: any[], maxDepth = 4, currentDepth = 0): any[] {
  if (!Array.isArray(children) || currentDepth >= maxDepth) return [];
  return children
    .filter((c: any) => c && c.visible !== false)
    .map((c: any) => {
      const summary: Record<string, any> = { name: c.name, type: c.type };
      const textContent = typeof c.characters === 'string' ? c.characters : c.typography?.characters;
      if (textContent) summary.textContent = textContent;
      if (c.componentPropertyReferences) summary.propertyReferences = c.componentPropertyReferences;
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

export function queryComponentTokens(componentName: string, rawTokens: any) {
  if (!rawTokens) {
    return { found: false, componentName, tokens: [], error: 'No raw tokens available in context.' };
  }
  const tokensList: any[] = [];
  if (Array.isArray(rawTokens)) {
    tokensList.push(...rawTokens);
  } else if (typeof rawTokens === 'object') {
    for (const [key, val] of Object.entries(rawTokens)) {
      tokensList.push(val && typeof val === 'object' ? { name: (val as any).name || key, ...(val as any) } : { name: key, value: val });
    }
  }
  const lowerComp = componentName.toLowerCase();
  const kebabComp = componentName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
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

  return { found: matchedTokens.length > 0, componentName, tokens: matchedTokens, totalTokens: matchedTokens.length };
}

export function executeReadComponentDetails(
  componentName: string,
  rawSpecs?: Record<string, any>,
  rawTokens?: any
) {
  if (!rawSpecs) {
    return {
      found: false,
      componentName,
      error: 'No raw specifications available in context.',
    };
  }

  const spec =
    rawSpecs[componentName] ||
    Object.entries(rawSpecs).find(([k]) => k.toLowerCase() === componentName.toLowerCase())?.[1];

  if (!spec) {
    const available = Object.keys(rawSpecs).join(', ') || 'none';
    return {
      found: false,
      componentName,
      error: `Component specification for "${componentName}" not found. Available specifications: ${available}`,
    };
  }

  const rootNode = spec.node || spec.document || spec;
  const rawProps =
    spec.properties || spec.componentPropertyDefinitions || rootNode.componentPropertyDefinitions || {};
  const variantNodes = extractVariantNodes(spec, rootNode);

  const defaultTarget = variantNodes.length > 0 ? variantNodes[0] : rootNode;
  const lv = extractLayoutAndVisual(defaultTarget);
  const childSlots = summarizeChildren(defaultTarget.children || []);
  const blueprint = buildComponentBlueprint(componentName, spec, rawTokens);

  const variantMatrix: Array<{ name: string; layout?: Record<string, any>; visual?: Record<string, any> }> = [];
  const seenStyles = new Set<string>();
  for (const v of variantNodes) {
    const vName = v.name || '';
    const styleKey = vName.split(',').map((p: string) => p.trim()).slice(0, 2).join(', ');
    if (!seenStyles.has(styleKey) && variantMatrix.length < 8) {
      seenStyles.add(styleKey);
      const vLv = extractLayoutAndVisual(v);
      variantMatrix.push({ name: vName, layout: vLv?.layout, visual: vLv?.visual });
    }
  }

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
    blueprint,
  };
}
