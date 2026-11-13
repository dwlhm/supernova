# Quick Start (Consumer Guide)

Panduan ini menjelaskan cara memasang dan menggunakan paket `@komerce-design/*` serta token desainnya di aplikasi **React**, **Vue 3**, **Svelte**, **Vue 2**, maupun **Angular**.

---

## 1. Instalasi Paket

Pilih paket sesuai framework proyek Anda, lalu pasang bersama paket token desain `@komerce-design/tokens`:

::: code-group

```bash [React]
pnpm add @komerce-design/react @komerce-design/tokens
```

```bash [Vue 3]
pnpm add @komerce-design/vue3 @komerce-design/tokens
```

```bash [Svelte]
pnpm add @komerce-design/svelte @komerce-design/tokens
```

```bash [Vue 2]
pnpm add @komerce-design/vue2 @komerce-design/tokens
```

```bash [Angular]
pnpm add @komerce-design/angular @komerce-design/tokens
```

:::

---

## 2. Setup Design Tokens & Tailwind CSS v4

Seluruh komponen menggunakan CSS custom properties semantik (`--color-*`, `--radius-*`, `--shadow-*`) dari `@komerce-design/tokens`.

### A. Import CSS Tokens di Entrypoint Aplikasi

```css
/* src/styles/main.css */
@import "tailwindcss";
@import "@komerce-design/tokens/tokens.css";
@import "@komerce-design/tokens/theme.css";
```

- **`tokens.css`**: Mendefinisikan variabel semantik Light Mode (`:root`) dan Dark Mode (`.dark`) hasil ekstraksi langsung dari Figma.
- **`theme.css`**: Mendaftarkan blok `@theme` untuk Tailwind CSS v4 sehingga utility class seperti `bg-primary-default`, `text-foreground-muted`, `border-border-default`, dan `bg-brand-kompack-primary` langsung tersedia.

### B. Mengaktifkan Dark Mode

Cukup tambahkan class `dark` pada elemen `<html>` atau container root aplikasi Anda. Seluruh komponen dan chart akan otomatis beralih ke palet Dark Mode tanpa konfigurasi tambahan:

```ts
document.documentElement.classList.toggle('dark');
```

---

## 3. Memilih Cara Penggunaan (3 Level Progresif)

Komerce Design System dirancang agar Anda tidak terkunci pada satu tingkat abstraksi:

| Level | Kapan Dipakai | Contoh |
| :--- | :--- | :--- |
| **1. Komponen UI Siap Pakai** | Kebutuhan standar dengan layout dan styling Komerce Design System. | `<Button>`, `<InputText>`, `<Table>`, `<ChartBar>` |
| **2. Komponen + Headless Controller** | Ingin manajemen state terpusat (validasi form async, sorting/pagination tabel, toast queue) dengan integrasi `bind*` plug-and-play. | [`createFormController`](/core/headless-form), [`createTableController`](/core/headless-table), [`createOverlayController`](/core/headless-primitives) |
| **3. Full Custom UI (Headless Engine)** | Ingin kontrol 100% atas markup/SVG/DOM sendiri sambil tetap memakai kalkulasi matematika, skala, atau ARIA dari design system. | [`getChart*State` & SVG Scales](/core/headless-chart), [`parseDateInput` & `createDialogState`](/core/headless-primitives) |

---

## 4. Contoh Pertama di 5 Framework

::: code-group

```tsx [React]
import { Button, Badge } from '@komerce-design/react';

export function App() {
  return (
    <div className="flex items-center gap-3 p-6">
      <Button variant="primary" onClick={() => console.log('Clicked!')}>
        Simpan Perubahan
      </Button>
      <Badge variant="success">Aktif</Badge>
    </div>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { Button, Badge } from '@komerce-design/vue3';
</script>

<template>
  <div class="flex items-center gap-3 p-6">
    <Button variant="primary" @click="console.log('Clicked!')">
      Simpan Perubahan
    </Button>
    <Badge variant="success">Aktif</Badge>
  </div>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { Button, Badge } from '@komerce-design/svelte';
</script>

<div class="flex items-center gap-3 p-6">
  <Button variant="primary" on:click={() => console.log('Clicked!')}>
    Simpan Perubahan
  </Button>
  <Badge variant="success">Aktif</Badge>
</div>
```

```vue [Vue 2]
<script>
import { Button, Badge } from '@komerce-design/vue2';

export default {
  components: { Button, Badge },
};
</script>

<template>
  <div class="flex items-center gap-3 p-6">
    <Button variant="primary">Simpan Perubahan</Button>
    <Badge variant="success">Aktif</Badge>
  </div>
</template>
```

```ts [Angular]
import { Component, NgModule } from '@angular/core';
import { ButtonModule, BadgeModule } from '@komerce-design/angular';

@Component({
  selector: 'app-root',
  template: `
    <div class="flex items-center gap-3 p-6">
      <kd-button variant="primary">Simpan Perubahan</kd-button>
      <kd-badge variant="success">Aktif</kd-badge>
    </div>
  `,
})
export class AppComponent {}

@NgModule({
  declarations: [AppComponent],
  imports: [ButtonModule, BadgeModule],
})
export class AppModule {}
```

:::

---

## Langkah Berikutnya

- Jelajahi [Design Tokens Explorer](/tokens) untuk melihat semua warna semantik, sub-brand, tipografi, dan shadow.
- Lihat [Component Catalog](/components/) atau [Multi-Framework Showcase](/showcase) untuk mencoba semua komponen secara interaktif.
- Pelajari [Form Validation (`createFormController`)](/core/headless-form), [Data Table (`createTableController`)](/core/headless-table), dan [Headless Chart Engine](/core/headless-chart) untuk skenario aplikasi kompleks.
