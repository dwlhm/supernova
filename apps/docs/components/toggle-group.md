# ToggleGroup

A toggle group organizes several related switch controls into one scannable settings section. Each switch remains independent, while the shared layout and optional group label communicate their relationship.

## When to Use

- Use when two to five related settings should be presented together.
- Use when each option can be enabled or disabled independently.
- Use in settings pages, preference panels, filters, or configuration forms.
- Do not use when users must choose only one option; use a radio group or segmented control instead.

## Usage Guidelines

- Give the group a concise label when the relationship between options is not self-evident.
- Write each toggle label as a clear setting name with an unambiguous on state.
- Show only the number of toggle rows needed; hide unused rows.
- Keep the size consistent with surrounding controls and interface density.
- Order options logically, placing the most common or important settings first.
- Explain unavailable options near the affected toggle rather than at the group level.

## Live Preview & Usage

<ComponentPreview name="ToggleGroup" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | small, medium, large |
| `ariaLabel` | `string` | `'Toggle group'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |

### `ToggleGroupItem`

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | small, medium, large |
| `pressed` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `ariaLabel` | `string` | `'Toggle option'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onPressedChange` | `(pressed: boolean) => void` | `-` | - |
