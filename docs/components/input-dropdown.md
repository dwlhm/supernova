# InputDropdown

A selection input that lets users choose one option from a predefined list while keeping the form compact.

## When to Use

- Use when available values are known in advance.
- Use when displaying all choices at once would take too much space.
- Use radio buttons for a small set of choices that should remain visible.

## Usage Guidelines

- Use a clear label and a meaningful placeholder such as “Choose department.”
- Order options logically and keep labels concise.
- Enable search for long or difficult-to-scan lists.
- Show the selected option in the Filled state.
- Provide specific error guidance and never rely on color alone.

## Live Preview & Usage

<ComponentPreview name="InputDropdown" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `open` | `boolean` | `false` | - |
| `value` | `string` | `''` | - |
| `options` | `SelectOption[]` | `[]` | - |
| `searchQuery` | `string` | `''` | - |
| `id` | `string` | `'input-dropdown'` | - |
| `name` | `string` | `'dropdown'` | - |
| `label` | `string` | `'Department'` | - |
| `placeholder` | `string` | `'Choose department'` | - |
| `hint` | `string` | `'Select your department or area of work.'` | - |
| `errorMessage` | `string` | `''` | - |
| `disabled` | `boolean` | `false` | - |
| `required` | `boolean` | `false` | - |
| `showLabel` | `boolean` | `true` | - |
| `showHint` | `boolean` | `false` | - |
| `showSearch` | `boolean` | `true` | - |
| `showLeftIcon` | `boolean` | `false` | - |
| `showRightIcon` | `boolean` | `true` | - |
| `className` | `string` | `''` | - |
| `onSelect` | `(value: string) => void` | `-` | - |
| `onSearchChange` | `(value: string) => void` | `-` | - |
| `onOpenChange` | `(open: boolean) => void` | `-` | - |
