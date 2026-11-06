# TabItem

A single tab item used inside the Tabs component. It supports a text label, an optional leading icon, an optional numeric value, and Default or Active states.

## When to Use

- Use Tab Item to represent one destination, content view, or category within a tab bar. Use it as part of Tabs rather than as a standalone control.

## Usage Guidelines

- Use short, distinct labels that clearly describe each destination.
- Keep only one tab active within a tab group.
- Show an icon only when it improves recognition; use icons consistently across sibling tabs.
- Use the numeric value for concise counts, such as unread or filtered items.

## Live Preview & Usage

<ComponentPreview name="TabItem" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `active` | `boolean` | `false` | - |
| `state` | `'default' \| 'active'` | `'default'` | default, active |
| `showIcon` | `boolean` | `false` | - |
| `showNum` | `boolean` | `false` | - |
| `num` | `string` | `''` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onClick` | `() => void` | `-` | - |
