import ts from 'typescript';
import { fixVue3ComputedRefs } from './vue3-computed.js';

export function extractDefaultPropsFromSource(source?: string): Map<string, string> {
  const defaults = new Map<string, string>();
  if (!source) return defaults;
  const sf = ts.createSourceFile('comp.lite.tsx', source, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TSX);
  const visit = (node: ts.Node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'useDefaultProps' &&
      node.arguments.length > 0
    ) {
      const arg = node.arguments[0]!;
      if (ts.isObjectLiteralExpression(arg)) {
        for (const prop of arg.properties) {
          if (ts.isPropertyAssignment(prop) && (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name))) {
            defaults.set(prop.name.text, prop.initializer.getText(sf));
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return defaults;
}

function appendVueImport(code: string, symbols: string[]): string {
  const vueImportRe = /import\s*\{([^}]+)\}\s*from\s*["']vue["']\s*;/;
  if (vueImportRe.test(code)) {
    return code.replace(vueImportRe, (_full, existing: string) => {
      const current = existing.split(',').map((s) => s.trim()).filter(Boolean);
      for (const sym of symbols) {
        if (!current.includes(sym)) current.push(sym);
      }
      return `import { ${current.join(', ')} } from "vue";`;
    });
  }
  return code.replace(
    /(<script\s+setup[^>]*>\s*\n)/,
    `$1import { ${symbols.join(', ')} } from "vue";\n`
  );
}

function appendVueUtilsImport(code: string, symbols: string[]): string {
  return code.replace(
    /import\s*\{([^}]+)\}\s*from\s*["']\.\/utils["']\s*;/,
    (_full, existing: string) => {
      const current = existing.split(',').map((s) => s.trim()).filter(Boolean);
      for (const sym of symbols) {
        if (!current.includes(sym)) current.push(sym);
      }
      return `import { ${current.join(', ')} } from "./utils";`;
    }
  );
}

function injectVue3UseId(code: string): string {
  const staticIdRe = /^(\s*id\s*:\s*)(["'][^"']+["'])(\s*,?\s*)$/m;
  const withDefaultsRe = /(withDefaults\(\s*defineProps<[\s\S]*?>\(\)\s*,\s*\{[\s\S]*?\}\s*\)\s*;?)/m;
  const wdMatch = code.match(withDefaultsRe);
  if (!wdMatch || !staticIdRe.test(wdMatch[1]!)) return code;

  const updatedWd = wdMatch[1]!.replace(staticIdRe, '$1""$3');
  let out = code.replace(
    wdMatch[1]!,
    `${updatedWd}\nconst __autoId = useId();\nconst __resolvedId = computed(() => (props.id && String(props.id).trim() !== '' ? props.id : __autoId));`
  );
  out = appendVueImport(out, ['useId', 'computed']);

  const scriptIdx = out.indexOf('<script');
  if (scriptIdx === -1) return out;
  const templatePart = out.slice(0, scriptIdx)
    .replace(/:(id|for)="id"/g, ':$1="__resolvedId"')
    .replace(/\bid\s*\+\s*'-hint'/g, "__resolvedId + '-hint'")
    .replace(/\bid:\s*id\s*\|\|\s*['"][^'"]+['"]/g, 'id: __resolvedId')
    .replace(/\bid:\s*id(?=\s*[,}])/g, 'id: __resolvedId');

  return `${templatePart}${out.slice(scriptIdx)}`;
}

function wireVue3AlertDialog(code: string): string {
  if (!/\bexport\s+interface\s+AlertDialogProps\b/.test(code)) return code;
  let out = appendVueImport(code, ['ref', 'watch', 'onBeforeUnmount']);
  out = appendVueUtilsImport(out, ['createFocusTrap']);

  const hookBlock = `const __dialogRef = ref<HTMLElement | null>(null);
let __cleanupFocusTrap: (() => void) | null = null;
watch(
  [() => props.open, __dialogRef],
  ([isOpen, el]) => {
    if (__cleanupFocusTrap) {
      __cleanupFocusTrap();
      __cleanupFocusTrap = null;
    }
    if (isOpen && el) {
      __cleanupFocusTrap = createFocusTrap(el);
    }
  },
  { flush: 'post' }
);
onBeforeUnmount(() => {
  if (__cleanupFocusTrap) {
    __cleanupFocusTrap();
    __cleanupFocusTrap = null;
  }
});
`;
  out = out.replace(/(<\/script>)/, `${hookBlock}$1`);
  out = out.replace(/(<div\b[^>]*\brole="alertdialog")/, '<div ref="__dialogRef" role="alertdialog"');
  out = out.replace(
    /(<template v-if="open">\s*\n)/,
    '$1    <Teleport to="body" :disabled="inline">\n'
  );
  out = out.replace(
    /(\n\s*<\/template>\s*\n<\/template>)/,
    '\n    </Teleport>$1'
  );
  return out;
}

function wireVue3InputDropdown(code: string): string {
  if (!/\bexport\s+interface\s+InputDropdownProps\b/.test(code)) return code;
  let out = appendVueImport(code, ['ref', 'watch', 'onBeforeUnmount']);
  out = appendVueUtilsImport(out, ['registerClickOutside', 'handleDropdownKeyDown']);

  const hookBlock = `const __rootRef = ref<HTMLElement | null>(null);
let __cleanupClickOutside: (() => void) | null = null;
watch(
  [() => props.open, __rootRef],
  ([isOpen, el]) => {
    if (__cleanupClickOutside) {
      __cleanupClickOutside();
      __cleanupClickOutside = null;
    }
    if (isOpen && el) {
      __cleanupClickOutside = registerClickOutside(el, () => {
        props.onOpenChange?.(false);
      });
    }
  },
  { flush: 'post' }
);
onBeforeUnmount(() => {
  if (__cleanupClickOutside) {
    __cleanupClickOutside();
    __cleanupClickOutside = null;
  }
});
const __onDropdownKeyDown = (event: KeyboardEvent) => {
  handleDropdownKeyDown(event, __rootRef.value, Boolean(props.open), props.onOpenChange);
};
`;
  out = out.replace(/(<\/script>)/, `${hookBlock}$1`);
  out = out.replace(
    /(<template>\s*\n\s*<div\b)/,
    '$1 ref="__rootRef" @keydown="__onDropdownKeyDown"'
  );
  return out;
}

/**
 * Vue 3 Target Framework Adapter (`adapter-vue3.ts`)
 * 1. Fixes chained computed ref unwrapping and useSlots() via `fixVue3ComputedRefs`.
 * 2. Backfills any `useDefaultProps` entries dropped by Mitosis when props are passed as a whole object.
 * 3. Wraps array and object literal defaults inside `withDefaults(defineProps<...>(), { ... })`
 *    into factory functions `() => [...]` / `() => ({...})` as required by Vue 3 + TypeScript.
 * 4. Injects `useId()` fallback for omitted/empty `props.id`.
 * 5. Wires `AlertDialog` (Teleport + `createFocusTrap`) and `InputDropdown` (`registerClickOutside` + keyboard nav).
 */
export function adaptVue3Output(rawCode: string, source?: string): string {
  const fixedComputed = fixVue3ComputedRefs(rawCode);
  const sourceDefaults = extractDefaultPropsFromSource(source);

  let code = fixedComputed
    .replace(
      /\{\{\s*(icon|[a-zA-Z0-9_]+Icon)\s*\}\}/g,
      '<component :is="$1" v-if="$1" class="h-4 w-4 shrink-0" /><slot v-else name="$1" />'
    )
    .replace(
      /(export\s+interface\s+\w+Props\s*\{)([\s\S]*?)(\})/m,
      (full, open: string, body: string, close: string) => {
        const stripped = body.replace(/^\s*children\s*\?\s*:\s*any\s*;?\s*$/gm, '');
        return stripped.trim().length > 0 ? `${open}${stripped}${close}` : full;
      }
    );

  code = code.replace(
    /(withDefaults\(\s*defineProps<[\s\S]*?>\(\)\s*,\s*\{)([\s\S]*?)(\}\s*\))/m,
    (_full, prefix: string, body: string, suffix: string) => {
      const cleanedBody = body.replace(/^\s*children\s*:\s*undefined\s*,?\s*$/gm, '');
      const existingKeys = new Set<string>();
      for (const m of cleanedBody.matchAll(/^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/gm)) {
        existingKeys.add(m[1]!);
      }
      let augmentedBody = cleanedBody;
      for (const [key, valText] of sourceDefaults.entries()) {
        if (!existingKeys.has(key) && key !== 'children') {
          const trimmedBody = augmentedBody.trimEnd();
          const needsComma = trimmedBody.length > 0 && !trimmedBody.endsWith(',');
          augmentedBody = `${trimmedBody}${needsComma ? ',' : ''}\n  ${key}: ${valText},\n`;
        }
      }
      const normalizedBody = augmentedBody.replace(
        /^(\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*:\s*)(\[[\s\S]*?\]|\{[\s\S]*?\})(\s*,?\s*)$/gm,
        (_m, keyPart: string, literalPart: string, tail: string) => {
          const trimmed = literalPart.trim();
          if (trimmed.startsWith('[')) {
            return `${keyPart}() => ${trimmed}${tail}`;
          }
          if (trimmed.startsWith('{')) {
            return `${keyPart}() => (${trimmed})${tail}`;
          }
          return `${keyPart}${literalPart}${tail}`;
        }
      );
      return `${prefix}${normalizedBody}${suffix}`;
    }
  );

  if (/<slot\b/.test(code) && !/\bdefineSlots\b/.test(code)) {
    const slotNames = new Set<string>(['default']);
    for (const m of code.matchAll(/<slot\s+[^>]*name=["']([a-zA-Z0-9_-]+)["']/g)) {
      slotNames.add(m[1]!);
    }
    const slotEntries = [...slotNames].map((s) => `${/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(s) ? s : `'${s}'`}?: () => any`).join('; ');
    code = code.replace(/<\/script>\s*$/, `defineSlots<{ ${slotEntries} }>();\n</script>`);
  }

  code = injectVue3UseId(code);
  code = wireVue3AlertDialog(code);
  code = wireVue3InputDropdown(code);

  return code;
}
