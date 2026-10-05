# Panduan Desain Komponen (UI/UX $\leftrightarrow$ Codebase)

Dokumen ini adalah **kontrak resmi dan panduan praktis bagi tim UI/UX** dalam merancang komponen di **Figma** dan **Supernova**, agar otomatis ter-generate menjadi komponen multi-framework (**React, Svelte, Vue 3, Vue 2**) tanpa perlu menulis kode frontend secara manual.

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
| **Icon** | Instance component icon, vector | Menjadi slot icon (`{props.icon}`) |
| **Slot / Children** | Area konten kosong di dalam card/modal | Menerima elemen anak apa pun (`{props.children}`) |

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
   * *Otomatis menjadi prop string dan conditional rendering jika teks diisi.*

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
  * Menambahkan kursor pointer dan hover feedback.
  * Memiliki guard otomatis: jika komponen `disabled: true`, klik tidak akan tertrigger.

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

```
+-----------------------------------+
|  [Icon]  Pendaftaran Berhasil     |
+-----------------------------------+
```

* **Struktur di Figma**:
  * Root Auto-layout Frame: `StatusBadge`
    - Layer 1 (Instance): `icon`
    - Layer 2 (Text): `text`
* **Properties**:
  * `variant`: `success` | `warning` | `danger` | `info`
  * `clickable`: `true`
  * `inputable`: `"none"`
* **Hasil Komponen Universal**:
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
  * Desainer tidak perlu mendefinisikan event `onChange`, `onFocus`, `isFocused` satu per satu. Semua interaksi form terpasang otomatis dengan validasi error border class!

---

## 🏷️ 4. Menambahkan Custom Attributes (Supernova Studio)

Jika QA atau Developer membutuhkan atribut tambahan untuk testing otomasi (seperti `data-testid`) atau analitik:

1. Di **Supernova Studio** $\rightarrow$ buka tabel **Components**.
2. Tambahkan kolom property baru, misal:
   * **Name**: `testId`
   * **Type**: `Text`
3. Exporter otomatis menginjeksi property tersebut ke dalam interface tipe dan menyematkan atribut `data-testid={props.testId}` pada elemen root HTML.

---

## 🔄 5. Alur Kerja Sinkronisasi (Workflow)

```
[Desain di Figma]
       │
       ▼ (Publish Library)
[Sync ke Supernova Cloud]
       │
       ▼ (Export via Monorepo Runner: npm run export:mock)
[Universal Mitosis Component (.lite.tsx)]
       │
       ▼ (Mitosis Compile: npm run generate)
[Production Packages: React, Svelte, Vue 3, Vue 2]
```

Dengan sistem ini, tim UI/UX memiliki kendali penuh atas evolusi Design System dengan kebebasan visual, tanpa terbebani kerumitan kode frontend!
