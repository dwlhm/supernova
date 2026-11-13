import ts from 'typescript';
import type { CompileError } from './types.js';
import { LINT_RULES, LINT_TARGET } from './lint-views.js';

type LineOf = (index: number) => number;

function lintError(rule: string, line: number, message: string): CompileError {
  return { target: LINT_TARGET, rule, line, message };
}

function walk(node: ts.Node, visit: (n: ts.Node) => void): void {
  visit(node);
  ts.forEachChild(node, (child) => walk(child, visit));
}

function isPropsChildren(node: ts.Node): node is ts.PropertyAccessExpression {
  return (
    ts.isPropertyAccessExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === 'props' &&
    node.name.text === 'children'
  );
}

/** `{props.children}` rendered as content, or the projection guard `<Show when={props.children}>` without `else`. */
function isPortableChildrenUse(node: ts.PropertyAccessExpression, sf: ts.SourceFile): boolean {
  const expr = node.parent;
  if (!ts.isJsxExpression(expr)) return false;
  const owner = expr.parent;
  if (ts.isJsxElement(owner) || ts.isJsxFragment(owner)) return true;
  if (!ts.isJsxAttribute(owner) || owner.name.getText(sf) !== 'when') return false;
  const tag = owner.parent.parent;
  if (!(ts.isJsxOpeningElement(tag) || ts.isJsxSelfClosingElement(tag)) || tag.tagName.getText(sf) !== 'Show') return false;
  // An `else` branch is a "no children" condition in disguise.
  return !tag.attributes.properties.some((a) => ts.isJsxAttribute(a) && a.name.getText(sf) === 'else');
}

function lintChildrenCondition(sf: ts.SourceFile, lineOf: LineOf): CompileError[] {
  const errors: CompileError[] = [];
  walk(sf, (node) => {
    if (!isPropsChildren(node) || isPortableChildrenUse(node, sf)) return;
    errors.push(
      lintError(
        LINT_RULES.noChildrenCondition,
        lineOf(node.getStart(sf)),
        'props.children may only be rendered ({props.children} or <Show when={props.children}>). Angular cannot test projected content, so do not branch on it (no !props.children, ternaries or Boolean(props.children)); render content through children only.'
      )
    );
  });
  return errors;
}

function componentBody(sf: ts.SourceFile): ts.Block | undefined {
  for (const stmt of sf.statements) {
    if (!ts.isFunctionDeclaration(stmt)) continue;
    if (stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)) return stmt.body;
  }
  return undefined;
}

/** Mitosis hooks (`useStore`, `useRef`, ...) are the only values a component body may bind. */
function isHookCall(init: ts.Expression | undefined): boolean {
  return !!init && ts.isCallExpression(init) && ts.isIdentifier(init.expression) && /^use[A-Z]/.test(init.expression.text);
}

function lintLocalBindings(sf: ts.SourceFile, lineOf: LineOf): CompileError[] {
  const errors: CompileError[] = [];
  for (const stmt of componentBody(sf)?.statements ?? []) {
    if (!ts.isVariableStatement(stmt)) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (isHookCall(decl.initializer)) continue;
      errors.push(
        lintError(
          LINT_RULES.noLocalBinding,
          lineOf(decl.getStart(sf)),
          `Local binding "${decl.name.getText(sf)}" in the component body is dropped by the Angular/Vue generators. Call the helper inline in JSX (e.g. createTooltipState({ id: props.id }).contentProps.id) instead.`
        )
      );
    }
  }
  return errors;
}

function callbackParamCount(member: ts.TypeElement): number | undefined {
  if (ts.isMethodSignature(member)) return member.parameters.length;
  if (ts.isPropertySignature(member) && member.type && ts.isFunctionTypeNode(member.type)) return member.type.parameters.length;
  return undefined;
}

function lintCallbackArity(sf: ts.SourceFile, lineOf: LineOf): CompileError[] {
  const errors: CompileError[] = [];
  for (const stmt of sf.statements) {
    if (!ts.isInterfaceDeclaration(stmt) || !stmt.name.text.endsWith('Props')) continue;
    for (const member of stmt.members) {
      const count = callbackParamCount(member);
      if (count === undefined || count <= 1) continue;
      errors.push(
        lintError(
          LINT_RULES.singleArgCallback,
          lineOf(member.getStart(sf)),
          `Callback "${member.name?.getText(sf)}" takes ${count} parameters; Angular outputs emit one value. Pass a single object instead, e.g. (event: { key: string; direction: 'asc' | 'desc' }) => void.`
        )
      );
    }
  }
  return errors;
}

/** Rules that keep one `.lite.tsx` source translatable to every target (notably Angular). */
export function lintPortability(source: string, lineOf: LineOf): CompileError[] {
  const sf = ts.createSourceFile('component.lite.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  return [...lintChildrenCondition(sf, lineOf), ...lintLocalBindings(sf, lineOf), ...lintCallbackArity(sf, lineOf)];
}
