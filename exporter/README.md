# Supernova Exporter for Mitosis JS

Export your Supernova design system tokens and foundational components into universal [Mitosis](https://mitosis.builder.io/) (`.lite.tsx`) components, TypeScript tokens, and CSS custom properties.

Mitosis components can be compiled to any frontend framework: **React**, **Vue (v2/v3)**, **Svelte**, **Angular**, **Solid**, **Qwik**, **Preact**, and **React Native**.

---

## Features

- **Universal Mitosis Components (`.lite.tsx`)**: Generates production-ready components (`Button`, `Card`, `Badge`, `Input`, `Typography`) following Builder.io Mitosis syntax (`useStore`, typed interfaces, universal JSX).
- **TypeScript Design Tokens**: Exports structured `tokens.ts` typed with `as const` and categorized by token type (`colors`, `typography`, `spacing`, `radii`, `borders`, `shadows`).
- **CSS Custom Properties**: Generates `tokens.css` with CSS variables formatted from token group hierarchy (e.g., `--color-primary`, `--space-4`).
- **Multi-Brand & Theme Aware**: Supports Supernova brands and themes via `computeTokensByApplyingThemes`.
- **Configurable**: Fully customizable through Supernova workspace settings or `config.json`.
- **Barrel Index File**: Optionally generates `index.ts` re-exporting all tokens and components for seamless consumption.

---

## Anatomy of the Exporter

The repository root is the deployment package. `exporter.json` and `config.json` live there. Sources and build tooling remain in the `exporter/` workspace:

| Path from repository root | Purpose |
| --- | --- |
| `exporter.json` | Supernova manifest, selecting `exporter/dist/index.js` |
| `config.json` | Supernova settings definitions |
| `exporter/package.json` | Source workspace dependencies and build scripts |
| `exporter/tsup.config.ts` | CommonJS bundler configuration |
| `exporter/src/index.ts` | Pulsar entry point |
| `exporter/src/components/` | Typed contract, SDK adapter and Mitosis AST generation |
| `exporter/src/runtime/` | Static framework independent helpers |
| `exporter/src/generators/` | Output artifact orchestration |
| `exporter/dist/index.js` | Committed installation executable |


---

All CLI install, local export and publish commands below run from the repository root. If currently inside `exporter/`, run `cd ..` first.

## Configuration Options

The exporter behavior can be customized via Supernova Cloud settings or local `config.json`:

| Option | Type | Default | Description |
|---|---|---|---|
| `exportTokens` | `boolean` | `true` | Export design tokens as TypeScript object and CSS variables. |
| `exportComponents` | `boolean` | `true` | Export components as Mitosis JSX (`.lite.tsx`) files. |
| `componentExtension` | `string` | `".lite.tsx"` | File extension for generated Mitosis components (`.lite.tsx` only). |
| `useCssVariables` | `boolean` | `true` | Generate `tokens.css` containing CSS Custom Properties. |
| `generateIndexFile` | `boolean` | `true` | Generate root `index.ts` barrel file exporting all tokens and components. |
| `showDisclaimer` | `boolean` | `true` | Prepend automated generation notice to generated files. |
| `disclaimerText` | `string` | `"This file was generated automatically..."` | Custom text for the file disclaimer. |
| `tokensDir` | `string` | `"tokens"` | Target directory for tokens relative to export root. |
| `componentsDir` | `string` | `"components"` | Target directory for components relative to export root. |
| `indent` | `number` | `2` | Spaces for token JSON and CSS indentation. Mitosis formatting is owned by the TypeScript AST printer (four spaces). |

---

## Build Instructions

Install dependencies from the monorepo root:

```bash
npm install
```

Build the exporter:

```bash
npm run build --workspace=exporter
# or from exporter directory:
npm run build
```

This compiles `src/index.ts` into a self-contained CommonJS bundle in `dist/index.js` ready for execution by Supernova Pulsar runtime.

---

## Local Testing with Supernova CLI

To test the exporter locally against a real Supernova workspace:

1. Install the Supernova CLI globally:
   ```bash
   npm install -g @supernovaio/cli
   ```

2. Obtain your API Key and Design System ID from Supernova workspace settings.

3. Run the exporter locally:
   ```bash
   supernova run-local-exporter \
     --apiKey="<YOUR_SUPERNOVA_API_KEY>" \
     --designSystemId="<YOUR_DESIGN_SYSTEM_ID>" \
     --exporterDir="." \
     --outputDir="./output"
   ```

4. Verify generated output in `./output`:
   ```
   output/
   ├── index.ts
   ├── tokens/
   │   ├── tokens.ts
   │   └── tokens.css
   └── components/
       ├── Button.lite.tsx
       ├── Card.lite.tsx
       ├── Badge.lite.tsx
       ├── Input.lite.tsx
       └── Typography.lite.tsx
   ```

---

## Compiling Mitosis to Target Frameworks

Generated `.lite.tsx` components can be compiled into target frameworks using the [`@builder.io/mitosis-cli`](https://mitosis.builder.io/docs/cli):

### 1. Install Mitosis CLI

```bash
npm install -D @builder.io/mitosis-cli @builder.io/mitosis
```

### 2. Configure `mitosis.config.js`

```javascript
module.exports = {
  files: 'output/components/**/*.lite.tsx',
  targets: ['react', 'vue3', 'svelte', 'solid', 'angular'],
  options: {
    react: {
      typescript: true,
      stylesType: 'style-tag'
    },
    vue3: {
      typescript: true,
      api: 'composition'
    },
    svelte: {
      typescript: true
    }
  }
}
```

### 3. Run Mitosis Compiler

```bash
# Compile to React
npx mitosis build --target=react

# Compile to Vue 3
npx mitosis build --target=vue3

# Compile to Svelte
npx mitosis build --target=svelte
```

---

## Publishing to Supernova Exporter Store

To publish this exporter for your organization or publicly in the Supernova Store:

```bash
supernova publish-exporter --apiKey="<YOUR_SUPERNOVA_API_KEY>" --exporterDir="."
```

## License

MIT © dwlhm

## Component architecture and ownership

Approved dataflow: Figma -> Supernova -> CI/CD -> exporter -> Mitosis `.lite.tsx` -> Svelte, React, Vue 2 and Vue 3. `scripts/generate-components.js` invokes Mitosis APIs for all four targets.

Engineering configures a Supernova **component Text property** with codeName `mitosisDefinition`, using the metadata in `contracts/mitosis-definition-property.json`. Its value is versioned JSON: `{ "schemaVersion": 1, "root": { "tag": "button" }, "properties": [], "behaviors": {} }`. Catalog component ID and name remain authoritative. An optional `designComponentId` joins an imported Figma component by its exact persistent SDK ID and imports its property definitions. Imported and custom properties with the same codeName are rejected; keep the imported declaration authoritative. This is a local contract artifact; cloud property setup has not been performed or verified here.

Designers continue editing Figma names, properties, variants and tokens. Engineers own the implementation mapping once per component contract and maintain it when new variants require styling or behavior changes. Supernova metadata alone cannot reconstruct arbitrary component markup. Missing definitions, invalid JSON, unknown versions, unsafe identifiers and invalid expressions fail explicitly instead of generating placeholder layouts.

`src/components/schema.ts` provides typed records and `defineComponentDefinition`; `adapter.ts` acquires SDK data; `ast.ts` uses TypeScript factories and the printer to emit source; `behaviors.ts` describes common form contracts. Static framework independent event dispatch and variant lookup live in `src/runtime/component-runtime.ts`, edited as ordinary TypeScript with LSP. The exporter bundles that source as text and emits a runtime artifact only when generated components import helpers. Framework generation copies it beside each target's generated components. All design classes come from definitions, never the runtime. Reactive variant getters remain in Mitosis `useStore`.

Engineers can author a local module with editor support:

```ts
import { defineComponentDefinition, ComponentDefinition } from './exporter/src/components/schema'
export default defineComponentDefinition({
  id: 'catalog-component-id', name: 'Action',
  properties: [{ name: 'disabled', type: 'Boolean', defaultValue: false }],
  behaviors: { clickable: true, disabled: true },
  root: { tag: 'button', attributes: { disabled: { kind: 'prop', name: 'disabled' } } }
} satisfies ComponentDefinition)
```

Run `node scripts/serialize-component-definition.js definition.ts` to emit validated JSON property values keyed by catalog ID. It executes the trusted engineering module locally and performs no remote writes. Typed bindings support literal/prop/state values, prop/not/and/or conditions and conditional classes. Legacy raw expressions are deprecated isolated compatibility input; they are syntax checked, not a security sandbox. Prefer typed records for editor support. The six mock definitions are engineering fixtures returned through the same SDK-shaped catalog property boundary as production.

Token export supports colors, dimensions, strings, numbers, booleans, shadows, typography, font families, weights and line heights. Gradients and blur currently fail as unsupported; they are not silently dropped.

Catalog names and imported Figma property names are normalized with the shared PascalCase/camelCase utilities; identity joins still use exact IDs. Invalid or colliding normalized identifiers fail with their component context. Component directories must be nonempty safe relative paths; TypeScript Mitosis output supports `.lite.tsx` only.

Token names retain unique leaf names within each category. When leaf names collide, every colliding token uses its full group path to qualify its exported TypeScript key and CSS variable name. Consumers must update imports and CSS references when a new collision changes these names; unresolved qualified-name collisions fail explicitly.

## Installing this exporter in Supernova

Use the repository URL: **https://github.com/dwlhm/supernova**. The repository root contains the authoritative `exporter.json` and `config.json`; its manifest selects `exporter/dist/index.js` as the executable. Supernova treats the repository root as the exporter package root. See [installing exporters](https://developers.supernova.io/latest/exporters/installing-exporters-GT7tr0qA) and [exporter anatomy](https://developers.supernova.io/latest/exporters/building-exporters-101/exporter-anatomy-HvQzZtsO).

Before importer refresh or an exporter version update, run `npm run build:exporter` from the repository root, then commit and push `exporter/dist/index.js` together with the matching sources, root `exporter.json` and `config.json`. The build validates the package automatically; `npm run validate:exporter-package` runs that check separately. After any exporter source change, rebuild and stage the bundled executable in the same commit; CI rejects a bundle that differs from a fresh build. The compiled executable is an intentional installation artifact; TypeScript sources remain authoritative. Other `dist/` files stay ignored. Validation checks manifest/config presence, safe executable paths, nonempty bundled JavaScript at the expected path; rebuilding is required to keep the committed executable current. Bundling dependencies remains the responsibility of the `noExternal` setting in `exporter/tsup.config.ts`.

Cloud installation has not been verified by the local package validation.

The bundled TypeScript compiler runs without its Node filesystem host: a dependency-scoped esbuild transform disables compiler Node detection only inside `typescript/lib/typescript.js`. AST parsing, factories and printing remain available. Pulsar can therefore expose `process` without CommonJS `__filename`/`__dirname`; no filename shims or host-global mutations are installed. The mock suite exercises complete token/component export in this VM shape.
