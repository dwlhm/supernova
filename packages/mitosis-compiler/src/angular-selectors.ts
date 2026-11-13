/** Native HTML element names: an Angular selector equal to one of these captures every such native element. */
const HTML_ELEMENTS = new Set(
  (
    'a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col ' +
    'colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 ' +
    'h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd label legend li link main map mark menu meta ' +
    'meter nav noscript object ol optgroup option output p picture pre progress q rp rt ruby s samp script search ' +
    'section select slot small source span strong style sub summary sup table tbody td template textarea tfoot th ' +
    'thead time title tr track u ul var video wbr'
  ).split(' ')
);

/** Same casing rules as the Mitosis generator (`TableHeaderRow` -> `table-header-row`, `InputOTP` -> `input-otp`). */
export function toKebabCase(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * `kd-<name>` always; the bare `<name>` alias only when it is not a native element. A bare `button`/`table`
 * selector would also match the component's own native `<button>`/`<table>` and recurse forever.
 */
export function angularSelector(kebabName: string): string {
  const prefixed = `kd-${kebabName}`;
  return HTML_ELEMENTS.has(kebabName) ? prefixed : `${prefixed}, ${kebabName}`;
}

function siblingImportNames(json: any): Set<string> {
  const names = new Set<string>();
  for (const imp of json?.imports ?? []) {
    if (!/\.lite(\.[jt]sx?)?$/.test(String(imp.path))) continue;
    for (const [local, kind] of Object.entries(imp.imports ?? {})) if (kind === 'default') names.add(local);
  }
  return names;
}

function tagSiblingNodes(node: any, siblings: Set<string>): void {
  if (!node || typeof node !== 'object') return;
  if (node['@type'] === '@builder.io/mitosis/node' && siblings.has(node.name)) {
    node.meta = { ...node.meta, selector: `kd-${toKebabCase(node.name)}` };
  }
  for (const val of Object.values(node)) {
    if (Array.isArray(val)) val.forEach((child) => tagSiblingNodes(child, siblings));
    else if (val && typeof val === 'object') tagSiblingNodes(val, siblings);
  }
}

/**
 * Mitosis prints composed siblings as `<kebab-name>`, which for `Button`/`Table` is indistinguishable from the
 * native element. Tag every sibling node with its prefixed selector so the template uses `<kd-button>`.
 */
export function angularSiblingTagPlugin() {
  const pre = (json: any) => {
    tagSiblingNodes(json, siblingImportNames(json));
    return json;
  };
  const plugin = () => ({ json: { pre } });
  plugin.json = { pre };
  return plugin as any;
}
