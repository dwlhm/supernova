/**
 * React Target Framework Adapter (`adapter-react.ts`)
 * 1. Normalizes JSX DOM attributes (`onInput` -> `onChange` on form controls, `colspan` -> `colSpan`).
 * 2. Rewrites `children?: any` to idiomatic `children?: React.ReactNode`.
 * 3. Injects `React.useId()` fallback for omitted/empty `props.id` when a static default exists.
 * 4. Wraps leaf components (`Button`, `InputText`, `InputTextArea`) in `React.forwardRef` with `...rest` forwarding.
 * 5. Wires `AlertDialog` (Portal + `createFocusTrap`) and `InputDropdown` (`registerClickOutside` + keyboard nav).
 * 6. Attaches imported sibling sub-components onto the root component via `Object.assign` for compound ergonomics.
 * 7. Wires `bindControllerProps` with `React.useState` when `bindControllerProps` is imported.
 */

interface LeafForwardRefSpec {
  htmlAttrType: string;
  elementType: string;
  tag: 'button' | 'input' | 'textarea';
}

const LEAF_FORWARD_REF_SPECS: Record<string, LeafForwardRefSpec> = {
  Button: {
    htmlAttrType: 'React.ButtonHTMLAttributes<HTMLButtonElement>',
    elementType: 'HTMLButtonElement',
    tag: 'button',
  },
  InputText: {
    htmlAttrType: 'React.InputHTMLAttributes<HTMLInputElement>',
    elementType: 'HTMLInputElement',
    tag: 'input',
  },
  InputTextArea: {
    htmlAttrType: 'React.TextareaHTMLAttributes<HTMLTextAreaElement>',
    elementType: 'HTMLTextAreaElement',
    tag: 'textarea',
  },
};

function appendUtilsImports(code: string, symbols: string[]): string {
  return code.replace(
    /import\s*\{([^}]+)\}\s*from\s*["']\.\/utils["']\s*;/,
    (_full, existing: string) => {
      const current = existing
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      for (const sym of symbols) {
        if (!current.includes(sym)) current.push(sym);
      }
      return `import { ${current.join(', ')} } from "./utils";`;
    }
  );
}

function injectReactUseId(code: string): string {
  const defaultBlockMatch = code.match(/(props\s*=\s*\{[\s\S]*?\.\.\.props,?\s*\};\n)/);
  if (!defaultBlockMatch) return code;
  const block = defaultBlockMatch[1]!;
  const staticIdMatch = block.match(/^(\s*id\s*:\s*)(["'][^"']+["'])(\s*,?\s*)$/m);
  if (!staticIdMatch) return code;

  const updatedBlock = block.replace(
    /^(\s*id\s*:\s*)(["'][^"']+["'])(\s*,?\s*)$/m,
    '$1__autoId$3'
  );
  return code.replace(
    defaultBlockMatch[0],
    `const __autoId = React.useId();\n  ${updatedBlock}  if (!props.id || String(props.id).trim() === '') props = { ...props, id: __autoId };\n`
  );
}

function extractInterfaceKeys(code: string, interfaceName: string): string[] {
  const ifaceMatch = code.match(
    new RegExp(`export\\s+interface\\s+${interfaceName}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm')
  );
  if (!ifaceMatch) return [];
  const keys: string[] = [];
  for (const m of ifaceMatch[1]!.matchAll(/^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\??\s*:/gm)) {
    keys.push(m[1]!);
  }
  return keys;
}

function applyReactForwardRefAndRest(code: string): string {
  const fnMatch = code.match(/function\s+([A-Z][A-Za-z0-9_]*)\s*\(\s*props\s*:\s*\1Props\s*\)\s*\{/);
  if (!fnMatch) return code;
  const name = fnMatch[1]!;
  const spec = LEAF_FORWARD_REF_SPECS[name];
  if (!spec) return code;

  const propsName = `${name}Props`;
  const ownKeys = extractInterfaceKeys(code, propsName);
  if (ownKeys.length === 0) return code;

  const omitUnion = ownKeys.map((k) => `'${k}'`).join(' | ');
  let out = code.replace(
    new RegExp(`export\\s+interface\\s+${propsName}\\s*\\{`),
    `export interface ${propsName} extends Omit<${spec.htmlAttrType}, ${omitUnion}> {`
  );

  out = out.replace(
    fnMatch[0],
    `const ${name} = React.forwardRef<${spec.elementType}, ${propsName}>(function ${name}(props, ref) {`
  );

  const destructure = ownKeys.map((k) => `${k}: _${k}`).join(', ');
  out = out.replace(
    /(\n\s*return\s*\()/,
    `\n  const { ${destructure}, ...rest } = props;$1`
  );

  out = out.replace(
    new RegExp(`<${spec.tag}(\\b)`),
    `<${spec.tag}$1 ref={ref} {...rest}`
  );

  out = out.replace(
    new RegExp(`\\n\\}\\s*\\n\\s*export\\s+default\\s+${name}\\s*;`),
    `\n});\n\nexport default ${name};`
  );

  return out;
}

function wireReactAlertDialog(code: string): string {
  if (!/\bfunction\s+AlertDialog\b/.test(code)) return code;
  let out = appendUtilsImports(code, ['createFocusTrap']);
  if (!/\bcreatePortal\b/.test(out)) {
    out = out.replace(
      /(import\s+\*\s+as\s+React\s+from\s+["']react["'];)/,
      '$1\nimport { createPortal } from "react-dom";'
    );
  }

  out = out.replace(
    /(\n\s*return\s*\()/,
    `\n  const __dialogRef = React.useRef<HTMLDivElement>(null);\n  React.useEffect(() => {\n    if (!props.open || !__dialogRef.current) return;\n    return createFocusTrap(__dialogRef.current);\n  }, [props.open]);\n  const __renderOverlay = (node: React.ReactNode) =>\n    !props.inline && typeof document !== "undefined" ? createPortal(node, document.body) : node;$1`
  );

  out = out.replace(
    /(<div\b[^>]*\brole="alertdialog")/,
    '<div ref={__dialogRef} role="alertdialog"'
  );

  out = out.replace(
    /\{props\.open\s*\?\s*\(/,
    '{props.open ? __renderOverlay('
  );

  return out;
}

function wireReactInputDropdown(code: string): string {
  if (!/\bfunction\s+InputDropdown\b/.test(code)) return code;
  let out = appendUtilsImports(code, ['registerClickOutside', 'handleDropdownKeyDown']);

  out = out.replace(
    /(\n\s*return\s*\()/,
    `\n  const __rootRef = React.useRef<HTMLDivElement>(null);\n  React.useEffect(() => {\n    if (!props.open || !__rootRef.current) return;\n    return registerClickOutside(__rootRef.current, () => {\n      props.onOpenChange?.(false);\n    });\n  }, [props.open]);$1`
  );

  out = out.replace(
    /(<div\b\s*id=\{props\.id\})/,
    '<div ref={__rootRef} onKeyDown={(event) => handleDropdownKeyDown(event as any, __rootRef.current, Boolean(props.open), props.onOpenChange)} id={props.id}'
  );

  return out;
}

export function adaptReactOutput(code: string): string {
  let out = code
    .replace(/\bcolspan=/g, 'colSpan=')
    .replace(/\browspan=/g, 'rowSpan=')
    .replace(/\bfor=/g, 'htmlFor=')
    .replace(/\bmaxLength="(\d+)"/g, 'maxLength={$1}')
    .replace(/\bchildren\s*\?\s*:\s*any\b/g, 'children?: React.ReactNode')
    .replace(/\b(icon|[a-zA-Z0-9_]+Icon)\s*\?\s*:\s*any\b/g, '$1?: React.ReactNode | React.ComponentType<any>')
    .replace(
      /\{props\.(icon|[a-zA-Z0-9_]+Icon)\}/g,
      "{props.$1 ? (typeof props.$1 === 'function' || (typeof props.$1 === 'object' && 'render' in props.$1 && !React.isValidElement(props.$1)) ? React.createElement(props.$1 as React.ComponentType<any>, { className: 'h-4 w-4 shrink-0' }) : props.$1) : null}"
    );

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

  out = injectReactUseId(out);
  out = wireReactAlertDialog(out);
  out = wireReactInputDropdown(out);
  out = applyReactForwardRefAndRest(out);

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
