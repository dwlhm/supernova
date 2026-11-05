/**
 * React Target Framework Adapter (`adapter-react.ts`)
 * 1. Normalizes JSX DOM attributes (`onInput` -> `onChange` on form controls, `colspan` -> `colSpan`).
 * 2. Rewrites `children?: any` to idiomatic `children?: React.ReactNode`.
 * 3. Attaches imported sibling sub-components onto the root component via `Object.assign` for compound ergonomics.
 * 4. Wires `bindControllerProps` with `React.useState` when `bindControllerProps` is imported.
 */
export function adaptReactOutput(code: string): string {
  let out = code
    .replace(/\bcolspan=/g, 'colSpan=')
    .replace(/\browspan=/g, 'rowSpan=')
    .replace(/\bfor=/g, 'htmlFor=')
    .replace(/\bchildren\s*\?\s*:\s*any\b/g, 'children?: React.ReactNode');

  // Convert Mitosis `<input ... onInput={` and `<textarea ... onInput={` to idiomatic React `onChange={`
  out = out.replace(
    /(<(?:input|textarea)\b[\s\S]*?)\bonInput=\{/g,
    '$1onChange={'
  );

  // If component imports bindControllerProps from ./utils, inject React.useState controller hook
  if (/\bbindControllerProps\b/.test(out) && !/\b__setCtrlState\b/.test(out)) {
    out = out.replace(
      /(props\s*=\s*\{[\s\S]*?\.\.\.props,?\s*\};\n)/,
      '$1  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});\n  props = bindControllerProps(props, __ctrlState, __setCtrlState);\n'
    );
  }

  // Attach imported sibling sub-components for React compound component pattern (e.g. Table.HeaderRow, Tabs.Item)
  const defaultExportMatch = out.match(/export\s+default\s+([A-Z][A-Za-z0-9_]*)\s*;/);
  if (defaultExportMatch) {
    const rootName = defaultExportMatch[1]!;
    const subImports: string[] = [];
    for (const m of out.matchAll(/import\s+([A-Z][A-Za-z0-9_]*)\s+from\s+["']\.\/([A-Z][A-Za-z0-9_]*)["']\s*;/g)) {
      const subName = m[1]!;
      if (subName !== rootName) subImports.push(subName);
    }
    if (subImports.length > 0 && !out.includes(`Object.assign(${rootName},`)) {
      const entries: string[] = [];
      const seenKeys = new Set<string>();
      for (const sub of subImports) {
        if (sub.startsWith(rootName) && sub.length > rootName.length) {
          const shortKey = sub.slice(rootName.length);
          if (/^[A-Z]/.test(shortKey) && !seenKeys.has(shortKey)) {
            seenKeys.add(shortKey);
            entries.push(`${shortKey}: ${sub}`);
          }
        }
        if (!seenKeys.has(sub)) {
          seenKeys.add(sub);
          entries.push(sub);
        }
      }
      out = out.replace(
        defaultExportMatch[0],
        `Object.assign(${rootName}, { ${entries.join(', ')} });\n\n${defaultExportMatch[0]}`
      );
    }
  }

  return out;
}
