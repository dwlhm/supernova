# Design Tokens

Design tokens represent the foundational design decisions of the Supernova UI system — colors, typography scales, spacing, and shadows.

Tokens are exported automatically from Supernova into `@dwlhm/design-tokens` as TypeScript constants, CSS variables, and Tailwind CSS v4 theme variables.

---

## Color Tokens

Click any color swatch to copy its hex value to your clipboard.

<ColorGrid />

---

## Typography Scale

Supernova defines standardized typographic scale sets for headings, body copy, and captions:

| Token Name | Font Family | Size | Weight | Line Height |
| :--- | :--- | :--- | :--- | :--- |
| **heading1** | Inter | `36px` | `600` | `44px` |
| **heading2** | Inter | `28px` | `600` | `36px` |
| **heading3** | Inter | `18px` | `600` | `28px` |
| **body1** | Inter | `16px` | `400` | `24px` |
| **body2** | Inter | `14px` | `500` | `20px` |
| **body3** | Inter | `12px` | `400` | `16px` |

---

## Elevation & Shadows

Elevation tokens provide depth perception for surfaces and overlays:

| Elevation Level | CSS Variable | Value |
| :--- | :--- | :--- |
| **Raised** | `--shadow-raised` | `0px 1px 3px -1px #000000, 0px 2px 3px -3px #000000` |
| **Overlay** | `--shadow-overlay` | `0px 15px 25px 0px #000000, 0px 5px 10px 0px #000000` |

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin: 24px 0;">
  <div style="padding: 24px; border-radius: 8px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); box-shadow: var(--shadow-raised); text-align: center;">
    <strong>Raised Surface</strong>
    <p style="font-size: 12px; color: var(--vp-c-text-2); margin-top: 6px;">Cards, buttons, dropdown triggers</p>
  </div>
  <div style="padding: 24px; border-radius: 8px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); box-shadow: var(--shadow-overlay); text-align: center;">
    <strong>Overlay Surface</strong>
    <p style="font-size: 12px; color: var(--vp-c-text-2); margin-top: 6px;">Modals, dialogs, popovers</p>
  </div>
</div>

---

## CSS Variables Reference

When importing `@dwlhm/design-tokens/css/tokens.css`, CSS custom properties are exposed globally:

```css
/* Background & Surface Tokens */
var(--color-background-page);
var(--color-background-primary);
var(--color-background-secondary);

/* Foreground & Text Tokens */
var(--color-foreground-neutral);
var(--color-foreground-primary);
var(--color-foreground-positive);

/* Border Tokens */
var(--color-border-neutral);
var(--color-border-primary);
var(--color-border-focus);
```
