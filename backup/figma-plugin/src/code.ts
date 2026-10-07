declare const figma: any;
declare const __html__: string;

figma.showUI(__html__, {
  width: 480,
  height: 640,
  themeColors: true,
  title: 'Supernova Design System Sync',
});

// ---------------------------------------------------------------------------
// Helpers: Color & Value Conversion
// ---------------------------------------------------------------------------

function round(val: number, precision: number = 2): number {
  const factor = Math.pow(10, precision);
  return Math.round(val * factor) / factor;
}

function componentToHex(c: number): string {
  const hex = Math.round(c * 255).toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function rgbaToString(color: { r: number; g: number; b: number; a?: number }, opacity: number = 1): string {
  if (!color) return 'transparent';
  const alpha = color.a !== undefined ? color.a * opacity : opacity;
  const roundedAlpha = round(alpha, 3);
  if (roundedAlpha < 1) {
    return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${roundedAlpha})`;
  }
  return rgbToHex(color.r, color.g, color.b);
}

function normalizeKey(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

function camelCase(str: string): string {
  const s = normalizeKey(str);
  if (!s) return 'token';
  return s.charAt(0).toLowerCase() + s.slice(1);
}

// ---------------------------------------------------------------------------
// Clean Node Serialization (Prevents Circular Reference Errors in Figma)
// ---------------------------------------------------------------------------

function serializeNode(node: any, depth: number = 0): any {
  if (!node || depth > 30) return null;

  const serialized: Record<string, any> = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible !== undefined ? node.visible : true,
  };

  // Layout properties
  if (node.layoutMode !== undefined) serialized.layoutMode = node.layoutMode;
  if (node.primaryAxisAlignItems !== undefined) serialized.primaryAxisAlignItems = node.primaryAxisAlignItems;
  if (node.counterAxisAlignItems !== undefined) serialized.counterAxisAlignItems = node.counterAxisAlignItems;
  if (node.itemSpacing !== undefined) serialized.itemSpacing = node.itemSpacing;
  if (node.paddingTop !== undefined) serialized.paddingTop = node.paddingTop;
  if (node.paddingRight !== undefined) serialized.paddingRight = node.paddingRight;
  if (node.paddingBottom !== undefined) serialized.paddingBottom = node.paddingBottom;
  if (node.paddingLeft !== undefined) serialized.paddingLeft = node.paddingLeft;
  if (node.layoutSizingHorizontal !== undefined) serialized.layoutSizingHorizontal = node.layoutSizingHorizontal;
  if (node.layoutSizingVertical !== undefined) serialized.layoutSizingVertical = node.layoutSizingVertical;
  if (node.layoutAlign !== undefined) serialized.layoutAlign = node.layoutAlign;
  if (node.layoutGrow !== undefined) serialized.layoutGrow = node.layoutGrow;

  // Sizing & bounds
  if (node.width !== undefined) serialized.width = round(node.width);
  if (node.height !== undefined) serialized.height = round(node.height);
  if (node.rotation !== undefined) serialized.rotation = round(node.rotation);

  if (node.absoluteBoundingBox) {
    serialized.absoluteBoundingBox = {
      x: round(node.absoluteBoundingBox.x),
      y: round(node.absoluteBoundingBox.y),
      width: round(node.absoluteBoundingBox.width),
      height: round(node.absoluteBoundingBox.height),
    };
  }

  // Corner radii
  if (node.cornerRadius !== undefined && typeof node.cornerRadius === 'number') {
    serialized.cornerRadius = node.cornerRadius;
  }
  if (node.topLeftRadius !== undefined) {
    serialized.topLeftRadius = node.topLeftRadius;
    serialized.topRightRadius = node.topRightRadius;
    serialized.bottomLeftRadius = node.bottomLeftRadius;
    serialized.bottomRightRadius = node.bottomRightRadius;
  }

  // Fills & Strokes
  if (Array.isArray(node.fills)) {
    serialized.fills = node.fills.map((paint: any) => serializePaint(paint));
  }
  if (Array.isArray(node.strokes)) {
    serialized.strokes = node.strokes.map((paint: any) => serializePaint(paint));
  }
  if (node.strokeWeight !== undefined) serialized.strokeWeight = node.strokeWeight;
  if (node.strokeAlign !== undefined) serialized.strokeAlign = node.strokeAlign;
  if (Array.isArray(node.dashPattern)) serialized.dashPattern = node.dashPattern;

  // Effects & Opacity
  if (Array.isArray(node.effects)) {
    serialized.effects = node.effects.map((effect: any) => serializeEffect(effect));
  }
  if (node.opacity !== undefined) serialized.opacity = round(node.opacity, 3);
  if (node.blendMode !== undefined) serialized.blendMode = node.blendMode;

  // Text specific
  if (node.type === 'TEXT') {
    serialized.characters = node.characters;
    serialized.style = {
      fontFamily: node.fontName ? node.fontName.family : undefined,
      fontWeight: node.fontName ? node.fontName.style : undefined,
      fontSize: node.fontSize !== undefined ? node.fontSize : undefined,
      textAlignHorizontal: node.textAlignHorizontal,
      textAlignVertical: node.textAlignVertical,
      letterSpacing: node.letterSpacing ? node.letterSpacing.value : undefined,
      lineHeight: node.lineHeight && typeof node.lineHeight === 'object' ? node.lineHeight.value : undefined,
    };
  }

  // Component properties
  const isVariant = node.type === 'COMPONENT' && node.parent && node.parent.type === 'COMPONENT_SET';
  if (!isVariant && (node.type === 'COMPONENT_SET' || node.type === 'COMPONENT')) {
    try {
      if (node.componentPropertyDefinitions) {
        serialized.componentPropertyDefinitions = node.componentPropertyDefinitions;
      }
    } catch (e) {}
  }
  if (isVariant && node.type === 'COMPONENT') {
    try {
      if (node.variantProperties) {
        serialized.variantProperties = node.variantProperties;
      }
    } catch (e) {}
  }
  if (node.type === 'INSTANCE') {
    try {
      if (node.componentProperties) {
        serialized.componentProperties = node.componentProperties;
      }
    } catch (e) {}
  }

  // Recursively serialize children (clean tree, omit parent)
  if (Array.isArray(node.children)) {
    serialized.children = node.children
      .map((child: any) => serializeNode(child, depth + 1))
      .filter(Boolean);
  }

  return serialized;
}

function serializePaint(paint: any): any {
  if (!paint) return null;
  const p: Record<string, any> = {
    type: paint.type,
    visible: paint.visible !== undefined ? paint.visible : true,
    opacity: paint.opacity !== undefined ? round(paint.opacity, 3) : 1,
    blendMode: paint.blendMode || 'NORMAL',
  };

  if (paint.color) {
    p.color = {
      r: round(paint.color.r, 4),
      g: round(paint.color.g, 4),
      b: round(paint.color.b, 4),
      a: paint.opacity !== undefined ? round(paint.opacity, 3) : 1,
    };
  }

  if (paint.gradientStops) {
    p.gradientStops = paint.gradientStops.map((stop: any) => ({
      position: round(stop.position, 4),
      color: {
        r: round(stop.color.r, 4),
        g: round(stop.color.g, 4),
        b: round(stop.color.b, 4),
        a: stop.color.a !== undefined ? round(stop.color.a, 3) : 1,
      },
    }));
  }

  return p;
}

function serializeEffect(effect: any): any {
  if (!effect) return null;
  return {
    type: effect.type,
    visible: effect.visible !== undefined ? effect.visible : true,
    radius: effect.radius !== undefined ? round(effect.radius) : 0,
    color: effect.color
      ? {
          r: round(effect.color.r, 4),
          g: round(effect.color.g, 4),
          b: round(effect.color.b, 4),
          a: effect.color.a !== undefined ? round(effect.color.a, 3) : 1,
        }
      : undefined,
    offset: effect.offset
      ? {
          x: round(effect.offset.x),
          y: round(effect.offset.y),
        }
      : undefined,
    spread: effect.spread !== undefined ? round(effect.spread) : undefined,
  };
}

// ---------------------------------------------------------------------------
// Token Extraction Logic
// ---------------------------------------------------------------------------

async function extractTokens(): Promise<{ normalized: Record<string, any>; raw: Record<string, any>; summary: any }> {
  const normalized: Record<string, Record<string, any>> = {
    colors: {},
    spacing: {},
    radii: {},
    typography: {},
    shadows: {},
    gradients: {},
    blurs: {},
  };

  const raw: Record<string, any> = {
    variables: [],
    collections: [],
    paintStyles: [],
    textStyles: [],
    effectStyles: [],
  };

  let variableCount = 0;
  let styleCount = 0;

  // 1. Extract Local Variables
  if (figma.variables && typeof figma.variables.getLocalVariablesAsync === 'function') {
    try {
      const [variables, collections] = await Promise.all([
        figma.variables.getLocalVariablesAsync(),
        figma.variables.getLocalVariableCollectionsAsync(),
      ]);

      const collectionMap = new Map<string, any>();
      for (const col of collections) {
        collectionMap.set(col.id, col);
        raw.collections.push({
          id: col.id,
          name: col.name,
          modes: col.modes,
          defaultModeId: col.defaultModeId,
        });
      }

      for (const variable of variables) {
        variableCount++;
        const col = collectionMap.get(variable.variableCollectionId);
        const colName = col ? col.name.toLowerCase() : '';
        const defaultModeId = col ? col.defaultModeId : Object.keys(variable.valuesByMode)[0];
        const val = variable.valuesByMode[defaultModeId];

        raw.variables.push({
          id: variable.id,
          name: variable.name,
          resolvedType: variable.resolvedType,
          valuesByMode: variable.valuesByMode,
          collectionId: variable.variableCollectionId,
          collectionName: col ? col.name : '',
        });

        const key = camelCase(variable.name);
        const lowerName = variable.name.toLowerCase();

        if (variable.resolvedType === 'COLOR') {
          if (val && typeof val === 'object' && 'r' in val) {
            normalized.colors[key] = rgbaToString(val);
          }
        } else if (variable.resolvedType === 'FLOAT') {
          const numVal = typeof val === 'number' ? val : 0;
          if (colName.includes('space') || colName.includes('spacing') || lowerName.includes('space') || lowerName.includes('spacing') || lowerName.includes('gap')) {
            normalized.spacing[key] = `${numVal}px`;
          } else if (colName.includes('radi') || lowerName.includes('radi') || lowerName.includes('corner') || lowerName.includes('round')) {
            normalized.radii[key] = `${numVal}px`;
          } else {
            normalized.spacing[key] = `${numVal}px`;
          }
        }
      }
    } catch (e) {
      console.warn('[figma-plugin] Variables extraction error:', e);
    }
  }

  // 2. Extract Paint Styles
  if (typeof figma.getLocalPaintStylesAsync === 'function') {
    try {
      const paintStyles = await figma.getLocalPaintStylesAsync();
      for (const style of paintStyles) {
        styleCount++;
        raw.paintStyles.push({
          id: style.id,
          name: style.name,
          paints: style.paints ? style.paints.map((p: any) => serializePaint(p)) : [],
        });

        const key = camelCase(style.name);
        const paint = style.paints && style.paints[0];
        if (paint && paint.visible !== false) {
          if (paint.type === 'SOLID' && paint.color) {
            normalized.colors[key] = rgbaToString(paint.color, paint.opacity);
          } else if (paint.type === 'GRADIENT_LINEAR' && paint.gradientStops) {
            const stops = paint.gradientStops
              .map((s: any) => `${rgbaToString(s.color)} ${round(s.position * 100)}%`)
              .join(', ');
            normalized.gradients[key] = `linear-gradient(90deg, ${stops})`;
          }
        }
      }
    } catch (e) {
      console.warn('[figma-plugin] Paint styles extraction error:', e);
    }
  }

  // 3. Extract Text Styles
  if (typeof figma.getLocalTextStylesAsync === 'function') {
    try {
      const textStyles = await figma.getLocalTextStylesAsync();
      for (const style of textStyles) {
        styleCount++;
        raw.textStyles.push({
          id: style.id,
          name: style.name,
          fontName: style.fontName,
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing,
        });

        const key = camelCase(style.name);
        const lineHeightVal =
          style.lineHeight && typeof style.lineHeight === 'object' && style.lineHeight.value
            ? `${round(style.lineHeight.value)}px`
            : 'normal';
        const letterSpacingVal =
          style.letterSpacing && typeof style.letterSpacing === 'object' && style.letterSpacing.value
            ? `${round(style.letterSpacing.value)}px`
            : '0px';

        normalized.typography[key] = {
          fontFamily: style.fontName ? style.fontName.family : 'Plus Jakarta Sans',
          fontSize: `${round(style.fontSize || 16)}px`,
          fontWeight: style.fontName ? style.fontName.style : '400',
          lineHeight: lineHeightVal,
          letterSpacing: letterSpacingVal,
        };
      }
    } catch (e) {
      console.warn('[figma-plugin] Text styles extraction error:', e);
    }
  }

  // 4. Extract Effect Styles (Shadows & Blurs)
  if (typeof figma.getLocalEffectStylesAsync === 'function') {
    try {
      const effectStyles = await figma.getLocalEffectStylesAsync();
      for (const style of effectStyles) {
        styleCount++;
        raw.effectStyles.push({
          id: style.id,
          name: style.name,
          effects: style.effects ? style.effects.map((e: any) => serializeEffect(e)) : [],
        });

        const key = camelCase(style.name);
        const effect = style.effects && style.effects[0];
        if (effect && effect.visible !== false) {
          if (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW') {
            const inset = effect.type === 'INNER_SHADOW' ? 'inset ' : '';
            const x = effect.offset ? effect.offset.x : 0;
            const y = effect.offset ? effect.offset.y : 0;
            const radius = effect.radius || 0;
            const spread = effect.spread || 0;
            const col = effect.color ? rgbaToString(effect.color) : 'rgba(0,0,0,0.1)';
            normalized.shadows[key] = `${inset}${x}px ${y}px ${radius}px ${spread}px ${col}`;
          } else if (effect.type === 'LAYER_BLUR' || effect.type === 'BACKGROUND_BLUR') {
            normalized.blurs[key] = `blur(${effect.radius || 0}px)`;
          }
        }
      }
    } catch (e) {
      console.warn('[figma-plugin] Effect styles extraction error:', e);
    }
  }

  return {
    normalized,
    raw,
    summary: {
      variables: variableCount,
      styles: styleCount,
      colorTokens: Object.keys(normalized.colors).length,
      spacingTokens: Object.keys(normalized.spacing).length,
      radiiTokens: Object.keys(normalized.radii).length,
      typographyTokens: Object.keys(normalized.typography).length,
      shadowTokens: Object.keys(normalized.shadows).length,
      gradientTokens: Object.keys(normalized.gradients).length,
      blurTokens: Object.keys(normalized.blurs).length,
    },
  };
}

// ---------------------------------------------------------------------------
// Component Extraction Logic
// ---------------------------------------------------------------------------

async function extractComponents(scope: 'selection' | 'page' | 'all' = 'selection'): Promise<{ components: any[]; raw: any[]; summary: any }> {
  let targetNodes: any[] = [];
  const seenIds = new Set<string>();

  const addTarget = (node: any) => {
    if (!node || !node.id) return;
    if (seenIds.has(node.id)) return;
    seenIds.add(node.id);
    targetNodes.push(node);
  };

  if (scope === 'selection') {
    const selection = figma.currentPage.selection;
    for (const node of selection) {
      if (node.type === 'COMPONENT_SET') {
        addTarget(node);
      } else if (node.type === 'COMPONENT') {
        if (node.parent && node.parent.type === 'COMPONENT_SET') {
          addTarget(node.parent);
        } else {
          addTarget(node);
        }
      } else if (typeof node.findAllWithCriteria === 'function') {
        const found = node.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] });
        for (const item of found) {
          if (item.type === 'COMPONENT_SET') {
            addTarget(item);
          } else if (item.type === 'COMPONENT') {
            if (item.parent && item.parent.type === 'COMPONENT_SET') {
              addTarget(item.parent);
            } else {
              addTarget(item);
            }
          }
        }
      }
    }
  } else if (scope === 'page') {
    if (typeof figma.currentPage.findAllWithCriteria === 'function') {
      const found = figma.currentPage.findAllWithCriteria({
        types: ['COMPONENT_SET', 'COMPONENT'],
      });
      for (const item of found) {
        addTarget(item);
      }
    }
  } else if (scope === 'all') {
    for (const page of figma.root.children) {
      if (typeof (page as any).loadAsync === 'function') {
        await (page as any).loadAsync();
      }
      if (typeof page.findAllWithCriteria === 'function') {
        const found = page.findAllWithCriteria({
          types: ['COMPONENT_SET', 'COMPONENT'],
        });
        for (const item of found) {
          addTarget(item);
        }
      }
    }
  }

  // Filter out components that are children of a COMPONENT_SET
  const filteredNodes: any[] = [];
  for (const node of targetNodes) {
    if (node.type === 'COMPONENT' && node.parent && node.parent.type === 'COMPONENT_SET') {
      continue; // Skip variant child; the parent set is the component unit
    }
    filteredNodes.push(node);
  }

  const components: any[] = [];
  const rawList: any[] = [];

  for (const node of filteredNodes) {
    const serializedNode = serializeNode(node);
    rawList.push(serializedNode);

    let variantValues: Record<string, any> = {};
    let variantsList: any[] = [];

    if (node.type === 'COMPONENT_SET' && Array.isArray(node.children)) {
      variantsList = node.children.map((child: any) => ({
        id: child.id,
        name: child.name,
        variantProperties: child.variantProperties || {},
      }));
      if (node.children[0] && node.children[0].variantProperties) {
        variantValues = node.children[0].variantProperties;
      }
    }

    let propDefs: any = {};
    if (node.type === 'COMPONENT_SET' || (node.type === 'COMPONENT' && (!node.parent || node.parent.type !== 'COMPONENT_SET'))) {
      try {
        propDefs = node.componentPropertyDefinitions || {};
      } catch (e) {
        propDefs = {};
      }
    }

    components.push({
      id: node.id,
      nodeId: node.id,
      name: node.name,
      rawName: node.name,
      description: node.description || '',
      fileId: figma.fileKey || '',
      componentPropertyDefinitions: propDefs,
      variantPropertyValues: variantValues,
      variants: variantsList,
      document: serializedNode,
      node: serializedNode,
    });
  }

  return {
    components,
    raw: rawList,
    summary: {
      scope,
      totalFound: filteredNodes.length,
      names: components.map((c) => c.name),
    },
  };
}

// ---------------------------------------------------------------------------
// Main Message Router
// ---------------------------------------------------------------------------

figma.ui.onmessage = async (msg: any) => {
  try {
    if (msg.type === 'extract-tokens') {
      const data = await extractTokens();
      figma.ui.postMessage({
        type: 'tokens-extracted',
        data,
      });
    } else if (msg.type === 'extract-components') {
      const data = await extractComponents(msg.scope || 'selection');
      figma.ui.postMessage({
        type: 'components-extracted',
        data,
      });
    } else if (msg.type === 'extract-all') {
      const tokensData = await extractTokens();
      const componentsData = await extractComponents(msg.scope || 'selection');
      figma.ui.postMessage({
        type: 'all-extracted',
        data: {
          tokens: tokensData.normalized,
          rawTokens: tokensData.raw,
          tokensSummary: tokensData.summary,
          components: componentsData.components,
          rawComponents: componentsData.raw,
          componentsSummary: componentsData.summary,
        },
      });
    } else if (msg.type === 'notify') {
      figma.notify(msg.message || '', {
        error: Boolean(msg.error),
        timeout: msg.timeout || 3000,
      });
    } else if (msg.type === 'close') {
      figma.closePlugin();
    }
  } catch (err: any) {
    console.error('[figma-plugin] Error processing message:', err);
    figma.ui.postMessage({
      type: 'error',
      message: err.message || String(err),
    });
    figma.notify(`Error: ${err.message}`, { error: true });
  }
};
