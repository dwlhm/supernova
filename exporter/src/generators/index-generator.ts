import { OutputTextFile } from "@supernovaio/sdk-exporters"
import { ExporterConfiguration } from "../config"
import { createFormattedTextFile } from "../utils/file-helper"

/**
 * Generate a root index.ts barrel exporting all generated tokens and components.
 */
export function generateIndexFile(
  config: ExporterConfiguration,
  componentNames: string[],
  hasTokens: boolean
): OutputTextFile | null {
  const statements: string[] = []

  if (hasTokens) {
    statements.push(`export * from './${config.tokensDir}/tokens'`)
  }

  for (const name of componentNames) {
    const ext = config.componentExtension || '.lite.tsx'
    const importPathWithoutExt = ext.replace(/\.tsx$|\.jsx$/, '')
    statements.push(`export { default as ${name} } from './${config.componentsDir}/${name}${importPathWithoutExt}'`)
    statements.push(`export * from './${config.componentsDir}/${name}${importPathWithoutExt}'`)
  }

  if (statements.length === 0) {
    return null
  }

  const content = statements.join('\n') + '\n'

  return createFormattedTextFile(
    '',
    'index.ts',
    content,
    config,
    'slash'
  )
}
