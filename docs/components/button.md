# Button

A versatile interactive component for user actions and link-styled navigation. It supports multiple emphasis levels, sizes, corner treatments, interaction states, optional leading and trailing icons, and an editable label.

## When to Use

- Use for actions such as submitting a form, confirming a decision, starting a workflow, or performing an operation.
- Use one clear Primary button for the preferred action at each decision point.
- Use Secondary, Outline, or Ghost for supporting actions.
- Use Destructive for dangerous or irreversible actions.
- Use Style=Link for navigation to another destination and implement it semantically as a hyperlink.

## Usage Guidelines

- Use a clear, concise, action-oriented label that ideally begins with a verb.
- Match visual emphasis to the importance of the action.
- Keep icon usage purposeful: leading icons can reinforce meaning, while trailing icons can indicate direction or continuation.
- Keep the label visible unless the icon is universally understood and has an accessible name.
- Use Disabled sparingly and explain why an action is unavailable when needed.
- Do not use Hover, Focus, or Pressed as resting states; they communicate interaction feedback or progress.
- Keep button hierarchy and sizing consistent within the same action group.

## Live Preview & Usage

<ComponentPreview name="Button" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `'Label'` | - |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | button, submit, reset |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive' \| 'link'` | `'primary'` | primary, secondary, outline, ghost, destructive, link |
| `size` | `'large' \| 'regular' \| 'small' \| 'mini'` | `'regular'` | large, regular, small, mini |
| `roundness` | `'default' \| 'round'` | `'default'` | default, round |
| `disabled` | `boolean` | `false` | - |
| `showLabel` | `boolean` | `true` | - |
| `showLeftIcon` | `boolean` | `false` | - |
| `showRightIcon` | `boolean` | `false` | - |
| `ariaLabel` | `string` | `''` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onClick` | `() => void` | `-` | - |
