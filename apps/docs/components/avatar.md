# Avatar

A circular identity component used to represent a person, account, or entity. It supports profile images, initials, and a generic icon fallback across five sizes, with an optional presence indicator.

## When to Use

- Identify a user in navigation, lists, messages, cards, profiles, and collaborative experiences.
- Use image when a recognizable profile photo is available.
- Use initials when no image is available but a meaningful name is known.
- Use icon as the final fallback when neither an image nor initials are available.

## Usage Guidelines

- Use regular as the default size for most product interfaces.
- Choose smaller sizes for dense or inline contexts, and larger sizes for profile-focused or high-emphasis layouts.
- Keep the image crop centered and use a clear, recognizable subject.
- Use no more than two initials. Prefer the first letters of the person’s first and last names.
- Show the status indicator only when presence information is current and meaningful.
- Pair the avatar with a visible name or accessible label when identity cannot be inferred from surrounding content.
- Do not use decorative imagery, logos, or status colors that conflict with the avatar’s identity purpose.

## Live Preview & Usage

<ComponentPreview name="Avatar" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `size` | `'mini' \| 'small' \| 'regular' \| 'large' \| 'x-large'` | `'mini'` | mini, small, regular, large, x-large |
| `type` | `'image' \| 'initials' \| 'icon'` | `'image'` | image, initials, icon |
| `showStatus` | `boolean` | `true` | - |
| `initialsText` | `string` | `'AB'` | - |
| `src` | `string` | `''` | - |
| `alt` | `string` | `''` | - |
| `icon` | `Component \| ReactNode \| Slot` | `-` | - |
| `status` | `'online' \| 'offline' \| 'busy' \| 'away'` | `'online'` | online, offline, busy, away |
| `className` | `string` | `''` | - |

## Design Tokens & Color Customization

`Avatar` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-interactive` | `--color-background-interactive` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `bg-destructive-default` | `--color-destructive-default` | Background / Surface fill |
| `bg-success-default` | `--color-success-default` | Background / Surface fill |
| `bg-warning-default` | `--color-warning-default` | Background / Surface fill |
| `border-background-default` | `--color-background-default` | Border / Divider stroke |
| `text-foreground-subtle` | `--color-foreground-subtle` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<Avatar className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Avatar className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
