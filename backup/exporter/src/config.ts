export type ExporterConfiguration = {
  exportTokens: boolean
  exportComponents: boolean
  componentExtension: string
  useCssVariables: boolean
  generateIndexFile: boolean
  showDisclaimer: boolean
  disclaimerText: string
  tokensDir: string
  componentsDir: string
  indent: number
}
