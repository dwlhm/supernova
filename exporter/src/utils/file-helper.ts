import { OutputFileType, OutputTextFile } from "@supernovaio/sdk-exporters"
import { ExporterConfiguration } from "../config"

export function getFileDisclaimer(
  config: ExporterConfiguration,
  commentStyle: 'slash' | 'block' = 'slash'
): string {
  if (!config.showDisclaimer) {
    return ''
  }

  const text = config.disclaimerText || 'This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.'

  if (commentStyle === 'block') {
    return `/**\n * ${text}\n */\n\n`
  }

  return `// ${text}\n\n`
}

export function createFormattedTextFile(
  relativePath: string,
  fileName: string,
  content: string,
  config: ExporterConfiguration,
  commentStyle: 'slash' | 'block' = 'slash'
): OutputTextFile {
  if (relativePath.startsWith('/') || /^[A-Za-z]:/.test(relativePath) || relativePath.split(/[\\/]/).some(part => part === '..' || part === '.')) throw new Error('Output directory must be a safe relative path')
  if (!fileName || /[\\/]/.test(fileName)) throw new Error('Output filename must not contain directory separators')
  const disclaimer = getFileDisclaimer(config, commentStyle)
  return {
    path: relativePath,
    name: fileName,
    content: `${disclaimer}${content.trim()}\n`,
    type: OutputFileType.text
  }
}
