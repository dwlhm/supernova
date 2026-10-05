import { AnyToken, TokenGroup, TokenType } from '@supernovaio/sdk-exporters'
import { camelCase, kebabCase } from '../utils/naming'
import { resolveTokenValue, ResolvedValue } from './values'

export type NormalizedToken = ResolvedValue & { id: string; category: string; key: string; cssName: string; themeName: string | null }
const categories = new Map<TokenType, string>([
  [TokenType.color, 'colors'], [TokenType.typography, 'typography'], [TokenType.fontSize, 'typography'],
  [TokenType.fontWeight, 'typography'], [TokenType.fontFamily, 'typography'], [TokenType.lineHeight, 'typography'],
  [TokenType.dimension, 'spacing'], [TokenType.size, 'spacing'], [TokenType.space, 'spacing'],
  [TokenType.radius, 'radii'], [TokenType.border, 'borders'], [TokenType.shadow, 'shadows'],
  [TokenType.gradient, 'gradients'], [TokenType.blur, 'blurs'],
  [TokenType.textCase, 'typography'], [TokenType.textDecoration, 'typography'], [TokenType.visibility, 'typography']
])
function groupPaths(groups: TokenGroup[]): Map<string, string[]> {
  const index = new Map<string, TokenGroup>()
  for (const group of groups) {
    if (index.has(group.id)) throw new Error(`Duplicate group ID: ${group.id}`)
    index.set(group.id, group)
  }
  const paths = new Map<string, string[]>()
  const active = new Set<string>()
  function visit(id: string): string[] {
    const cached = paths.get(id)
    if (cached) return cached
    const group = index.get(id)
    if (!group) throw new Error(`Missing token group: ${id}`)
    if (active.has(id)) throw new Error(`Token group cycle: ${id}`)
    active.add(id)
    const parent = group.parentGroupId ? visit(group.parentGroupId) : []
    const path = group.name.trim() ? [...parent, group.name.trim()] : parent
    active.delete(id)
    paths.set(id, path)
    return path
  }
  for (const group of groups) visit(group.id)
  return paths
}
function themeName(type: TokenType, name: string): string | null {
  const prefixes: Partial<Record<TokenType, { output: string; remove: string[] }>> = {
    [TokenType.color]: { output: 'color', remove: ['color-'] },
    [TokenType.shadow]: { output: 'shadow', remove: ['shadow-'] },
    [TokenType.radius]: { output: 'radius', remove: ['radius-', 'radii-'] },
    [TokenType.fontFamily]: { output: 'font', remove: ['font-family-', 'font-'] },
    [TokenType.fontSize]: { output: 'text', remove: ['font-size-', 'text-'] }
  }
  const rule = prefixes[type]
  if (!rule) return null
  const prefix = rule.remove.find(candidate => name.startsWith(candidate))
  return `--${rule.output}-${prefix ? name.slice(prefix.length) : name}`
}
export function normalizeTokens(tokens: AnyToken[], groups: TokenGroup[]): NormalizedToken[] {
  const paths = groupPaths(groups)
  const candidates = tokens.map(token => {
    if (token.parentGroupId && !paths.has(token.parentGroupId)) throw new Error(`Token ${token.id}: missing group ${token.parentGroupId}`)
    const fullName = [...(token.parentGroupId ? paths.get(token.parentGroupId)! : []), token.name].join('-')
    const cssName = kebabCase(fullName)
    const key = camelCase(token.name)
    if (!cssName || !key) throw new Error(`Token ${token.id}: empty normalized name`)
    let value: ResolvedValue
    try { value = resolveTokenValue(token.tokenType, token.value) }
    catch (cause) { throw new Error(`Token ${token.id} (${token.name}): value resolution failed`, { cause }) }
    return { ...value, id: token.id, category: categories.get(token.tokenType) ?? 'other', key, cssName: `--${cssName}`, themeName: themeName(token.tokenType, cssName), fullName }
  })
  const counts = new Map<string, number>()
  for (const token of candidates) {
    const key = `${token.category}:${token.key}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const seen = new Map<string, string>()
  function unique(key: string, id: string) {
    const existing = seen.get(key)
    if (existing !== undefined) throw new Error(`Normalized token collision ${key}: ${existing} and ${id}`)
    seen.set(key, id)
  }
  return candidates.map(({ fullName, ...token }) => {
    if (counts.get(`${token.category}:${token.key}`)! > 1) token.key = camelCase(fullName)
    unique(`css:${token.cssName}`, token.id)
    unique(`category:${token.category}:${token.key}`, token.id)
    if (token.themeName) unique(`theme:${token.themeName}`, token.id)
    return token
  })
}
