import ts from 'typescript'

export function expression(source: string, context: string): ts.Expression {
  const file = ts.createSourceFile('expression.tsx', `const value = (${source});`, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const diagnostics = (file as ts.SourceFile & { parseDiagnostics: ts.Diagnostic[] }).parseDiagnostics
  if (diagnostics.length || file.statements.length !== 1 || !ts.isVariableStatement(file.statements[0])) throw new Error(`${context}: invalid expression`)
  const initializer = file.statements[0].declarationList.declarations[0].initializer
  if (!initializer || !ts.isParenthesizedExpression(initializer)) throw new Error(`${context}: invalid expression`)
  // Parsed nodes carry source positions; synthesize them before printing in another file.
  let transformContext: ts.TransformationContext
  const clone = (node: ts.Node): ts.Node => {
    const result = ts.visitEachChild(node, clone, transformContext)
    ts.setTextRange(result, { pos: -1, end: -1 })
    return result
  }
  const transformed = ts.transform(initializer.expression, [ctx => { transformContext = ctx; return node => clone(node) as ts.Expression }])
  try { return transformed.transformed[0] } finally { transformed.dispose() }
}
