# Design Tokens Explorer

Jelajahi seluruh token desain hasil ekstraksi Figma secara visual — mulai dari palet warna semantik & sub-brand Komerce (Light & Dark Mode), skala tipografi, border radius, dimensi kontrol, hingga *elevation shadow*. Klik chip class Tailwind atau variabel CSS untuk menyalin langsung.

<DesignTokensExplorer />

## Cara Custom Warna Komponen dengan Design Tokens

Seluruh komponen di Design System ini dibangun di atas variabel CSS semantik (`var(--color-*)`) dari Figma. Anda dapat mengubah warna **background**, **text/foreground**, **border**, maupun **indikator** pada komponen apa pun melalui 2 cara:

### 1. Menggunakan Class Token Semantik / Sub-Brand (`className` / `contentClassName` / `indicatorClassName`)

Setiap komponen menggabungkan prop class menggunakan `cn()` (`tailwind-merge`), sehingga class warna yang Anda kirim akan otomatis menggantikan token default:

```tsx
// Button & Badge dengan token warna sub-brand Komerce
<Button className="bg-brand-kompack-primary hover:bg-brand-kompack-secondary text-primary-foreground">
  Kirim Paket
</Button>

// Tooltip dengan warna bubble & dot kustom (tanpa mempengaruhi elemen trigger)
<Tooltip text="Tersimpan otomatis" contentClassName="bg-brand-komtim-primary text-primary-foreground">
  <span>Status</span>
</Tooltip>

// Progressbar, Slider & Chart Tooltip dengan warna kustom
<Progressbar value={80} indicatorClassName="bg-success-default" trackClassName="bg-success-subtle" />
<ChartBar data={rows} barColorClass="bg-brand-komplace-primary" tooltipClassName="bg-foreground-default text-foreground-inverse" />
```

### 2. Rebinding Variabel CSS Token (`--color-*`) per Komponen atau Tema

Untuk mengubah seluruh bagian internal komponen yang terikat ke suatu token Figma sekaligus (misalnya mengubah `--color-primary-default` pada `SwitchButton`, `Slider`, `Tabs`, atau `Stepper`):

```tsx
<div className="[--color-primary-default:var(--color-brand-komclass-primary)] [--color-primary-hover:var(--color-brand-komclass-secondary)]">
  <SwitchButton checked={true} label="Aktifkan Kelas" />
  <Slider value={65} />
</div>
```

<details>
<summary>Lihat Tabel Referensi Lengkap CSS Variables</summary>

### Color

| Token Name | CSS Variable | Value |
| :--- | :--- | :--- |
| `🌱 Semantic/colors/accent/default` | `--color-accent-default` | `rgb(245, 245, 245)` |
| `🌱 Semantic/colors/background/default` | `--color-background-default` | `rgb(255, 255, 255)` |
| `🌱 Semantic/colors/background/interactive` | `--color-background-interactive` | `rgb(229, 229, 229)` |
| `🌱 Semantic/colors/background/muted` | `--color-background-muted` | `rgb(245, 245, 245)` |
| `🌱 Semantic/colors/background/subtle` | `--color-background-subtle` | `rgb(250, 250, 250)` |
| `🌱 Semantic/colors/border/default` | `--color-border-default` | `rgb(229, 229, 229)` |
| `🌱 Semantic/colors/border/subtle` | `--color-border-subtle` | `rgb(245, 245, 245)` |
| `🌱 Semantic/colors/brand/komads/primary` | `--color-brand-komads-primary` | `rgb(128, 128, 128)` |
| `🌱 Semantic/colors/brand/komads/secondary` | `--color-brand-komads-secondary` | `rgb(102, 102, 102)` |
| `🌱 Semantic/colors/brand/komcards/primary` | `--color-brand-komcards-primary` | `rgb(127, 127, 127)` |
| `🌱 Semantic/colors/brand/komcards/secondary` | `--color-brand-komcards-secondary` | `rgb(101, 101, 102)` |
| `🌱 Semantic/colors/brand/komchat/primary` | `--color-brand-komchat-primary` | `rgb(248, 50, 10)` |
| `🌱 Semantic/colors/brand/komchat/secondary` | `--color-brand-komchat-secondary` | `rgb(178, 35, 20)` |
| `🌱 Semantic/colors/brand/komclass/primary` | `--color-brand-komclass-primary` | `rgb(109, 60, 184)` |
| `🌱 Semantic/colors/brand/komclass/secondary` | `--color-brand-komclass-secondary` | `rgb(84, 50, 150)` |
| `🌱 Semantic/colors/brand/komed/primary` | `--color-brand-komed-primary` | `rgb(161, 226, 231)` |
| `🌱 Semantic/colors/brand/komerce/primary` | `--color-brand-komerce-primary` | `rgb(197, 51, 0)` |
| `🌱 Semantic/colors/brand/komlabs/primary` | `--color-brand-komlabs-primary` | `rgb(255, 102, 233)` |
| `🌱 Semantic/colors/brand/kompack/primary` | `--color-brand-kompack-primary` | `rgb(66, 133, 244)` |
| `🌱 Semantic/colors/brand/kompack/secondary` | `--color-brand-kompack-secondary` | `rgb(30, 93, 186)` |
| `🌱 Semantic/colors/brand/komplace/primary` | `--color-brand-komplace-primary` | `rgb(254, 87, 34)` |
| `🌱 Semantic/colors/brand/komplace/secondary` | `--color-brand-komplace-secondary` | `rgb(234, 55, 7)` |
| `🌱 Semantic/colors/brand/komship/primary` | `--color-brand-komship-primary` | `rgb(251, 188, 5)` |
| `🌱 Semantic/colors/brand/komship/secondary` | `--color-brand-komship-secondary` | `rgb(204, 146, 18)` |
| `🌱 Semantic/colors/brand/komstore/primary` | `--color-brand-komstore-primary` | `rgb(9, 178, 171)` |
| `🌱 Semantic/colors/brand/komstore/secondary` | `--color-brand-komstore-secondary` | `rgb(0, 72, 61)` |
| `🌱 Semantic/colors/brand/komtim/primary` | `--color-brand-komtim-primary` | `rgb(52, 168, 83)` |
| `🌱 Semantic/colors/brand/komtim/secondary` | `--color-brand-komtim-secondary` | `rgb(0, 131, 45)` |
| `🌱 Semantic/colors/brand/monochrome/default` | `--color-brand-monochrome` | `rgb(31, 41, 55)` |
| `🌱 Semantic/colors/chart/series-1` | `--color-chart-series-1` | `rgb(59, 130, 246)` |
| `🌱 Semantic/colors/chart/series-2` | `--color-chart-series-2` | `rgb(6, 182, 212)` |
| `🌱 Semantic/colors/chart/series-3` | `--color-chart-series-3` | `rgb(139, 92, 246)` |
| `🌱 Semantic/colors/chart/series-4` | `--color-chart-series-4` | `rgb(245, 158, 11)` |
| `🌱 Semantic/colors/chart/series-5` | `--color-chart-series-5` | `rgb(236, 72, 153)` |
| `🌱 Semantic/colors/destructive/background` | `--color-destructive-background` | `rgb(220, 38, 38)` |
| `🌱 Semantic/colors/destructive/border` | `--color-destructive-border` | `rgb(251, 113, 133)` |
| `🌱 Semantic/colors/destructive/default` | `--color-destructive-default` | `rgb(225, 29, 72)` |
| `🌱 Semantic/colors/destructive/foreground` | `--color-destructive-foreground` | `rgb(190, 18, 60)` |
| `🌱 Semantic/colors/destructive/hover` | `--color-destructive-hover` | `rgb(190, 18, 60)` |
| `🌱 Semantic/colors/destructive/pressed` | `--color-destructive-pressed` | `rgb(159, 18, 57)` |
| `🌱 Semantic/colors/destructive/subtle` | `--color-destructive-subtle` | `rgb(255, 241, 242)` |
| `🌱 Semantic/colors/focus/ring-default` | `--color-focus-ring-default` | `rgb(212, 212, 212)` |
| `🌱 Semantic/colors/focus/ring-error` | `--color-focus-ring-error` | `rgb(253, 164, 175)` |
| `🌱 Semantic/colors/focus/ring-primary` | `--color-focus-ring-primary` | `rgb(255, 176, 136)` |
| `🌱 Semantic/colors/foreground/default` | `--color-foreground-default` | `rgb(10, 10, 10)` |
| `🌱 Semantic/colors/foreground/inverse` | `--color-foreground-inverse` | `rgb(250, 250, 250)` |
| `🌱 Semantic/colors/foreground/muted` | `--color-foreground-muted` | `rgb(115, 115, 115)` |
| `🌱 Semantic/colors/foreground/subtle` | `--color-foreground-subtle` | `rgb(82, 82, 82)` |
| `🌱 Semantic/colors/ghost/default` | `--color-ghost-default` | `rgba(255, 255, 255, 0)` |
| `🌱 Semantic/colors/ghost/hover` | `--color-ghost-hover` | `rgba(0, 0, 0, 0.05)` |
| `🌱 Semantic/colors/info/default` | `--color-info-default` | `rgb(59, 130, 246)` |
| `🌱 Semantic/colors/info/foreground` | `--color-info-foreground` | `rgb(29, 78, 216)` |
| `🌱 Semantic/colors/info/subtle` | `--color-info-subtle` | `rgb(239, 246, 255)` |
| `🌱 Semantic/colors/overlay/backdrop` | `--color-overlay-backdrop` | `rgba(0, 0, 0, 0.6)` |
| `🌱 Semantic/colors/primary/border-emphasis` | `--color-primary-border-emphasis` | `rgb(255, 138, 76)` |
| `🌱 Semantic/colors/primary/default` | `--color-primary-default` | `rgb(229, 85, 20)` |
| `🌱 Semantic/colors/primary/foreground` | `--color-primary-foreground` | `rgb(255, 255, 255)` |
| `🌱 Semantic/colors/primary/hover` | `--color-primary-hover` | `rgb(168, 62, 16)` |
| `🌱 Semantic/colors/primary/muted` | `--color-primary-muted` | `rgb(204, 75, 18)` |
| `🌱 Semantic/colors/primary/on-surface` | `--color-primary-on-surface` | `rgb(77, 29, 8)` |
| `🌱 Semantic/colors/primary/pressed` | `--color-primary-pressed` | `rgb(122, 46, 12)` |
| `🌱 Semantic/colors/primary/subtle` | `--color-primary-subtle` | `rgb(255, 232, 217)` |
| `🌱 Semantic/colors/primary/subtle-foreground` | `--color-primary-subtle-foreground` | `rgb(122, 46, 12)` |
| `🌱 Semantic/colors/secondary/default` | `--color-secondary-default` | `rgb(245, 245, 245)` |
| `🌱 Semantic/colors/secondary/foreground` | `--color-secondary-foreground` | `rgb(23, 23, 23)` |
| `🌱 Semantic/colors/secondary/hover` | `--color-secondary-hover` | `rgb(250, 250, 250)` |
| `🌱 Semantic/colors/success/default` | `--color-success-default` | `rgb(34, 197, 94)` |
| `🌱 Semantic/colors/success/foreground` | `--color-success-foreground` | `rgb(21, 128, 61)` |
| `🌱 Semantic/colors/success/subtle` | `--color-success-subtle` | `rgb(240, 253, 244)` |
| `🌱 Semantic/colors/warning/default` | `--color-warning-default` | `rgb(245, 158, 11)` |
| `🌱 Semantic/colors/warning/foreground` | `--color-warning-foreground` | `rgb(180, 83, 9)` |
| `🌱 Semantic/colors/warning/subtle` | `--color-warning-subtle` | `rgb(255, 251, 235)` |

### Effect

| Token Name | CSS Variable | Value |
| :--- | :--- | :--- |
| `effect/Focus Ring/Default` | `--shadow-focus-ring-default` | `0px 0px 0px 3px rgb(212, 212, 212)` |
| `effect/Focus Ring/Error` | `--shadow-focus-ring-error` | `0px 0px 0px 3px rgb(253, 164, 175)` |
| `effect/Focus Ring/Primary` | `--shadow-focus-ring-primary` | `0px 0px 0px 3px rgb(255, 176, 136)` |
| `effect/Shadow/2xl` | `--shadow-2xl` | `0px 25px 50px 12px rgba(0, 0, 0, 0.25)` |
| `effect/Shadow/2xs` | `--shadow-2xs` | `0px 1px 0px 0px rgba(0, 0, 0, 0.05)` |
| `effect/Shadow/lg` | `--shadow-lg` | `0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)` |
| `effect/Shadow/md` | `--shadow-md` | `0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)` |
| `effect/Shadow/sm` | `--shadow-sm` | `0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)` |
| `effect/Shadow/xl` | `--shadow-xl` | `0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)` |
| `effect/Shadow/xs` | `--shadow-xs` | `0px 1px 2px 0px rgba(0, 0, 0, 0.05)` |

### Float

| Token Name | CSS Variable | Value |
| :--- | :--- | :--- |
| `🌱 Semantic/opacity/disabled` | `--opacity-disabled` | `0.5` |
| `🌱 Semantic/opacity/visible` | `--opacity-visible` | `1` |
| `🌱 Semantic/radius/rounded-2xl` | `--radius-2xl` | `16px` |
| `🌱 Semantic/radius/rounded-full` | `--radius-full` | `9999px` |
| `🌱 Semantic/radius/rounded-lg` | `--radius-lg` | `8px` |
| `🌱 Semantic/radius/rounded-md` | `--radius-md` | `6px` |
| `🌱 Semantic/radius/rounded-none` | `--radius-none` | `0` |
| `🌱 Semantic/radius/rounded-sm` | `--radius-sm` | `4px` |
| `🌱 Semantic/radius/rounded-xl` | `--radius-xl` | `12px` |
| `🌱 Semantic/radius/rounded-xs` | `--radius-xs` | `2px` |
| `🌱 Semantic/sizing/border-width/default` | `--sizing-border-width-default` | `1` |
| `🌱 Semantic/sizing/border-width/focus` | `--sizing-border-width-focus` | `2` |
| `🌱 Semantic/sizing/control-height/2x-large` | `--sizing-control-height-2x-large` | `96px` |
| `🌱 Semantic/sizing/control-height/large` | `--sizing-control-height-large` | `40px` |
| `🌱 Semantic/sizing/control-height/mini` | `--sizing-control-height-mini` | `24px` |
| `🌱 Semantic/sizing/control-height/regular` | `--sizing-control-height-regular` | `36px` |
| `🌱 Semantic/sizing/control-height/small` | `--sizing-control-height-small` | `32px` |
| `🌱 Semantic/sizing/control-height/x-large` | `--sizing-control-height-x-large` | `56px` |
| `🌱 Semantic/sizing/focus-ring/offset` | `--sizing-focus-ring-offset` | `0` |
| `🌱 Semantic/sizing/focus-ring/spread` | `--sizing-focus-ring-spread` | `3px` |
| `🌱 Semantic/sizing/icon-stroke-width/default` | `--sizing-icon-stroke-width-default` | `1.5` |
| `🌱 Semantic/sizing/icon/lg` | `--sizing-icon-lg` | `20px` |
| `🌱 Semantic/sizing/icon/md` | `--sizing-icon-md` | `16px` |
| `🌱 Semantic/sizing/icon/sm` | `--sizing-icon-sm` | `12px` |
| `🌱 Semantic/sizing/icon/xl` | `--sizing-icon-xl` | `28px` |
| `🌱 Semantic/spacing/2xl` | `--spacing-2xl` | `32px` |
| `🌱 Semantic/spacing/2xs` | `--spacing-2xs` | `4px` |
| `🌱 Semantic/spacing/2xs-plus` | `--spacing-2xs-plus` | `6px` |
| `🌱 Semantic/spacing/3xl` | `--spacing-3xl` | `40px` |
| `🌱 Semantic/spacing/3xs` | `--spacing-3xs` | `2px` |
| `🌱 Semantic/spacing/4xl` | `--spacing-4xl` | `48px` |
| `🌱 Semantic/spacing/5xl` | `--spacing-5xl` | `64px` |
| `🌱 Semantic/spacing/lg` | `--spacing-lg` | `20px` |
| `🌱 Semantic/spacing/md` | `--spacing-md` | `16px` |
| `🌱 Semantic/spacing/none` | `--spacing-none` | `0` |
| `🌱 Semantic/spacing/padding-y/large` | `--spacing-padding-y-large` | `10px` |
| `🌱 Semantic/spacing/padding-y/mini` | `--spacing-padding-y-mini` | `3px` |
| `🌱 Semantic/spacing/padding-y/regular` | `--spacing-padding-y-regular` | `8px` |
| `🌱 Semantic/spacing/sm` | `--spacing-sm` | `12px` |
| `🌱 Semantic/spacing/xl` | `--spacing-xl` | `24px` |
| `🌱 Semantic/spacing/xs` | `--spacing-xs` | `8px` |
| `🌱 Semantic/spacing/xs-plus` | `--spacing-xs-plus` | `10px` |
| `🌱 Semantic/typography/heading-1/font-size` | `--font-heading-1-font-size` | `48px` |
| `🌱 Semantic/typography/heading-1/letter-spacing` | `--font-heading-1-letter-spacing` | `-1.5px` |
| `🌱 Semantic/typography/heading-1/line-height` | `--font-heading-1-line-height` | `48px` |
| `🌱 Semantic/typography/heading-2/font-size` | `--font-heading-2-font-size` | `30px` |
| `🌱 Semantic/typography/heading-2/letter-spacing` | `--font-heading-2-letter-spacing` | `-1px` |
| `🌱 Semantic/typography/heading-2/line-height` | `--font-heading-2-line-height` | `30px` |
| `🌱 Semantic/typography/heading-3/font-size` | `--font-heading-3-font-size` | `24px` |
| `🌱 Semantic/typography/heading-3/letter-spacing` | `--font-heading-3-letter-spacing` | `-1px` |
| `🌱 Semantic/typography/heading-3/line-height` | `--font-heading-3-line-height` | `28.8px` |
| `🌱 Semantic/typography/heading-4/font-size` | `--font-heading-4-font-size` | `20px` |
| `🌱 Semantic/typography/heading-4/letter-spacing` | `--font-heading-4-letter-spacing` | `0` |
| `🌱 Semantic/typography/heading-4/line-height` | `--font-heading-4-line-height` | `24px` |
| `🌱 Semantic/typography/paragraph/body/font-size` | `--font-paragraph-body-font-size` | `14px` |
| `🌱 Semantic/typography/paragraph/body/letter-spacing` | `--font-paragraph-body-letter-spacing` | `0` |
| `🌱 Semantic/typography/paragraph/body/line-height` | `--font-paragraph-body-line-height` | `21px` |
| `🌱 Semantic/typography/paragraph/caption/font-size` | `--font-paragraph-caption-font-size` | `12px` |
| `🌱 Semantic/typography/paragraph/caption/letter-spacing` | `--font-paragraph-caption-letter-spacing` | `0` |
| `🌱 Semantic/typography/paragraph/caption/line-height` | `--font-paragraph-caption-line-height` | `16px` |
| `🌱 Semantic/typography/paragraph/label/font-size` | `--font-paragraph-label-font-size` | `11px` |
| `🌱 Semantic/typography/paragraph/label/letter-spacing` | `--font-paragraph-label-letter-spacing` | `0` |
| `🌱 Semantic/typography/paragraph/label/line-height` | `--font-paragraph-label-line-height` | `14px` |
| `🌱 Semantic/typography/paragraph/title/font-size` | `--font-paragraph-title-font-size` | `16px` |
| `🌱 Semantic/typography/paragraph/title/letter-spacing` | `--font-paragraph-title-letter-spacing` | `0` |
| `🌱 Semantic/typography/paragraph/title/line-height` | `--font-paragraph-title-line-height` | `24px` |

### String

| Token Name | CSS Variable | Value |
| :--- | :--- | :--- |
| `🌱 Semantic/typography/font-family/body` | `--font-body` | `Plus Jakarta Sans` |
| `🌱 Semantic/typography/font-family/headings` | `--font-headings` | `Plus Jakarta Sans` |
| `🌱 Semantic/typography/heading-1/weight` | `--font-heading-1-weight` | `600` |
| `🌱 Semantic/typography/heading-2/weight` | `--font-heading-2-weight` | `600` |
| `🌱 Semantic/typography/heading-3/weight` | `--font-heading-3-weight` | `600` |
| `🌱 Semantic/typography/heading-4/weight` | `--font-heading-4-weight` | `600` |
| `🌱 Semantic/typography/paragraph/weight-bold` | `--font-paragraph-weight-bold` | `600` |
| `🌱 Semantic/typography/paragraph/weight-medium` | `--font-paragraph-weight-medium` | `500` |
| `🌱 Semantic/typography/paragraph/weight-regular` | `--font-paragraph-weight-regular` | `400` |

</details>
