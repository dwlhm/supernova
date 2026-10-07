/**
 * Host consoles are optional in the Pulsar sandbox; it provides `console` without `warn`.
 * Reporting is therefore capability-detected and must never abort an export.
 */
export function reportToHost(lines: string[]): void {
  if (lines.length === 0) return
  try {
    if (typeof console === 'undefined') return
    const emit = typeof console.warn === 'function' ? console.warn : typeof console.log === 'function' ? console.log : null
    if (!emit) return
    for (const line of lines) emit.call(console, line)
  } catch {
    // A partial or hostile host console must never fail an export.
  }
}
