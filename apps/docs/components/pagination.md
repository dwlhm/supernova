# Pagination

Pagination lets users navigate through content or data that is divided across multiple pages. This component includes Previous and Next controls, individual page numbers, and an ellipsis for skipped page ranges.

### Variants

Default — Use the standard pagination layout when users need sequential navigation and direct access to nearby pages.

## When to Use

- Use for long lists, tables, search results, or collections that are split into pages.
- Use when users need to understand their current position and move to a specific page.
- Avoid pagination when all content can be displayed clearly on one page or when continuous loading is more appropriate.

## Usage Guidelines

- Place pagination directly below the content it controls.
- Clearly distinguish the current page from available pages.
- Disable Previous on the first page and Next on the last page.
- Use an ellipsis to compress long page ranges while keeping the first, last, current, and nearby pages accessible.
- Preserve sorting, filters, and item order when users move between pages.
- Provide accessible labels for navigation controls and indicate the current page to assistive technologies.

## Live Preview & Usage

<ComponentPreview name="Pagination" />

## Props & Variants

| Prop | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `currentPage` | `number` | `1` | - |
| `totalPages` | `number` | `1` | - |
| `previousLabel` | `string` | `'Previous'` | - |
| `nextLabel` | `string` | `'Next'` | - |
| `ariaLabel` | `string` | `'Pagination'` | - |
| `prevIcon` | `Component \| ReactNode \| Slot` | `-` | - |
| `nextIcon` | `Component \| ReactNode \| Slot` | `-` | - |
| `getPageAriaLabel` | `(page: number) => string` | `-` | - |
| `className` | `string` | `''` | - |
| `onPageChange` | `(page: number) => void` | `-` | - |

## Design Tokens & Color Customization

`Pagination` consumes canonical Figma semantic color tokens. You can customize its colors either by passing semantic/brand utility classes via `className` or by rebinding the underlying CSS custom properties (`--color-*`) on the component or a parent wrapper:

| Tailwind Token Class | CSS Variable | UI Role |
| :--- | :--- | :--- |
| `bg-background-default` | `--color-background-default` | Background / Surface fill |
| `bg-background-interactive` | `--color-background-interactive` | Background / Surface fill |
| `bg-background-muted` | `--color-background-muted` | Background / Surface fill |
| `border-border-default` | `--color-border-default` | Border / Divider stroke |
| `ring-focus-ring-primary` | `--color-focus-ring-primary` | Focus ring highlight |
| `text-foreground-default` | `--color-foreground-default` | Text / Foreground color |

```tsx
// 1. Direct token override via className
<Pagination className="bg-brand-kompack-primary text-primary-foreground" />

// 2. Scoped CSS variable token rebinding (updates all internal elements using that token)
<Pagination className="[--color-primary-default:var(--color-brand-komship-primary)]" />
```
