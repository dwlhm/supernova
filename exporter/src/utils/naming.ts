/**
 * Utility functions for case conversion and identifier sanitization.
 */

export function sanitizeIdentifier(str: string): string {
  if (!str) return ''
  // Replace characters not allowed in JS identifiers (allowing letters, digits, underscores, hyphens)
  return str.replace(/[^a-zA-Z0-9_-]/g, ' ').trim()
}

export function splitWords(str: string): string[] {
  if (!str) return []
  return sanitizeIdentifier(str)
    // Handle camelCase / PascalCase boundary: "fooBar" -> "foo Bar"
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    // Handle acronym boundary: "XMLHttp" -> "XML Http"
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2')
    // Replace separators (-, _, spaces) with a single space
    .replace(/[-_\s]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
}

export function camelCase(str: string): string {
  const words = splitWords(str)
  if (words.length === 0) return ''
  return words
    .map((word, index) => {
      const lower = word.toLowerCase()
      if (index === 0) {
        return lower
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join('')
}

export function pascalCase(str: string): string {
  const words = splitWords(str)
  if (words.length === 0) return ''
  return words
    .map(word => {
      const lower = word.toLowerCase()
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join('')
}

export function kebabCase(str: string): string {
  const words = splitWords(str)
  if (words.length === 0) return ''
  return words.map(w => w.toLowerCase()).join('-')
}
