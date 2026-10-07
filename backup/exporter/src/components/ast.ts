import ts from 'typescript'
import { ComponentDefinition, ChildNode, Binding, Condition, ClassBinding, validateBinding } from './schema'
import { expression } from './legacy-expressions'
import { inputableType, inputProperties, inputTags, voidTags, BehaviorPropertyType } from './behaviors'

const f = ts.factory
const id = f.createIdentifier
const prop = (name: string) => f.createPropertyAccessExpression(id('props'), name)
const call = (name: string, args: ts.Expression[]) => f.createCallExpression(id(name), undefined, args)
const literal = (value: unknown): ts.Expression => {
  if (value === undefined) return id('undefined')
  if (value === null) return f.createNull()
  if (typeof value === 'string') return f.createStringLiteral(value)
  if (typeof value === 'boolean') return value ? f.createTrue() : f.createFalse()
  if (typeof value === 'number' && Number.isFinite(value)) return value < 0 ? f.createPrefixUnaryExpression(ts.SyntaxKind.MinusToken, f.createNumericLiteral(-value)) : f.createNumericLiteral(value)
  if (Array.isArray(value)) return f.createArrayLiteralExpression(value.map(literal))
  if (typeof value === 'object') return f.createObjectLiteralExpression(Object.entries(value).map(([key, val]) => f.createPropertyAssignment(f.createStringLiteral(key), literal(val))))
  throw new Error('defaultValue: expected JSON value')
}
function type(kind: BehaviorPropertyType): ts.TypeNode {
  if (kind === 'event') return f.createFunctionTypeNode(undefined, [f.createParameterDeclaration(undefined, undefined, 'event', undefined, f.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword))], f.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword))
  if (kind === 'value') return f.createUnionTypeNode([type('string'), type('number')])
  return f.createKeywordTypeNode(({ string: ts.SyntaxKind.StringKeyword, number: ts.SyntaxKind.NumberKeyword, boolean: ts.SyntaxKind.BooleanKeyword, any: ts.SyntaxKind.AnyKeyword } as const)[kind])
}
/** Legacy fixture expression spelling is confined to this boundary. */
function conditionExpression(condition: Condition, context: string): ts.Expression {
  if (!condition || typeof condition !== 'object') throw new Error(`${context}: invalid condition`)
  if (condition.kind === 'prop') { validateBinding(condition, context); return prop(condition.name) }
  if (condition.kind === 'not') return f.createPrefixUnaryExpression(ts.SyntaxKind.ExclamationToken, f.createParenthesizedExpression(conditionExpression(condition.condition, context)))
  if ((condition.kind === 'and' || condition.kind === 'or') && Array.isArray(condition.conditions) && condition.conditions.length) return condition.conditions.map(item => conditionExpression(item, context)).reduce((a, b) => f.createBinaryExpression(a, condition.kind === 'and' ? ts.SyntaxKind.AmpersandAmpersandToken : ts.SyntaxKind.BarBarToken, b))
  throw new Error(`${context}: invalid condition`)
}
function bound(value: string | Binding, context: string): ts.Expression {
  if (typeof value !== 'string') { validateBinding(value, context); return value.kind === 'literal' ? literal(value.value) : f.createPropertyAccessExpression(id(value.kind === 'prop' ? 'props' : 'state'), value.name) }
  return value.startsWith('{') && value.endsWith('}') ? expression(value.slice(1, -1), context) : f.createStringLiteral(value)
}
function classBinding(value: string | ClassBinding, context: string): ts.Expression {
  if (typeof value === 'string') return value.startsWith('${') && value.endsWith('}') ? expression(value.slice(2, -1), context) : f.createStringLiteral(value)
  if (value.kind === 'conditional') return f.createConditionalExpression(conditionExpression(value.condition, context), undefined, f.createStringLiteral(value.whenTrue), undefined, f.createStringLiteral(value.whenFalse))
  return bound(value, context)
}
export function generateComponentSource(component: ComponentDefinition): { code: string; runtimeImports: string[] } {
  const input = inputableType(component)
  const members = new Map<string, ts.TypeNode>()
  if (input === 'none' && component.root?.childrenSlot !== false && !voidTags.has(component.root?.tag || 'div')) members.set('children', type('any'))
  for (const property of component.properties || []) {
    const options = property.options?.map(option => typeof option === 'string' ? option : option.value ?? option.name ?? '')
    members.set(property.codeName || property.name, options?.length ? f.createUnionTypeNode(options.map(value => f.createLiteralTypeNode(f.createStringLiteral(value)))) : type(({ boolean: 'boolean', number: 'number', instanceswap: 'any', node: 'any' } as Record<string, BehaviorPropertyType>)[property.type.toLowerCase()] || 'string'))
  }
  if (input !== 'none') for (const [key, kind] of Object.entries(inputProperties[input])) if (!members.has(key)) members.set(key, type(kind))
  if (component.behaviors?.clickable) members.set('onClick', type('event'))
  if (component.behaviors?.disabled && !members.has('disabled')) members.set('disabled', type('boolean'))
  const getters = Object.entries(component.behaviors?.variantStyles || {}).map(([key, styles]) => {
    const fallback = component.properties?.find(p => (p.codeName || p.name) === key)?.defaultValue
    return f.createGetAccessorDeclaration(undefined, `${key}Class`, [], undefined, f.createBlock([f.createReturnStatement(call('resolveVariantClass', [literal(styles), prop(key), literal(fallback)]))], true))
  })
  const body: ts.Statement[] = []
  const defaults = (component.properties || []).filter(p => p.defaultValue !== undefined)
  if (defaults.length) body.push(f.createExpressionStatement(call('useDefaultProps', [f.createObjectLiteralExpression(defaults.map(p => f.createPropertyAssignment(p.codeName || p.name, literal(p.defaultValue))), true)])))
  if (getters.length) body.push(f.createVariableStatement(undefined, f.createVariableDeclarationList([f.createVariableDeclaration('state', undefined, undefined, call('useStore', [f.createObjectLiteralExpression(getters, true)]))], ts.NodeFlags.Const)))
  let usesEvents = false
  const event = (name: string, disabled = false): ts.Expression => {
    usesEvents = true
    return f.createArrowFunction(undefined, undefined, [f.createParameterDeclaration(undefined, undefined, 'event')], undefined, f.createToken(ts.SyntaxKind.EqualsGreaterThanToken), call('dispatchEvent', [prop(name), id('event'), disabled ? prop('disabled') : f.createFalse()]))
  }
  const render = (node: ChildNode & { childrenSlot?: boolean }, root = false): ts.JsxChild => {
    const tag = node.tag || (node.role === 'icon' ? 'span' : node.role === 'text' ? 'p' : root && component.behaviors?.clickable && !node.children ? 'button' : 'div')
    const attributes = new Map<string, ts.Expression>()
    if (input !== 'none' && inputTags[input] === tag) {
      for (const key of ['name', 'value', 'disabled', 'required']) attributes.set(key, prop(key))
      if (input === 'text') { attributes.set('type', f.createBinaryExpression(prop('type'), ts.SyntaxKind.QuestionQuestionToken, f.createStringLiteral('text'))); attributes.set('placeholder', prop('placeholder')) }
      if (input === 'textarea') { attributes.set('rows', f.createBinaryExpression(prop('rows'), ts.SyntaxKind.QuestionQuestionToken, f.createNumericLiteral(3))); attributes.set('placeholder', prop('placeholder')) }
      if (input === 'radio' || input === 'checkbox') { attributes.set('type', f.createStringLiteral(input)); attributes.set('checked', prop('checked')) }
      for (const key of ['onChange', 'onFocus', 'onBlur']) attributes.set(key, event(key))
    }
    if (root && input === 'none' && component.behaviors?.clickable) attributes.set('onClick', event('onClick', component.behaviors.disabled))
    if (node.className || node.dynamicClasses?.length) {
      const classes = [bound(node.className || '', `${component.name}.className`), ...(node.dynamicClasses || []).map(value => classBinding(value, `${component.name}.dynamicClasses`))]
      attributes.set('className', classes.reduce((left, right) => f.createBinaryExpression(f.createBinaryExpression(left, ts.SyntaxKind.PlusToken, f.createStringLiteral(' ')), ts.SyntaxKind.PlusToken, right)))
    }
    for (const [key, value] of Object.entries(node.attributes || {})) attributes.set(key, bound(value, `${component.name}.${key}`))
    const attrs = f.createJsxAttributes([...attributes].map(([key, value]) => f.createJsxAttribute(id(key), f.createJsxExpression(undefined, value))))
    const children: ts.JsxChild[] = (node.children || []).map(child => render(child))
    if (node.content) {
      if (typeof node.content !== 'string') children.push(f.createJsxExpression(undefined, prop(node.content.bindProp)))
      else if (node.content.startsWith('{')) {
        const parsed = expression(`<span>${node.content}</span>`, `${component.name}.content`)
        if (!ts.isJsxElement(parsed)) throw new Error(`${component.name}: invalid content`)
        children.push(...parsed.children)
      } else children.push(f.createJsxExpression(undefined, f.createStringLiteral(node.content)))
    }
    if (root && input === 'none' && node.childrenSlot !== false && !voidTags.has(tag)) children.push(f.createJsxExpression(undefined, prop('children')))
    if (voidTags.has(tag) && children.length) throw new Error(`${component.name}: void element ${tag} cannot contain children`)
    const element = voidTags.has(tag) ? f.createJsxSelfClosingElement(id(tag), undefined, attrs) : f.createJsxElement(f.createJsxOpeningElement(id(tag), undefined, attrs), children, f.createJsxClosingElement(id(tag)))
    if (!node.condition) return element
    const condition = typeof node.condition !== 'string' ? conditionExpression(node.condition, component.name) : /^[A-Za-z_$][\w$]*$/.test(node.condition) ? prop(node.condition) : expression(node.condition, `${component.name}.condition`)
    return f.createJsxExpression(undefined, f.createBinaryExpression(condition, ts.SyntaxKind.AmpersandAmpersandToken, f.createParenthesizedExpression(element)))
  }
  const root = render(component.root || {}, true)
  if (ts.isJsxExpression(root) || ts.isJsxText(root)) throw new Error(`${component.name}: root condition is unsupported`)
  body.push(f.createReturnStatement(f.createParenthesizedExpression(root)))
  const imports: ts.Statement[] = []
  const importNames = [...(defaults.length ? ['useDefaultProps'] : []), ...(getters.length ? ['useStore'] : [])]
  const imported = (names: string[], path: string) => f.createImportDeclaration(undefined, f.createImportClause(false, undefined, f.createNamedImports(names.map(name => f.createImportSpecifier(false, undefined, id(name))))), f.createStringLiteral(path))
  if (importNames.length) imports.push(imported(importNames, '@builder.io/mitosis'))
  const helpers = [...(getters.length ? ['resolveVariantClass'] : []), ...(usesEvents ? ['dispatchEvent'] : [])]
  if (helpers.length) imports.push(imported(helpers, '../runtime/component-runtime'))
  const statements = [...imports, f.createInterfaceDeclaration([f.createModifier(ts.SyntaxKind.ExportKeyword)], `${component.name}Props`, undefined, undefined, [...members].map(([name, kind]) => f.createPropertySignature(undefined, name, f.createToken(ts.SyntaxKind.QuestionToken), kind))), f.createFunctionDeclaration([f.createModifier(ts.SyntaxKind.ExportKeyword), f.createModifier(ts.SyntaxKind.DefaultKeyword)], undefined, component.name, undefined, [f.createParameterDeclaration(undefined, undefined, 'props', undefined, f.createTypeReferenceNode(`${component.name}Props`))], undefined, f.createBlock(body, true))]
  return { runtimeImports: helpers, code: ts.createPrinter({ newLine: ts.NewLineKind.LineFeed }).printFile(f.createSourceFile(statements, f.createToken(ts.SyntaxKind.EndOfFileToken), ts.NodeFlags.None)) }
}
