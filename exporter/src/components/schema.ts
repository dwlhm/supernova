import { inputProperties, voidTags, BehaviorPropertyType } from './behaviors'
export type Binding = { kind: 'literal'; value: string | number | boolean | null } | { kind: 'prop' | 'state'; name: string }
export type Condition = { kind: 'prop'; name: string } | { kind: 'not'; condition: Condition } | { kind: 'and' | 'or'; conditions: Condition[] }
export type ClassBinding = Binding | { kind: 'conditional'; condition: Condition; whenTrue: string; whenFalse: string }
export type InputableType = 'none' | 'text' | 'textarea' | 'select' | 'radio' | 'checkbox'

export interface ComponentPropertyOption {
  name?: string
  value?: string
}

export interface ComponentProperty {
  id?: string
  name: string
  codeName?: string
  type: string
  options?: Array<string | ComponentPropertyOption>
  defaultValue?: unknown
  isCustomAttribute?: boolean
  description?: string
}

export interface ChildNode {
  tag?: string
  role?: 'container' | 'text' | 'icon' | 'slot' | 'interactive'
  className?: string
  dynamicClasses?: Array<string | ClassBinding>
  condition?: string | Condition
  attributes?: Record<string, string | Binding>
  content?: string | { bindProp: string }
  children?: ChildNode[]
}

export interface ComponentDefinition {
  id: string
  name: string
  description?: string
  designComponentId?: string
  properties?: ComponentProperty[]
  behaviors?: {
    clickable?: boolean
    disabled?: boolean
    inputable?: InputableType | boolean
    variantStyles?: Record<string, Record<string, string>>
  }
  root: {
    tag?: string
    role?: ChildNode['role']
    className?: string
    dynamicClasses?: Array<string | ClassBinding>
    attributes?: Record<string, string | Binding>
    children?: ChildNode[]
    childrenSlot?: boolean
  }
}


export function parseDefinitions(value: unknown, allowImportedReferences = false): ComponentDefinition[] {
  if (!Array.isArray(value)) throw new Error('components: expected an array')
  const names = new Set<string>()
  const reserved = new Set(['default','class','function','return','var','const','let','interface','export','import','props','state','useStore','useDefaultProps','resolveVariantClass','dispatchEvent','constructor','prototype','__proto__'])
  const identifiers = /^[A-Za-z_$][A-Za-z0-9_$]*$/
  const record = (v: unknown, path: string): Record<string, unknown> => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error(`${path}: expected object`)
    return v as Record<string, unknown>
  }
  const text = (v: unknown, path: string): string => {
    if (typeof v !== 'string') throw new Error(`${path}: expected string`)
    return v
  }
  return value.map((entry, index) => {
    const context = `components[${index}]`
    const obj = record(entry, context)
    text(obj.id, `${context}.id`)
    const name = text(obj.name, `${context}.name`)
    if (!identifiers.test(name) || reserved.has(name) || names.has(name)) throw new Error(`${context}: invalid or duplicate component name ${name}`)
    names.add(name)
    const properties = new Set<string>()
    if (obj.properties !== undefined) {
      if (!Array.isArray(obj.properties)) throw new Error(`${context}.properties: expected array`)
      obj.properties.forEach((raw, i) => {
        const prop = record(raw, `${context}.properties[${i}]`)
        const key = text(prop.codeName ?? prop.name, `${context}.property.name`)
        const propertyType = text(prop.type, `${context}.${key}.type`).toLowerCase()
        if (!['text','string','select','variant','boolean','number','instanceswap','node'].includes(propertyType)) throw new Error(`${context}.${key}: unsupported property type`)
        if (prop.defaultValue !== undefined && propertyType === 'boolean' && typeof prop.defaultValue !== 'boolean') throw new Error(`${context}.${key}: expected boolean default`)
        if (prop.defaultValue !== undefined && propertyType === 'number' && (typeof prop.defaultValue !== 'number' || !Number.isFinite(prop.defaultValue))) throw new Error(`${context}.${key}: expected finite number default`)
        if (prop.defaultValue !== undefined && ['text','string','select','variant'].includes(propertyType) && typeof prop.defaultValue !== 'string') throw new Error(`${context}.${key}: expected string default`)
        if (!identifiers.test(key) || reserved.has(key) || properties.has(key) || key === 'children') throw new Error(`${context}: invalid or duplicate property ${key}`)
        properties.add(key)
        text(prop.name, `${context}.${key}.name`)
        if (prop.options !== undefined) {
          if (!Array.isArray(prop.options) || !prop.options.length) throw new Error(`${context}.${key}.options: expected nonempty array`)
          const opts = prop.options.map(option => typeof option === 'string' ? option : text(record(option, context).value ?? record(option, context).name, context))
          if (new Set(opts).size !== opts.length) throw new Error(`${context}.${key}: duplicate option`)
          if (prop.defaultValue !== undefined && !opts.includes(prop.defaultValue as string)) throw new Error(`${context}.${key}: default is not an option`)
        }
      })
    }
    const input = obj.behaviors && typeof obj.behaviors === 'object' ? (obj.behaviors as Record<string, unknown>).inputable : 'none'
    const behaviorProps: Record<string, BehaviorPropertyType> = { ...(input === true ? inputProperties.text : typeof input === 'string' && input !== 'none' && input in inputProperties ? inputProperties[input as Exclude<InputableType, 'none'>] : {}) }
    const behavior = obj.behaviors as ComponentDefinition['behaviors']
    if (behavior?.clickable) behaviorProps.onClick = 'event'
    if (behavior?.disabled) behaviorProps.disabled = 'boolean'
    for (const raw of (obj.properties as ComponentProperty[] | undefined) || []) {
      const key = raw.codeName || raw.name
      const requiredType = behaviorProps[key]
      const actual = raw.type.toLowerCase()
      if (requiredType && !(['text','string','variant','select'].includes(actual) && requiredType === 'string') && !(actual === requiredType) && requiredType !== 'any' && !(requiredType === 'value' && ['text','string','number'].includes(actual))) throw new Error(`${context}.${key}: declared type conflicts with input behavior ${requiredType}`)
    }
    if (obj.designComponentId !== undefined) text(obj.designComponentId, `${context}.designComponentId`)
    const declared = new Set([...properties, ...Object.keys(behaviorProps)])
    const root = obj.root as ComponentDefinition['root'] | undefined
    if ((input === undefined || input === false || input === 'none') && root?.childrenSlot !== false && !voidTags.has(root?.tag || 'div')) declared.add('children')
    if (obj.behaviors && typeof obj.behaviors === 'object') {
      if ((obj.behaviors as Record<string, unknown>).clickable) declared.add('onClick')
      if ((obj.behaviors as Record<string, unknown>).disabled) declared.add('disabled')
    }
    const stateKeys = new Set(Object.keys((obj.behaviors as ComponentDefinition['behaviors'])?.variantStyles || {}).map(key => `${key}Class`))
    const checkRefs = (value: unknown, path: string): void => {
      if (!value || typeof value !== 'object') return
      const binding = value as Record<string, unknown>
      if (binding.kind === 'prop' && !declared.has(String(binding.name)) && !(allowImportedReferences && typeof obj.designComponentId === 'string')) throw new Error(`${path}: undeclared prop ${binding.name}`)
      if (binding.kind === 'state' && !stateKeys.has(String(binding.name))) throw new Error(`${path}: undeclared state ${binding.name}`)
      for (const child of Object.values(binding)) { if (Array.isArray(child)) child.forEach(item => checkRefs(item, path)); else if (child && typeof child === 'object') checkRefs(child, path) }
    }
    const visit = (raw: unknown, path: string) => {
      const node = record(raw, path)
      checkRefs(node, path)
      if (node.childrenSlot !== undefined && typeof node.childrenSlot !== 'boolean') throw new Error(`${path}.childrenSlot: expected boolean`)
      if (node.role !== undefined && !['container','text','icon','slot','interactive'].includes(String(node.role))) throw new Error(`${path}: invalid role`)
      if (node.condition !== undefined && typeof node.condition !== 'string') validateCondition(node.condition, path)
      if (Array.isArray(node.dynamicClasses)) for (const binding of node.dynamicClasses) if (typeof binding !== 'string') {
        const candidate = record(binding, path)
        if (candidate.kind === 'conditional') { validateCondition(candidate.condition, path); text(candidate.whenTrue, path); text(candidate.whenFalse, path) } else validateBinding(binding, path)
      }
      if (node.tag !== undefined && !/^[A-Za-z][A-Za-z0-9-]*$/.test(text(node.tag, path))) throw new Error(`${path}: invalid tag`)
      for (const field of ['className', 'role']) if (node[field] !== undefined) text(node[field], `${path}.${field}`)
      if (node.dynamicClasses !== undefined && (!Array.isArray(node.dynamicClasses) || node.dynamicClasses.some(x => typeof x !== 'string' && (!x || typeof x !== 'object')))) throw new Error(`${path}: invalid dynamicClasses`)
      if (node.attributes !== undefined) for (const [key, val] of Object.entries(record(node.attributes, path))) {
        if (!/^[A-Za-z_][A-Za-z0-9_:.-]*$/.test(key)) throw new Error(`${path}: invalid attribute ${key}`)
        if (typeof val !== 'string') validateBinding(val, `${path}.${key}`)
      }
      if (node.children !== undefined) {
        if (!Array.isArray(node.children)) throw new Error(`${path}.children: expected array`)
        node.children.forEach((child, i) => visit(child, `${path}.children[${i}]`))
      }
      if (node.content !== undefined && typeof node.content !== 'string') {
        const binding = text(record(node.content, path).bindProp, path)
        if (!identifiers.test(binding) || (!declared.has(binding) && !(allowImportedReferences && typeof obj.designComponentId === 'string'))) throw new Error(`${path}: invalid binding`)
      }
    }
    if (!obj.root) throw new Error(`${context}: unsupported layout: Supernova metadata does not contain an explicit component definition`)
    visit(obj.root, `${context}.root`)
    if (obj.behaviors !== undefined) {
      const behaviors = record(obj.behaviors, `${context}.behaviors`)
      for (const flag of ['clickable', 'disabled']) if (behaviors[flag] !== undefined && typeof behaviors[flag] !== 'boolean') throw new Error(`${context}.${flag}: expected boolean`)
      if (behaviors.inputable !== undefined && typeof behaviors.inputable !== 'boolean' && !['none','text','textarea','select','radio','checkbox'].includes(String(behaviors.inputable))) throw new Error(`${context}: unsupported inputable behavior`)
      if (behaviors.variantStyles !== undefined) for (const [key, raw] of Object.entries(record(behaviors.variantStyles, context))) {
        if (!properties.has(key) && !(allowImportedReferences && typeof obj.designComponentId === 'string')) throw new Error(`${context}: variant property ${key} is not declared`)
        for (const val of Object.values(record(raw, context))) text(val, context)
      }
    }
    return obj as unknown as ComponentDefinition
  })
}

export function validateBinding(value: unknown, path: string): asserts value is Binding {
  if (!value || typeof value !== 'object') throw new Error(`${path}: expected binding`)
  const binding = value as Record<string, unknown>
  if (binding.kind === 'literal' && (binding.value === null || ['string', 'boolean'].includes(typeof binding.value) || (typeof binding.value === 'number' && Number.isFinite(binding.value)))) return
  if ((binding.kind === 'prop' || binding.kind === 'state') && typeof binding.name === 'string' && /^[A-Za-z_$][\w$]*$/.test(binding.name)) return
  throw new Error(`${path}: invalid binding`)
}
export function defineComponentDefinition<const T extends ComponentDefinition>(definition: T): T {
  parseDefinitions([definition], true)
  return definition
}

export function validateCondition(value: unknown, path: string): asserts value is Condition {
  if (!value || typeof value !== 'object') throw new Error(`${path}: invalid condition`)
  const condition = value as Record<string, unknown>
  if (condition.kind === 'prop') { validateBinding(condition, path); return }
  if (condition.kind === 'not') { validateCondition(condition.condition, path); return }
  if ((condition.kind === 'and' || condition.kind === 'or') && Array.isArray(condition.conditions) && condition.conditions.length) { condition.conditions.forEach(item => validateCondition(item, path)); return }
  throw new Error(`${path}: invalid condition`)
}

/** Serialized engineering contract, separate from SDK catalog identity. */
export interface ComponentDefinitionPayloadV1 {
  schemaVersion: 1
  designComponentId?: string
  root: ComponentDefinition['root']
  properties?: ComponentDefinition['properties']
  behaviors?: ComponentDefinition['behaviors']
}
