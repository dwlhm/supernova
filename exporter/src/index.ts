import { Supernova, PulsarContext, RemoteVersionIdentifier, AnyOutputFile } from "@supernovaio/sdk-exporters"
import { ExporterConfiguration } from "./config"
import { generateTokenFiles } from "./generators/token-generator"
import { generateComponentFiles } from "./generators/component-generator"
import { generateIndexFile } from "./generators/index-generator"

/**
 * Supernova Pulsar configuration object.
 */
export const exportConfiguration = Pulsar.exportConfig<ExporterConfiguration>()

/**
 * Supernova Pulsar export entry point.
 */
Pulsar.export(async (sdk: Supernova, context: PulsarContext): Promise<Array<AnyOutputFile>> => {
  const remoteVersionIdentifier: RemoteVersionIdentifier = {
    designSystemId: context.dsId,
    versionId: context.versionId
  }

  const files: Array<AnyOutputFile> = []

  let hasTokens = false
  if (exportConfiguration.exportTokens) {
    const tokenFiles = await generateTokenFiles(sdk, context, exportConfiguration, remoteVersionIdentifier)
    files.push(...tokenFiles)
    hasTokens = tokenFiles.length > 0
  }

  let componentNames: string[] = []
  if (exportConfiguration.exportComponents) {
    const { componentFiles, names } = await generateComponentFiles(sdk, context, exportConfiguration, remoteVersionIdentifier)
    files.push(...componentFiles)
    componentNames = names
  }

  if (exportConfiguration.generateIndexFile) {
    const indexFile = generateIndexFile(exportConfiguration, componentNames, hasTokens)
    if (indexFile) {
      files.push(indexFile)
    }
  }

  return files
})
