import { Supernova, PulsarContext, RemoteVersionIdentifier } from '@supernovaio/sdk-exporters'
import { ComponentDefinition, ComponentProperty, parseDefinitions } from './schema'
import { camelCase, pascalCase } from '../utils/naming'
import { reportToHost } from '../utils/report'

export const MITOSIS_DEFINITION_PROPERTY = 'mitosisDefinition'

export interface ComponentCatalogFigmaOrigin {
  fileId: string | null
  nodeId: string | null
  sourceId: string | null
  componentPropertyDefinitions: unknown[]
  variantPropertyValues: Record<string, string> | null
  variants?: Array<{
    id: string
    name: string
    variantPropertyValues: Record<string, string> | null
    origin: {
      fileId: string | null
      nodeId: string | null
      sourceId: string | null
    } | null
    updatedAt: string | null
  }>
  updatedAt: string | null
}

export interface ComponentCatalogItem {
  id: string
  name: string
  description: string
  brandId: string | null
  hasMitosisDefinition: boolean
  fileId: string | null
  nodeId: string | null
  sourceId: string | null
  componentPropertyDefinitions: unknown[]
  variantPropertyValues: Record<string, string> | null
  updatedAt: string | null
  figma: ComponentCatalogFigmaOrigin | null
}

function findLinkedDesignComponent(
  component: { id: string; name: string; properties?: any[]; propertyValues?: Record<string, any> },
  designs: Array<any>,
  explicitDesignComponentId?: string
) {
  if (explicitDesignComponentId) {
    const match = designs.find(d => d.id === explicitDesignComponentId || d.idInVersion === explicitDesignComponentId)
    if (match) return match
  }

  for (const prop of component.properties || []) {
    const isFigmaLink =
      prop.linkElementType === 'FigmaComponent' ||
      prop.codeName === 'figmaComponent' ||
      prop.codeName === 'designComponent' ||
      prop.codeName === 'figma'
    if (isFigmaLink) {
      const val = component.propertyValues?.[prop.id] ?? component.propertyValues?.[prop.codeName]
      if (typeof val === 'string' && val) {
        const match = designs.find(d => d.id === val || d.idInVersion === val)
        if (match) return match
      }
    }
  }

  const directId = (component as any).designComponentId || (component as any).figmaComponentId
  if (typeof directId === 'string' && directId) {
    const match = designs.find(d => d.id === directId || d.idInVersion === directId)
    if (match) return match
  }

  const idMatch = designs.find(d => d.id === component.id || d.idInVersion === component.id)
  if (idMatch) return idMatch

  const nameMatch = designs.find(d => d.name && d.name.trim().toLowerCase() === component.name.trim().toLowerCase())
  if (nameMatch) return nameMatch

  return undefined
}

function extractFigmaOrigin(
  component: { id: string; name: string; updatedAt?: Date | string | null },
  linkedDesign?: any
): {
  fileId: string | null
  nodeId: string | null
  sourceId: string | null
  componentPropertyDefinitions: unknown[]
  variantPropertyValues: Record<string, string> | null
  updatedAt: string | null
  figma: ComponentCatalogFigmaOrigin | null
} {
  if (!linkedDesign) {
    const compUpdatedAt = component.updatedAt
      ? (component.updatedAt instanceof Date ? component.updatedAt.toISOString() : String(component.updatedAt))
      : null

    return {
      fileId: null,
      nodeId: null,
      sourceId: null,
      componentPropertyDefinitions: [],
      variantPropertyValues: null,
      updatedAt: compUpdatedAt,
      figma: null
    }
  }

  const fileId = linkedDesign.origin?.fileId ?? linkedDesign.fileId ?? null
  const nodeId = linkedDesign.origin?.nodeId ?? linkedDesign.nodeId ?? null
  const sourceId = linkedDesign.origin?.sourceId ?? linkedDesign.sourceId ?? null

  const rawDefs = (linkedDesign as any).componentPropertyDefinitions
  const propList = Array.isArray(rawDefs) ? rawDefs : (rawDefs && typeof rawDefs === 'object' ? Object.values(rawDefs) : [])
  const componentPropertyDefinitions = propList.map((p: any) => ({
    id: p.id,
    name: p.name,
    codeName: camelCase(p.name),
    type: p.type,
    defaultValue: p.defaultValue,
    ...(p.options ? { options: p.options } : {})
  }))

  const variantPropertyValues = linkedDesign.variantPropertyValues ??
    (Array.isArray(linkedDesign.children) ? linkedDesign.children.find((c: any) => c.variantPropertyValues)?.variantPropertyValues ?? null : null)

  const figmaUpdatedAt = linkedDesign.updatedAt
    ? (linkedDesign.updatedAt instanceof Date ? linkedDesign.updatedAt.toISOString() : String(linkedDesign.updatedAt))
    : (component.updatedAt
      ? (component.updatedAt instanceof Date ? component.updatedAt.toISOString() : String(component.updatedAt))
      : null)

  const variants = Array.isArray(linkedDesign.children)
    ? linkedDesign.children.map((child: any) => ({
        id: child.id,
        name: child.name,
        variantPropertyValues: child.variantPropertyValues || null,
        origin: child.origin ? {
          fileId: child.origin.fileId ?? null,
          nodeId: child.origin.nodeId ?? null,
          sourceId: child.origin.sourceId ?? null
        } : null,
        updatedAt: child.updatedAt
          ? (child.updatedAt instanceof Date ? child.updatedAt.toISOString() : String(child.updatedAt))
          : null
      }))
    : []

  const figma: ComponentCatalogFigmaOrigin = {
    fileId,
    nodeId,
    sourceId,
    componentPropertyDefinitions,
    variantPropertyValues,
    variants,
    updatedAt: figmaUpdatedAt
  }

  return {
    fileId,
    nodeId,
    sourceId,
    componentPropertyDefinitions,
    variantPropertyValues,
    updatedAt: figmaUpdatedAt,
    figma
  }
}

export async function exportComponentCatalog(
  sdk: Supernova,
  context: PulsarContext,
  version: RemoteVersionIdentifier,
  indent = 2
): Promise<{ catalogJson: string; definitions: ComponentDefinition[] }> {
  const filter = context.brandId ? { brandId: context.brandId } : undefined
  const catalog = await sdk.components.getComponents(version, filter)
  let designs: Awaited<ReturnType<typeof sdk.components.getDesignComponents>> = []
  try {
    designs = (await sdk.components.getDesignComponents(version, filter)) || []
  } catch {
    designs = []
  }

  const definitions: unknown[] = []
  const catalogEntries: ComponentCatalogItem[] = []
  const skipped: string[] = []

  for (const component of catalog) {
    const properties = (component.properties || []).filter(property => property.codeName === MITOSIS_DEFINITION_PROPERTY)
    let explicitDesignComponentId: string | undefined
    let hasMitosisDefinition = false

    if (properties.length === 0) {
      skipped.push(component.name)
    } else {
      if (properties.length !== 1 || properties[0].propertyType !== 'Text') {
        throw new Error(`${component.name}: configure one Supernova Text component property with codeName ${MITOSIS_DEFINITION_PROPERTY}; engineering must supply its versioned implementation definition`)
      }
      const raw = component.propertyValues?.[properties[0].id]
      if (typeof raw !== 'string' || !raw.trim()) {
        throw new Error(`${component.name}: ${MITOSIS_DEFINITION_PROPERTY} must contain schemaVersion 1 JSON`)
      }
      let payload: Record<string, unknown>
      try {
        payload = JSON.parse(raw)
      } catch {
        throw new Error(`${component.name}: invalid ${MITOSIS_DEFINITION_PROPERTY} JSON`)
      }
      if (!payload || typeof payload !== 'object' || Array.isArray(payload) || payload.schemaVersion !== 1) {
        throw new Error(`${component.name}: unsupported component schemaVersion`)
      }

      hasMitosisDefinition = true
      let imported: ComponentProperty[] = []

      if (payload.designComponentId !== undefined) {
        if (typeof payload.designComponentId !== 'string') throw new Error(`${component.name}: designComponentId must be a string`)
        explicitDesignComponentId = payload.designComponentId
        const matches = designs.filter(design => design.id === payload.designComponentId || design.idInVersion === payload.designComponentId)
        if (matches.length !== 1) throw new Error(`${component.name}: designComponentId must match exactly one imported Figma component id`)
        const rawDefs = (matches[0] as any).componentPropertyDefinitions
        const propList = Array.isArray(rawDefs) ? rawDefs : (rawDefs && typeof rawDefs === 'object' ? Object.values(rawDefs) : [])
        imported = propList.map((property: any) => ({
          id: property.id,
          name: property.name,
          codeName: camelCase(property.name),
          type: property.type,
          defaultValue: property.defaultValue,
          ...(property.options ? { options: property.options } : {})
        }))
      }

      const custom = payload.properties === undefined ? [] : payload.properties
      if (!Array.isArray(custom)) throw new Error(`${component.name}: properties must be an array`)
      const merged = [...imported]
      for (const property of custom) {
        if (!property || typeof property !== 'object') throw new Error(`${component.name}: invalid custom property`)
        const key = (property as any).codeName || (property as any).name
        const match = imported.find(existing => (existing.codeName || existing.name) === key)
        if (match) throw new Error(`${component.name}: duplicate imported/custom property ${key}; keep imported property authoritative and remove custom duplicate`)
        merged.push(property as ComponentProperty)
      }

      definitions.push({
        ...payload,
        id: component.id,
        name: pascalCase(component.name),
        description: component.description,
        designComponentId: undefined,
        properties: merged
      })
    }

    const linkedDesign = findLinkedDesignComponent(component, designs, explicitDesignComponentId)
    const figmaOrigin = extractFigmaOrigin(component, linkedDesign)

    catalogEntries.push({
      id: component.id,
      name: component.name,
      description: component.description || '',
      brandId: component.brandId || null,
      hasMitosisDefinition,
      fileId: figmaOrigin.fileId,
      nodeId: figmaOrigin.nodeId,
      sourceId: figmaOrigin.sourceId,
      componentPropertyDefinitions: figmaOrigin.componentPropertyDefinitions,
      variantPropertyValues: figmaOrigin.variantPropertyValues,
      updatedAt: figmaOrigin.updatedAt,
      figma: figmaOrigin.figma
    })
  }

  if (skipped.length > 0) {
    reportToHost([
      `[supernova-mitosis-exporter] ${skipped.length} component(s) skipped, no ${MITOSIS_DEFINITION_PROPERTY} Text property so no implementation contract is available:`,
      ...skipped.map(name => `  ${name}`)
    ])
  }

  const catalogJson = JSON.stringify(catalogEntries, null, indent)
  return {
    catalogJson,
    definitions: parseDefinitions(definitions)
  }
}

export async function loadComponentDefinitions(
  sdk: Supernova,
  context: PulsarContext,
  version: RemoteVersionIdentifier
): Promise<ComponentDefinition[]> {
  const { definitions } = await exportComponentCatalog(sdk, context, version)
  return definitions
}
