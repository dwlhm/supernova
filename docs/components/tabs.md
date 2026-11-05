# Tabs

A horizontal tab bar composed of Tab Item instances. It provides up to eight tabs for switching between related content views or categories.

## When to Use

- Use Tabs when users need to move between peer views within the same context without leaving the page. Do not use it for sequential steps or primary site navigation.

## Usage Guidelines

- Use two to eight tabs with concise, parallel labels.
- Keep one tab active and ensure its content is visible.
- Order tabs by importance, frequency, or a natural sequence.
- Hide unused tabs instead of leaving empty labels.
- Avoid overcrowding; use another navigation pattern if labels no longer fit clearly.

## Live Preview & Usage

<ComponentPreview name="Tabs" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `tabs` | `TabData[]` | `[]` | - |
| `activeTab` | `string` | `'overview'` | - |
| `ariaLabel` | `string` | `'Tabs'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onTabChange` | `(id: string) => void` | `-` | - |
