import { GradientType, TokenType, Unit } from '@supernovaio/sdk-exporters'

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }
export type ResolvedValue = { css: string; js: JsonValue }

function record(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected a value record')
  return value as Record<string, unknown>
}
function number(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('Expected a finite numeric value')
  return value
}
function text(value: unknown): string {
  if (typeof value === 'string') return value
  const result = record(value).text
  if (typeof result !== 'string') throw new Error('Expected a text value')
  return result
}
const units: Record<string, string> = {
  [Unit.pixels]: 'px', [Unit.percent]: '%', [Unit.rem]: 'rem', [Unit.ms]: 'ms', [Unit.raw]: '',
  px: 'px', pt: 'pt', '%': '%', rem: 'rem', ms: 'ms', Points: 'pt', None: '', Milliseconds: 'ms'
}
export function measure(value: unknown): string {
  if (typeof value === 'number') return `${number(value)}px`
  if (typeof value === 'string') return value
  const data = record(value)
  const unit = data.unit ?? Unit.pixels
  if (typeof unit !== 'string' || !Object.hasOwn(units, unit)) throw new Error(`Unsupported measure unit: ${String(unit)}`)
  return `${number(data.measure)}${units[unit]}`
}
/** Compatibility boundary for fixtures predating SDK ColorTokenValue. */
function legacyColor(data: Record<string, unknown>): string {
  const alpha = data.a === undefined ? 1 : number(data.a)
  if (typeof data.hex === 'string' && alpha === 1) return data.hex.startsWith('#') ? data.hex : `#${data.hex}`
  return rgba(data, alpha)
}
function rgba(data: Record<string, unknown>, alpha: number): string {
  const channels = [number(data.r), number(data.g), number(data.b)]
  if (channels.some(channel => channel < 0 || channel > 255) || alpha < 0 || alpha > 1) throw new Error('Color channels or opacity are out of range')
  return `rgba(${channels.map(Math.round).join(', ')}, ${alpha})`
}
export function color(value: unknown): string {
  if (typeof value === 'string') return value
  const data = record(value)
  if (data.color !== undefined) return rgba(record(data.color), number(record(data.opacity).measure))
  return legacyColor(data)
}
function option(value: unknown): string {
  if (typeof value === 'string') return value
  const result = record(value).value
  if (typeof result !== 'string') throw new Error('Expected an option value')
  return result
}
const textCaseCss: Record<string, string> = { Original: 'none', Upper: 'uppercase', Lower: 'lowercase', Camel: 'capitalize', SmallCaps: 'small-caps' }
const textDecorationCss: Record<string, string> = { None: 'none', Underline: 'underline', Strikethrough: 'line-through' }
/** Clockwise angle from the CSS `to top` origin; mathematically identical to Supernova's branching conversion. */
function gradientAngle(from: Record<string, unknown>, to: Record<string, unknown>): number {
  const angle = Math.atan2(number(to.x) - number(from.x), number(from.y) - number(to.y)) * (180 / Math.PI)
  return Math.round(angle * 100) / 100
}
function gradientLayer(value: unknown): string {
  const layer = record(value)
  if (!Array.isArray(layer.stops) || layer.stops.length === 0) throw new Error('Gradient requires at least one stop')
  const stops = layer.stops.map(stop => {
    const data = record(stop)
    return `${color(data.color)} ${Math.round(number(data.position) * 10000) / 100}%`
  }).join(', ')
  switch (layer.type) {
    case GradientType.radial: return `radial-gradient(circle, ${stops})`
    case GradientType.angular: return `conic-gradient(${stops})`
    default: return `linear-gradient(${gradientAngle(record(layer.from), record(layer.to))}deg, ${stops})`
  }
}
const familyCss = (family: string) => family.includes(' ') ? JSON.stringify(family) : family
const scalar = (css: string): ResolvedValue => ({ css, js: css })

export function resolveTokenValue(type: TokenType, value: unknown): ResolvedValue {
  if (value === null || value === undefined) throw new Error('Missing token value')
  switch (type) {
    case TokenType.color: return scalar(color(value))
    case TokenType.radius: {
      const data = typeof value === 'object' ? record(value) : null
      return scalar(measure(data?.radius ?? value))
    }
    case TokenType.dimension: case TokenType.size: case TokenType.space:
    case TokenType.fontSize: case TokenType.lineHeight: case TokenType.letterSpacing:
      return scalar(measure(value))
    case TokenType.duration:
      return scalar(typeof value === 'number' ? `${number(value)}ms` : measure(value))
    case TokenType.zIndex: {
      const result = number(typeof value === 'number' ? value : record(value).measure)
      if (!Number.isInteger(result)) throw new Error('Z-index must be an integer')
      return { css: String(result), js: result }
    }
    case TokenType.opacity: {
      const result = number(typeof value === 'number' ? value : record(value).measure)
      if (result < 0 || result > 1) throw new Error('Opacity must be between 0 and 1')
      return { css: String(result), js: result }
    }
    case TokenType.fontWeight: {
      const result = typeof value === 'number' ? number(value) : text(value)
      return { css: String(result), js: result }
    }
    case TokenType.fontFamily: {
      const family = text(value)
      return { css: familyCss(family), js: family }
    }
    case TokenType.border: {
      const data = record(value)
      const width = measure(data.width)
      if (typeof data.style !== 'string') throw new Error('Missing border style')
      const style = data.style.toLowerCase()
      const resolvedColor = color(data.color)
      return { css: `${width} ${style} ${resolvedColor}`, js: { width, style, color: resolvedColor } }
    }
    case TokenType.gradient:
      return scalar((Array.isArray(value) ? value : [value]).map(gradientLayer).join(', '))
    case TokenType.blur:
      return scalar(`blur(${measure(record(value).radius)})`)
    case TokenType.textCase: {
      const result = option(value)
      return scalar(textCaseCss[result] ?? result.toLowerCase())
    }
    case TokenType.textDecoration: {
      const result = option(value)
      return scalar(textDecorationCss[result] ?? result.toLowerCase())
    }
    case TokenType.visibility:
      return scalar(option(value).toLowerCase())
    case TokenType.shadow: {
      const layers = Array.isArray(value) ? value : [value]
      return scalar(layers.map(layer => {
        const data = record(layer)
        return `${data.type === 'Inner' ? 'inset ' : ''}${measure(data.x)} ${measure(data.y)} ${measure(data.radius)} ${measure(data.spread)} ${color(data.color)}`
      }).join(', '))
    }
    case TokenType.typography: {
      const data = record(value)
      const fontFamily = text(data.fontFamily)
      const fontSize = measure(data.fontSize)
      const fontWeight = text(data.fontWeight)
      const lineHeight = data.lineHeight === null ? 'normal' : measure(data.lineHeight)
      const letterSpacing = measure(data.letterSpacing)
      return { css: `${fontWeight} ${fontSize}/${lineHeight} ${familyCss(fontFamily)}`, js: { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } }
    }
    default: {
      if (typeof value === 'string' || typeof value === 'boolean') return { css: String(value), js: value }
      if (typeof value === 'number') return { css: String(number(value)), js: value }
      const data = record(value)
      if (data.text !== undefined) return scalar(text(data))
      if (data.measure !== undefined) return scalar(measure(data))
      throw new Error(`Unsupported token type: ${type}`)
    }
  }
}
