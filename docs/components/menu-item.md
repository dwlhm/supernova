# MenuItem

A secondary or expandable navigation item used within a menu hierarchy. It supports optional icons and badges, plus a submenu content slot for nested destinations.

## When to Use

- Use for secondary destinations or parent items that reveal nested navigation.
- Use Active when the item is selected or its submenu is expanded.

## Usage Guidelines

- Keep labels concise and clearly related to their parent section.
- Use the trailing icon to communicate expansion when submenu content is available.
- Keep nesting shallow and preserve a clear visual relationship between parent and submenu items.
- Use badges only for meaningful, concise status information.

## Live Preview & Usage

<ComponentPreview name="MenuItem" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `'Menu'` | - |
| `active` | `boolean` | `false` | - |
| `showLabel` | `boolean` | `true` | - |
| `showLeadingIcon` | `boolean` | `true` | - |
| `showTrailingIcon` | `boolean` | `true` | - |
| `showBadge` | `boolean` | `false` | - |
| `badgeLabel` | `string` | `'New'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onClick` | `() => void` | `-` | - |
