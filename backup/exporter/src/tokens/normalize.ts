import { AnyToken, TokenGroup, TokenType } from '@supernovaio/sdk-exporters'
import { camelCase, kebabCase } from '../utils/naming'
import { resolveTokenValue, ResolvedValue } from './values'

export type NormalizedToken = ResolvedValue & { id: string; name: string; category: string; key: string; cssName: string; themeName: string | null }
export type TokenNameCollision = {
  kind: 'css' | 'key' | 'theme'
  id: string
  name: string
  requested: string
  assigned: string
  conflictsWith: string
}
export type NormalizedTokens = { tokens: NormalizedToken[]; collisions: TokenNameCollision[] }
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
export function normalizeTokens(tokens: AnyToken[], groups: TokenGroup[]): NormalizedTokens {
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
    return { ...value, id: token.id, name: token.name, category: categories.get(token.tokenType) ?? 'other', key, cssName: `--${cssName}`, themeName: themeName(token.tokenType, cssName), fullName }
  })
  const counts = new Map<string, number>()
  for (const token of candidates) {
    const key = `${token.category}:${token.key}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const reserved = new Map<string, string>()
  const collisions: TokenNameCollision[] = []
  /** Reserves a name in encounter order; duplicates take a deterministic numeric suffix instead of failing the export. */
  function reserve(kind: TokenNameCollision['kind'], namespace: string, token: { id: string; name: string }, requested: string, suffixed: (index: number) => string): string {
    const owner = reserved.get(`${namespace}:${requested}`)
    if (owner === undefined) {
      reserved.set(`${namespace}:${requested}`, token.id)
      return requested
    }
    for (let index = 2; ; index++) {
      const candidate = suffixed(index)
      if (!reserved.has(`${namespace}:${candidate}`)) {
        reserved.set(`${namespace}:${candidate}`, token.id)
        collisions.push({ kind, id: token.id, name: token.name, requested, assigned: candidate, conflictsWith: owner })
        return candidate
      }
    }
  }
  const tokens_ = candidates.map(({ fullName, ...token }) => {
    if (counts.get(`${token.category}:${token.key}`)! > 1) token.key = camelCase(fullName)
    token.cssName = reserve('css', 'css', token, token.cssName, index => `${token.cssName}-${index}`)
    token.key = reserve('key', `key:${token.category}`, token, token.key, index => `${token.key}${index}`)
    if (token.themeName !== null) token.themeName = reserve('theme', 'theme', token, token.themeName, index => `${token.themeName}-${index}`)
    return token
  })
  return { tokens: tokens_, collisions }
}
