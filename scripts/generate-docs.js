const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const paths = require('./export-source').resolveExportPaths();
const componentsSourceDir = paths.componentsDir;
const tokensSourceDir = paths.tokensDir;
const docsDir = path.join(rootDir, 'docs');
const docsComponentsDir = path.join(docsDir, 'components');
const componentsManifestPath = path.join(docsDir, '.vitepress', 'components.generated.json');

function readComponentsManifest() {
  try {
    const parsed = JSON.parse(fs.readFileSync(componentsManifestPath, 'utf8'));
    if (parsed && Array.isArray(parsed.components)) {
      return parsed;
    }
  } catch (e) {
    // Missing or unparseable manifest: treat as an empty component set.
  }
  return { components: [] };
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. Parse tokens from tokens.ts
function parseTokens() {
  const tokensTsPath = path.join(tokensSourceDir, 'tokens.ts');
  if (!fs.existsSync(tokensTsPath)) {
    console.error(`[generate-docs] FATAL: tokens artifact not found at ${tokensTsPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(tokensTsPath, 'utf8');
  const match = content.match(/export const tokens\s*=\s*({[\s\S]*});?\s*$/);
  if (match) {
    try {
      const fn = new Function(`return ${match[1]}`);
      return fn();
    } catch (e) {
      console.warn('Could not parse tokens via Function:', e.message);
    }
  }
  return { colors: {}, typography: {}, shadows: {} };
}

// 2. Parse component .lite.tsx files
const COMPONENT_METADATA = {
  Button: {
    description: 'Interactive button component with support for multiple visual variants, sizes, full-width layouts, and disabled states.',
    defaults: {
      variant: "'primary'",
      size: "'md'",
      disabled: 'false',
      fullWidth: 'false',
      type: "'button'"
    },
    descriptions: {
      children: 'Content or label to render inside button',
      variant: 'Visual appearance variant',
      size: 'Button dimensions and padding',
      disabled: 'Whether the button is interactive',
      fullWidth: 'Expands button to fill parent container width',
      type: 'HTML button type attribute',
      onClick: 'Callback fired on click event'
    },
    sampleReact: `import { Button } from '@dwlhm/ui-react'

export default function Demo() {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <Button variant="primary" size="md" onClick={() => alert('Clicked!')}>
        Primary Button
      </Button>
      <Button variant="secondary" size="md">
        Secondary
      </Button>
      <Button variant="outline" size="md">
        Outline
      </Button>
    </div>
  )
}`,
    sampleSvelte: `<script>
  import Button from '@dwlhm/ui-svelte/Button.svelte'
</script>

<div style="display: flex; gap: 12px;">
  <Button variant="primary" size="md" on:click={() => alert('Clicked!')}>
    Primary Button
  </Button>
  <Button variant="secondary" size="md">
    Secondary
  </Button>
  <Button variant="outline" size="md">
    Outline
  </Button>
</div>`,
    sampleVue: `<template>
  <div style="display: flex; gap: 12px;">
    <Button variant="primary" size="md" :onClick="() => alert('Clicked!')">
      Primary Button
    </Button>
    <Button variant="secondary" size="md">
      Secondary
    </Button>
    <Button variant="outline" size="md">
      Outline
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@dwlhm/ui-vue'
</script>`,
    sampleVue2: `<template>
  <div style="display: flex; gap: 12px;">
    <Button variant="primary" size="md" :onClick="() => alert('Clicked!')">
      Primary Button
    </Button>
    <Button variant="secondary" size="md">
      Secondary
    </Button>
    <Button variant="outline" size="md">
      Outline
    </Button>
  </div>
</template>

<script>
import { Button } from '@dwlhm/ui-vue2'

export default {
  components: { Button }
}
</script>`
  },
  Badge: {
    description: 'Compact status badge indicator used for categorization, counters, and highlights.',
    defaults: {
      variant: "'primary'",
      size: "'md'",
      rounded: 'false'
    },
    descriptions: {
      children: 'Text content or indicator symbol',
      variant: 'Color tone indicating status or category',
      size: 'Padding and font size scale',
      rounded: 'Renders fully rounded pill shape when true'
    },
    sampleReact: `import { Badge } from '@dwlhm/ui-react'

export default function Demo() {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge variant="primary">New</Badge>
      <Badge variant="success" rounded>Completed</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="danger">Failed</Badge>
    </div>
  )
}`,
    sampleSvelte: `<script>
  import Badge from '@dwlhm/ui-svelte/Badge.svelte'
</script>

<div style="display: flex; gap: 8px; align-items: center;">
  <Badge variant="primary">New</Badge>
  <Badge variant="success" rounded={true}>Completed</Badge>
  <Badge variant="warning">Pending</Badge>
  <Badge variant="danger">Failed</Badge>
</div>`
  },
  Card: {
    description: 'Container element for organizing related content with optional title, subtitle, elevation shadow, and borders.',
    defaults: {
      padding: "'md'",
      shadow: "'md'",
      bordered: 'false'
    },
    descriptions: {
      children: 'Main card body content',
      title: 'Header title text',
      subtitle: 'Secondary supporting description text',
      padding: 'Internal container spacing',
      bordered: 'Adds outline border if true',
      shadow: 'Elevation drop shadow level',
      onClick: 'Optional click handler making the card interactive'
    },
    sampleReact: `import { Card, Button } from '@dwlhm/ui-react'

export default function Demo() {
  return (
    <Card
      title="Project Overview"
      subtitle="Supernova design system compilation"
      bordered
      shadow="md"
      padding="lg"
    >
      <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#475569' }}>
        Mitosis compiles source components directly to React, Svelte, and more.
      </p>
      <Button variant="primary" size="sm">Explore Docs</Button>
    </Card>
  )
}`,
    sampleSvelte: `<script>
  import Card from '@dwlhm/ui-svelte/Card.svelte'
  import Button from '@dwlhm/ui-svelte/Button.svelte'
</script>

<Card
  title="Project Overview"
  subtitle="Supernova design system compilation"
  bordered={true}
  shadow="md"
  padding="lg"
>
  <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569;">
    Mitosis compiles source components directly to React, Svelte, and more.
  </p>
  <Button variant="primary" size="sm">Explore Docs</Button>
</Card>`
  },
  Input: {
    description: 'Form input component supporting text values, validation error states, helper text, labels, and required flags.',
    defaults: {
      type: "'text'",
      disabled: 'false',
      required: 'false'
    },
    descriptions: {
      value: 'Controlled input string value',
      placeholder: 'Placeholder text when input is empty',
      type: 'HTML input type attribute',
      disabled: 'Disables input interaction',
      required: 'Shows required asterisk and marks input required',
      label: 'Field label above the input',
      error: 'Error message text that triggers red border state',
      helperText: 'Subtle guidance text displayed below input',
      name: 'HTML input name attribute',
      onChange: 'Callback fired on text input change',
      onFocus: 'Callback fired when input gains focus',
      onBlur: 'Callback fired when input loses focus'
    },
    sampleReact: `import { Input } from '@dwlhm/ui-react'
import { useState } from 'react'

export default function Demo() {
  const [val, setVal] = useState('')

  return (
    <Input
      label="Work Email"
      placeholder="colleague@company.com"
      required
      helperText="We will send your verification link here."
      value={val}
      onChange={(e) => setVal(e.target.value)}
    />
  )
}`,
    sampleSvelte: `<script>
  import Input from '@dwlhm/ui-svelte/Input.svelte'
  let val = ''
</script>

<Input
  label="Work Email"
  placeholder="colleague@company.com"
  required={true}
  helperText="We will send your verification link here."
  value={val}
  on:change={(e) => val = e.target.value}
/>`
  },
  Typography: {
    description: 'Standardized typography component for headings, body copy, and caption text with consistent font scale and weight.',
    defaults: {
      variant: "'body'",
      align: "'left'",
      weight: "'normal'"
    },
    descriptions: {
      children: 'Text content to display',
      variant: 'Typography scale preset (h1-h6, body, body-sm, caption)',
      color: 'Custom text color CSS class or style',
      align: 'Horizontal text alignment (left, center, right)',
      weight: 'Font weight (normal, medium, semibold, bold)'
    },
    sampleReact: `import { Typography } from '@dwlhm/ui-react'

export default function Demo() {
  return (
    <div>
      <Typography variant="h2" weight="bold">
        Design Tokens & Components
      </Typography>
      <Typography variant="body" weight="normal" color="text-slate-600">
        Consistent design tokens guarantee cohesion across multi-framework applications.
      </Typography>
    </div>
  )
}`,
    sampleSvelte: `<script>
  import Typography from '@dwlhm/ui-svelte/Typography.svelte'
</script>

<div>
  <Typography variant="h2" weight="bold">
    Design Tokens & Components
  </Typography>
  <Typography variant="body" weight="normal" color="text-slate-600">
    Consistent design tokens guarantee cohesion across multi-framework applications.
  </Typography>
</div>`
  }
};

function parseComponentFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const baseName = path.basename(filePath, '.lite.tsx');
  const compositionMatch = content.match(/\/\* @composition (.*?) \*\//);
  const composition = compositionMatch ? JSON.parse(compositionMatch[1]) : null;
  const meta = (composition ? null : COMPONENT_METADATA[baseName]) || {
    description: `${baseName} component generated from Supernova.`,
    defaults: {},
    descriptions: {},
    sampleReact: `import { ${baseName} } from '@dwlhm/ui-react'`,
    sampleSvelte: `import ${baseName} from '@dwlhm/ui-svelte/${baseName}.svelte'`
  };

  // Find interface
  const interfaceRegex = new RegExp(`export\\s+interface\\s+${baseName}Props\\s*\\{([\\s\\S]*?)\\}`, 'm');
  const match = content.match(interfaceRegex);

  const props = [];
  if (match) {
    const lines = match[1].split('\n');
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('//') || line.startsWith('/*')) continue;

      // match: propName?: type or propName: type
      const propMatch = line.match(/^(\w+)(\??)\s*:\s*(.+)$/);
      if (propMatch) {
        const propName = propMatch[1];
        const isOptional = propMatch[2] === '?';
        let rawType = propMatch[3].replace(/;$/, '').trim();

        // format type for markdown table (escape pipes)
        const displayType = rawType.replace(/\|/g, '\\|');
        const defaultValue = meta.defaults[propName] || (isOptional ? '-' : '**required**');
        const description = meta.descriptions[propName] || '-';

        props.push({
          name: propName,
          type: displayType,
          required: !isOptional,
          default: defaultValue,
          description: description
        });
      }
    }
  }

  const sampleVue = meta.sampleVue || `<template>\n  <${baseName} />\n</template>\n\n<script setup lang="ts">\nimport { ${baseName} } from '@dwlhm/ui-vue'\n</script>`;
  const sampleVue2 = meta.sampleVue2 || `<template>\n  <${baseName} />\n</template>\n\n<script>\nimport { ${baseName} } from '@dwlhm/ui-vue2'\n\nexport default {\n  components: { ${baseName} }\n}\n</script>`;

  return {
    name: baseName,
    composition,
    description: composition ? `Composable part of ${composition.root}. Consumer owns content, order and repetition.` : meta.description,
    props: props,
    sampleReact: meta.sampleReact,
    sampleSvelte: meta.sampleSvelte,
    sampleVue: sampleVue,
    sampleVue2: sampleVue2
  };
}

// 3. Generate docs/index.md
function generateIndexDoc(components) {
  const hasComponents = components.length > 0;

  const heroActions = hasComponents
    ? `    - theme: brand
      text: Components Catalog
      link: /components/
    - theme: alt
      text: Design Tokens
      link: /tokens`
    : `    - theme: brand
      text: Design Tokens
      link: /tokens`;

  const features = hasComponents
    ? `  - title: Multi-Framework Compilation
    details: Write once in Mitosis, compile natively to React, Svelte, Vue 3, and Vue 2 with zero runtime overhead.
  - title: Automated Pipeline
    details: Webhook-driven export from Supernova cloud directly into monorepo packages and documentation.
  - title: First-Class TypeScript
    details: Fully typed props, Tailwind CSS v4 design tokens, and interactive sandbox components.`
    : `  - title: Automated Pipeline
    details: Webhook-driven export from Supernova cloud directly into monorepo packages and documentation.
  - title: Design Tokens
    details: Every Supernova token exported as CSS variables and typed TypeScript.`;

  const packagesIntro = hasComponents
    ? 'The Supernova UI ecosystem consists of five synchronized packages:'
    : 'The Supernova design system is published as a single design-tokens package:';

  const frameworkPackageRows = hasComponents
    ? `| **\`@dwlhm/ui-react\`** | \`1.0.0\` | React 18 / 19 Native Components | \`npm install @dwlhm/ui-react\` |
| **\`@dwlhm/ui-svelte\`** | \`1.0.0\` | Svelte 4 / 5 Native Components | \`npm install @dwlhm/ui-svelte\` |
| **\`@dwlhm/ui-vue\`** | \`1.0.0\` | Vue 3 Native Components (Composition API) | \`npm install @dwlhm/ui-vue\` |
| **\`@dwlhm/ui-vue2\`** | \`1.0.0\` | Vue 2 Native Components (Webpack 4 Compatible) | \`npm install @dwlhm/ui-vue2\` |
`
    : '';

  const tokensSectionNumber = hasComponents ? 5 : 1;

  return `---
layout: home

hero:
  name: "Supernova"
  text: "Design System"
  tagline: ${hasComponents ? 'Multi-framework UI components and tokens compiled from Supernova and Mitosis' : 'Design tokens compiled from Supernova.'}
  actions:
${heroActions}

features:
${features}
---

## Packages Overview

${packagesIntro}

| Package | Version | Ecosystem | Install Command |
| :--- | :--- | :--- | :--- |
| **\`@dwlhm/design-tokens\`** | \`1.0.0\` | CSS Variables, Tailwind v4, TS Tokens | \`npm install @dwlhm/design-tokens\` |
${frameworkPackageRows}
---

## Quick Start

${hasComponents ? `### 1. React Setup

Install the React component package and tokens:

\`\`\`bash
npm install @dwlhm/ui-react @dwlhm/design-tokens
\`\`\`

Import the design token stylesheets into your root application:

\`\`\`css
/* main.css or index.css */
@import "@dwlhm/design-tokens/css/tokens.css";
@import "@dwlhm/design-tokens/css/theme.css";
\`\`\`

Render components anywhere in your React application:

\`\`\`tsx
import { Button, Card, Badge } from '@dwlhm/ui-react'

export default function App() {
  return (
    <Card title="Supernova UI" subtitle="React Application" bordered shadow="md">
      <Badge variant="success">Production Ready</Badge>
      <div style={{ marginTop: '16px' }}>
        <Button variant="primary" size="md">
          Explore System
        </Button>
      </div>
    </Card>
  )
}
\`\`\`

---

### 2. Svelte Setup

Install the Svelte component package and tokens:

\`\`\`bash
npm install @dwlhm/ui-svelte @dwlhm/design-tokens
\`\`\`

Import tokens in your root layout:

\`\`\`svelte
<script>
  import '@dwlhm/design-tokens/css/tokens.css'
  import '@dwlhm/design-tokens/css/theme.css'
  import Button from '@dwlhm/ui-svelte/Button.svelte'
  import Card from '@dwlhm/ui-svelte/Card.svelte'
  import Badge from '@dwlhm/ui-svelte/Badge.svelte'
</script>

<Card title="Supernova UI" subtitle="Svelte Application" bordered={true} shadow="md">
  <Badge variant="success">Production Ready</Badge>
  <div style="margin-top: 16px;">
    <Button variant="primary" size="md">
      Explore System
    </Button>
  </div>
</Card>
\`\`\`

---

### 3. Vue 3 Setup

Install the Vue 3 component package and tokens:

\`\`\`bash
npm install @dwlhm/ui-vue @dwlhm/design-tokens
\`\`\`

Import tokens in your root application and use components:

\`\`\`vue
<template>
  <Card title="Supernova UI" subtitle="Vue 3 Application" :bordered="true" shadow="md">
    <Badge variant="success">Production Ready</Badge>
    <div style="margin-top: 16px;">
      <Button variant="primary" size="md">
        Explore System
      </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import '@dwlhm/design-tokens/css/tokens.css'
import '@dwlhm/design-tokens/css/theme.css'
import { Button, Card, Badge } from '@dwlhm/ui-vue'
</script>
\`\`\`

---

### 4. Vue 2 (Webpack 4 Compatible) Setup

Install the Vue 2 component package and tokens:

\`\`\`bash
npm install @dwlhm/ui-vue2 @dwlhm/design-tokens
\`\`\`

Import pre-bundled components directly (no special webpack loaders needed):

\`\`\`vue
<template>
  <Card title="Supernova UI" subtitle="Vue 2 Application" :bordered="true" shadow="md">
    <Badge variant="success">Production Ready</Badge>
    <div style="margin-top: 16px;">
      <Button variant="primary" size="md">
        Explore System
      </Button>
    </div>
  </Card>
</template>

<script>
import '@dwlhm/design-tokens/css/tokens.css'
import '@dwlhm/design-tokens/css/theme.css'
import { Button, Card, Badge } from '@dwlhm/ui-vue2'

export default {
  components: {
    Button,
    Card,
    Badge,
  },
}
</script>
\`\`\`

---

` : ''}### ${tokensSectionNumber}. Tokens Only (Framework Agnostic)

Use design tokens directly in any web project:

\`\`\`bash
npm install @dwlhm/design-tokens
\`\`\`

In TypeScript / JavaScript:

\`\`\`ts
import { tokens } from '@dwlhm/design-tokens'

console.log(tokens.colors.colorBackgroundPrimary)
console.log(tokens.typography.heading1.fontSize)
\`\`\`

In CSS:

\`\`\`css
.custom-card {
  background-color: var(--color-background-page);
  box-shadow: var(--shadow-raised);
}
\`\`\`
`;
}

// 4. Generate docs/tokens.md
function generateTokensDoc(tokens) {
  const typography = tokens.typography || {};
  const shadows = tokens.shadows || {};

  return `# Design Tokens

Design tokens represent the foundational design decisions of the Supernova UI system — colors, typography scales, spacing, and shadows.

Tokens are exported automatically from Supernova into \`@dwlhm/design-tokens\` as TypeScript constants, CSS variables, and Tailwind CSS v4 theme variables.

---

## Color Tokens

Click any color swatch to copy its hex value to your clipboard.

<ColorGrid />

---

## Typography Scale

Supernova defines standardized typographic scale sets for headings, body copy, and captions:

| Token Name | Font Family | Size | Weight | Line Height |
| :--- | :--- | :--- | :--- | :--- |
| **heading1** | ${typography.heading1?.fontFamily || 'Inter'} | \`${typography.heading1?.fontSize || '36px'}\` | \`${typography.heading1?.fontWeight || '600'}\` | \`${typography.heading1?.lineHeight || '44px'}\` |
| **heading2** | ${typography.heading2?.fontFamily || 'Inter'} | \`${typography.heading2?.fontSize || '28px'}\` | \`${typography.heading2?.fontWeight || '600'}\` | \`${typography.heading2?.lineHeight || '36px'}\` |
| **heading3** | ${typography.heading3?.fontFamily || 'Inter'} | \`${typography.heading3?.fontSize || '18px'}\` | \`${typography.heading3?.fontWeight || '600'}\` | \`${typography.heading3?.lineHeight || '28px'}\` |
| **body1** | ${typography.body1?.fontFamily || 'Inter'} | \`${typography.body1?.fontSize || '16px'}\` | \`${typography.body1?.fontWeight || '400'}\` | \`${typography.body1?.lineHeight || '24px'}\` |
| **body2** | ${typography.body2?.fontFamily || 'Inter'} | \`${typography.body2?.fontSize || '14px'}\` | \`${typography.body2?.fontWeight || '500'}\` | \`${typography.body2?.lineHeight || '20px'}\` |
| **body3** | ${typography.body3?.fontFamily || 'Inter'} | \`${typography.body3?.fontSize || '12px'}\` | \`${typography.body3?.fontWeight || '400'}\` | \`${typography.body3?.lineHeight || '16px'}\` |

---

## Elevation & Shadows

Elevation tokens provide depth perception for surfaces and overlays:

| Elevation Level | CSS Variable | Value |
| :--- | :--- | :--- |
| **Raised** | \`--shadow-raised\` | \`${shadows.raised || '0px 1px 3px -1px #000000, 0px 2px 3px -3px #000000'}\` |
| **Overlay** | \`--shadow-overlay\` | \`${shadows.overlay || '0px 15px 25px 0px #000000, 0px 5px 10px 0px #000000'}\` |

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin: 24px 0;">
  <div style="padding: 24px; border-radius: 8px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); box-shadow: var(--shadow-raised); text-align: center;">
    <strong>Raised Surface</strong>
    <p style="font-size: 12px; color: var(--vp-c-text-2); margin-top: 6px;">Cards, buttons, dropdown triggers</p>
  </div>
  <div style="padding: 24px; border-radius: 8px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); box-shadow: var(--shadow-overlay); text-align: center;">
    <strong>Overlay Surface</strong>
    <p style="font-size: 12px; color: var(--vp-c-text-2); margin-top: 6px;">Modals, dialogs, popovers</p>
  </div>
</div>

---

## CSS Variables Reference

When importing \`@dwlhm/design-tokens/css/tokens.css\`, CSS custom properties are exposed globally:

\`\`\`css
/* Background & Surface Tokens */
var(--color-background-page);
var(--color-background-primary);
var(--color-background-secondary);

/* Foreground & Text Tokens */
var(--color-foreground-neutral);
var(--color-foreground-primary);
var(--color-foreground-positive);

/* Border Tokens */
var(--color-border-neutral);
var(--color-border-primary);
var(--color-border-focus);
\`\`\`
`;
}

// 5. Generate docs/components/index.md
function generateComponentsCatalogDoc(components) {
  let doc = `# Components Catalog

The Supernova UI component catalog provides cross-framework components authored in Mitosis and compiled natively for React and Svelte.

---

## Available Components

| Component | Description | Frameworks | Documentation |
| :--- | :--- | :--- | :--- |
`;

  for (const c of components) {
    const slug = c.name.toLowerCase();
    doc += `| **\`<${c.name}>\`** | ${c.description} | React, Svelte | [View ${c.name} Docs](/components/${slug}) |\n`;
  }

  doc += `
---

## Feature Comparison

All components share identical API surfaces across frameworks:

- **Type Safe**: Strict TypeScript definitions for props and events.
- **Zero Style Desync**: Single source of truth styles powered by Tailwind CSS v4 and Supernova tokens.
- **Native Output**: React uses JSX; Svelte uses idiomatic \`.svelte\` templates.
`;

  return doc;
}

// 6. Generate individual component docs
function generateComponentDoc(comp) {
  const slug = comp.name.toLowerCase();

  let propsTable = '| Property | Type | Default | Description |\n';
  propsTable += '| :--- | :--- | :--- | :--- |\n';

  for (const p of comp.props) {
    propsTable += `| \`${p.name}\` | \`${p.type}\` | \`${p.default}\` | ${p.description} |\n`;
  }

  const compositionDoc = comp.composition ? `\n## Composition\n\nRoot: \`${comp.composition.root}\`. Parts: ${comp.composition.parts.map(name => `\`${name}\``).join(', ')}.\n\nThe default slot ${comp.composition.slot === 'default' ? `uses ${JSON.stringify(comp.composition.defaultContent ?? '')} when no content is supplied` : 'replaces all design example children'}. Consumers own item data, ordering and repetition. There is no composition mode or internal design type prop.\n${comp.name === comp.composition.root && comp.composition.examples ? Object.entries(comp.composition.examples).map(([kind, example]) => `\n### ${kind === 'loop' ? 'Consumer loop' : 'Static composition'}\n\n\`\`\`tsx\n${example}\n\`\`\`\n`).join('') : ''}` : '';

  return `# ${comp.name}\n\n${comp.description}${compositionDoc}

---

${comp.composition ? 'Interactive preview is not available for composition parts; use the examples below.\n' : `## Interactive Preview\n\n<ComponentSandbox name="${comp.name}" />\n\n---\n`}

## Code Examples

::: code-group

\`\`\`tsx [React]
${comp.sampleReact}
\`\`\`

\`\`\`svelte [Svelte]
${comp.sampleSvelte}
\`\`\`

\`\`\`vue [Vue 3]
${comp.sampleVue}
\`\`\`

\`\`\`vue [Vue 2]
${comp.sampleVue2}
\`\`\`

:::

---

## Props Reference

${propsTable}

---

## Framework Integration

### React

\`\`\`tsx
import { ${comp.name} } from '@dwlhm/ui-react'
\`\`\`

### Svelte

\`\`\`svelte
<script>
  import ${comp.name} from '@dwlhm/ui-svelte/${comp.name}.svelte'
</script>
\`\`\`

### Vue 3

\`\`\`vue
<script setup lang="ts">
import { ${comp.name} } from '@dwlhm/ui-vue'
</script>
\`\`\`

### Vue 2 (Webpack 4 Compatible)

\`\`\`vue
<script>
import { ${comp.name} } from '@dwlhm/ui-vue2'

export default {
  components: {
    ${comp.name}
  }
}
</script>
\`\`\`
`;
}

function run() {
  console.log('--- Generating Documentation ---');
  ensureDir(docsDir);

  const tokens = parseTokens();
  console.log('Parsed tokens:', Object.keys(tokens));

  const manifest = readComponentsManifest();
  const components = [];

  // Parse components
  if (manifest.components.length > 0) {
    ensureDir(docsComponentsDir);

    const componentFiles = fs.readdirSync(componentsSourceDir)
      .filter(file => file.endsWith('.lite.tsx'))
      .sort();

    for (const file of componentFiles) {
      const fullPath = path.join(componentsSourceDir, file);
      const comp = parseComponentFile(fullPath);
      components.push(comp);
      console.log(`Parsed component: ${comp.name} (${comp.props.length} props)`);

      // Write component doc
      const compDoc = generateComponentDoc(comp);
      const destPath = path.join(docsComponentsDir, `${comp.name.toLowerCase()}.md`);
      fs.writeFileSync(destPath, compDoc, 'utf8');
      console.log(`Generated docs/components/${comp.name.toLowerCase()}.md`);
    }

    // Write docs/components/index.md
    const catalogDoc = generateComponentsCatalogDoc(components);
    fs.writeFileSync(path.join(docsComponentsDir, 'index.md'), catalogDoc, 'utf8');
    console.log('Generated docs/components/index.md');

    // Prune orphan component pages no longer present in the manifest.
    const validSlugs = new Set(manifest.components.map((c) => c.slug));
    for (const entry of fs.readdirSync(docsComponentsDir)) {
      if (!entry.endsWith('.md') || entry === 'index.md') continue;
      const slug = entry.slice(0, -'.md'.length);
      if (validSlugs.has(slug)) continue;
      fs.rmSync(path.join(docsComponentsDir, entry));
      console.log(`Pruned orphan component page: docs/components/${entry}`);
    }
  } else {
    if (fs.existsSync(docsComponentsDir)) {
      fs.rmSync(docsComponentsDir, { recursive: true, force: true });
    }
    console.warn('[generate-docs] WARNING: no components in the manifest; removed docs/components/ so no stale component pages are published.');
  }

  // Write docs/index.md
  const indexDoc = generateIndexDoc(components);
  fs.writeFileSync(path.join(docsDir, 'index.md'), indexDoc, 'utf8');
  console.log('Generated docs/index.md');

  // Write docs/tokens.md
  const tokensDoc = generateTokensDoc(tokens);
  fs.writeFileSync(path.join(docsDir, 'tokens.md'), tokensDoc, 'utf8');
  console.log('Generated docs/tokens.md');

  console.log('Documentation generated successfully!\n');
}

run();
