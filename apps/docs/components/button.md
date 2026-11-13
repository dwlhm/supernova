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
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | button, submit, reset |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive' \| 'link'` | `'primary'` | primary, secondary, outline, ghost, destructive, link |
| `size` | `'large' \| 'regular' \| 'small' \| 'mini'` | `'regular'` | large, regular, small, mini |
| `roundness` | `'default' \| 'round'` | `'default'` | default, round |
| `disabled` | `boolean` | `false` | - |
| `showLeftIcon` | `boolean` | `false` | - |
| `showRightIcon` | `boolean` | `false` | - |
| `leftIcon` | `Component \| ReactNode \| Slot` | `-` | - |
| `rightIcon` | `Component \| ReactNode \| Slot` | `-` | - |
| `ariaLabel` | `string` | `''` | - |
| `className` | `string` | `''` | - |
| `children` | `ReactNode \| Slot \| ng-content` | `-` | - |
| `onClick` | `() => void` | `-` | - |

## Design Tokens & Color Customization

`Button` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-interactive` | `--color-background-interactive` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-destructive-background` | `--color-destructive-background` | Background / Surface fill |
| `bg-destructive-hover` | `--color-destructive-hover` | Background / Surface fill |
| `bg-destructive-pressed` | `--color-destructive-pressed` | Background / Surface fill |
| `bg-ghost-default` | `--color-ghost-default` | Background / Surface fill |
| `bg-ghost-hover` | `--color-ghost-hover` | Background / Surface fill |
| `bg-primary-default` | `--color-primary-default` | Background / Surface fill |
| `bg-primary-hover` | `--color-primary-hover` | Background / Surface fill |
| `bg-primary-pressed` | `--color-primary-pressed` | Background / Surface fill |
| `bg-secondary-default` | `--color-secondary-default` | Background / Surface fill |
| `bg-secondary-hover` | `--color-secondary-hover` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `border-primary-border-emphasis` | `--color-primary-border-emphasis` | Border / Divider stroke |
| `ring-focus-ring-error` | `--color-focus-ring-error` | Focus ring highlight |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |
| `text-primary-foreground` | `--color-primary-foreground` | Text / Foreground color |
| `text-primary-muted` | `--color-primary-muted` | Text / Foreground color |
| `text-primary-on-surface` | `--color-primary-on-surface` | Text / Foreground color |
| `text-primary-pressed` | `--color-primary-pressed` | Text / Foreground color |
| `text-secondary-foreground` | `--color-secondary-foreground` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<Button className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Button className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
