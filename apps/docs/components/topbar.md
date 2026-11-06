# Topbar

A horizontal application header that provides a consistent area for page-level or global controls through a flexible content slot.

## When to Use

- Use at the top of authenticated application screens that require persistent global or contextual actions.
- Use to host content such as page context, search, notifications, help, or account actions when those controls need consistent placement.

## Usage Guidelines

- Place content in Topbar Content and prioritize the most important actions.
- Keep the bar concise; move infrequent actions into menus when space is limited.
- Maintain predictable control order across screens.
- Avoid duplicating navigation or actions already provided by the sidebar or page header.

## Live Preview & Usage

<ComponentPreview name="Topbar" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `showSearch` | `boolean` | `false` | - |
| `searchPlaceholder` | `string` | `'Search'` | - |
| `searchValue` | `string` | `''` | - |
| `showSidebarToggle` | `boolean` | `true` | - |
| `sidebarToggleLabel` | `string` | `'Toggle sidebar'` | - |
| `breadcrumbRoot` | `string` | `'Home'` | - |
| `breadcrumbCurrent` | `string` | `'Breadcrumb'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onSearchChange` | `(value: string) => void` | `-` | - |
| `onToggleSidebar` | `() => void` | `-` | - |
