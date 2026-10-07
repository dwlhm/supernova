/** Static framework independent behavior. Generated components supply all design values. */
export function resolveVariantClass(styles: Record<string, string>, value: unknown, fallback: unknown): string {
  const key = value === undefined ? fallback : value
  return typeof key === 'string' && Object.prototype.hasOwnProperty.call(styles, key) ? styles[key] : ''
}

export function dispatchEvent(handler: ((event: unknown) => void) | undefined, event: unknown, disabled = false): void {
  if (!disabled && typeof handler === 'function') handler(event)
}
