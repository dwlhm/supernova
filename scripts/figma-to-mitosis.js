#!/usr/bin/env node

/**
 * Supernova Figma to Mitosis Transpiler
 *
 * Fetches and transpiles Figma component scene graph data into idiomatic
 * Mitosis universal JSX (.lite.tsx) files.
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Environment configuration
// ---------------------------------------------------------------------------

/**
 * Lightweight .env parser without external dependencies.
 */
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) {
      continue;
    }

    const key = line.slice(0, eqIdx).trim();
    let val = line.slice(eqIdx + 1).trim();

    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = val;
    }
  }
}

// Automatically load .env from repository root if present
loadEnvFile(path.resolve(__dirname, '..', '.env'));

// ---------------------------------------------------------------------------
// Helpers: String manipulation
// ---------------------------------------------------------------------------

function toCamelCase(str) {
  if (!str) return '';
  // Strip any Figma property suffixes such as "#101:1"
  const clean = str.replace(/#.*$/, '').trim();
  return clean
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (chr) => chr.toLowerCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

function toPascalCase(str) {
  if (!str) return 'FigmaComponent';
  const clean = str.replace(/#.*$/, '').trim();
  const camel = clean
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (chr) => chr.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
  return camel.length > 0 ? camel : 'FigmaComponent';
}

const PROHIBITED_PROP_NAMES = {
  style: 'variant',
  class: 'className',
  default: 'isDefault',
  key: 'itemKey',
  ref: 'elementRef',
  slot: 'slotName',
  'slot-scope': 'slotScope',
  is: 'isType',
};

const PROHIBITED_KEYWORDS = new Set([
  'do', 'if', 'for', 'let', 'new', 'try', 'var', 'case', 'else', 'with', 'await',
  'break', 'catch', 'class', 'const', 'super', 'throw', 'while', 'yield', 'delete',
  'export', 'import', 'return', 'switch', 'default', 'extends', 'finally',
  'continue', 'debugger', 'function', 'arguments', 'typeof', 'void', 'key',
  'ref', 'slot', 'slot-scope', 'is', 'style',
]);

function sanitizePropName(name) {
  if (!name) return '';
  const lower = name.toLowerCase();
  if (PROHIBITED_PROP_NAMES[lower]) {
    return PROHIBITED_PROP_NAMES[lower];
  }
  if (PROHIBITED_KEYWORDS.has(lower)) {
    return `${name}Prop`;
  }
  return name;
}

function cleanPropKey(rawKey) {
  if (!rawKey) return '';
  const withoutId = rawKey.replace(/#.*$/, '').trim();
  return sanitizePropName(toCamelCase(withoutId));
}

// ---------------------------------------------------------------------------
// Token & Color Management
// ---------------------------------------------------------------------------

function parseColorString(str) {
  if (!str || typeof str !== 'string') return null;
  const s = str.trim();

  const rgbaMatch = s.match(/rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)/i);
  if (rgbaMatch) {
    return {
      r: Math.round(parseFloat(rgbaMatch[1])),
      g: Math.round(parseFloat(rgbaMatch[2])),
      b: Math.round(parseFloat(rgbaMatch[3])),
      a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1,
    };
  }

  const hexMatch = s.match(/^#([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const a = hex.length >= 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
    return { r, g, b, a };
  }

  return null;
}

function normalizeFigmaColor(color, opacity = 1) {
  if (!color || typeof color !== 'object') return null;
  const r = Math.round((color.r ?? 0) * 255);
  const g = Math.round((color.g ?? 0) * 255);
  const b = Math.round((color.b ?? 0) * 255);
  const rawAlpha = color.a !== undefined ? color.a : opacity;
  const a = Math.round(rawAlpha * 100) / 100;
  const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  return { r, g, b, a, hex };
}

/**
 * Load tokens from a path or find them in default project locations.
 */
function loadTokens(tokensPath) {
  const tokenEntries = [];

  const candidates = tokensPath
    ? [path.resolve(process.cwd(), tokensPath)]
    : [
        path.resolve(process.cwd(), 'tokens', 'tokens.css'),
        path.resolve(process.cwd(), 'tokens', 'tokens.ts'),
        path.resolve(__dirname, '..', 'tokens', 'tokens.css'),
        path.resolve(__dirname, '..', 'tokens', 'tokens.ts'),
      ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      try {
        const content = fs.readFileSync(candidate, 'utf8');
        if (candidate.endsWith('.css')) {
          const varRegex = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
          let match;
          while ((match = varRegex.exec(content)) !== null) {
            const varName = match[1];
            const parsed = parseColorString(match[2]);
            if (parsed) {
              tokenEntries.push({
                varName,
                cssVar: `var(${varName})`,
                ...parsed,
              });
            }
          }
        } else if (candidate.endsWith('.ts') || candidate.endsWith('.json')) {
          const colorRegex = /"([a-zA-Z0-9_-]+)"\s*:\s*"([^"]+)"/g;
          let match;
          while ((match = colorRegex.exec(content)) !== null) {
            const tokenName = match[1];
            const parsed = parseColorString(match[2]);
            if (parsed) {
              tokenEntries.push({
                varName: `--color-${tokenName.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
                cssVar: `var(--color-${tokenName.replace(/([A-Z])/g, '-$1').toLowerCase()})`,
                tokenName,
                ...parsed,
              });
            }
          }
        }
      } catch (err) {
        // Fall through gracefully if file can't be parsed
      }
    }
  }

  return tokenEntries;
}

/**
 * Resolve a Figma paint object to a CSS variable or Tailwind class.
 * Context can be "background", "border", or "foreground".
 */
function resolveColor(paint, context = 'background', tokens = []) {
  if (!paint || paint.visible === false) return null;

  if (paint.type !== 'SOLID' || !paint.color) {
    return null;
  }

  const norm = normalizeFigmaColor(paint.color, paint.opacity);
  if (!norm) return null;

  // Check bound variables first if present
  if (paint.boundVariables && paint.boundVariables.color) {
    const bound = paint.boundVariables.color;
    if (bound.name) {
      const varSlug = bound.name.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
      const cssVar = `var(--${varSlug})`;
      if (context === 'background') return `bg-[${cssVar}]`;
      if (context === 'border') return `border-[${cssVar}]`;
      if (context === 'foreground') return `text-[${cssVar}]`;
    }
  }

  // Exact or near matches in tokens list
  let bestToken = null;
  let bestDistance = Infinity;

  for (const t of tokens) {
    const dr = norm.r - t.r;
    const dg = norm.g - t.g;
    const db = norm.b - t.b;
    const da = Math.abs(norm.a - t.a);
    const dist = Math.sqrt(dr * dr + dg * dg + db * db) + da * 100;

    if (dist < 3) {
      // Preference weight if token name matches context
      const matchesContext =
        (context === 'background' && (t.varName.includes('background') || t.varName.includes('bg'))) ||
        (context === 'border' && t.varName.includes('border')) ||
        (context === 'foreground' && (t.varName.includes('foreground') || t.varName.includes('text')));

      const effectiveDist = dist - (matchesContext ? 1.5 : 0);

      if (effectiveDist < bestDistance) {
        bestDistance = effectiveDist;
        bestToken = t;
      }
    }
  }

  if (bestToken) {
    if (context === 'background') {
      if (bestToken.r === 255 && bestToken.g === 255 && bestToken.b === 255 && bestToken.a === 1) {
        return 'bg-white';
      }
      if (bestToken.r === 0 && bestToken.g === 0 && bestToken.b === 0 && bestToken.a === 1) {
        return 'bg-black';
      }
      return `bg-[${bestToken.cssVar}]`;
    }
    if (context === 'border') {
      return `border-[${bestToken.cssVar}]`;
    }
    if (context === 'foreground') {
      if (bestToken.r === 255 && bestToken.g === 255 && bestToken.b === 255 && bestToken.a === 1) {
        return 'text-white';
      }
      if (bestToken.r === 0 && bestToken.g === 0 && bestToken.b === 0 && bestToken.a === 1) {
        return 'text-black';
      }
      return `text-[${bestToken.cssVar}]`;
    }
  }

  // Fallback direct color matching
  if (norm.r === 255 && norm.g === 255 && norm.b === 255 && norm.a === 1) {
    if (context === 'background') return 'bg-white';
    if (context === 'border') return 'border-white';
    if (context === 'foreground') return 'text-white';
  }

  if (norm.r === 0 && norm.g === 0 && norm.b === 0 && norm.a === 1) {
    if (context === 'background') return 'bg-black';
    if (context === 'border') return 'border-black';
    if (context === 'foreground') return 'text-black';
  }

  if (norm.a < 1) {
    const rgbaStr = `rgba(${norm.r},${norm.g},${norm.b},${norm.a})`;
    if (context === 'background') return `bg-[${rgbaStr}]`;
    if (context === 'border') return `border-[${rgbaStr}]`;
    if (context === 'foreground') return `text-[${rgbaStr}]`;
  }

  if (context === 'background') return `bg-[${norm.hex}]`;
  if (context === 'border') return `border-[${norm.hex}]`;
  if (context === 'foreground') return `text-[${norm.hex}]`;

  return null;
}

// ---------------------------------------------------------------------------
// Auto-Layout & Node Style Mapper
// ---------------------------------------------------------------------------

function mapCornerRadius(radius) {
  if (typeof radius !== 'number' || radius <= 0) return null;
  if (radius >= 9999) return 'rounded-full';
  if (radius >= 24) return 'rounded-3xl';
  if (radius >= 16) return 'rounded-2xl';
  if (radius >= 12) return 'rounded-xl';
  if (radius >= 8) return 'rounded-lg';
  if (radius >= 6) return 'rounded-md';
  if (radius >= 4) return 'rounded';
  if (radius >= 2) return 'rounded-sm';
  return `rounded-[${radius}px]`;
}

function mapAutoLayoutToTailwind(node, options = {}) {
  const classes = [];
  const tokens = options.tokens || [];

  // Layout mode
  if (node.layoutMode === 'HORIZONTAL') {
    classes.push('flex', 'flex-row');
  } else if (node.layoutMode === 'VERTICAL') {
    classes.push('flex', 'flex-col');
  }

  // Gap (itemSpacing)
  if (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL') {
    if (typeof node.itemSpacing === 'number') {
      if (node.itemSpacing === 0) {
        classes.push('gap-0');
      } else {
        const gapVal = Math.round(node.itemSpacing / 4);
        classes.push(`gap-${gapVal}`);
      }
    }
  }

  // Padding
  const pt = typeof node.paddingTop === 'number' ? Math.round(node.paddingTop / 4) : 0;
  const pr = typeof node.paddingRight === 'number' ? Math.round(node.paddingRight / 4) : 0;
  const pb = typeof node.paddingBottom === 'number' ? Math.round(node.paddingBottom / 4) : 0;
  const pl = typeof node.paddingLeft === 'number' ? Math.round(node.paddingLeft / 4) : 0;

  if (pt === pr && pr === pb && pb === pl) {
    if (pt > 0) classes.push(`p-${pt}`);
  } else if (pt === pb && pl === pr) {
    if (pl > 0) classes.push(`px-${pl}`);
    if (pt > 0) classes.push(`py-${pt}`);
  } else {
    if (pt > 0) classes.push(`pt-${pt}`);
    if (pr > 0) classes.push(`pr-${pr}`);
    if (pb > 0) classes.push(`pb-${pb}`);
    if (pl > 0) classes.push(`pl-${pl}`);
  }

  // Alignment
  if (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL') {
    switch (node.primaryAxisAlignItems) {
      case 'CENTER':
        classes.push('justify-center');
        break;
      case 'MAX':
        classes.push('justify-end');
        break;
      case 'SPACE_BETWEEN':
        classes.push('justify-between');
        break;
      case 'MIN':
      default:
        break;
    }

    switch (node.counterAxisAlignItems) {
      case 'CENTER':
        classes.push('items-center');
        break;
      case 'MAX':
        classes.push('items-end');
        break;
      case 'BASELINE':
        classes.push('items-baseline');
        break;
      case 'MIN':
      default:
        break;
    }
  }

  // Corner radius
  const roundedClass = mapCornerRadius(node.cornerRadius);
  if (roundedClass) {
    classes.push(roundedClass);
  }

  // Fills (Background)
  if (Array.isArray(node.fills)) {
    const visibleFill = node.fills.find((f) => f.visible !== false);
    if (visibleFill) {
      const bgClass = resolveColor(visibleFill, 'background', tokens);
      if (bgClass) classes.push(bgClass);
    }
  }

  // Strokes (Border)
  if (Array.isArray(node.strokes)) {
    const visibleStroke = node.strokes.find((s) => s.visible !== false);
    if (visibleStroke) {
      const weight = typeof node.strokeWeight === 'number' ? node.strokeWeight : 1;
      if (weight === 1) {
        classes.push('border');
      } else if (weight > 1) {
        classes.push(`border-${weight}`);
      }
      const borderClass = resolveColor(visibleStroke, 'border', tokens);
      if (borderClass) classes.push(borderClass);
    }
  }

  // Effects (Shadows)
  if (Array.isArray(node.effects)) {
    const dropShadow = node.effects.find((e) => e.type === 'DROP_SHADOW' && e.visible !== false);
    if (dropShadow) {
      const radius = dropShadow.radius || 0;
      if (radius <= 3) classes.push('shadow-sm');
      else if (radius <= 6) classes.push('shadow');
      else if (radius <= 12) classes.push('shadow-md');
      else if (radius <= 20) classes.push('shadow-lg');
      else if (radius <= 28) classes.push('shadow-xl');
      else classes.push('shadow-2xl');
    }
  }

  // Sizing
  if (node.layoutSizingHorizontal === 'FILL' || node.layoutAlign === 'STRETCH') {
    classes.push('w-full');
  }
  if (node.layoutGrow === 1) {
    classes.push('flex-1');
  }

  return classes;
}

function mapTextStylesToTailwind(node, options = {}) {
  const classes = [];
  const tokens = options.tokens || [];
  const style = node.style || {};

  // Font size
  const fontSize = style.fontSize || 16;
  if (fontSize <= 12) classes.push('text-xs');
  else if (fontSize <= 14) classes.push('text-sm');
  else if (fontSize <= 16) classes.push('text-base');
  else if (fontSize <= 18) classes.push('text-lg');
  else if (fontSize <= 20) classes.push('text-xl');
  else if (fontSize <= 24) classes.push('text-2xl');
  else if (fontSize <= 30) classes.push('text-3xl');
  else classes.push('text-4xl');

  // Font weight
  const fontWeight = style.fontWeight || 400;
  if (fontWeight >= 800) classes.push('font-extrabold');
  else if (fontWeight >= 700) classes.push('font-bold');
  else if (fontWeight >= 600) classes.push('font-semibold');
  else if (fontWeight >= 500) classes.push('font-medium');
  else classes.push('font-normal');

  // Text alignment
  if (style.textAlignHorizontal === 'CENTER') classes.push('text-center');
  else if (style.textAlignHorizontal === 'RIGHT') classes.push('text-right');
  else if (style.textAlignHorizontal === 'JUSTIFIED') classes.push('text-justify');

  // Text color from fills
  if (Array.isArray(node.fills)) {
    const visibleFill = node.fills.find((f) => f.visible !== false);
    if (visibleFill) {
      const textClass = resolveColor(visibleFill, 'foreground', tokens);
      if (textClass) classes.push(textClass);
    }
  }

  return classes;
}

// ---------------------------------------------------------------------------
// Scene Graph Inspection & Prop Extraction
// ---------------------------------------------------------------------------

function isButtonLikeNode(node) {
  if (!node || !node.name) return false;
  const name = node.name.toLowerCase();
  const validTypes = ['FRAME', 'INSTANCE', 'COMPONENT', 'GROUP', 'COMPONENT_SET'];
  if (!validTypes.includes(node.type)) return false;

  // Container or collection names are not individual buttons
  if (/actions|action-bar|actions-container|button-group|btn-group|buttons|toolbar|footer|header/.test(name)) {
    return false;
  }

  // If node has children that are buttons, this node is an action container, not a button (unless it is a COMPONENT_SET)
  if (node.type !== 'COMPONENT_SET' && Array.isArray(node.children) && node.children.some((c) => isButtonLikeNode(c))) {
    return false;
  }

  return (
    name.includes('button') ||
    name.includes('btn') ||
    name.includes('fab') ||
    name.includes('action') ||
    name.includes('confirm') ||
    name.includes('cancel') ||
    name.includes('cta') ||
    name.includes('submit') ||
    name.includes('dismiss') ||
    name.includes('close') ||
    name.includes('deactivate') ||
    name.includes('delete')
  );
}

function detectButtonAction(node) {
  if (!node || !node.name) return 'click';
  const name = node.name.toLowerCase();
  if (/confirm|accept|submit|save|deactivate|delete|agree|primary-button|btn-primary/.test(name)) {
    return 'confirm';
  }
  if (/cancel|close|dismiss|discard|secondary-button|btn-secondary|btn-cancel/.test(name)) {
    return 'cancel';
  }
  return 'click';
}

/**
 * Normalizes input so root document node is directly accessible.
 */
function normalizeFigmaNode(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('figmaNode must be a valid object');
  }

  if (input.document) {
    const doc = { ...input.document };
    if (!doc.componentPropertyDefinitions && input.componentPropertyDefinitions) {
      doc.componentPropertyDefinitions = input.componentPropertyDefinitions;
    }
    return doc;
  }

  if (input.nodes && typeof input.nodes === 'object') {
    const firstKey = Object.keys(input.nodes)[0];
    if (firstKey && input.nodes[firstKey]) {
      const nodeObj = input.nodes[firstKey];
      const doc = normalizeFigmaNode(nodeObj);
      if (!doc.componentPropertyDefinitions) {
        if (nodeObj.componentSets) {
          const setMeta = nodeObj.componentSets[firstKey] || Object.values(nodeObj.componentSets)[0];
          if (setMeta && setMeta.componentPropertyDefinitions) {
            doc.componentPropertyDefinitions = setMeta.componentPropertyDefinitions;
          }
        }
        if (!doc.componentPropertyDefinitions && nodeObj.components) {
          const compMeta = nodeObj.components[firstKey] || Object.values(nodeObj.components)[0];
          if (compMeta && compMeta.componentPropertyDefinitions) {
            doc.componentPropertyDefinitions = compMeta.componentPropertyDefinitions;
          }
        }
      }
      return doc;
    }
  }

  return input;
}

/**
 * Select the primary/default baseline variant child from a COMPONENT_SET's children.
 * Preference for child whose name contains Default (or Primary / Regular / not disabled / first child).
 */
function selectBaselineVariant(children) {
  if (!Array.isArray(children) || children.length === 0) return null;

  let bestChild = children[0];
  let bestScore = -Infinity;

  for (const child of children) {
    const name = (child.name || '').toLowerCase();
    let score = 0;

    // Heavy penalty for disabled or inactive states
    if (name.includes('disabled')) score -= 100;
    if (name.includes('hover') || name.includes('pressed') || name.includes('focus') || name.includes('active')) score -= 20;

    // Bonus for baseline keywords
    if (name.includes('default')) score += 50;
    if (name.includes('primary')) score += 30;
    if (name.includes('regular') || name.includes('medium') || name.includes('md')) score += 20;
    if (name.includes('normal')) score += 10;

    if (score > bestScore) {
      bestScore = score;
      bestChild = child;
    }
  }

  return bestChild;
}

/**
 * Generate dynamic class expressions for variant properties in a COMPONENT_SET.
 */
function generateVariantClassExpressions(rootNode, baselineNode, options = {}) {
  const defs = rootNode.componentPropertyDefinitions;
  if (!defs) {
    return { variantExpressions: [], hasStyleVariants: false, hasSizeVariants: false };
  }

  const tokens = options.tokens || [];
  const entries = Array.isArray(defs)
    ? defs.map((d) => [d.name || d.codeName, d])
    : Object.entries(defs);

  const expressions = [];
  let hasStyleVariants = false;
  let hasSizeVariants = false;

  for (const [rawKey, def] of entries) {
    const type = def.type ? def.type.toUpperCase() : 'TEXT';
    if (type !== 'VARIANT') continue;

    const withoutId = rawKey.replace(/#.*$/, '').trim();
    const codeName = sanitizePropName(toCamelCase(withoutId));
    const optionsList = def.variantOptions || def.options || [];
    if (!Array.isArray(optionsList) || optionsList.length === 0) continue;

    const defaultValue = def.defaultValue || optionsList[0];
    const nameLower = withoutId.toLowerCase();

    const isStyle =
      /style|variant|color|theme|type/.test(nameLower) ||
      optionsList.some((o) =>
        /primary|secondary|outline|ghost|danger|warning|success|info|neutral/.test(String(o).toLowerCase())
      );
    const isSize =
      /size/.test(nameLower) ||
      optionsList.some((o) => /small|regular|large|sm|md|lg|tiny|huge/.test(String(o).toLowerCase()));

    if (isStyle) hasStyleVariants = true;
    if (isSize) hasSizeVariants = true;

    // Build style map per option
    const optionStyles = {};

    for (const opt of optionsList) {
      const optStr = String(opt);
      let matchedChild = null;

      if (Array.isArray(rootNode.children)) {
        matchedChild = rootNode.children.find((c) => {
          const cName = c.name || '';
          const matchesPropAndVal =
            cName.includes(`${withoutId}=${optStr}`) || cName.includes(`${rawKey}=${optStr}`);
          const matchesVal = cName.includes(optStr);
          const notDisabled = !cName.toLowerCase().includes('disabled');
          return (matchesPropAndVal || matchesVal) && notDisabled;
        });
      }

      if (matchedChild) {
        if (isStyle) {
          const classes = [];
          if (Array.isArray(matchedChild.fills)) {
            const visibleFill = matchedChild.fills.find((f) => f.visible !== false);
            if (visibleFill) {
              const bgClass = resolveColor(visibleFill, 'background', tokens);
              if (bgClass) classes.push(bgClass);
            }
          }
          if (Array.isArray(matchedChild.strokes)) {
            const visibleStroke = matchedChild.strokes.find((s) => s.visible !== false);
            if (visibleStroke) {
              const weight = typeof matchedChild.strokeWeight === 'number' ? matchedChild.strokeWeight : 1;
              classes.push(weight > 1 ? `border-${weight}` : 'border');
              const borderClass = resolveColor(visibleStroke, 'border', tokens);
              if (borderClass) classes.push(borderClass);
            }
          }
          const textChild = Array.isArray(matchedChild.children)
            ? matchedChild.children.find((c) => c.type === 'TEXT')
            : null;
          if (textChild && Array.isArray(textChild.fills)) {
            const textFill = textChild.fills.find((f) => f.visible !== false);
            if (textFill) {
              const textClass = resolveColor(textFill, 'foreground', tokens);
              if (textClass) classes.push(textClass);
            }
          }
          if (classes.length > 0) {
            optionStyles[optStr] = classes.join(' ');
          }
        } else if (isSize) {
          const classes = [];
          const pt = typeof matchedChild.paddingTop === 'number' ? Math.round(matchedChild.paddingTop / 4) : null;
          const pr = typeof matchedChild.paddingRight === 'number' ? Math.round(matchedChild.paddingRight / 4) : null;
          const pb = typeof matchedChild.paddingBottom === 'number' ? Math.round(matchedChild.paddingBottom / 4) : null;
          const pl = typeof matchedChild.paddingLeft === 'number' ? Math.round(matchedChild.paddingLeft / 4) : null;

          if (pt !== null && pr !== null && pb !== null && pl !== null) {
            if (pt === pr && pr === pb && pb === pl && pt > 0) {
              classes.push(`p-${pt}`);
            } else if (pt === pb && pl === pr) {
              if (pl > 0) classes.push(`px-${pl}`);
              if (pt > 0) classes.push(`py-${pt}`);
            }
          }
          const textChild = Array.isArray(matchedChild.children)
            ? matchedChild.children.find((c) => c.type === 'TEXT')
            : null;
          if (textChild && textChild.style) {
            const textClasses = mapTextStylesToTailwind(textChild, { tokens });
            const sizeClass = textClasses.find((c) => c.startsWith('text-'));
            if (sizeClass) classes.push(sizeClass);
          }
          if (classes.length > 0) {
            optionStyles[optStr] = classes.join(' ');
          }
        }
      }

      // Fallback heuristics if no explicit styles found
      if (!optionStyles[optStr]) {
        const lowerOpt = optStr.toLowerCase();
        if (isStyle) {
          if (lowerOpt === 'primary') {
            optionStyles[optStr] = 'bg-[var(--color-background-primary)] text-white';
          } else if (lowerOpt === 'secondary') {
            optionStyles[optStr] = 'bg-[var(--color-background-secondary)] text-[var(--color-foreground-neutral)]';
          } else if (lowerOpt === 'outline') {
            optionStyles[optStr] = 'border border-[var(--color-border-neutral)] bg-transparent text-[var(--color-foreground-neutral)]';
          } else if (lowerOpt === 'ghost') {
            optionStyles[optStr] = 'bg-transparent text-[var(--color-foreground-neutral)]';
          } else if (lowerOpt === 'danger' || lowerOpt === 'destructive') {
            optionStyles[optStr] = 'bg-red-600 text-white';
          } else if (lowerOpt === 'warning') {
            optionStyles[optStr] = 'bg-yellow-500 text-black';
          } else if (lowerOpt === 'success') {
            optionStyles[optStr] = 'bg-green-600 text-white';
          }
        } else if (isSize) {
          if (lowerOpt === 'small' || lowerOpt === 'sm') {
            optionStyles[optStr] = 'px-3 py-1.5 text-xs';
          } else if (lowerOpt === 'large' || lowerOpt === 'lg') {
            optionStyles[optStr] = 'px-6 py-3 text-lg';
          } else if (lowerOpt === 'regular' || lowerOpt === 'medium' || lowerOpt === 'md') {
            optionStyles[optStr] = 'px-4 py-2 text-sm';
          }
        }
      }
    }

    // Build the ternary chain
    const nonDefault = optionsList.filter((o) => String(o) !== String(defaultValue));
    const defaultVal = optionStyles[String(defaultValue)] || '';

    if (nonDefault.length > 0 && Object.keys(optionStyles).length > 0) {
      let expr = '';
      for (const opt of nonDefault) {
        const val = optionStyles[String(opt)] || '';
        if (val) {
          expr += `props.${codeName} === '${opt}' ? '${val}' : `;
        }
      }
      if (expr.length > 0) {
        expr += `'${defaultVal}'`;
        expressions.push(`(${expr})`);
      }
    }
  }

  return {
    variantExpressions: expressions,
    hasStyleVariants,
    hasSizeVariants,
  };
}

/**
 * Extract component properties, variants, booleans, and events from node scene graph.
 */
function extractComponentProperties(rootNode) {
  const propsMap = new Map();

  // 1. Parse componentPropertyDefinitions if present
  const rawDefs = rootNode.componentPropertyDefinitions;
  if (rawDefs) {
    const processDef = (rawKey, def) => {
      const withoutId = (rawKey || '').replace(/#.*$/, '').trim();
      const codeName = sanitizePropName(toCamelCase(withoutId));
      if (!codeName) return;
      const type = def.type ? def.type.toUpperCase() : 'TEXT';
      let tsType = 'string';
      if (type === 'VARIANT') {
        const opts = def.variantOptions || def.options;
        const isBooleanVariant =
          Array.isArray(opts) &&
          opts.length === 2 &&
          opts.map((o) => String(o).toLowerCase()).sort().join(',') === 'false,true';
        if (isBooleanVariant || codeName.toLowerCase() === 'disabled') {
          tsType = 'boolean';
        } else {
          tsType = Array.isArray(opts) && opts.length > 0 ? opts.map((o) => JSON.stringify(o)).join(' | ') : 'string';
        }
      } else if (type === 'BOOLEAN') {
        tsType = 'boolean';
      } else if (type === 'TEXT') {
        tsType = 'string';
      } else {
        tsType = 'any';
      }
      propsMap.set(codeName, {
        name: codeName,
        rawKey,
        type,
        tsType,
        defaultValue: def.defaultValue,
      });

      // Also register PascalCase alias if raw key was PascalCase (e.g. Style, Size)
      const sanitizedRaw = withoutId.replace(/[^a-zA-Z0-9_]/g, '');
      if (sanitizedRaw && sanitizedRaw !== codeName && /^[A-Z]/.test(sanitizedRaw)) {
        propsMap.set(sanitizedRaw, {
          name: sanitizedRaw,
          rawKey,
          type,
          tsType,
          defaultValue: def.defaultValue,
        });
      }
    };

    if (Array.isArray(rawDefs)) {
      for (const def of rawDefs) {
        processDef(def.name || def.codeName, def);
      }
    } else if (typeof rawDefs === 'object') {
      for (const [rawKey, def] of Object.entries(rawDefs)) {
        processDef(rawKey, def);
      }
    }
  }

  // 2. Scan tree for interactive buttons and visibility toggles
  function scanNode(node) {
    if (!node) return;

    // Check visible binding
    if (node.componentPropertyReferences && node.componentPropertyReferences.visible) {
      const visProp = cleanPropKey(node.componentPropertyReferences.visible);
      if (visProp && !propsMap.has(visProp)) {
        propsMap.set(visProp, {
          name: visProp,
          type: 'BOOLEAN',
          tsType: 'boolean',
          defaultValue: true,
        });
      }
    }

    // Check characters binding
    if (node.componentPropertyReferences && node.componentPropertyReferences.characters) {
      const textProp = cleanPropKey(node.componentPropertyReferences.characters);
      if (textProp && !propsMap.has(textProp)) {
        propsMap.set(textProp, {
          name: textProp,
          type: 'TEXT',
          tsType: 'string',
          defaultValue: node.characters || '',
        });
      }
    }

    // Check button actions
    if (isButtonLikeNode(node)) {
      const action = detectButtonAction(node);
      if (action === 'confirm') {
        if (!propsMap.has('onConfirm')) {
          propsMap.set('onConfirm', { name: 'onConfirm', type: 'EVENT', tsType: '() => void' });
        }
        if (!propsMap.has('confirmText')) {
          propsMap.set('confirmText', { name: 'confirmText', type: 'TEXT', tsType: 'string', defaultValue: 'Confirm' });
        }
      } else if (action === 'cancel') {
        if (!propsMap.has('onCancel')) {
          propsMap.set('onCancel', { name: 'onCancel', type: 'EVENT', tsType: '() => void' });
        }
        if (!propsMap.has('cancelText')) {
          propsMap.set('cancelText', { name: 'cancelText', type: 'TEXT', tsType: 'string', defaultValue: 'Cancel' });
        }
      } else {
        if (!propsMap.has('onClick')) {
          propsMap.set('onClick', { name: 'onClick', type: 'EVENT', tsType: '(event?: any) => void' });
        }
      }
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        scanNode(child);
      }
    }
  }

  scanNode(rootNode);

  // Standard props
  if (!propsMap.has('children')) {
    propsMap.set('children', { name: 'children', type: 'STANDARD', tsType: 'any' });
  }
  if (!propsMap.has('className')) {
    propsMap.set('className', { name: 'className', type: 'STANDARD', tsType: 'string' });
  }

  return propsMap;
}

// ---------------------------------------------------------------------------
// JSX Generator
// ---------------------------------------------------------------------------

function renderSceneNode(node, depth, context) {
  const indent = '  '.repeat(depth);
  const childIndent = '  '.repeat(depth + 1);
  const { propsMap, tokens, isRoot } = context;

  // Visibility toggle condition
  let visibilityCondition = null;
  if (node.componentPropertyReferences && node.componentPropertyReferences.visible) {
    const propKey = cleanPropKey(node.componentPropertyReferences.visible);
    const propDef = propsMap.get(propKey);
    if (propDef && propDef.defaultValue === false) {
      visibilityCondition = `props.${propKey}`;
    } else {
      visibilityCondition = `props.${propKey} !== false`;
    }
  }

  let elementJsx = '';

  // 1. Text Node
  if (node.type === 'TEXT') {
    const textClasses = mapTextStylesToTailwind(node, { tokens });
    const classAttr = textClasses.length > 0 ? ` className="${textClasses.join(' ')}"` : '';

    const fontSize = node.style?.fontSize || 16;
    const nameLower = (node.name || '').toLowerCase();
    let tag = 'p';
    if (nameLower.includes('icon') || (node.characters && node.characters.trim().length <= 2)) {
      tag = 'span';
    } else if (fontSize >= 24 || nameLower.includes('heading1') || nameLower.includes('title1')) {
      tag = 'h2';
    } else if (fontSize >= 18 || nameLower.includes('heading') || nameLower.includes('title')) {
      tag = 'h3';
    }

    // Determine prop binding for characters
    let boundProp = null;
    if (node.componentPropertyReferences && node.componentPropertyReferences.characters) {
      boundProp = cleanPropKey(node.componentPropertyReferences.characters);
    } else {
      // Fuzzy match by name
      const camel = toCamelCase(node.name);
      if (propsMap.has(camel) && propsMap.get(camel).type === 'TEXT') {
        boundProp = camel;
      }
    }

    const defaultText = (node.characters || '').trim();
    let content = '';
    if (boundProp) {
      content = `{props.${boundProp} || ${JSON.stringify(defaultText)}}`;
    } else if (defaultText.length > 0) {
      content = JSON.stringify(defaultText).slice(1, -1);
    }

    elementJsx = `${indent}<${tag}${classAttr}>${content}</${tag}>`;
  }
  // 2. Button / Interactive Node
  else if (isButtonLikeNode(node)) {
    if (isRoot) {
      let buttonClasses = mapAutoLayoutToTailwind(node, { tokens });

      // If variant style expressions exist, filter out fills and strokes from static classes
      if (context.hasStyleVariants) {
        buttonClasses = buttonClasses.filter(
          (c) => !c.startsWith('bg-') && !c.startsWith('text-') && !c.startsWith('border')
        );
      }
      // If variant size expressions exist, filter out padding and text size from static classes
      if (context.hasSizeVariants) {
        buttonClasses = buttonClasses.filter(
          (c) =>
            !c.startsWith('p-') &&
            !c.startsWith('px-') &&
            !c.startsWith('py-') &&
            !c.startsWith('pt-') &&
            !c.startsWith('pb-') &&
            !c.startsWith('pl-') &&
            !c.startsWith('pr-') &&
            !c.startsWith('text-')
        );
      }

      buttonClasses.push('cursor-pointer', 'transition-colors', 'focus:outline-none');
      const staticClasses = buttonClasses.join(' ');

      let classAttr = '';
      const variantExprs = context.variantExpressions || [];

      if (variantExprs.length > 0) {
        classAttr = ` className={"${staticClasses} " + ${variantExprs.join(' + " " + ')} + (props.className ? " " + props.className : "")}`;
      } else if (staticClasses.length > 0) {
        classAttr = ` className={"${staticClasses}" + (props.className ? " " + props.className : "")}`;
      }

      const nonTextChildren = Array.isArray(node.children) ? node.children.filter((c) => c.type !== 'TEXT') : [];

      if (nonTextChildren.length === 0) {
        elementJsx = `${indent}<button onClick={(e) => props.onClick?.(e)} disabled={props.disabled || props.state === 'Disabled'}${classAttr}>\n${childIndent}{props.label || props.children || 'Button'}\n${indent}</button>`;
      } else {
        const renderedChildren = [];
        let textRendered = false;
        for (const child of node.children) {
          if (child.type === 'TEXT') {
            renderedChildren.push(`${childIndent}{props.label || props.children || 'Button'}`);
            textRendered = true;
          } else {
            renderedChildren.push(renderSceneNode(child, depth + 1, { ...context, isRoot: false }));
          }
        }
        if (!textRendered) {
          renderedChildren.push(`${childIndent}{props.label || props.children || 'Button'}`);
        }
        elementJsx = `${indent}<button onClick={(e) => props.onClick?.(e)} disabled={props.disabled || props.state === 'Disabled'}${classAttr}>\n${renderedChildren.join('\n')}\n${indent}</button>`;
      }
    } else {
      const action = detectButtonAction(node);
      let onClickHandler = '() => props.onClick?.()';
      let textProp = null;

      if (action === 'confirm') {
        onClickHandler = '() => props.onConfirm?.()';
        textProp = 'confirmText';
      } else if (action === 'cancel') {
        onClickHandler = '() => props.onCancel?.()';
        textProp = 'cancelText';
      }

      const buttonClasses = mapAutoLayoutToTailwind(node, { tokens });

      // Check children for button text
      const textChildren = Array.isArray(node.children) ? node.children.filter((c) => c.type === 'TEXT') : [];
      if (textChildren.length === 1 && node.children.length === 1) {
        const childTextClasses = mapTextStylesToTailwind(textChildren[0], { tokens });
        buttonClasses.push(...childTextClasses);
      }

      buttonClasses.push('cursor-pointer', 'transition-colors', 'focus:outline-none');
      const classAttr = buttonClasses.length > 0 ? ` className="${buttonClasses.join(' ')}"` : '';

      if (textChildren.length === 1 && node.children.length === 1) {
        const defaultText = textChildren[0].characters || (action === 'confirm' ? 'Confirm' : 'Cancel');
        const textExpression = textProp
          ? `{props.${textProp} || ${JSON.stringify(defaultText)}}`
          : `{${JSON.stringify(defaultText)}}`;
        elementJsx = `${indent}<button onClick={${onClickHandler}}${classAttr}>\n${childIndent}${textExpression}\n${indent}</button>`;
      } else if (Array.isArray(node.children) && node.children.length > 0) {
        const renderedChildren = node.children
          .map((child) => renderSceneNode(child, depth + 1, { ...context, isRoot: false }))
          .filter(Boolean)
          .join('\n');
        elementJsx = `${indent}<button onClick={${onClickHandler}}${classAttr}>\n${renderedChildren}\n${indent}</button>`;
      } else {
        const fallbackText = action === 'confirm' ? 'Confirm' : action === 'cancel' ? 'Cancel' : 'Button';
        const textExpression = textProp
          ? `{props.${textProp} || ${JSON.stringify(fallbackText)}}`
          : `{${JSON.stringify(fallbackText)}}`;
        elementJsx = `${indent}<button onClick={${onClickHandler}}${classAttr}>\n${childIndent}${textExpression}\n${indent}</button>`;
      }
    }
  }
  // 3. Container / Frame Node
  else {
    let containerClasses = mapAutoLayoutToTailwind(node, { tokens });

    if (isRoot && context.hasStyleVariants) {
      containerClasses = containerClasses.filter(
        (c) => !c.startsWith('bg-') && !c.startsWith('text-') && !c.startsWith('border')
      );
    }
    if (isRoot && context.hasSizeVariants) {
      containerClasses = containerClasses.filter(
        (c) =>
          !c.startsWith('p-') &&
          !c.startsWith('px-') &&
          !c.startsWith('py-') &&
          !c.startsWith('pt-') &&
          !c.startsWith('pb-') &&
          !c.startsWith('pl-') &&
          !c.startsWith('pr-') &&
          !c.startsWith('text-')
      );
    }

    const staticClasses = containerClasses.join(' ');
    const variantExprs = isRoot ? (context.variantExpressions || []) : [];

    let classAttr = '';
    if (isRoot) {
      if (variantExprs.length > 0) {
        classAttr = ` className={"${staticClasses} " + ${variantExprs.join(' + " " + ')} + (props.className ? " " + props.className : "")}`;
      } else {
        classAttr = ` className={"${staticClasses}" + (props.className ? " " + props.className : "")}`;
      }
    } else if (staticClasses.length > 0) {
      classAttr = ` className="${staticClasses}"`;
    }

    const hasChildren = Array.isArray(node.children) && node.children.length > 0;

    if (!hasChildren && !isRoot) {
      elementJsx = `${indent}<div${classAttr} />`;
    } else {
      const renderedChildren = (node.children || [])
        .map((child) => renderSceneNode(child, depth + 1, { ...context, isRoot: false }))
        .filter(Boolean);

      if (isRoot) {
        renderedChildren.push(`${childIndent}{props.children}`);
      }

      const childrenBlock = renderedChildren.join('\n');
      elementJsx = `${indent}<div${classAttr}>\n${childrenBlock}\n${indent}</div>`;
    }
  }

  // Wrap with visibility toggle if conditional
  if (visibilityCondition) {
    const indentedJsx = elementJsx
      .split('\n')
      .map((line) => (line.length > 0 ? `  ${line}` : line))
      .join('\n');
    return `${indent}{${visibilityCondition} && (\n${indentedJsx}\n${indent})}`;
  }

  return elementJsx;
}

// ---------------------------------------------------------------------------
// Main Transpiler Function
// ---------------------------------------------------------------------------

/**
 * Transpile a Figma component scene graph node into idiomatic Mitosis JSX (.lite.tsx).
 *
 * @param {object} figmaNode - Raw Figma component node or full API response
 * @param {object} [options] - Transpilation options: { componentName, tokens }
 * @returns {string} Emitted .lite.tsx component source code
 */
function transpileFigmaNodeToMitosis(figmaNode, options = {}) {
  const rootNode = normalizeFigmaNode(figmaNode);
  if (!rootNode) {
    throw new Error('Invalid or empty Figma node provided for transpilation.');
  }

  const componentName = options.componentName
    ? toPascalCase(options.componentName)
    : toPascalCase(rootNode.name || 'FigmaComponent');

  const tokens = options.tokens || loadTokens();

  // COMPONENT_SET handling
  const isComponentSet = rootNode.type === 'COMPONENT_SET';
  let effectiveNode = rootNode;
  let variantInfo = { variantExpressions: [], hasStyleVariants: false, hasSizeVariants: false };

  if (isComponentSet) {
    const baselineChild = selectBaselineVariant(rootNode.children);
    if (baselineChild) {
      effectiveNode = {
        ...baselineChild,
        id: rootNode.id,
        name: rootNode.name,
        type: rootNode.type,
        componentPropertyDefinitions:
          rootNode.componentPropertyDefinitions || baselineChild.componentPropertyDefinitions,
        children: baselineChild.children || [],
      };
    }
    variantInfo = generateVariantClassExpressions(rootNode, effectiveNode, { tokens });
  }

  const propsMap = extractComponentProperties(effectiveNode);

  // If button-like component set or button root, ensure standard button props
  if (isButtonLikeNode(effectiveNode)) {
    if (!propsMap.has('onClick')) {
      propsMap.set('onClick', { name: 'onClick', type: 'EVENT', tsType: '(event?: any) => void' });
    }
    const existingDisabled = propsMap.get('disabled');
    if (!existingDisabled || existingDisabled.tsType !== 'boolean') {
      propsMap.set('disabled', { name: 'disabled', type: 'BOOLEAN', tsType: 'boolean' });
    }
    if (!propsMap.has('label')) {
      propsMap.set('label', { name: 'label', type: 'TEXT', tsType: 'string' });
    }
    if (!propsMap.has('state')) {
      propsMap.set('state', { name: 'state', type: 'TEXT', tsType: 'string' });
    } else {
      const stateProp = propsMap.get('state');
      if (stateProp.tsType && stateProp.tsType !== 'string' && !stateProp.tsType.toLowerCase().includes('disabled')) {
        stateProp.tsType += ' | "Disabled"';
      }
      const pascalStateProp = propsMap.get('State');
      if (pascalStateProp && pascalStateProp.tsType && pascalStateProp.tsType !== 'string' && !pascalStateProp.tsType.toLowerCase().includes('disabled')) {
        pascalStateProp.tsType += ' | "Disabled"';
      }
    }
  }

  // Generate TypeScript interface
  const propsInterfaceLines = [`export interface ${componentName}Props {`];
  for (const [, prop] of propsMap.entries()) {
    propsInterfaceLines.push(`  ${prop.name}?: ${prop.tsType};`);
  }
  propsInterfaceLines.push('}');
  const propsInterfaceCode = propsInterfaceLines.join('\n');

  // Render JSX tree
  const jsxTree = renderSceneNode(effectiveNode, 2, {
    propsMap,
    tokens,
    isRoot: true,
    variantExpressions: variantInfo.variantExpressions,
    hasStyleVariants: variantInfo.hasStyleVariants,
    hasSizeVariants: variantInfo.hasSizeVariants,
  });

  // Construct complete Mitosis component file
  const code = `import { useStore } from '@builder.io/mitosis';

${propsInterfaceCode}

export default function ${componentName}(props: ${componentName}Props) {
  const state = useStore({});

  return (
${jsxTree}
  );
}
`;

  return code;
}

// ---------------------------------------------------------------------------
// Figma REST API Fetcher
// ---------------------------------------------------------------------------

/**
 * Fetch a component scene node from the Figma REST API.
 *
 * @param {string} fileId - Figma file ID
 * @param {string} nodeId - Figma node ID (e.g. "123:456" or "123-456")
 * @param {string} accessToken - Figma personal access token
 * @returns {Promise<object>} Figma document node
 */
async function fetchFigmaNode(fileId, nodeId, accessToken) {
  if (!fileId || typeof fileId !== 'string') {
    throw new Error('Figma fileId is required.');
  }
  if (!nodeId || typeof nodeId !== 'string') {
    throw new Error('Figma nodeId is required.');
  }

  const token = accessToken || process.env.FIGMA_ACCESS_TOKEN;
  if (!token || typeof token !== 'string') {
    throw new Error('Figma access token is required (pass via argument, --token, or FIGMA_ACCESS_TOKEN env var).');
  }

  const encodedFile = encodeURIComponent(fileId);
  const encodedNode = encodeURIComponent(nodeId);
  const url = `https://api.figma.com/v1/files/${encodedFile}/nodes?ids=${encodedNode}`;

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Figma-Token': token,
      },
    });
  } catch (err) {
    throw new Error(`Failed to connect to Figma API: ${err.message}`);
  }

  if (response.status === 403) {
    throw new Error(`Invalid or unauthorized Figma access token (HTTP 403) for file "${fileId}".`);
  }
  if (response.status === 404) {
    throw new Error(`Figma file "${fileId}" not found (HTTP 404).`);
  }
  if (response.status === 429) {
    throw new Error(`Figma API rate limit exceeded (HTTP 429). Please retry later.`);
  }
  if (!response.ok) {
    throw new Error(`Figma API request failed with HTTP ${response.status}: ${response.statusText}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error(`Failed to parse Figma API response as JSON: ${err.message}`);
  }

  if (data.err || data.status) {
    throw new Error(`Figma API error: ${data.err || data.message || JSON.stringify(data)}`);
  }

  const nodes = data.nodes || {};
  const targetNode =
    nodes[nodeId] ||
    nodes[decodeURIComponent(nodeId)] ||
    nodes[encodeURIComponent(nodeId)] ||
    nodes[nodeId.replace(':', '-')] ||
    Object.values(nodes)[0];

  if (!targetNode || !targetNode.document) {
    throw new Error(`Figma node "${nodeId}" not found in file "${fileId}".`);
  }

  const documentNode = targetNode.document;

  // Enrich with component metadata if available
  if (!documentNode.componentPropertyDefinitions) {
    if (targetNode.componentSets) {
      const setMeta = targetNode.componentSets[nodeId] || Object.values(targetNode.componentSets)[0];
      if (setMeta && setMeta.componentPropertyDefinitions) {
        documentNode.componentPropertyDefinitions = setMeta.componentPropertyDefinitions;
      }
    }
    if (!documentNode.componentPropertyDefinitions && targetNode.components) {
      const compMeta = targetNode.components[nodeId] || Object.values(targetNode.components)[0];
      if (compMeta && compMeta.componentPropertyDefinitions) {
        documentNode.componentPropertyDefinitions = compMeta.componentPropertyDefinitions;
      }
    }
  }

  return documentNode;
}

/**
 * Fetch multiple component scene nodes from the Figma REST API in batched chunks.
 *
 * @param {string} fileId - Figma file ID
 * @param {string[]} nodeIds - Array of Figma node IDs (e.g. ["123:456", "123:789"])
 * @param {string} [accessToken] - Figma personal access token
 * @param {number} [chunkSize=50] - Number of node IDs to fetch per request (default: 50)
 * @returns {Promise<Record<string, object>>} Merged dictionary mapping nodeId to Figma node object
 */
async function fetchFigmaNodesBatch(fileId, nodeIds, accessToken, chunkSize = 50) {
  if (!fileId || typeof fileId !== 'string') {
    throw new Error('Figma fileId is required.');
  }
  if (!Array.isArray(nodeIds) || nodeIds.length === 0) {
    return {};
  }

  const token = accessToken || process.env.FIGMA_ACCESS_TOKEN;
  if (!token || typeof token !== 'string') {
    throw new Error('Figma access token is required (pass via argument, --token, or FIGMA_ACCESS_TOKEN env var).');
  }

  const size = typeof chunkSize === 'number' && chunkSize > 0 ? chunkSize : 50;
  const uniqueNodeIds = [...new Set(nodeIds.filter(Boolean))];
  if (uniqueNodeIds.length === 0) {
    return {};
  }

  const chunks = [];
  for (let i = 0; i < uniqueNodeIds.length; i += size) {
    chunks.push(uniqueNodeIds.slice(i, i + size));
  }

  const allNodes = {};

  for (const chunk of chunks) {
    const encodedFile = encodeURIComponent(fileId);
    const encodedIds = encodeURIComponent(chunk.join(','));
    const url = `https://api.figma.com/v1/files/${encodedFile}/nodes?ids=${encodedIds}`;

    let response;
    const maxRetries = 3;
    let delay = 1000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-Figma-Token': token,
          },
        });
      } catch (err) {
        if (attempt === maxRetries) {
          throw new Error(`Failed to connect to Figma API: ${err.message}`);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }

      if (response.status === 429) {
        if (attempt < maxRetries) {
          const retryAfter =
            response.headers && typeof response.headers.get === 'function'
              ? response.headers.get('Retry-After')
              : null;
          const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : delay;
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          delay *= 2;
          continue;
        } else {
          throw new Error('Figma API rate limit exceeded (HTTP 429). Please retry later.');
        }
      }

      if (response.status === 403) {
        throw new Error(`Invalid or unauthorized Figma access token (HTTP 403) for file "${fileId}".`);
      }
      if (response.status === 404) {
        throw new Error(`Figma file "${fileId}" not found (HTTP 404).`);
      }
      if (!response.ok) {
        throw new Error(`Figma API request failed with HTTP ${response.status}: ${response.statusText}`);
      }

      break;
    }

    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error(`Failed to parse Figma API response as JSON: ${err.message}`);
    }

    if (data.err || data.status) {
      throw new Error(`Figma API error: ${data.err || data.message || JSON.stringify(data)}`);
    }

    if (data.nodes && typeof data.nodes === 'object') {
      Object.assign(allNodes, data.nodes);
    }
  }

  return allNodes;
}

// ---------------------------------------------------------------------------
// CLI Argument Parser & Runner
// ---------------------------------------------------------------------------

function parseArgs(args) {
  const result = {
    file: null,
    node: null,
    token: null,
    out: null,
    fixture: null,
    name: null,
    tokens: null,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg.startsWith('--file=')) {
      result.file = arg.slice(7);
    } else if (arg === '--file' || arg === '-f') {
      result.file = args[++i];
    } else if (arg.startsWith('--node=')) {
      result.node = arg.slice(7);
    } else if (arg === '--node' || arg === '-n') {
      result.node = args[++i];
    } else if (arg.startsWith('--token=')) {
      result.token = arg.slice(8);
    } else if (arg === '--token' || arg === '-t') {
      result.token = args[++i];
    } else if (arg.startsWith('--out=')) {
      result.out = arg.slice(6);
    } else if (arg === '--out' || arg === '-o') {
      result.out = args[++i];
    } else if (arg.startsWith('--fixture=')) {
      result.fixture = arg.slice(10);
    } else if (arg === '--fixture') {
      result.fixture = args[++i];
    } else if (arg.startsWith('--name=')) {
      result.name = arg.slice(7);
    } else if (arg === '--name') {
      result.name = args[++i];
    } else if (arg.startsWith('--tokens=')) {
      result.tokens = arg.slice(9);
    } else if (arg === '--tokens') {
      result.tokens = args[++i];
    }
  }

  return result;
}

function printHelp() {
  console.log(`
Supernova Figma to Mitosis Transpiler

Usage:
  node scripts/figma-to-mitosis.js [options]

Options:
  --file, -f       Figma file ID
  --node, -n       Figma node ID
  --token, -t      Figma personal access token (or set FIGMA_ACCESS_TOKEN env var)
  --out, -o        Output path for the generated .lite.tsx file
  --fixture        Path to a local Figma node JSON fixture (bypasses Figma API)
  --name           Override component name (e.g. AlertDialog)
  --tokens         Path to custom design tokens file (tokens.css or tokens.ts)
  --help, -h       Display this help message

Examples:
  # Using local fixture
  node scripts/figma-to-mitosis.js --fixture=scripts/fixtures/alert-dialog.figma.json --out=output/components/AlertDialog.lite.tsx

  # Using Figma REST API
  node scripts/figma-to-mitosis.js --file=ABC123xyz --node=101:200 --out=output/components/MyComp.lite.tsx
`);
}

async function runCli() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  let figmaNode;
  const tokens = loadTokens(args.tokens);

  if (args.fixture) {
    const fixturePath = path.resolve(process.cwd(), args.fixture);
    if (!fs.existsSync(fixturePath)) {
      throw new Error(`Fixture file not found: ${fixturePath}`);
    }
    const rawContent = fs.readFileSync(fixturePath, 'utf8');
    figmaNode = JSON.parse(rawContent);
  } else if (args.file && args.node) {
    const token = args.token || process.env.FIGMA_ACCESS_TOKEN;
    if (!token) {
      throw new Error('FIGMA_ACCESS_TOKEN is required (pass via --token or set FIGMA_ACCESS_TOKEN env var).');
    }
    console.log(`Fetching Figma node "${args.node}" from file "${args.file}"...`);
    figmaNode = await fetchFigmaNode(args.file, args.node, token);
  } else {
    printHelp();
    throw new Error('Either --fixture or both --file and --node are required.');
  }

  const code = transpileFigmaNodeToMitosis(figmaNode, {
    componentName: args.name,
    tokens,
  });

  if (args.out) {
    const outPath = path.resolve(process.cwd(), args.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, code, 'utf8');
    console.log(`✓ Mitosis component written to ${outPath}`);
  } else {
    console.log(code);
  }
}

// ---------------------------------------------------------------------------
// Exports & Entrypoint
// ---------------------------------------------------------------------------

module.exports = {
  fetchFigmaNode,
  fetchFigmaNodesBatch,
  transpileFigmaNodeToMitosis,
  extractComponentProperties,
  selectBaselineVariant,
  generateVariantClassExpressions,
  mapAutoLayoutToTailwind,
  mapTextStylesToTailwind,
  loadTokens,
  resolveColor,
  parseArgs,
  loadEnvFile,
};

if (require.main === module) {
  runCli().catch((err) => {
    console.error(`[figma-to-mitosis] ERROR: ${err.message}`);
    process.exit(1);
  });
}
