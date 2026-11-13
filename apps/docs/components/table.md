# Table

A configurable data-table component with populated and empty states, optional row selection, and optional row numbering.

## When to Use

- Use to present structured records that users need to scan and compare across consistent columns. Use the Empty state when no records are available.

## Usage Guidelines

- Use clear column labels and keep cell content consistent by column.
- Show only the columns required for the task.
- Enable checkboxes only when bulk selection or row selection is supported.
- Enable row numbers only when sequential references are useful.
- Use the Empty state for true no-data outcomes and provide a relevant next action when possible.
- For complex sorting, filtering, pagination, or responsive behavior, pair this component with the appropriate surrounding controls and patterns.

## Live Preview & Usage

<ComponentPreview name="Table" />

## Headless Table Controller (`createTableController`)

`Table`, `TableHeaderCell`, `TableCheckboxHeaderCell`, `TableBodyRow`, `TableCheckboxBodyCell`, and `Pagination` integrate plug-and-play with `createTableController` for reactive search, tri-state sorting (`'asc' | 'desc' | 'none'`), page-scoped checkbox selection with `indeterminate` state, and pagination across all 5 frameworks. See the full [Headless Table Controller Guide & Live Playground](/core/headless-table).

```tsx
import { createTableController, Table, TableHeaderRow, TableHeaderCell, TableCheckboxHeaderCell, TableBodyRow, TableCheckboxBodyCell, Pagination } from '@komerce-design/react';

const table = createTableController({ rows: orders, getRowId: (r) => r.id, searchKeys: ['customer', 'email'] });
// Bind directly:
// <InputText {...table.bindSearch()} />
// <TableCheckboxHeaderCell {...table.bindHeaderCheckbox()} />
// <TableHeaderCell {...table.bindHeaderSort('customer')}>Customer</TableHeaderCell>
// <TableBodyRow {...table.bindRow(row.id)}><TableCheckboxBodyCell {...table.bindRowCheckbox(row.id)} /></TableBodyRow>
// <Pagination {...table.bindPagination()} />
```

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `caption` | `string` | `'Data table'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `TableBodyCell`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | left, center, right |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `TableBodyRow`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `selected` | `boolean` | `false` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `TableCellValue`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `layout` | `'row' \| 'stacked'` | `'row'` | row, stacked |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | left, center, right |
| `status` | `'none' \| 'success' \| 'warning' \| 'destructive' \| 'info'` | `'none'` | none, success, warning, destructive, info |
| `secondaryText` | `string` | `''` | - |
| `badgeText` | `string` | `''` | - |
| `imageSrc` | `string` | `''` | - |
| `imageAlt` | `string` | `''` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `TableCheckboxBodyCell`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `checked` | `boolean` | `false` | - |
| `ariaLabel` | `string` | `'Select row'` | - |
| `className` | `string` | `''` | - |
| `onCheckedChange` | `(checked: boolean) => void` | `-` | - |

### `TableCheckboxHeaderCell`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `checked` | `boolean` | `false` | - |
| `indeterminate` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `ariaLabel` | `string` | `'Select all rows'` | - |
| `className` | `string` | `''` | - |
| `onCheckedChange` | `(checked: boolean) => void` | `-` | - |

### `TableEmpty`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `''` | - |
| `description` | `string` | `''` | - |
| `ctaLabel` | `string` | `''` | - |
| `showIcon` | `boolean` | `true` | - |
| `icon` | `Component \| ReactNode \| Slot` | `-` | - |
| `showTitle` | `boolean` | `true` | - |
| `showDescription` | `boolean` | `true` | - |
| `showCTA` | `boolean` | `false` | - |
| `colSpan` | `number` | `5` | - |
| `onCtaClick` | `() => void` | `-` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `TableHeaderCell`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | left, center, right |
| `sortable` | `boolean` | `false` | - |
| `sortDirection` | `'asc' \| 'desc' \| 'none'` | `'none'` | asc, desc, none |
| `sortIcon` | `Component \| ReactNode \| Slot` | `-` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onSort` | `() => void` | `-` | - |

### `TableHeaderRow`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `TableNoBodyCell`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `no` | `number` | `1` | - |
| `className` | `string` | `''` | - |

### `TableNoHeaderCell`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `className` | `string` | `''` | - |

## Design Tokens & Color Customization

`Table` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-background-subtle` | `--color-background-subtle` | Background / Surface fill |
| `bg-destructive-default` | `--color-destructive-default` | Background / Surface fill |
| `bg-info-default` | `--color-info-default` | Background / Surface fill |
| `bg-primary-default` | `--color-primary-default` | Background / Surface fill |
| `bg-primary-foreground` | `--color-primary-foreground` | Background / Surface fill |
| `bg-primary-hover` | `--color-primary-hover` | Background / Surface fill |
| `bg-primary-pressed` | `--color-primary-pressed` | Background / Surface fill |
| `bg-primary-subtle` | `--color-primary-subtle` | Background / Surface fill |
| `bg-success-default` | `--color-success-default` | Background / Surface fill |
| `bg-warning-default` | `--color-warning-default` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `border-border-subtle` | `--color-border-subtle` | Border / Divider stroke |
| `border-primary-default` | `--color-primary-default` | Border / Divider stroke |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |
| `text-foreground-subtle` | `--color-foreground-subtle` | Text / Foreground color |
| `text-primary-foreground` | `--color-primary-foreground` | Text / Foreground color |
| `text-primary-subtle-foreground` | `--color-primary-subtle-foreground` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<Table className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Table className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
