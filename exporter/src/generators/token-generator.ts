import { Supernova, PulsarContext, RemoteVersionIdentifier, OutputTextFile } from '@supernovaio/sdk-exporters'
import { ExporterConfiguration } from '../config'
import { createFormattedTextFile } from '../utils/file-helper'
import { normalizeTokens } from '../tokens/normalize'
import { JsonValue } from '../tokens/values'
import { reportToHost } from '../utils/report'

/** SDK I/O boundary; rendering consumes the same normalized values for every output. */
export async function generateTokenFiles(
  sdk: Supernova,
  context: PulsarContext,
  config: ExporterConfiguration,
  remoteVersionIdentifier: RemoteVersionIdentifier
): Promise<OutputTextFile[]> {
  if (!Number.isInteger(config.indent) || config.indent < 0 || config.indent > 10) {
    throw new Error('Token exporter indent must be an integer between 0 and 10')
  }
  const filter = context.brandId ? { brandId: context.brandId } : undefined
  let tokens
  let groups
  try {
    [tokens, groups] = await Promise.all([
      sdk.tokens.getTokens(remoteVersionIdentifier, filter),
      sdk.tokens.getTokenGroups(remoteVersionIdentifier, filter)
    ])
  } catch (cause) {
    throw new Error(`Unable to load tokens/groups for version ${context.versionId}`, { cause })
  }
  const themeIds = context.themeIds ?? (context.themeId ? [context.themeId] : [])
  if (themeIds.length > 0) {
    try {
      const themes = await sdk.tokens.getTokenThemes(remoteVersionIdentifier, filter)
      const selected = themeIds.map(id => {
        const theme = themes.find(candidate => candidate.id === id)
        if (!theme) throw new Error(`Requested theme not found: ${id}`)
        return theme
      })
      tokens = await sdk.tokens.computeTokensByApplyingThemes(tokens, tokens, selected)
    } catch (cause) {
      throw new Error(`Unable to apply token themes: ${themeIds.join(', ')}`, { cause })
    }
  }
  const { tokens: normalized, collisions } = normalizeTokens(tokens, groups)
  const collisionLines = collisions.map(collision => `${collision.kind} ${collision.requested} -> ${collision.assigned} (token ${collision.id}, conflicts with ${collision.conflictsWith})`)
  if (collisions.length > 0) {
    reportToHost([
      `[supernova-mitosis-exporter] ${collisions.length} duplicate token name(s) disambiguated:`,
      ...collisionLines.map(line => `  ${line}`)
    ])
  }
  const slashNotice = collisions.length === 0 ? '' : `// Duplicate token names disambiguated during export:\n${collisionLines.map(line => `//   ${line}`).join('\n')}\n\n`
  const blockNotice = collisions.length === 0 ? '' : `/**\n * Duplicate token names disambiguated during export:\n${collisionLines.map(line => ` *   ${line}`).join('\n')}\n */\n\n`
  const categorized: Record<string, Record<string, JsonValue>> = Object.create(null)
  for (const token of normalized) {
    categorized[token.category] ??= Object.create(null)
    categorized[token.category][token.key] = token.js
  }
  const files: OutputTextFile[] = [createFormattedTextFile(
    config.tokensDir, 'tokens.ts',
    `${slashNotice}export const tokens = ${JSON.stringify(categorized, null, config.indent)} as const;\n\nexport type Tokens = typeof tokens;\nexport default tokens;\n`,
    config, 'slash'
  )]
  const indent = ' '.repeat(config.indent)
  if (config.useCssVariables) {
    files.push(createFormattedTextFile(config.tokensDir, 'tokens.css',
      `${blockNotice}:root {\n${normalized.map(token => `${indent}${token.cssName}: ${token.css};`).join('\n')}\n}\n`, config, 'block'))
  }
  const themeVariables = normalized.filter(token => token.themeName !== null)
  if (themeVariables.length > 0) {
    files.push(createFormattedTextFile(config.tokensDir, 'theme.css',
      `${blockNotice}/**\n * Tailwind CSS v4 Theme Configuration\n * Usage in main css:\n *   @import "tailwindcss";\n *   @import "./${config.tokensDir}/theme.css";\n */\n\n@theme {\n${themeVariables.map(token => `${indent}${token.themeName}: ${token.css};`).join('\n')}\n}\n`,
      config, 'block'))
  }
  return files
}
