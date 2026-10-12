import type { FigmaColor, FigmaToken, FigmaComponentSpec } from '@supernova/contracts';

/**
 * Converts a Figma RGB/RGBA color object to standard rgba string.
 */
export function serializeColor(color: { r: number; g: number; b: number; a?: number }, opacity: number = 1): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = Math.round((color.a !== undefined ? color.a : opacity) * 100) / 100;
  return a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Extracts AutoLayout and geometry parameters from a Figma node structure.
 */
export function extractLayout(node: Record<string, any>): Record<string, any> {
  const layout: Record<string, any> = {
    width: node.width ?? 0,
    height: node.height ?? 0,
    layoutMode: node.layoutMode ?? 'NONE',
  };

  if (node.layoutMode && node.layoutMode !== 'NONE') {
    layout.primaryAxisAlignItems = node.primaryAxisAlignItems ?? 'MIN';
    layout.counterAxisAlignItems = node.counterAxisAlignItems ?? 'MIN';
    layout.paddingTop = node.paddingTop ?? 0;
    layout.paddingRight = node.paddingRight ?? 0;
    layout.paddingBottom = node.paddingBottom ?? 0;
    layout.paddingLeft = node.paddingLeft ?? 0;
    layout.itemSpacing = node.itemSpacing ?? 0;
  }

  if (typeof node.cornerRadius === 'number') {
    layout.cornerRadius = node.cornerRadius;
  } else if (
    typeof node.topLeftRadius === 'number' ||
    typeof node.topRightRadius === 'number' ||
    typeof node.bottomRightRadius === 'number' ||
    typeof node.bottomLeftRadius === 'number'
  ) {
    layout.cornerRadius = {
      topLeft: typeof node.topLeftRadius === 'number' ? node.topLeftRadius : 0,
      topRight: typeof node.topRightRadius === 'number' ? node.topRightRadius : 0,
      bottomRight: typeof node.bottomRightRadius === 'number' ? node.bottomRightRadius : 0,
      bottomLeft: typeof node.bottomLeftRadius === 'number' ? node.bottomLeftRadius : 0,
    };
  }

  return layout;
}

/**
 * Normalizes a variable into a unified FigmaToken format.
 */
export function formatVariableToken(
  variable: { id: string; name: string; resolvedType: string; valuesByMode: Record<string, any>; description?: string },
  collectionName: string = '',
  tokensOrMap?: FigmaToken[] | Map<string, FigmaToken>
): FigmaToken {
  // Use first mode value available
  const modeKeys = Object.keys(variable.valuesByMode || {});
  let rawValue = modeKeys.length > 0 ? variable.valuesByMode[modeKeys[0]!] : null;

  if (tokensOrMap && rawValue && typeof rawValue === 'object' && rawValue.type === 'VARIABLE_ALIAS') {
    const map = tokensOrMap instanceof Map ? tokensOrMap : new Map(tokensOrMap.map((t) => [t.id, t]));
    const target = map.get(rawValue.id);
    if (target) {
      rawValue = target.value;
    }
  }

  return {
    id: variable.id,
    name: collectionName ? `${collectionName}/${variable.name}` : variable.name,
    type: variable.resolvedType.toLowerCase(),
    value: rawValue,
    description: variable.description || undefined,
  };
}

/**
 * Resolves all VARIABLE_ALIAS values across tokens with recursive cycle detection
 * and color normalization.
 */
export function resolveVariableAliases(tokens: FigmaToken[]): FigmaToken[] {
  const tokenMap = new Map<string, FigmaToken>();
  for (const token of tokens) {
    if (token.id) {
      tokenMap.set(token.id, token);
      if (token.id.startsWith('VariableID:')) {
        tokenMap.set(token.id.slice('VariableID:'.length), token);
      } else {
        tokenMap.set(`VariableID:${token.id}`, token);
      }
    }
  }

  function isAlias(val: any): val is { id: string; type: string } {
    return (
      val !== null &&
      typeof val === 'object' &&
      typeof val.id === 'string' &&
      typeof val.type === 'string' &&
      val.type.toUpperCase() === 'VARIABLE_ALIAS'
    );
  }

  function isColorObject(val: any): boolean {
    return (
      val !== null &&
      typeof val === 'object' &&
      typeof val.r === 'number' &&
      typeof val.g === 'number' &&
      typeof val.b === 'number'
    );
  }

  function resolveVal(val: any, visited: Set<string>): any {
    if (isAlias(val)) {
      if (visited.has(val.id)) {
        return val;
      }
      visited.add(val.id);
      const target = tokenMap.get(val.id);
      if (!target) {
        return val;
      }
      return resolveVal(target.value, visited);
    }
    if (isColorObject(val)) {
      return serializeColor(val, val.a);
    }
    return val;
  }

  return tokens.map((token) => {
    const visited = new Set<string>();
    if (token.id) {
      visited.add(token.id);
      if (token.id.startsWith('VariableID:')) {
        visited.add(token.id.slice('VariableID:'.length));
      } else {
        visited.add(`VariableID:${token.id}`);
      }
    }

    let resolvedVal = resolveVal(token.value, visited);
    if (isColorObject(resolvedVal)) {
      resolvedVal = serializeColor(resolvedVal, resolvedVal.a);
    }

    return {
      ...token,
      value: resolvedVal,
    };
  });
}

/**
 * Serializes a Figma effect (drop shadow, inner shadow, blur) into a standard object.
 */
export function serializeEffect(effect: any): Record<string, any> {
  const serialized: Record<string, any> = {
    type: effect.type,
    visible: effect.visible !== false,
    radius: typeof effect.radius === 'number' ? effect.radius : 0,
  };

  if (effect.color) {
    serialized.color = serializeColor(effect.color, effect.color.a ?? 1);
  }

  if (effect.offset) {
    serialized.offset = {
      x: effect.offset.x ?? 0,
      y: effect.offset.y ?? 0,
    };
  }

  if (effect.spread !== undefined && typeof effect.spread === 'number') {
    serialized.spread = effect.spread;
  }

  return serialized;
}

/**
 * Formats a component node into FigmaComponentSpec.
 */
export function formatComponentSpec(
  node: { id: string; name: string; key?: string; description?: string; parent?: { name?: string; type?: string } },
  serializedNodeData: Record<string, any>,
  pageName?: string
): FigmaComponentSpec {
  const spec: FigmaComponentSpec = {
    id: node.id,
    name: node.name,
    node: serializedNodeData,
  };

  if (pageName) {
    spec.pageName = pageName;
  }
  if (node.key) {
    spec.key = node.key;
  }
  if (node.description) {
    spec.description = node.description;
  }
  if (node.parent && node.parent.type === 'COMPONENT_SET' && node.parent.name) {
    spec.componentSetName = node.parent.name;
  }

  return spec;
}

/**
 * Formats a COMPONENT_SET into a single aggregated FigmaComponentSpec.
 */
export function formatComponentSetSpec(
  componentSet: {
    id: string;
    name: string;
    key?: string;
    description?: string;
    componentPropertyDefinitions?: Record<string, any>;
  },
  variants: any[],
  layoutData?: any,
  pageName?: string
): FigmaComponentSpec {
  const properties: Record<string, any> = {};
  if (componentSet.componentPropertyDefinitions) {
    for (const [key, value] of Object.entries(componentSet.componentPropertyDefinitions)) {
      properties[key] = value;
    }
  }

  const spec: FigmaComponentSpec = {
    id: componentSet.id,
    name: componentSet.name,
    properties,
    node: {
      ...(layoutData || {}),
      variantCount: variants.length,
      variants,
    },
  };

  if (pageName) {
    spec.pageName = pageName;
  }
  if (componentSet.key) {
    spec.key = componentSet.key;
  }
  if (componentSet.description) {
    spec.description = componentSet.description;
  }

  return spec;
}

/**
 * Helper to register a variable ID and its prefixed/unprefixed variant as known.
 */
export function markKnownVariableId(id: string, knownIds: Set<string>): void {
  knownIds.add(id);
  if (id.startsWith('VariableID:')) {
    knownIds.add(id.slice('VariableID:'.length));
  } else {
    knownIds.add(`VariableID:${id}`);
  }
}

/**
 * Checks whether a variable ID is known in either bare or prefixed form.
 */
export function isKnownVariableId(id: string, knownIds: Set<string>): boolean {
  if (knownIds.has(id)) return true;
  if (id.startsWith('VariableID:')) {
    return knownIds.has(id.slice('VariableID:'.length));
  }
  return knownIds.has(`VariableID:${id}`);
}

/**
 * Scans a node and its fills, strokes, and effects for any referenced bound variables.
 * Missing IDs are added to `missingIds` if they are not already in `knownIds`.
 */
export function collectBoundVariableIds(
  node: Record<string, any>,
  missingIds: Set<string>,
  knownIds: Set<string>
): void {
  if (!node) return;

  function extractAliasId(val: any): string | null {
    if (val && typeof val === 'object' && typeof val.id === 'string') {
      return val.id;
    }
    return null;
  }

  function checkId(id: string | null | undefined) {
    if (id && !isKnownVariableId(id, knownIds)) {
      missingIds.add(id);
    }
  }

  // 1. Direct boundVariables on node
  if (node.boundVariables && typeof node.boundVariables === 'object') {
    for (const val of Object.values(node.boundVariables)) {
      if (Array.isArray(val)) {
        for (const item of val) {
          checkId(extractAliasId(item));
        }
      } else {
        checkId(extractAliasId(val));
      }
    }
  }

  // 2. Fills
  if (Array.isArray(node.fills)) {
    for (const fill of node.fills) {
      if (fill?.boundVariables && typeof fill.boundVariables === 'object') {
        for (const val of Object.values(fill.boundVariables)) {
          checkId(extractAliasId(val));
        }
      }
    }
  }

  // 3. Strokes
  if (Array.isArray(node.strokes)) {
    for (const stroke of node.strokes) {
      if (stroke?.boundVariables && typeof stroke.boundVariables === 'object') {
        for (const val of Object.values(stroke.boundVariables)) {
          checkId(extractAliasId(val));
        }
      }
    }
  }

  // 4. Effects
  if (Array.isArray(node.effects)) {
    for (const effect of node.effects) {
      if (effect?.boundVariables && typeof effect.boundVariables === 'object') {
        for (const val of Object.values(effect.boundVariables)) {
          checkId(extractAliasId(val));
        }
      }
    }
  }
}

/**
 * Strips non-serializable symbols and breaks circular references
 * to ensure safe transit through Figma IPC postMessage.
 */
export function sanitizeForPostMessage<T>(data: T): T {
  if (data === undefined) return undefined as any;
  const seen = new WeakSet();
  return JSON.parse(
    JSON.stringify(data, (_key, value) => {
      if (typeof value === 'symbol') {
        return undefined;
      }
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return undefined;
        }
        seen.add(value);
      }
      return value;
    })
  );
}

/**
 * Returns true if the page name is composed entirely of divider characters
 * (e.g. \u2500 box drawing light horizontal ─, em-dash —, en-dash –, hyphens -, underscores _, spaces, dots)
 * or starts with —, ---, --, ─.
 */
export function isDividerPage(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed.length === 0) return true;

  const dividerOnlyRegex = /^[\u2500\u2014\u2013\-_.\s]+$/;
  if (dividerOnlyRegex.test(trimmed)) {
    return true;
  }

  const DIVIDER_PREFIXES = ['—', '---', '--', '─'];
  return DIVIDER_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
}

/**
 * Returns true if cleaned name matches or contains patterns, pattern, playground,
 * sandbox, scratchpad, trash, archive, welcome, cover, template, templates.
 */
export function isExcludedPage(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  const lower = name.toLowerCase().trim();
  const EXCLUDED_TERMS = [
    'patterns',
    'pattern',
    'playground',
    'sandbox',
    'scratchpad',
    'trash',
    'archive',
    'welcome',
    'cover',
    'template',
    'templates',
  ];

  const regex = new RegExp(`\\b(${EXCLUDED_TERMS.join('|')})\\b`, 'i');
  if (regex.test(lower)) {
    return true;
  }

  const cleaned = lower.replace(/[^\p{L}\p{N}\s]/gu, ' ').trim();
  const words = cleaned.split(/\s+/);
  return words.some((word) => EXCLUDED_TERMS.includes(word));
}

/**
 * Returns true if page acts as a section header for components
 * (e.g. matches /\bcomponents?\b/i or has emoji + component, e.g., '💠 Components', '❖ Components', 'Components', 'UI Components').
 */
export function isComponentsSectionHeader(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return /\bcomponents?\b/i.test(trimmed);
}

/**
 * Returns true if page acts as another section header
 * (e.g. contains foundation, patterns, playground, templates, archive or starts with emoji/symbol).
 */
export function isSectionHeader(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed.length === 0) return false;

  // Check if it starts with an emoji or symbol
  if (/^[\p{Extended_Pictographic}\p{S}]/u.test(trimmed)) {
    return true;
  }

  // Check if it contains any section header keyword
  const lower = trimmed.toLowerCase();
  const SECTION_KEYWORDS = [
    'foundation',
    'foundations',
    'patterns',
    'pattern',
    'playground',
    'templates',
    'template',
    'archive',
    'sandbox',
    'scratchpad',
  ];
  const regex = new RegExp(`\\b(${SECTION_KEYWORDS.join('|')})\\b`, 'i');
  return regex.test(lower);
}

/**
 * Section-aware page selection logic:
 * - If a Components section header exists:
 *   Scans forward until next section header, excluded page, or divider followed by new section.
 * - If NO Components section header exists:
 *   Falls back to scanning valid pages while excluding dividers and excluded pages.
 */
export function getComponentPagesToScan<T extends { name: string; type?: string }>(
  pages: readonly T[] | T[]
): T[];
export function getComponentPagesToScan(pages: readonly string[] | string[]): string[];
export function getComponentPagesToScan<T extends { name: string; type?: string } | string>(
  pages: readonly T[] | T[]
): T[] {
  if (!Array.isArray(pages) || pages.length === 0) {
    return [];
  }

  function getPageName(p: T): string {
    return typeof p === 'string' ? p : p.name;
  }

  function isValidPageType(p: T): boolean {
    if (typeof p === 'string') return true;
    return !p.type || p.type === 'PAGE';
  }

  // 1. Check if any page satisfies isComponentsSectionHeader
  const headerIndex = pages.findIndex((p) => {
    const name = getPageName(p);
    return isComponentsSectionHeader(name) && !isDividerPage(name);
  });

  // Case A: A Components section header exists
  if (headerIndex !== -1) {
    const componentPages: T[] = [];

    for (let i = headerIndex + 1; i < pages.length; i++) {
      const p = pages[i]!;
      const name = getPageName(p);

      // Check for divider page
      if (isDividerPage(name)) {
        // Check if this divider is followed by a new section header or excluded page
        const nextNonDivider = pages.slice(i + 1).find((next) => !isDividerPage(getPageName(next)));
        if (
          nextNonDivider &&
          ((isSectionHeader(getPageName(nextNonDivider)) && !isComponentsSectionHeader(getPageName(nextNonDivider))) ||
            isExcludedPage(getPageName(nextNonDivider)))
        ) {
          // Section ended at this divider
          break;
        }
        // Otherwise, skip the divider page
        continue;
      }

      // Check if page marks the start of the next section
      if (
        (isSectionHeader(name) && !isComponentsSectionHeader(name)) ||
        isExcludedPage(name)
      ) {
        break;
      }

      // Exclude pages that match the components header name
      if (isComponentsSectionHeader(name)) {
        continue;
      }

      // Ensure valid page type (if type property is present)
      if (isValidPageType(p)) {
        componentPages.push(p);
      }
    }

    return componentPages;
  }

  // Case B: NO Components section header exists -> fallback
  return pages.filter((p) => {
    const name = getPageName(p);
    return isValidPageType(p) && !isDividerPage(name) && !isExcludedPage(name);
  });
}


