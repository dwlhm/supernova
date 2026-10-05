# Supernova Mock Exporter & Offline Development Engine

Mekanisme ini memungkinkan kamu mengembangkan dan menguji custom Supernova Exporter (`@dwlhm/supernova-exporter-mitosis`) secara **100% offline** di lokal, tanpa perlu:
- Akun Supernova Cloud
- Supernova CLI login / API Key
- Koneksi internet ke backend Supernova

---

## 🚀 Fitur Utama

1. **Realistic Design Tokens**: 66 mock tokens bawaan mencakup Colors (skala gray, blue, purple, green, semantic bg/fg/border), Typography (Inter heading1-3, body1-3), Spacing (4px - 64px), Radii (4px - full), Shadows, dan Borders.
2. **Theming Support**: Simulasi pergantian theme seperti Light theme (default) dan Dark theme (`theme-dark`) dengan override token otomatis.
3. **Live Watch Mode**: Mengawasi perubahan pada `exporter/src/**` dan `exporter/mock/data/**`. Begitu kamu edit kode exporter, otomatis bundle `tsup` di-rebuild (~10ms) dan file `output/` langsung diperbarui!
4. **Pulsar Bridge Emulation**: Mensimulasikan runtime environment `globalThis.Pulsar` yang identik dengan runtime asli Supernova Pulsar engine.

---

## 📖 Cara Penggunaan

### 1. Jalankan Sekali (One-shot Export)
Dari root workspace:
```bash
npm run export:mock
```
Atau dari direktori `exporter/`:
```bash
npm run mock
```

File hasil export akan langsung di-generate ke folder `output/`:
- `output/tokens/tokens.ts`
- `output/tokens/tokens.css`
- `output/tokens/theme.css`
- `output/components/*.lite.tsx`
- `output/index.ts`

### 2. Mode Watch (Pengembangan Real-time)
Jalankan watch mode saat mengoding exporter:
```bash
npm run dev:mock
```
Setiap kali kamu mengedit file di `exporter/src/` (misalnya memodifikasi `token-generator.ts` atau `component-generator.ts`), runner akan otomatis meng-compile dan meng-export ulang dalam hitungan milidetik!

### 3. Ekspor dengan Dark Theme
Untuk menguji bagaimana exporter menangani themes:
```bash
npm run export:mock:dark
# atau
node exporter/mock/runner.js --theme theme-dark
```

### 4. Ekspor ke Direktori Kustom
```bash
node exporter/mock/runner.js --out ./test-output
```

### 5. Menjalankan Automated Test
```bash
npm run test:exporter
# atau dari dalam folder exporter/
npm test
```

---

## 🎨 Menyesuaikan Mock Data

Semua data mock disimpan dalam format JSON sederhana di dalam folder `exporter/mock/data/`:

### 1. `tokens.json`
Daftar seluruh design tokens. Kamu bisa menambahkan token baru dengan struktur standar Supernova:
```json
{
  "id": "token-color-brand-accent",
  "name": "accent",
  "tokenType": "Color",
  "parentGroupId": "group-color-base",
  "value": {
    "hex": "#f59e0b",
    "r": 245,
    "g": 158,
    "b": 11,
    "a": 1
  }
}
```

Tipe token yang didukung:
- `Color`: `{ "hex": "#...", "r": 0, "g": 0, "b": 0, "a": 1 }`
- `Typography`: `{ "fontFamily": { "text": "..." }, "fontSize": { "measure": 16, "unit": "Pixels" }, ... }`
- `Space` / `Dimension`: `{ "measure": 16, "unit": "Pixels" }`
- `BorderRadius`: `{ "measure": 8, "unit": "Pixels" }`
- `Border`: `{ "width": { "measure": 1, "unit": "Pixels" }, "style": "solid", "color": { "hex": "#...", "a": 1 } }`
- `Shadow`: array of shadow objects `{ "x": ..., "y": ..., "radius": ..., "spread": ..., "color": ..., "type": "Drop" }`

### 2. `token-groups.json`
Hierarki grup token untuk penamaan CSS variable & object namespace:
```json
{
  "id": "group-color-brand",
  "name": "brand",
  "parentGroupId": "group-color"
}
```

### 3. `themes.json`
Daftar theme dan token overrides:
```json
{
  "id": "theme-dark",
  "name": "Dark Theme",
  "overrides": {
    "token-color-bg-page": {
      "hex": "#0f172a",
      "r": 15,
      "g": 23,
      "b": 42,
      "a": 1
    }
  }
}
```

---

## 🔄 Integrasi Alur Penuh (End-to-End Workflow)

Setelah menjalankan mock export, kamu bisa langsung melanjutkan pipeline build monorepo:
```bash
# 1. Export token & komponen dari mock data
npm run export:mock

# 2. Distribusikan ke packages/tokens dan compile Mitosis ke React/Svelte/Vue
npm run generate

# 3. Build seluruh library consumer packages
npm run build:packages
```
Dengan alur ini, kamu dapat mengembangkan, memodifikasi styling, menambahkan generator format baru (misal SCSS, JSON schema, dsb.), dan memvalidasi hasilnya tanpa perlu login ke Supernova Cloud sama sekali.

The repository root `exporter.json` and `config.json` are authoritative. The mock runner loads the executable selected by that manifest and watches both metadata files. Exporter sources remain in `exporter/src/`.

The test suite also executes the bundled exporter in a Pulsar-like VM with host process/require/module and no filename globals, checking all eleven artifacts and unchanged host process.
