# Toggle

Toggle lets users switch a single setting between off and on, with the change taking effect immediately.

## When to Use

- Use for binary preferences or settings with an immediate result.
- Use when users can clearly understand the effect of turning the option on or off.
- Do not use for multiple-choice decisions, required acknowledgements, or actions that need confirmation.

## Usage Guidelines

- Pair the toggle with a clear, concise label that describes the enabled state.
- Keep the current state visually clear and avoid relying on color alone.
- Use one size consistently within the same interface area.
- Use supporting text when the outcome may not be obvious.
- Keep disabled controls visible only when their context is useful, and explain why they are unavailable when needed.

## Live Preview & Usage

<ComponentPreview name="Toggle" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `pressed` | `boolean` | `false` | - |
| `disabled` | `boolean` | `false` | - |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | small, medium, large |
| `showText` | `boolean` | `false` | - |
| `label` | `string` | `'Toggle'` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `ariaLabel` | `string` | `''` | - |
| `onPressedChange` | `(pressed: boolean) => void` | `-` | - |
