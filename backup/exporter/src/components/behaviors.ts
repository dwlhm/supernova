import type { ComponentDefinition, InputableType } from './schema'

export type BehaviorPropertyType = 'string' | 'number' | 'boolean' | 'any' | 'event' | 'value'
export function inputableType(component: ComponentDefinition): InputableType {
  return component.behaviors?.inputable === true ? 'text' : component.behaviors?.inputable || 'none'
}
const common: Record<string, BehaviorPropertyType> = { name: 'string', disabled: 'boolean', required: 'boolean', label: 'string', error: 'string', helperText: 'string', onChange: 'event', onFocus: 'event', onBlur: 'event' }
export const inputProperties: Record<Exclude<InputableType, 'none'>, Record<string, BehaviorPropertyType>> = {
  text: { ...common, value: 'string', placeholder: 'string', type: 'string' },
  textarea: { ...common, value: 'string', placeholder: 'string', rows: 'number' },
  select: { ...common, value: 'value', options: 'any', placeholder: 'string' },
  radio: { ...common, value: 'any', checked: 'boolean' },
  checkbox: { ...common, value: 'any', checked: 'boolean' }
}
export const inputTags: Record<Exclude<InputableType, 'none'>, string> = { text: 'input', textarea: 'textarea', select: 'select', radio: 'input', checkbox: 'input' }
export const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])
