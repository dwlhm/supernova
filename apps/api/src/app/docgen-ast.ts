import * as ts from 'typescript';

export interface ExtractedPropMeta {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
}

export interface RegistryComponentMeta {
  name: string;
  group: string;
  variants: Record<string, string[]>;
  booleans: string[];
  totalVariants: number;
}

const REGISTRY_BOOLEAN_PROP_RE =
  /^(show[A-Z]|disabled$|active$|checked$|expanded$|open$|pressed$|destructive$|indeterminate$|area$|required$)/;

export function extractPropsFromLiteSource(sourceCode?: string): ExtractedPropMeta[] {
  if (!sourceCode || !sourceCode.trim()) return [];
  const sf = ts.createSourceFile(
    'Component.lite.tsx',
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  const defaultMap = new Map<string, string>();
  const props: ExtractedPropMeta[] = [];

  const visitDefaults = (node: ts.Node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'useDefaultProps' &&
      node.arguments.length > 0 &&
      ts.isObjectLiteralExpression(node.arguments[0]!)
    ) {
      for (const prop of node.arguments[0]!.properties) {
        if (ts.isPropertyAssignment(prop) && prop.name) {
          const key = prop.name.getText(sf).replace(/^['"]|['"]$/g, '');
          const valText = prop.initializer.getText(sf).trim();
          defaultMap.set(key, valText);
        }
      }
    }
    ts.forEachChild(node, visitDefaults);
  };
  visitDefaults(sf);

  for (const stmt of sf.statements) {
    if (ts.isInterfaceDeclaration(stmt) && stmt.name.text.endsWith('Props')) {
      for (const member of stmt.members) {
        if (ts.isPropertySignature(member) && member.name) {
          const name = member.name.getText(sf).replace(/^['"]|['"]$/g, '');
          const rawType = member.type ? member.type.getText(sf).replace(/\s+/g, ' ').trim() : 'any';
          const typeText = name === 'children' && rawType === 'any' ? 'ReactNode | Slot | ng-content' : rawType;
          const required = !member.questionToken;
          props.push({
            name,
            type: typeText,
            required,
            defaultValue: defaultMap.get(name),
          });
        }
      }
      break;
    }
  }

  return props;
}

export function extractRegistryMetaFromLiteSource(
  name: string,
  group: string,
  sourceCode?: string
): RegistryComponentMeta {
  const variants: Record<string, string[]> = {};
  const booleans: string[] = [];
  let hasErrorMessageProp = false;

  for (const prop of extractPropsFromLiteSource(sourceCode)) {
    if (prop.name === 'target' || prop.name === 'role' || prop.name === 'ariaHidden') continue;
    if (prop.name === 'errorMessage') hasErrorMessageProp = true;
    if (prop.type === 'boolean') {
      if (REGISTRY_BOOLEAN_PROP_RE.test(prop.name)) booleans.push(prop.name);
    } else if (prop.type.includes("'") || prop.type.includes('"')) {
      const unionParts = prop.type
        .split('|')
        .map((p) => p.trim())
        .filter((p) => /^['"][^'"]+['"]$/.test(p))
        .map((p) => p.slice(1, -1));
      if (unionParts.length >= 2) variants[prop.name] = unionParts;
    }
  }

  if (hasErrorMessageProp) {
    variants.previewState = ['default', 'filled', 'focus', 'error', 'disabled'];
  }
  const counts = Object.values(variants).map((v) => v.length);
  const totalVariants = counts.length > 0 ? counts.reduce((acc, c) => acc * c, 1) : 0;
  return { name, group, variants, booleans, totalVariants };
}

function sanitizeFigmaSentence(text: string): string {
  return text
    .replace(/,\s*up to ten columns(?:\s+and ten rows)?/gi, '')
    .replace(/\bSelect the Type variant based on meaning/gi, 'Compose semantic child components or pass cell values based on meaning')
    .replace(/\bUse Slot only when none of the standard variants fit\.?/gi, 'Pass custom child components via children/slots when needed.')
    .trim();
}

export function formatDescriptionSections(rawDescription?: string): string {
  const withoutProps = (rawDescription || '').split(/\r?\n\s*PROPERTIES:?\s*\r?\n/i)[0] || '';
  const desc = sanitizeFigmaSentence(withoutProps)
    .replace(/^Description:?\s*\r?\n+/i, '')
    .replace(/\r?\n+Variant(s)?:?\s*\r?\n+/gi, '\n\n### Variants\n\n');
  if (!desc) return '';

  const whenMatch = desc.match(/WHEN TO USE:?\s*([\s\S]*?)(?=USAGE GUIDELINES:?|PROPERTIES:?|VISUAL ANATOMY|$)/i);
  const guideMatch = desc.match(/USAGE GUIDELINES:?\s*([\s\S]*?)(?=PROPERTIES:?|VISUAL ANATOMY|$)/i);

  if (!whenMatch && !guideMatch) {
    return `${desc}\n\n`;
  }

  const lines: string[] = [];
  const intro = desc.split(/WHEN TO USE:?|USAGE GUIDELINES:?|PROPERTIES:?|VISUAL ANATOMY/i)[0]?.trim();
  if (intro) {
    lines.push(intro, '');
  }

  const appendBullets = (heading: string, block: string) => {
    lines.push(`## ${heading}`, '');
    const items = block
      .split(/\r?\n|•/)
      .map((s) => sanitizeFigmaSentence(s.replace(/^[-*]\s*/, '').trim()))
      .filter((s) => Boolean(s) && !/^Show (?:Column|Row|Toggle|Affiliate|Kom)/i.test(s));
    for (const item of items) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  };

  if (whenMatch?.[1]?.trim()) {
    appendBullets('When to Use', whenMatch[1].trim());
  }
  if (guideMatch?.[1]?.trim()) {
    appendBullets('Usage Guidelines', guideMatch[1].trim());
  }

  return lines.join('\n') + '\n';
}
