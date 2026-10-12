import type { FigmaDocument, FigmaToken, FigmaComponentSpec } from '@supernova/contracts';
import {
  extractLayout,
  formatVariableToken,
  formatComponentSpec,
  formatComponentSetSpec,
  serializeColor,
  serializeEffect,
  resolveVariableAliases,
  collectBoundVariableIds,
  markKnownVariableId,
  isKnownVariableId,
  sanitizeForPostMessage,
  getComponentPagesToScan,
} from './extractor.js';

figma.showUI(__html__, { width: 440, height: 600, themeColors: true });

function postMessageSafe(message: any): void {
  figma.ui.postMessage(sanitizeForPostMessage(message));
}

function serializeNode(node: SceneNode, depth: number = 0): Record<string, any> {
  if (depth > 5) {
    return { id: node.id, name: node.name, type: node.type };
  }

  const base: Record<string, any> = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
    layout: extractLayout(node as any),
  };

  // Fills & Strokes
  if ('fills' in node && Array.isArray(node.fills)) {
    base.fills = node.fills
      .filter((f) => f.visible !== false && f.type === 'SOLID')
      .map((f: any) => ({
        type: f.type,
        color: serializeColor(f.color, f.opacity),
      }));
  }

  // Text content
  if (node.type === 'TEXT') {
    base.characters = node.characters;
    base.fontSize = typeof node.fontSize === 'number' ? node.fontSize : undefined;
  }

  // Children
  if ('children' in node && Array.isArray(node.children)) {
    base.children = node.children.map((child) => serializeNode(child, depth + 1));
  }

  return base;
}

function scanNodeForBoundVariables(node: any, missingIds: Set<string>, knownIds: Set<string>): void {
  collectBoundVariableIds(node, missingIds, knownIds);
  if ('children' in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      scanNodeForBoundVariables(child, missingIds, knownIds);
    }
  }
}

async function extractWholeDocument(): Promise<FigmaDocument> {
  // 1. Ensure all document pages are loaded dynamically
  if (typeof figma.loadAllPagesAsync === 'function') {
    await figma.loadAllPagesAsync();
  }

  const tokens: FigmaToken[] = [];
  const components: FigmaComponentSpec[] = [];
  const knownVariableIds = new Set<string>();
  const missingVariableIds = new Set<string>();
  const collectionMap = new Map<string, string>();

  // 2. Extract Variables
  if (figma.variables && typeof figma.variables.getLocalVariablesAsync === 'function') {
    try {
      const [variables, collections] = await Promise.all([
        figma.variables.getLocalVariablesAsync(),
        figma.variables.getLocalVariableCollectionsAsync(),
      ]);

      for (const col of collections) {
        collectionMap.set(col.id, col.name);
      }

      for (const v of variables) {
        markKnownVariableId(v.id, knownVariableIds);
        const colName = collectionMap.get(v.variableCollectionId) || '';
        tokens.push(formatVariableToken(v as any, colName));

        if (v.valuesByMode) {
          for (const modeVal of Object.values(v.valuesByMode)) {
            if (
              modeVal &&
              typeof modeVal === 'object' &&
              (modeVal as any).type === 'VARIABLE_ALIAS' &&
              typeof (modeVal as any).id === 'string'
            ) {
              const refId = (modeVal as any).id;
              if (!isKnownVariableId(refId, knownVariableIds)) {
                missingVariableIds.add(refId);
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('Failed to extract variables:', err);
    }
  }

  // 3. Extract Styles (Paint & Text)
  if (typeof figma.getLocalPaintStylesAsync === 'function') {
    try {
      const paintStyles = await figma.getLocalPaintStylesAsync();
      for (const ps of paintStyles) {
        const solidPaints = ps.paints.filter((p) => p.visible !== false && p.type === 'SOLID');
        if (solidPaints.length > 0) {
          const paint = solidPaints[0] as any;
          tokens.push({
            id: ps.id,
            name: `color/${ps.name}`,
            type: 'color',
            value: serializeColor(paint.color, paint.opacity),
            description: ps.description || undefined,
          });
        }
      }
    } catch (err) {
      console.warn('Failed to extract paint styles:', err);
    }
  }

  if (typeof figma.getLocalTextStylesAsync === 'function') {
    try {
      const textStyles = await figma.getLocalTextStylesAsync();
      for (const ts of textStyles) {
        tokens.push({
          id: ts.id,
          name: `typography/${ts.name}`,
          type: 'typography',
          value: {
            fontSize: typeof ts.fontSize === 'number' ? ts.fontSize : undefined,
            lineHeight: ts.lineHeight && typeof ts.lineHeight === 'object' ? ts.lineHeight : undefined,
            fontFamily: ts.fontName && typeof ts.fontName === 'object' ? ts.fontName.family : undefined,
          },
          description: ts.description || undefined,
        });
      }
    } catch (err) {
      console.warn('Failed to extract text styles:', err);
    }
  }

  // 3c. Extract Effect Styles (Shadows & Blurs)
  if (typeof figma.getLocalEffectStylesAsync === 'function') {
    try {
      const effectStyles = await figma.getLocalEffectStylesAsync();
      for (const es of effectStyles) {
        tokens.push({
          id: es.id,
          name: `effect/${es.name}`,
          type: 'effect',
          value: es.effects.map(serializeEffect),
          description: es.description || undefined,
        });
      }
    } catch (err) {
      console.warn('Failed to extract effect styles:', err);
    }
  }

  // 4. Extract components from selected component pages
  const pagesToScan = getComponentPagesToScan<PageNode>(figma.root.children as any);

  for (const page of pagesToScan) {
    // Scan scene nodes on this page for boundVariables
    scanNodeForBoundVariables(page, missingVariableIds, knownVariableIds);

    // 4a. Find COMPONENT_SET nodes first and aggregate variants
    const componentSets = page.findAllWithCriteria({
      types: ['COMPONENT_SET'],
    });

    for (const compSet of componentSets) {
      const variants: any[] = [];
      for (const child of compSet.children) {
        if (child.type === 'COMPONENT') {
          const serialized = serializeNode(child);
          variants.push({
            id: child.id,
            name: child.name,
            properties: (child as any).variantProperties || (child as any).componentProperties || {},
            node: serialized,
          });
        }
      }

      const setLayout = extractLayout(compSet as any);
      components.push(formatComponentSetSpec(compSet as any, variants, setLayout, page.name));
    }

    // 4b. Find standalone COMPONENT nodes (skip children of COMPONENT_SET)
    const pageComponents = page.findAllWithCriteria({
      types: ['COMPONENT'],
    });

    for (const comp of pageComponents) {
      if (comp.parent && comp.parent.type === 'COMPONENT_SET') {
        continue;
      }
      const serialized = serializeNode(comp);
      components.push(formatComponentSpec(comp as any, serialized, page.name));
    }
  }

  // 5. Fetch external/library variables referenced via boundVariables or aliases
  if (figma.variables && typeof figma.variables.getVariableByIdAsync === 'function') {
    while (missingVariableIds.size > 0) {
      const idsToFetch = Array.from(missingVariableIds);
      missingVariableIds.clear();

      for (const id of idsToFetch) {
        if (isKnownVariableId(id, knownVariableIds)) continue;
        markKnownVariableId(id, knownVariableIds);

        try {
          const variable = await figma.variables.getVariableByIdAsync(id);
          if (variable) {
            let colName = '';
            if (variable.variableCollectionId) {
              if (collectionMap.has(variable.variableCollectionId)) {
                colName = collectionMap.get(variable.variableCollectionId)!;
              } else if (typeof figma.variables.getVariableCollectionByIdAsync === 'function') {
                try {
                  const col = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
                  if (col) {
                    colName = col.name;
                    collectionMap.set(col.id, col.name);
                  }
                } catch {
                  // Ignore collection fetch error
                }
              }
            }

            tokens.push(formatVariableToken(variable as any, colName));

            if (variable.valuesByMode) {
              for (const modeVal of Object.values(variable.valuesByMode)) {
                if (
                  modeVal &&
                  typeof modeVal === 'object' &&
                  (modeVal as any).type === 'VARIABLE_ALIAS' &&
                  typeof (modeVal as any).id === 'string'
                ) {
                  const refId = (modeVal as any).id;
                  if (!isKnownVariableId(refId, knownVariableIds)) {
                    missingVariableIds.add(refId);
                  }
                }
              }
            }
          }
        } catch (err) {
          console.warn(`Failed to fetch external variable ${id}:`, err);
        }
      }
    }
  }

  // 6. Resolve all variable aliases
  const resolvedTokens = resolveVariableAliases(tokens);

  return {
    name: figma.root.name || 'Figma Design System',
    tokens: resolvedTokens,
    components,
  };
}

async function triggerAutoScan() {
  try {
    const document = await extractWholeDocument();
    postMessageSafe({ type: 'document-scanned', document });
  } catch (err: any) {
    figma.notify(`Auto-scan failed: ${err.message}`, { error: true });
    postMessageSafe({ type: 'scan-error', error: err.message });
  }
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'rescan') {
    figma.notify('Rescanning Figma document...');
    await triggerAutoScan();
  } else if (msg.type === 'notify') {
    figma.notify(msg.message, { error: !!msg.error });
  } else if (msg.type === 'extract-all') {
    try {
      figma.notify('Scanning entire Figma document...');
      const document = await extractWholeDocument();
      postMessageSafe({
        type: 'extraction-data',
        document,
        options: msg.options,
        targets: msg.targets,
        publishers: msg.publishers,
        backendUrl: msg.backendUrl,
        apiToken: msg.apiToken,
      });
    } catch (err: any) {
      figma.notify(`Extraction failed: ${err.message}`, { error: true });
      postMessageSafe({ type: 'extraction-error', error: err.message });
    }
  }
};

// Trigger auto-scan immediately on plugin startup
triggerAutoScan();
