import { Supernova, PulsarContext, RemoteVersionIdentifier } from '@supernovaio/sdk-exporters'
import { ComponentDefinition, ComponentProperty, parseDefinitions } from './schema'

import { camelCase, pascalCase } from '../utils/naming'
import { reportToHost } from '../utils/report'
export const MITOSIS_DEFINITION_PROPERTY = 'mitosisDefinition'
export async function loadComponentDefinitions(sdk: Supernova, context: PulsarContext, version: RemoteVersionIdentifier): Promise<ComponentDefinition[]> {
  const filter = context.brandId ? { brandId: context.brandId } : undefined
  const catalog = await sdk.components.getComponents(version, filter)
  let designs: Awaited<ReturnType<typeof sdk.components.getDesignComponents>> | undefined
  const definitions: unknown[] = []
  const skipped: string[] = []
  for (const component of catalog) {
    const properties = component.properties.filter(property => property.codeName === MITOSIS_DEFINITION_PROPERTY)
    if (properties.length === 0) { skipped.push(component.name); continue }
    if (properties.length !== 1 || properties[0].propertyType !== 'Text') throw new Error(`${component.name}: configure one Supernova Text component property with codeName ${MITOSIS_DEFINITION_PROPERTY}; engineering must supply its versioned implementation definition`)
    const raw = component.propertyValues[properties[0].id]
    if (typeof raw !== 'string' || !raw.trim()) throw new Error(`${component.name}: ${MITOSIS_DEFINITION_PROPERTY} must contain schemaVersion 1 JSON`)
    let payload: Record<string, unknown>
    try { payload = JSON.parse(raw) } catch { throw new Error(`${component.name}: invalid ${MITOSIS_DEFINITION_PROPERTY} JSON`) }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) || payload.schemaVersion !== 1) throw new Error(`${component.name}: unsupported component schemaVersion`)
    let imported: ComponentProperty[] = []
    if (payload.designComponentId !== undefined) {
      if (typeof payload.designComponentId !== 'string') throw new Error(`${component.name}: designComponentId must be a string`)
      designs ??= await sdk.components.getDesignComponents(version, filter)
      const matches = designs.filter(design => design.id === payload.designComponentId)
      if (matches.length !== 1) throw new Error(`${component.name}: designComponentId must match exactly one imported Figma component id`)
      imported = (matches[0].componentPropertyDefinitions || []).map(property => ({ id: property.id, name: property.name, codeName: camelCase(property.name), type: property.type, defaultValue: property.defaultValue, ...(property.options ? { options: property.options } : {}) }))
    }
    const custom = payload.properties === undefined ? [] : payload.properties
    if (!Array.isArray(custom)) throw new Error(`${component.name}: properties must be an array`)
    const merged = [...imported]
    for (const property of custom) {
      if (!property || typeof property !== 'object') throw new Error(`${component.name}: invalid custom property`)
      const key = property.codeName || property.name
      const match = imported.find(existing => (existing.codeName || existing.name) === key)
      if (match) throw new Error(`${component.name}: duplicate imported/custom property ${key}; keep imported property authoritative and remove custom duplicate`)
      merged.push(property)
    }
    definitions.push({ ...payload, id: component.id, name: pascalCase(component.name), description: component.description, designComponentId: undefined, properties: merged })
  }
  if (skipped.length > 0) {
    reportToHost([
      `[supernova-mitosis-exporter] ${skipped.length} component(s) skipped, no ${MITOSIS_DEFINITION_PROPERTY} Text property so no implementation contract is available:`,
      ...skipped.map(name => `  ${name}`)
    ])
  }
  return parseDefinitions(definitions)
}
