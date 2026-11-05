import ts from 'typescript';
import { INPUT_TAG_START_RE, buildViews } from './lint-views.js';
import { findOpeningTagEnd, isFlaggedTextInputTag } from './lint.js';
import { isValidComponentName } from './names.js';

interface TextEdit {
  start: number;
  end: number;
  replacement: string;
}

function applyEdits(source: string, edits: TextEdit[]): string {
  if (edits.length === 0) return source;
  const sorted = [...edits].sort((a, b) => b.start - a.start);
  let out = source;
  let lastStart = Infinity;
  for (const edit of sorted) {
    if (edit.end > lastStart) continue;
    out = out.slice(0, edit.start) + edit.replacement + out.slice(edit.end);
    lastStart = edit.start;
  }
  return out;
}

function normalizeComponentIdentity(source: string, componentName?: string): string {
  if (!componentName || !isValidComponentName(componentName)) return source;
  let out = source;
  const fnMatch = out.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(/);
  const oldFnName = fnMatch?.[1];
  if (oldFnName && oldFnName !== componentName) {
    out = out.replace(
      /export\s+default\s+function\s+[A-Za-z0-9_]+\s*\(/,
      `export default function ${componentName}(`
    );
    const oldPropsName = `${oldFnName}Props`;
    const newPropsName = `${componentName}Props`;
    if (out.includes(oldPropsName)) {
      out = out.replace(new RegExp(`\\b${oldPropsName}\\b`, 'g'), newPropsName);
    }
  }
  return out;
}

function normalizeTextInputOnChange(source: string): string {
  const views = buildViews(source);
  const text = views.code;
  const edits: TextEdit[] = [];

  for (const match of text.matchAll(INPUT_TAG_START_RE)) {
    const tagStart = match.index ?? 0;
    const tagName = match[1] as string;
    const tagEnd = findOpeningTagEnd(text, tagStart + match[0].length);
    const tagContent = text.slice(tagStart, tagEnd);
    if (/\bonInput\s*=/.test(tagContent)) continue;
    if (!isFlaggedTextInputTag(tagName, tagContent)) continue;

    for (const ocMatch of tagContent.matchAll(/\bonChange(?=\s*=)/g)) {
      const start = tagStart + (ocMatch.index ?? 0);
      edits.push({ start, end: start + 'onChange'.length, replacement: 'onInput' });
    }
  }

  return applyEdits(source, edits);
}

function isPropertyNameOrAccessTarget(node: ts.Identifier): boolean {
  const parent = node.parent;
  if (!parent) return false;
  if (ts.isPropertyAccessExpression(parent) && parent.name === node) return true;
  if (ts.isPropertyAssignment(parent) && parent.name === node) return true;
  if (ts.isPropertySignature(parent) && parent.name === node) return true;
  if (ts.isMethodDeclaration(parent) && parent.name === node) return true;
  if (ts.isGetAccessorDeclaration(parent) && parent.name === node) return true;
  if (ts.isJsxAttribute(parent) && parent.name === node) return true;
  if (ts.isBindingElement(parent) && parent.propertyName === node) return true;
  return false;
}

function findEnclosingScope(node: ts.Node): ts.Node {
  let curr: ts.Node | undefined = node.parent;
  while (curr) {
    if (
      ts.isGetAccessorDeclaration(curr) ||
      ts.isMethodDeclaration(curr) ||
      ts.isFunctionDeclaration(curr) ||
      ts.isFunctionExpression(curr) ||
      ts.isArrowFunction(curr) ||
      ts.isBlock(curr)
    ) {
      return curr;
    }
    curr = curr.parent;
  }
  return node.getSourceFile();
}

function renameInScope(
  sf: ts.SourceFile,
  edits: TextEdit[],
  scope: ts.Node,
  declNameNode: ts.Identifier,
  oldName: string,
  newName: string
) {
  const declPos = declNameNode.getStart(sf);
  function visitRef(n: ts.Node) {
    if (ts.isIdentifier(n) && n.text === oldName && n.getStart(sf) >= declPos) {
      if (n === declNameNode) {
        edits.push({ start: n.getStart(sf), end: n.getEnd(), replacement: newName });
        return;
      }
      if (ts.isShorthandPropertyAssignment(n.parent)) {
        edits.push({ start: n.getStart(sf), end: n.getEnd(), replacement: `${oldName}: ${newName}` });
        return;
      }
      if (!isPropertyNameOrAccessTarget(n)) {
        edits.push({ start: n.getStart(sf), end: n.getEnd(), replacement: newName });
      }
    }
    ts.forEachChild(n, visitRef);
  }
  visitRef(scope);
}

function collectShadowedVarRenames(source: string): TextEdit[] {
  const sf = ts.createSourceFile('normalize.lite.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits: TextEdit[] = [];

  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node) && node.initializer) {
      const initText = node.initializer.getText(sf).trim();
      if (ts.isIdentifier(node.name)) {
        const varName = node.name.text;
        if (new RegExp(`^props\\.${varName}\\b`).test(initText)) {
          renameInScope(sf, edits, findEnclosingScope(node), node.name, varName, `raw_${varName}`);
        }
      } else if (ts.isObjectBindingPattern(node.name) && initText === 'props') {
        const scope = findEnclosingScope(node);
        for (const el of node.name.elements) {
          if (ts.isIdentifier(el.name) && !el.propertyName) {
            const varName = el.name.text;
            const safeName = `raw_${varName}`;
            renameInScope(sf, edits, scope, el.name, varName, safeName);
            edits.push({ start: el.name.getStart(sf), end: el.name.getEnd(), replacement: `${varName}: ${safeName}` });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sf);
  return edits;
}

function unwrapStoreObject(call: ts.CallExpression): ts.ObjectLiteralExpression | null {
  if (call.arguments.length === 0) return null;
  let arg = call.arguments[0]!;
  while (ts.isTypeAssertionExpression(arg) || ts.isAsExpression(arg) || ts.isParenthesizedExpression(arg)) {
    arg = arg.expression;
  }
  return ts.isObjectLiteralExpression(arg) ? arg : null;
}

function collectUseStoreTypeStrips(source: string): TextEdit[] {
  const sf = ts.createSourceFile('usetypes.lite.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits: TextEdit[] = [];

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'useStore') {
      const obj = unwrapStoreObject(node);
      if (obj) {
        for (const prop of obj.properties) {
          if (ts.isMethodDeclaration(prop) || ts.isGetAccessorDeclaration(prop)) {
            if (prop.type) {
              const colonStart = source.lastIndexOf(':', prop.type.getStart(sf));
              if (colonStart !== -1) edits.push({ start: colonStart, end: prop.type.end, replacement: '' });
            }
            for (const param of prop.parameters) {
              if (param.type) {
                const paramEnd = param.questionToken ? param.questionToken.end : param.name.end;
                edits.push({ start: paramEnd, end: param.type.end, replacement: '' });
              }
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sf);
  return edits;
}

function collectStorePropCollisionRenames(source: string): TextEdit[] {
  const sf = ts.createSourceFile('storecollision.lite.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const propNames = new Set<string>();
  const collisions = new Map<string, string>();
  const edits: TextEdit[] = [];
  let stateVar = 'state';

  function scanDecls(node: ts.Node) {
    if (ts.isInterfaceDeclaration(node) && node.name.text.endsWith('Props')) {
      for (const m of node.members) {
        if (ts.isPropertySignature(m) && m.name && ts.isIdentifier(m.name)) propNames.add(m.name.text);
      }
    }
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'useDefaultProps') {
      const obj = unwrapStoreObject(node);
      if (obj) {
        for (const p of obj.properties) {
          if (p.name && ts.isIdentifier(p.name)) propNames.add(p.name.text);
        }
      }
    }
    ts.forEachChild(node, scanDecls);
  }
  scanDecls(sf);
  if (propNames.size === 0) return edits;

  function scanStore(node: ts.Node) {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'useStore') {
      if (ts.isVariableDeclaration(node.parent) && ts.isIdentifier(node.parent.name)) {
        stateVar = node.parent.name.text;
      }
      const obj = unwrapStoreObject(node);
      if (obj) {
        for (const prop of obj.properties) {
          if (prop.name && ts.isIdentifier(prop.name) && propNames.has(prop.name.text)) {
            const safe = `resolved_${prop.name.text}`;
            collisions.set(prop.name.text, safe);
            edits.push({ start: prop.name.getStart(sf), end: prop.name.getEnd(), replacement: safe });
          }
        }
      }
    }
    ts.forEachChild(node, scanStore);
  }
  scanStore(sf);
  if (collisions.size === 0) return edits;

  function renameStateAccess(node: ts.Node) {
    if (
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === stateVar &&
      collisions.has(node.name.text)
    ) {
      edits.push({ start: node.name.getStart(sf), end: node.name.getEnd(), replacement: collisions.get(node.name.text)! });
    }
    ts.forEachChild(node, renameStateAccess);
  }
  renameStateAccess(sf);
  return edits;
}

export function normalizeMitosisSource(source: string, componentName?: string): string {
  let out = normalizeComponentIdentity(source, componentName);
  out = normalizeTextInputOnChange(out);
  const typeStrips = collectUseStoreTypeStrips(out);
  if (typeStrips.length > 0) out = applyEdits(out, typeStrips);
  const shadowEdits = collectShadowedVarRenames(out);
  if (shadowEdits.length > 0) out = applyEdits(out, shadowEdits);
  const storeCollisions = collectStorePropCollisionRenames(out);
  if (storeCollisions.length > 0) out = applyEdits(out, storeCollisions);
  return out;
}
