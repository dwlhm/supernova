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
   pnpm --filter @supernova/figma-plugin build
   ```
2. Open Figma Desktop App.
3. Navigate to **Plugins** -> **Development** -> **Import plugin from manifest...**.
4. Select `packages/figma-plugin/manifest.json`.

## Configuration Options

Inside the plugin UI:
- **Backend API URL**: `http://localhost:8080` (default) or deployed backend endpoint.
- **Bearer Token**: Optional authorization header when the backend runs with `API_TOKEN`.
- **Target Frameworks**: Select any subset of React, Svelte, Vue 3, Vue 2, Angular (all selected by default).
- **Publish Outputs**:
  - `Download ZIP`: Downloads the complete multi-framework bundle.
  - `GitHub PR`: Automatically creates a branch and opens a Pull Request.
