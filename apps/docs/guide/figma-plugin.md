# Figma Plugin Extractor

The extraction package (`packages/figma-plugin`) is a native Figma plugin designed to extract design tokens and components across complete documents.

## Dynamic Page Access

Figma documents with multiple pages load page content on-demand. When accessing components across all pages, the plugin first invokes:

```typescript
if (typeof figma.loadAllPagesAsync === 'function') {
  await figma.loadAllPagesAsync();
}
```

This ensures all `PageNode` objects are fully initialized in memory prior to traversing `figma.root.children`.

## Installation & Development

1. Build the plugin bundle:
   ```bash
   pnpm --filter @komerce-design/figma-plugin build
   ```
2. Open Figma Desktop App.
3. Navigate to **Plugins** -> **Development** -> **Import plugin from manifest...**.
4. Select `packages/figma-plugin/manifest.json`.

## Sync Workflows in the Plugin UI

Inside the plugin UI, select the components you want to sync and choose either workflow:

1. **Export Extraction JSON ⬇ (Zero Server)**:
   - Downloads `<document>-figma.json` directly from Figma.
   - Run `pnpm komerce sync ./<document>-figma.json` in your terminal to author `src/*` and compile `library/*` in-process.
2. **Compute Local Sync Plan → Apply Sync to Workspace (1-Click Listener)**:
   - Start `pnpm komerce listen` in your terminal (`http://127.0.0.1:8080`, no `API_TOKEN` needed).
   - Click **Compute Local Sync Plan** to preview `New`, `Changed`, and `Unchanged` components, then click **Apply Sync to Workspace** to stream progress and write directly to `src/*`, `library/*`, and `apps/docs`.
