import { Supernova, PulsarContext, RemoteVersionIdentifier, OutputTextFile } from '@supernovaio/sdk-exporters'
import { ExporterConfiguration } from '../config'
import { createFormattedTextFile } from '../utils/file-helper'
import { exportComponentCatalog } from '../components/adapter'
import { generateComponentSource } from '../components/ast'
import runtimeSource from '../runtime/component-runtime.ts?raw'

export async function generateComponentFiles(
  sdk: Supernova,
  context: PulsarContext,
  config: ExporterConfiguration,
  remoteVersionIdentifier: RemoteVersionIdentifier
): Promise<{ componentFiles: OutputTextFile[]; names: string[]; catalogFile: OutputTextFile }> {
  if (!config.componentsDir) throw new Error('componentsDir must be a nonempty safe relative directory')
  if (config.componentExtension && config.componentExtension !== '.lite.tsx') throw new Error('Mitosis componentExtension must be .lite.tsx')
  const { catalogJson, definitions } = await exportComponentCatalog(sdk, context, remoteVersionIdentifier, config.indent)
  const sources = definitions.map(definition => ({ definition, source: generateComponentSource(definition) }))
  const componentFiles = sources.map(({ definition, source }) => createFormattedTextFile(config.componentsDir, `${definition.name}.lite.tsx`, source.code, config))
  if (sources.some(({ source }) => source.runtimeImports.length > 0)) {
    const parts = config.componentsDir.replace(/\\/g, '/').split('/').filter(Boolean)
    parts.pop()
    componentFiles.push(createFormattedTextFile([...parts, 'runtime'].join('/'), 'component-runtime.ts', runtimeSource, { ...config, showDisclaimer: false }))
  }
  const catalogFile = createFormattedTextFile('', 'components.catalog.json', catalogJson, { ...config, showDisclaimer: false })
  return { componentFiles, names: definitions.map(definition => definition.name), catalogFile }
}
