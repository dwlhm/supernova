# Panduan Desain Komponen (UI/UX $\leftrightarrow$ Codebase)

Dokumen ini adalah **kontrak resmi dan panduan praktis bagi tim UI/UX** dalam merancang komponen di **Figma** dan **Supernova**, untuk menghasilkan presentasi multi-framework (**React, Svelte, Vue 3, Vue 2**). Engineering tetap memiliki kontrak HTML, state, event, validasi, dan accessibility.

See the [shared component contract](component-contract.md) for the approved content, appearance, behavior and accessibility framework. This guide distinguishes design intent from exporter guarantees; earlier automatic-interaction claims did not match the implementation.

---

## 💡 Filosofi & Prinsip Utama

1. **Figma & Supernova adalah Single Source of Truth**:
   Semua nama komponen, variasi desain, dan teks berasal dari desain yang dibuat oleh UI/UX.
2. **Bebas dari Istilah Teknis**:
   UI/UX **tidak perlu memikirkan tag HTML** seperti `<div>`, `<p>`, `<span>`, atau sintaks JavaScript. Cukup gunakan struktur layer alami di Figma.
3. **Behavior-Driven Design**:
   Interaktivitas (apakah bisa diklik, apakah sebuah form input, atau apakah memiliki status disabled) ditentukan melalui konfigurasi *Behavior* yang jelas dan konsisten.

---

## 🎨 1. Cara Merancang Komponen di Figma

### A. Semantic Layer Roles (Peran Layer Alami)
Saat membuat komponen di Figma, gunakan penamaan atau peran layer berikut:

| Peran Semantik | Contoh di Figma | Perilaku di Kode |
| :--- | :--- | :--- |
| **Container** | Frame pembungkus, Auto-layout Frame | Menjadi kontainer tata letak (`div`) |
| **Text** | Layer teks (`title`, `subtitle`, `label`, `text`) | Otomatis menjadi teks semantik (`p` / `span`) |
| **Icon** | Instance component icon, vector | Figma import mempertahankan struktur visual; slot icon harus memakai binding/property atau definisi engineering eksplisit |
| **Slot / Children** | Area konten kosong di dalam card/modal | `children` root tersedia sesuai pipeline; slot internal perlu binding/definisi eksplisit |

---

### B. Memanfaatkan Component Properties di Figma
Gunakan fitur bawaan Figma **Component Properties** di panel kanan Figma:

1. **Variant** (Pilihan Tampilan):
   * `size`: `sm` | `md` | `lg`
   * `variant`: `primary` | `secondary` | `outline` | `danger`
   * `padding`: `none` | `sm` | `md` | `lg`
   * *Otomatis di-generate menjadi TypeScript Union Type pada kode.*

2. **Boolean** (Toggle On/Off):
   * `bordered`: `true` / `false`
   * `disabled`: `true` / `false`
   * `fullWidth`: `true` / `false`
   * *Otomatis menjadi prop boolean di kode.*

3. **Text Property** (Konten Teks Dinamis):
   * `title`: "Judul Kartu"
   * `subtitle`: "Deskripsi singkat"
   * `placeholder`: "Masukkan email..."
   * *Menjadi prop string dengan default desain. Figma TEXT tanpa property juga mendapat prop dari nama layer; string kosong menghapus teks, sedangkan visibility perlu boolean terpisah.*

4. **Instance Swap** (Slot Komponen Lain):
   * `icon`: Pilihan icon panah, ceklis, dll.
   * *Otomatis menjadi prop komponen yang fleksibel.*

---

## ⚡ 2. Sistem Behavior (Kemampuan Komponen)

Behavior adalah cara kita memberi tahu exporter mengenai kemampuan interaktif komponen:

### A. `clickable` (Komponen Interaktif)
* **Kapan digunakan**: Untuk tombol, kartu yang bisa diklik, atau tag interaktif.
* **Hasil di Kode**:
  * Otomatis menginjeksi prop `onClick?: (event) => void`.
  * Styling cursor/hover berasal dari definisi; `clickable` typed behavior tidak menginjeksi styling.
  * Guard callback berlaku jika behavior `disabled` juga dikonfigurasi. Native button memerlukan atribut `disabled` yang terikat; klik pada `div` tidak otomatis memiliki keyboard semantics.

---

### B. `inputable` (Komponen Form)
Untuk komponen form input, tentukan jenis `inputable`:

| Jenis `inputable` | Penggunaan | Otomatis Menginjeksi Props |
| :--- | :--- | :--- |
| **`none`** *(default)* | Komponen biasa (Card, Button, Badge, Typography) | Tidak ada prop form yang mengotori komponen |
| **`text`** | Input teks, password, email, search | `value`, `placeholder`, `type`, `label`, `error`, `helperText`, `required`, `disabled`, `onChange`, `onFocus`, `onBlur` |
| **`textarea`** | Input multiline / pesan panjang | `value`, `placeholder`, `rows`, `label`, `error`, `helperText`, `onChange`, `onFocus`, `onBlur` |
| **`select`** | Dropdown pemilihan | `value`, `options`, `placeholder`, `label`, `error`, `helperText`, `onChange` |
| **`radio` / `checkbox`** | Pilihan opsi tunggal atau centang | `checked`, `value`, `label`, `disabled`, `onChange` |

---

## 🧩 3. Contoh Kasus Desain Komponen

### Kasus 1: Komponen Multi-Element (`StatusBadge`)
Misalkan UI/UX ingin membuat badge status yang memiliki icon dan teks berdampingan:

Target: an explicitly defined icon slot beside editable status text.

* **Struktur di Figma**:
  * Root Auto-layout Frame: `StatusBadge`
    - Layer 1 (Instance): `icon`
    - Layer 2 (Text): `text`
* **Properties**:
  * `variant`: `success` | `warning` | `danger` | `info`
  * `clickable`: `true`
  * `inputable`: `"none"`
* **Target engineering ilustratif** (slot dan kondisi harus didefinisikan eksplisit; bukan jaminan output otomatis):
  ```tsx
  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ...">
    {props.icon && <p className="m-0 leading-none">{props.icon}</p>}
    {props.text && <p className="m-0 leading-none">{props.text}</p>}
    {props.children}
  </div>
  ```

---

### Kasus 2: Komponen Input Form (`Input`)
* **Struktur di Figma**:
  * Root Frame: `Input`
    - Layer Label: `label` (dengan tanda `*` jika `required`)
    - Layer Field: `input`
    - Layer Pesan Error: `error`
    - Layer Helper: `helperText`
* **Behavior**:
  * `inputable`: `"text"`
* **Hasil Komponen Universal**:
  * Desainer tidak perlu mendefinisikan event `onChange`, `onFocus`, `isFocused` satu per satu. Typed behavior menyediakan atribut native dan meneruskan event asli. Label, helper, error, hubungan ID, validasi dan error border harus didefinisikan oleh engineering; lihat shared contract.

---

## 🏷️ 4. Menambahkan Custom Attributes (Supernova Studio)

Jika QA atau Developer membutuhkan atribut tambahan untuk testing otomasi (seperti `data-testid`) atau analitik:

1. Di **Supernova Studio** $\rightarrow$ buka tabel **Components**.
2. Tambahkan kolom property baru, misal:
   * **Name**: `testId`
   * **Type**: `Text`
3. Property saja tidak otomatis menambahkan atribut DOM. Engineering mendeklarasikan prop `testId` dan binding atribut root `"data-testid": { "kind": "prop", "name": "testId" }` pada `mitosisDefinition`.

---

## 🔄 5. Alur Kerja Sinkronisasi (Workflow)

1. Publish the Figma library and synchronize design metadata with Supernova.
2. Import Figma presentation with `npm run figma:import`, or export engineering-authored Supernova definitions (local fixture mode: `npm run export:mock`). These are separate component sources.
3. Review the generated Mitosis source and component contract.
4. Compile current sources with `npm run generate:components` into React, Svelte, Vue 3 and Vue 2 packages.
5. Verify native DOM, controlled events and accessibility in consuming applications. Unchanged design fingerprints may preserve previous source; use the individual converter refresh procedure in the shared contract when converter policy changes.

Tim UI/UX mengatur konten, varian dan token; engineering memastikan semantics, interaksi dan accessibility sesuai kontrak pada DOM hasil compile.
