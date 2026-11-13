# Progressbar

A horizontal progress bar that communicates how much of an ongoing process has been completed.

## When to Use

- Use for tasks with measurable progress, such as uploads, downloads, installations, onboarding, or multi-step processing.
- Use when progress can be represented as a percentage or a known fraction of completion.
- Do not use for activity with an unknown duration; use an indeterminate loading indicator instead.

## Usage Guidelines

- Keep the track width consistent within the same flow.
- Update progress from left to right and avoid moving backward unless the underlying process genuinely regresses.
- Pair the bar with a percentage or short status label when users need precise progress information.
- Do not use color alone to communicate status; provide supporting text when status is important.
- Show completion clearly at 100%, then transition to the completed state or next step.

## Live Preview & Usage

<ComponentPreview name="Progressbar" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `value` | `number` | `0` | - |
| `label` | `string \| ((percentage: number) => string)` | `'Progress'` | - |
| `showLabel` | `boolean` | `false` | - |
| `trackClassName` | `string` | `''` | - |
| `indicatorClassName` | `string` | `''` | - |
| `className` | `string` | `''` | - |

## Design Tokens & Color Customization

`Progressbar` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `indicatorClassName` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-primary-default` | `--color-primary-default` | Background / Surface fill |
| `text-foreground-muted` | `--color-foreground-muted` | Text / Foreground color |

```tsx
// 1. Direct token override via indicatorClassName
<Progressbar indicatorClassName="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Progressbar indicatorClassName="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
