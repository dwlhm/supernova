import ts from 'typescript';
import type { CompileError } from './types.js';
import { LINT_RULES, LINT_TARGET } from './lint-views.js';

/** Tier 3 budget: a stateless `.lite.tsx` must stay small enough to review at a glance. */
export const TIER3_MAX_LINES = 80;

const STATE_HELPER_RE = /^get[A-Z]\w*State$/;

type LineOf = (index: number) => number;

function lintError(rule: string, line: number, message: string): CompileError {
  return { target: LINT_TARGET, rule, line, message };
}

function walk(node: ts.Node, visit: (n: ts.Node) => void): void {
  visit(node);
  ts.forEachChild(node, (child) => walk(child, visit));
}

function lintMaxLines(source: string): CompileError[] {
  const lines = source.split('\n').filter((l) => l.trim() !== '').length;
  if (lines <= TIER3_MAX_LINES) return [];
  return [
    lintError(
      LINT_RULES.tier3MaxLines,
      TIER3_MAX_LINES + 1,
      `Component has ${lines} non-blank lines (max ${TIER3_MAX_LINES}). Do not duplicate subtrees per variant/orientation: render one element and switch its classes with cva() maps. If it is still too long, extract a self-contained part into a sibling component (e.g. "<Name>Item" for repeated items, "<Name>Indicator"/"<Name>Connector" for parts of an item).`
    ),
  ];
}

/** Literal containing data: a non-empty array, or an object with properties. */
function isFixtureLiteral(node: ts.Expression): boolean {
  if (ts.isArrayLiteralExpression(node)) return node.elements.length > 0;
  if (ts.isObjectLiteralExpression(node)) return node.properties.length > 0;
  return false;
}

function lintFixtureDefaults(sf: ts.SourceFile, lineOf: LineOf): CompileError[] {
  const errors: CompileError[] = [];
  walk(sf, (node) => {
    if (!ts.isCallExpression(node) || node.expression.getText(sf) !== 'useDefaultProps') return;
    const arg = node.arguments[0];
    if (!arg || !ts.isObjectLiteralExpression(arg)) return;
    for (const prop of arg.properties) {
      if (!ts.isPropertyAssignment(prop) || !isFixtureLiteral(prop.initializer)) continue;
      const name = prop.name.getText(sf);
      errors.push(
        lintError(
          LINT_RULES.noFixtureDefaults,
          lineOf(prop.getStart(sf)),
          `Default for "${name}" hardcodes demo data. Default data props to [] (or omit them); demo content belongs in the component example, not in the component.`
        )
      );
    }
  });
  return errors;
}

function isForElement(node: ts.Node, sf: ts.SourceFile): node is ts.JsxElement {
  return ts.isJsxElement(node) && node.openingElement.tagName.getText(sf) === 'For';
}

function forEachExpression(node: ts.JsxElement, sf: ts.SourceFile): string | undefined {
  for (const attr of node.openingElement.attributes.properties) {
    if (ts.isJsxAttribute(attr) && attr.name.getText(sf) === 'each' && attr.initializer && ts.isJsxExpression(attr.initializer)) {
      return attr.initializer.expression?.getText(sf);
    }
  }
  return undefined;
}

function lintDualModeList(sf: ts.SourceFile, source: string, lineOf: LineOf): CompileError[] {
  if (!/\bprops\.children\b/.test(source)) return [];
  const errors: CompileError[] = [];
  walk(sf, (node) => {
    if (!isForElement(node, sf)) return;
    const each = forEachExpression(node, sf);
    const prop = each?.match(/^props\.(\w+)$/)?.[1];
    if (!prop) return;
    errors.push(
      lintError(
        LINT_RULES.noDualModeList,
        lineOf(node.getStart(sf)),
        `Component accepts children but also renders "props.${prop}" with <For>. Compound components are composition-only: remove "${prop}" and let the consumer render sibling "<Name>Item" components as children.`
      )
    );
  });
  return errors;
}

/** Names bound by the `<For>` render callback, e.g. `(step, index) => ...`. */
function forItemParams(node: ts.JsxElement): Set<string> {
  const names = new Set<string>();
  for (const child of node.children) {
    const fn = ts.isJsxExpression(child) ? child.expression : undefined;
    if (!fn || !(ts.isArrowFunction(fn) || ts.isFunctionExpression(fn))) continue;
    for (const p of fn.parameters) if (ts.isIdentifier(p.name)) names.add(p.name.text);
  }
  return names;
}

function referencesAny(node: ts.Node, names: Set<string>): boolean {
  let found = false;
  walk(node, (n) => {
    if (ts.isIdentifier(n) && names.has(n.text)) found = true;
  });
  return found;
}

/** Flags per-item derived state (helper calls using the item/index) recomputed inside one `<For>` item. */
function lintRepeatedItemState(sf: ts.SourceFile, lineOf: LineOf): CompileError[] {
  const errors: CompileError[] = [];
  walk(sf, (node) => {
    if (!isForElement(node, sf)) return;
    const params = forItemParams(node);
    const counts = new Map<string, { count: number; pos: number; name: string }>();
    walk(node, (inner) => {
      if (!ts.isCallExpression(inner) || !ts.isIdentifier(inner.expression)) return;
      if (!STATE_HELPER_RE.test(inner.expression.text)) return;
      if (!inner.arguments.some((arg) => referencesAny(arg, params))) return;
      const key = inner.getText(sf).replace(/\s+/g, '');
      const entry = counts.get(key) ?? { count: 0, pos: inner.getStart(sf), name: inner.expression.text };
      entry.count++;
      counts.set(key, entry);
    });
    for (const { count, pos, name } of counts.values()) {
      if (count < 2) continue;
      errors.push(
        lintError(
          LINT_RULES.noRepeatedItemState,
          lineOf(pos),
          `"${name}(...)" is recomputed ${count} times per <For> item. Move the item markup into a sibling "<Name>Item" component that receives the derived state as props.`
        )
      );
    }
  });
  return errors;
}

/** Tier 3 rules for stateless `.lite.tsx` components: size budget, no fixtures, composition-only lists. */
export function lintTier3(source: string, lineOf: LineOf): CompileError[] {
  const sf = ts.createSourceFile('component.lite.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  return [
    ...lintMaxLines(source),
    ...lintFixtureDefaults(sf, lineOf),
    ...lintDualModeList(sf, source, lineOf),
    ...lintRepeatedItemState(sf, lineOf),
  ];
}
