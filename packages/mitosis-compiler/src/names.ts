/**
 * Component names become file names and identifiers in generated code, so they must be plain
 * PascalCase identifiers. Mirrors domain.ValidComponentName in the Go API.
 */
export const COMPONENT_NAME_PATTERN = /^[A-Z][A-Za-z0-9]{0,63}$/;

export function isValidComponentName(name: string): boolean {
  return COMPONENT_NAME_PATTERN.test(name);
}
