import ts from 'typescript';

const SCRIPT_SETUP_RE = /(<script\b[^>]*\bsetup\b[^>]*>)([\s\S]*?)(<\/script>)/;

function isInsideTypeContext(node: ts.Node): boolean {
  let curr: ts.Node | undefined = node.parent;
  while (curr) {
    if (
      ts.isTypeNode(curr) ||
      ts.isInterfaceDeclaration(curr) ||
      ts.isTypeAliasDeclaration(curr) ||
      ts.isImportDeclaration(curr) ||
      ts.isExportDeclaration(curr)
    ) {
      return true;
    }
    curr = curr.parent;
  }
  return false;
}

function isDeclarationOrPropertyName(node: ts.Identifier): boolean {
  const parent = node.parent;
  if (!parent) return false;
  if (ts.isVariableDeclaration(parent) && parent.name === node) return true;
  if (ts.isParameter(parent) && parent.name === node) return true;
  if (ts.isFunctionDeclaration(parent) && parent.name === node) return true;
  if (ts.isPropertyAccessExpression(parent) && parent.name === node) return true;
  if (ts.isPropertyAssignment(parent) && parent.name === node) return true;
  if (ts.isMethodDeclaration(parent) && parent.name === node) return true;
  if (ts.isGetAccessorDeclaration(parent) && parent.name === node) return true;
  if (ts.isBindingElement(parent) && (parent.name === node || parent.propertyName === node)) return true;
  return false;
}

function isAlreadyValueAccess(node: ts.Identifier): boolean {
  const parent = node.parent;
  return Boolean(
    parent &&
      ts.isPropertyAccessExpression(parent) &&
      parent.expression === node &&
      parent.name.text === 'value'
  );
}

function scopeDeclaresIdentifier(scope: ts.Node, name: string): boolean {
  if (
    ts.isFunctionDeclaration(scope) ||
    ts.isFunctionExpression(scope) ||
    ts.isArrowFunction(scope) ||
    ts.isMethodDeclaration(scope)
  ) {
    for (const param of scope.parameters) {
      if (ts.isIdentifier(param.name) && param.name.text === name) return true;
    }
  }
  if (ts.isBlock(scope)) {
    for (const stmt of scope.statements) {
      if (!ts.isVariableStatement(stmt)) continue;
      for (const decl of stmt.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === name) return true;
      }
    }
  }
  return false;
}

function isShadowedInEnclosingScope(node: ts.Identifier, sf: ts.SourceFile): boolean {
  let curr: ts.Node | undefined = node.parent;
  while (curr && curr !== sf) {
    if (scopeDeclaresIdentifier(curr, node.text)) return true;
    curr = curr.parent;
  }
  return false;
}

function collectComputedNames(sf: ts.SourceFile): Set<string> {
  const names = new Set<string>();
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || !decl.initializer) continue;
      if (
        ts.isCallExpression(decl.initializer) &&
        ts.isIdentifier(decl.initializer.expression) &&
        decl.initializer.expression.text === 'computed'
      ) {
        names.add(decl.name.text);
      }
    }
  }
  return names;
}

function collectUnwrappedComputedNodes(sf: ts.SourceFile, computedNames: Set<string>): ts.Identifier[] {
  const unwrapped: ts.Identifier[] = [];
  function visit(node: ts.Node) {
    if (
      ts.isIdentifier(node) &&
      computedNames.has(node.text) &&
      !isDeclarationOrPropertyName(node) &&
      !isAlreadyValueAccess(node) &&
      !isInsideTypeContext(node) &&
      !isShadowedInEnclosingScope(node, sf)
    ) {
      unwrapped.push(node);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return unwrapped;
}

function fixVue3UseSlots(scriptBody: string): string {
  if (!/\buseSlots\s*\(\s*\)/.test(scriptBody)) return scriptBody;
  let out = scriptBody.replace(/\buseSlots\s*\(\s*\)/g, '__slots');
  if (/import\s*\{([^}]*)\}\s*from\s*["']vue["']/.test(out)) {
    out = out.replace(/import\s*\{([^}]*)\}\s*from\s*(["']vue["'])/, (full, imports, mod) => {
      const list = String(imports)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (!list.includes('useSlots')) list.push('useSlots');
      return `import { ${list.join(', ')} } from ${mod};\nconst __slots = useSlots()`;
    });
  } else {
    out = `\nimport { useSlots } from "vue";\nconst __slots = useSlots();\n${out}`;
  }
  return out;
}

export function fixVue3ComputedRefs(sfcCode: string): string {
  const match = sfcCode.match(SCRIPT_SETUP_RE);
  if (!match) return sfcCode;
  const [fullBlock, openTag, rawScriptBody, closeTag] = match;
  let scriptBody = fixVue3UseSlots(rawScriptBody!);
  const sf = ts.createSourceFile('comp.setup.ts', scriptBody, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const computedNames = collectComputedNames(sf);
  if (computedNames.size > 0) {
    const nodes = collectUnwrappedComputedNodes(sf, computedNames);
    const sorted = [...nodes].sort((a, b) => b.getStart(sf) - a.getStart(sf));
    for (const id of sorted) {
      const start = id.getStart(sf);
      const end = id.getEnd();
      const replacement = ts.isShorthandPropertyAssignment(id.parent)
        ? `${id.text}: ${id.text}.value`
        : `${id.text}.value`;
      scriptBody = scriptBody.slice(0, start) + replacement + scriptBody.slice(end);
    }
  }
  return sfcCode.replace(fullBlock, `${openTag}${scriptBody}${closeTag}`);
}

export function findUnwrappedVue3ComputedRefs(sfcCode: string): string[] {
  const match = sfcCode.match(SCRIPT_SETUP_RE);
  if (!match) return [];
  const scriptBody = match[2]!;
  const sf = ts.createSourceFile('comp.setup.ts', scriptBody, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const computedNames = collectComputedNames(sf);
  if (computedNames.size === 0) return [];
  const nodes = collectUnwrappedComputedNodes(sf, computedNames);
  return [...new Set(nodes.map((n) => n.text))];
}
