# Shared component contract

This contract separates generated presentation from the interaction and accessibility decisions owned by engineers. It applies to Figma imports and explicit Supernova `mitosisDefinition` components; their capabilities differ.

## Result / Crack / Need

**Result:** Figma scene nodes and properties become Mitosis props, bindings and presentation; typed definitions become explicitly authored nodes and attributes. Mitosis compilation supplies framework components, whose terminal sink is the browser DOM. Content changes must reach the rendered text, controlled changes must reach the caller, and associations must reach the actual native control.

**Crack:** A visual state named Open, Error or Disabled does not prove calendar behavior, validation or focus management. Duplicate IDs, missing description targets, unnamed icon buttons and focus suppression break the contract. Inferred prop names can change when layers are renamed or reordered. Invalid typed definitions fail validation rather than providing invented layouts.

**Need:** Stable explicit Figma properties for public APIs; loaded token theme/Tailwind utilities; caller-owned state and validation; unique IDs with rendered targets; an engineering contract for composite widgets; verification in each supported framework and browser.

## Four independent parts

| Part | Shared shape | Required caller / engineering decision |
| --- | --- | --- |
| Content | Editable strings and explicit slots; design text supplies defaults | Public names, localization, empty content, visibility and slot ownership |
| Appearance | Design variants, layout, token utilities and `className` where supported | Supported variants, responsive layout, error/disabled styles and visible focus |
| Behavior | Native controls; controlled `value` / `checked`; original event callbacks | State owner, event interpretation, validation, loading/error recovery and keyboard transitions |
| Accessibility | Native semantics, control IDs, labels, descriptions and truthful state | Actual control association, accessible name, keyboard/focus ownership and assistive technology tests |

Content visibility and content values remain separate. A boolean `hintText` controls visibility; a string such as `hintTextContent` supplies copy. An empty string intentionally clears copy; a missing value uses the design default. Business validation and async state belong to the caller rather than the presentation exporter.

## Figma text and root hooks

Explicit Figma text-property references take precedence. Each unbound TEXT node gets a camelCase string prop derived from its layer name, with the original characters and whitespace as its default. Rendering uses `props.name ?? "design default"`, so `""` is preserved. Conflicts with boolean, event, variant or standard props receive `Content`, then numeric suffixes as needed. Repeated inferred names receive independent props. A root button with one direct text node uses the `label` convenience prop unless the node has an explicit binding; multiple text nodes remain independently editable. Prefer explicit text properties for a stable public API: layer renames and traversal reordering can change inferred names.

Figma-generated roots expose optional `id` and `ariaDescribedby` bindings. Native button roots additionally expose `ariaLabel` and `ariaLabelledby`; generic `div`, `p` and `span` roots do not receive naming attributes. The caller supplies unique IDs and real description/name targets. These hooks address the visual root: if an input is nested inside a visual wrapper, the wrapper ID does not label that input. Use an explicit engineering definition to associate the actual control.

Generated Figma native buttons use `type="button"`, preserve native keyboard activation and existing root disabled behavior, and do not add `focus:outline-none`. The generator does not infer roles, `tabIndex`, `aria-expanded`, focus traps or widget state from layer names. Focus still needs visual verification against the final theme. Icons are hidden from assistive technology only when explicitly identified as decorative in the engineering contract.

## Native form and accessibility target

Use native `button`, `input`, `textarea` and `select` elements for their respective interactions. Associate a real `label` with the control through `htmlFor` and a unique control `id`. Put helper/error IDs in the control's `aria-describedby`, including only rendered targets, and put `aria-invalid` on that control when invalid. Icon-only buttons require a meaningful accessible name; visible text is normally the name for text buttons. The [W3C APG guidance](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) explains that ARIA roles do not supply keyboard behavior. The [generic-role specification](https://www.w3.org/TR/wai-aria-1.2/#generic) prohibits accessible naming of generic elements.

The following is a **consumer/engineering React target**, not automatic Figma output or a JSON definition. `onChange` receives the native framework event; the caller decides how to update its controlled value. IDs must be unique across instances.

```tsx
import type * as React from "react";

interface FieldProps {
  id: string;
  label: string;
  value: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

function Field(props: FieldProps) {
  const helperId = props.helperText ? `${props.id}-help` : undefined;
  const errorId = props.error ? `${props.id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        value={props.value}
        disabled={props.disabled}
        required={props.required}
        aria-describedby={describedBy}
        aria-invalid={props.error ? true : undefined}
        onChange={props.onChange}
      />
      {props.helperText && <p id={helperId}>{props.helperText}</p>}
      {props.error && <p id={errorId}>{props.error}</p>}
    </div>
  );
}
```

The typed-definition pipeline supports explicit `tag`, `attributes`, declared props, content bindings and conditional child nodes. Its `inputable` behavior provides controlled native input attributes and forwards original `onChange`, `onFocus` and `onBlur` events. It does **not** automatically render label/helper/error nodes, connect their IDs, validate values, normalize events to values or implement composite widgets. Define those nodes and associations explicitly. A typed native button needs an explicit `type="button"` attribute; Figma button defaults are a separate pipeline policy.

## Composite widgets and DatePicker

A generated DatePicker with editable label and placeholder text remains a presentation until an interaction contract exists. Define selected date/range types, locale/time zone, parse/format rules, limits, invalid/empty states, controlled open/selection state and caller notification before implementing a calendar. A visual `state="Open"` variant alone does not supply those behaviors.

For a modal calendar, define focus entry, modal focus containment, Escape dismissal, focus return to the trigger, arrow navigation through dates, month/year navigation, selection and announcements. Release focus ownership and any listeners when the overlay closes or unmounts. The [W3C date picker dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/) provides a concrete keyboard and focus contract to adapt and test. Do not add modal roles or expanded/selected state until the behavior actually fulfills them.

## Reusable readiness template

Complete this table per component before calling it ready:

| Contract item | Required evidence |
| --- | --- |
| Content API | Explicit/inferred names recorded; custom and empty strings reach each text node; repeated content stays independent |
| Appearance | Variants and token matches checked; exact fallback values explained; visible focus, responsive and disabled states checked |
| Behavior | State/event owner named; native original events documented; keyboard, empty, invalid and recovery paths exercised |
| Accessibility | Real labels/control IDs and description targets checked; truthful states; icon names/decorative handling; overlay focus lifecycle where relevant |
| Targets | Equivalent DOM semantics and event contracts checked in every supported framework |

Contrast, target size, screen reader operation and browser interoperability are **UNVERIFIED** until tested on the actual generated/consuming component. Generation and successful compilation alone are not accessibility certification.

Existing generated files are not rewritten by this contract. Synchronization preserves existing `.lite.tsx` files when design fingerprints are unchanged, even if converter code changed. `npm run generate:components` recompiles current Mitosis sources; it does not refresh Figma text props. To refresh an individual source, provide its real file/node IDs and reviewed output path to the converter, then compile packages:

```bash
node scripts/figma-to-mitosis.js --file=<real-file-id> --node=<real-node-id> --out=components/<component-name>.lite.tsx
npm run generate:components
```

Replace the angle-bracket placeholders before running the commands. Review the generated source/API changes before compilation; no force-sync flag exists.

## Generation-time composition contract

**Result:** a catalog component plus explicit internal composition metadata selects source nodes and produces one fixed `.lite.tsx` component per part. The existing compiler generates all parts and exports for React, Vue 3, Vue 2 and Svelte. Consumers own item data, order and repetition. Design examples are replaced at the part's slot; no internal design `type`, mode, count or visibility property is automatically exposed.

**Crack:** invalid metadata, missing or duplicate source node IDs, duplicate output names, undeclared attribute bindings, unsupported tags and existing unowned output collisions fail explicitly. The output namespace is checked before writes. Regeneration tracks all owned source files and their hashes; removed parts are deleted only if their source still matches the last generated hash. Modified removed parts block regeneration/removal before any replacement sources are written; review or move those custom files first. Missing parts trigger regeneration. A changed contract changes the design fingerprint. Successful generation does not implement focus, keyboard navigation or stateful widget behavior.

**Need:** engineering-authored metadata with real node IDs from the loaded scene; reviewed semantic tags and native attributes; stable consumer data IDs; explicit state/interaction contracts when applicable. No layer-name guessing decides composition. Components without metadata retain the existing single-component API. `mitosisDefinition` remains a separate explicit-definition pipeline; this composition engine currently applies to the Figma scene converter.

### Metadata source and schema

`components.composition.json` is a repository-owned registry keyed by the exact PascalCase catalog name. It survives Figma/Supernova catalog refreshes. The committed registry contains reviewed production contracts for Breadcrumb, Table, TableHeaderRow and TableBodyRow. Alternatively, attach `composition` to a catalog entry; an entry configured in both places fails as a conflict. Unknown registry keys fail. `sync:components` reads this registry automatically; `--composition-registry=<file>` selects another registry.

Each contract contains `version: 1`, `root` (matching the catalog's generated name), a nonempty `parts` array and optional `examples: { static, loop }` strings for documentation. Each part defines:

| Field | Contract |
| --- | --- |
| `name` | Unique PascalCase export/file name; the root must be included |
| `sourceNodeId` | Exact node ID within the loaded scene, selected before rendering |
| `tag` | Explicit native semantic tag: nav, ol, ul, li, a, span, div, p, table, thead, tbody, tfoot, tr, th, td, caption, section, button or label |
| `props` | Public prop names mapped to `string`, `boolean` or `number`; no automatically imported Figma properties |
| `attributes` | Native attribute names mapped to primitive literals or `{ "prop": "declaredName" }`; no executable expressions, event attributes or raw HTML |
| `slot` | `replace`: only caller children; `default`: caller children with explicit fallback |
| `defaultContent` | Optional string fallback for a default slot, independent of example design content |
| `classes` | Optional string replacing inferred source classes, including `""` to preserve native table layout |

Every part also exposes `children` and `className`. Primitive public props are optional; contracts may map explicit `id`, `aria-label` and other native attributes onto declared props. `slot="replace"` emits no baked design children. Internal variant selection happens through explicit `sourceNodeId`; a design property named `1`, `2` or `deep` is never a consumer switch in this API.

Without a `classes` override, the converter reuses the selected node's token/style mapping. Source flex layout is not automatically suitable for native table parts: the Table fixture explicitly overrides classes to preserve table display. Engineers must review presentation and semantics together.

### Fixtures and migration

`scripts/fixtures/breadcrumb.composition.json` defines Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator and BreadcrumbEllipsis. Its nav has a label, the current page has `aria-current="page"`, and separators/ellipsis are decorative. Separators belong inside list items so every direct `ol` child remains an `li`. Consumers can provide zero, one or many paths. `home`, `breadcrumb`, `showEllipsis` and internal `type` disappear from the composed API; content and ellipsis become caller composition.

`scripts/fixtures/table.composition.json` independently demonstrates Table, TableBody, TableRow and TableCell. These generic fixtures demonstrate engine capability. The production registry now separately activates reviewed real-source Breadcrumb, Table, TableHeaderRow and TableBodyRow contracts; compact `production-*.figma.json` fixtures preserve their actual IDs, variants and presentation for regression testing. The catalog intentionally includes these reviewed roots alongside the four existing components; it does not bulk-import every scene component.

Generate the fixture parts into a temporary directory:

```bash
node scripts/figma-to-mitosis.js --fixture=scripts/fixtures/breadcrumb.figma.json --name=Breadcrumb --composition=scripts/fixtures/breadcrumb.composition.json --out=/tmp/supernova-breadcrumb
```

For composition, CLI `--out` is a directory; without composition, it remains the existing single output file. The CLI records its own ownership ledger and rejects existing unowned files. The PR processor records grouped ownership in `.components-manifest.json`. Neither ledger replaces the authoritative generated component-set manifest at `docs/.vitepress/components.generated.json`; that manifest also carries each part's composition documentation metadata.

Compilation and server-rendered structure are verified by automated fixtures. Browser layout, focus, keyboard interactions, screen readers remain **UNVERIFIED**. Production source selection and regeneration are verified offline against the saved real Figma scene; live CI execution remains unverified.


### Reviewed production Table composition

The Table group provides `Table` (`table`), `TableHeader` (`thead`) and `TableBody` (`tbody`). Existing design row components keep independent ownership: TableHeaderRow provides `TableHeaderRow` (`tr`) and `TableHeaderCell` (`th`, `scope="col"`); TableBodyRow provides `TableBodyRow` (`tr`) and `TableCell` (`td`). All accept caller content instead of rendering the example rows or ten columns. Native table parts use explicit empty class overrides to preserve native display; callers can provide presentation through `className`.

The former whole-table visual example is not a public state switch. Empty states, checkbox behavior and pagination remain caller-owned surfaces outside these native table parts. Breadcrumb's internal Type=1/2/deep examples likewise select real source presentation during generation; consumer paths, separators and ellipsis decide the rendered structure.

The full source file can be fetched once with `npm run figma:cache -- --file=<file-key>` and reused using `--figma-snapshot=<path>` on import, processing and conversion. The cache is local and gitignored; failed or invalid refreshes preserve the previous valid snapshot. Snapshot mode fails on missing nodes rather than fetching or synthesizing replacements. See README for the complete offline iteration commands.
