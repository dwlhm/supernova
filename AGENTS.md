# Komerce Design System — Interactive AI Agent Guide (`AGENTS.md`)

Panduan ini menyinkronkan setiap sesi interaktif AI coding agent (`agy`, Claude Code, OpenCode, Cursor) dengan pipeline **Komerce Design System (`komerce-design`)**.

## 1. Arsitektur Single Source of Truth (`src/*`)

- **Universal Mitosis Sources (`src/components/*.lite.tsx`, `src/icons/*.lite.tsx`, `src/examples/*Example.lite.tsx`)** adalah **satu-satunya sumber kode komponen** (tanpa database SQLite).
- `pnpm komerce sync` mengekstrak desain Figma dan menulis langsung ke `src/{components,icons,examples,tokens}/*`.
- **JANGAN** mengedit hasil kompilasi di `library/{tokens,react,vue3,svelte,vue2,angular}` atau `apps/docs/.vitepress/theme/preview/*` secara manual — keduanya di-generate otomatis dari `src/*` (dan di-ignore oleh Git).

## 2. Alur Kerja Saat Mengedit Komponen Secara Interaktif (Tanpa `komerce regen`)

Ketika developer meminta perbaikan visual, props, atau interaksi komponen secara langsung di sesi chat agent:

1. **Wajib Inspeksi JSON Hasil Extract Figma & Blueprint Terlebih Dahulu**:
   **JANGAN PERNAH** menebak atau mengubah bentuk visual komponen tanpa memeriksa hasil ekstraksi Figma (`var/extractions/latest.json`) terlebih dahulu! Selalu jalankan:
   ```bash
   pnpm komerce inspect <ComponentName>
   ```
   Command ini membaca langsung `var/extractions/latest.json` serta `src/knowledge.json` dan menampilkan:
   - `familyFiles`: daftar file komponen utama, sub-komponen (`<Name>Item`, `<Name>*Cell`, dll.), dan `<Name>Example.lite.tsx`.
   - `knowledgeRules` & `globalRules`: aturan dari `src/knowledge.json` yang tidak boleh dilanggar.
   - `blueprint`: *canonical props*, *baseTailwindClasses*, *hierarchy* (struktur node & kelas Tailwind hasil ekstraksi Figma, misalnya `Vector 1: ["w-1.5", "h-1.5", "rounded-full"]`), *variantDiffs* (`childOrder`, `changedNodes`), dan *stateStyles* langsung dari `var/extractions/latest.json`.
   - Patuhi 100% bentuk visual, urutan child (`childOrder`), spacing (`gap-*`, `px-*`, `py-*`), radius (`rounded-*`), dan warna semantik yang tertera di `blueprint` / `var/extractions/latest.json`.

2. **Edit File di `src/{components,icons,examples}/*.lite.tsx` (Base-First Surgical Edit)**:
   - Pertahankan struktur interaktif, helper `./utils`, dan atribut ARIA yang sudah berjalan.
   - Untuk komponen *compound* (`Table`, `Tabs`, `ToggleGroup`, `Stepper`, `Breadcrumb`, `Chart`, `MainMenu`), periksa dan perbarui juga sub-komponen turunannya serta `src/examples/<Name>Example.lite.tsx`.
   - Pastikan preview dokumentasi (`apps/docs/.vitepress/theme/components/PreviewDefaults.ts` untuk leaf component, atau `src/examples/<Name>Example.lite.tsx` untuk compound component) mendemonstrasikan perilaku interaktif secara real (hover, click, toggle, active tab, step change, row selection).

3. **Simpan Aturan ke Local Knowledge Base (`src/knowledge.json`)**:
   Setiap kali memperbaiki perilaku atau kontrak visual komponen, tambahkan aturan ringkasnya ke `components["<ComponentName>"].rules` di `src/knowledge.json`. Dengan begitu, saat nanti `pnpm komerce sync` dijalankan ulang dari Figma, hasil kerja sesi interaktif tidak akan ter-reset.

4. **Jalankan Full Workspace Sync (`pnpm komerce build`)**:
   Setelah selesai mengedit `.lite.tsx` dan `src/knowledge.json`, jalankan:
   ```bash
   pnpm komerce build <ComponentName>
   ```
   (atau `pnpm komerce build` untuk seluruh komponen). Command ini otomatis:
   - Meng-update tabel Props di `apps/docs/components/<kebab-name>.md` dari AST `.lite.tsx` terbaru,
   - Meng-compile ulang paket multi-framework (`@komerce-design/*`) di `library/{tokens,react,vue3,svelte,vue2,angular}`, dan
   - Meng-compile ulang preview 5 framework di `apps/docs` (`compile-docs-components.mjs`).

## 3. Aturan Wajib Authoring Mitosis (`.lite.tsx`)

- **Batas Ukuran Tier 3**: Maksimal **80 baris non-kosong** per file `.lite.tsx`. Gunakan `cva(key, map, fallback)` dan `cn(...)` dari `./utils`, bukan duplikasi subtree JSX.
- **Control Flow & Hooks**:
  - Hanya gunakan `useDefaultProps`, `useStore`, `<Show when={...}>`, dan `<For each={...}>` dari `@builder.io/mitosis`.
  - **DILARANG** menggunakan hook React (`useState`, `useEffect`, `useMemo`), manipulasi DOM langsung (`document.*`, `window.*`), atau deklarasi `const` lokal non-hook di body komponen (`no-local-binding`).
  - **DILARANG** melakukan *prop shadowing* (`const value = props.value`) atau menamai getter `useStore` sama dengan nama prop di `<Name>Props`.
  - **DILARANG** mengirim elemen JSX sebagai nilai prop (`icon={<Icon />}`); gunakan `children` atau data primitif.
  - Gunakan `onInput` (bukan `onChange`) untuk `<input type="text|email|password|search|tel|url|number">` dan `<textarea>`.
- **Kontrak `children` vs Trigger-Wrapper Overlays (`Tooltip`)**:
  - Komponen standar menerima label/konten lewat `{props.children}` (`<Button>Save</Button>`). Jangan melakukan percabangan pada `props.children` (`!props.children` atau ternary) karena Angular `<ng-content>` (`kd-*`) tidak mendukung deteksi slot kosong.
  - **Pengecualian Trigger-Wrapper Overlay (`Tooltip`)**: `{props.children}` adalah **elemen trigger** (`<Tooltip text="Label" position="top" trigger="hover">Hover me</Tooltip>`), sedangkan `props.text` adalah isi pesan di dalam floating bubble `role="tooltip"`.
- **Single-Value Callbacks**: Setiap callback prop maksimal menerima 1 parameter (gunakan object untuk >1 nilai) agar kompatibel dengan Angular `@Output() EventEmitter<T>`.
- **Zero Arbitrary Tailwind Colors**: Dilarang menggunakan hex/rgb bracket classes (`bg-[#2563eb]`); selalu gunakan semantic token classes (`bg-primary-default`, `text-foreground-default`, `border-border-default`, dll.).

## 4. Prinsip Open & Consumer-Customizable Components (Anti-Closed Design)

- **DILARANG Membuat Komponen yang *Closed* (Tertutup)**:
  - **Jangan pernah mengunci teks, label, hint, placeholder, ikon, atau perilaku di dalam komponen.** Setiap elemen yang tampil atau berinteraksi dengan user (`label`, `timeLabel`, `hint`, `placeholder`, `errorMessage`, `heading`, `description`, `actionText`, `cancelLabel`, `confirmLabel`, `icon`, `leftIcon`, `rightIcon`, `leadingIcon`, `trailingIcon`, `children`, dll.) **WAJIB** dapat dikustomisasi sepenuhnya oleh consumer melalui props atau slots/`children`.
  - Default teks di dalam helper (`./utils`) hanya boleh berfungsi sebagai *fallback* netral ketika consumer tidak mengirimkan prop terkait.
- **Gunakan Callback Function (`string | ((state) => string)`) untuk Teks Dinamis (Bukan String Template DSL)**:
  - Untuk properti teks yang bergantung pada state/nilai komponen (seperti `hint` dan `displayValue` pada `DatePicker`, `hint` pada `Input*`, `displayValue` pada `InputDropdown`, `fileCount` pada `InputMultipleFileUpload`, `label` dan `hint` serta `formatValue` pada `Slider`, `label` pada `Progressbar`, `targetLabel` pada `MetricCardProgress`, serta `formatTooltip` dan `formatValue` pada `Chart*`), **WAJIB** mendukung tipe `string | ((value) => string)` (misalnya ``hint={date => `Jadwal: ${date.formatted}`}``), **bukan** menciptakan DSL string placeholder tertutup seperti `hint="Jadwal: {date}"`. Consumer harus dapat memformat nilai secara bebas menggunakan fungsi JavaScript/`Intl.DateTimeFormat` standar.
- **Skema Props yang Composable & Ortogonal (Bukan Preset Use-Case Sempit)**:
  - Dilarang mendesain prop `type` yang mengunci komponen pada satu skenario bisnis sempit (misalnya `type="date-of-birth-picker"`). Pecah menjadi kapabilitas ortogonal yang dapat dikombinasikan bebas oleh consumer (seperti `mode?: 'single' | 'range' | 'month' | 'year'`, `editable?: boolean`, `showTime?: boolean`).
- **Integrasi Wajib dengan Headless Controllers (Form, Table, Chart, Overlay/Navigation)**:
  - **Headless Form (`createFormController`)**: Setiap komponen form/input (`InputText`, `InputTextArea`, `InputDropdown`, `InputOTP`, `InputFileInput`, `InputFileDropZone`, `InputImageUploader`, `InputMultipleFileUpload`, `DatePicker`, `Checkbox`, `RadioButton`, `SwitchButton`, `Slider`) **WAJIB** kompatibel secara *plug-and-play* dengan `{...form.bindField('fieldName')}` dari `createFormController` (`id`, `name`, `value`, `required`, `disabled`, `error`, `errorMessage`, `validating`, `onValueChange`, `onBlur`).
  - **Headless Table (`createTableController`)**: `TableHeaderCell`, `TableCheckboxHeaderCell`, `TableBodyRow`, `TableCheckboxBodyCell`, dan `Pagination` **WAJIB** kompatibel secara *plug-and-play* dengan `table.bindHeaderSort(key)`, `table.bindHeaderCheckbox()`, `table.bindRow(id)`, `table.bindRowCheckbox(id)`, `table.bindPagination()`, dan `table.bindSearch()` dari `createTableController`.
  - **Headless Chart (`getChart*State`)**: Seluruh 9 komponen `Chart*` **WAJIB** mendukung `formatTooltip?: (ctx: ChartTooltipContext) => string`, `formatValue?: (value: number) => string`, dan per-point `tooltip?: string | ((ctx: ChartTooltipContext) => string)`.
- **WAI-ARIA 1.2 & Keyboard Accessibility Discipline**:
  - Jangan pernah memasang default `ariaLabel` non-kosong pada komponen yang merender `{props.children}` (`Checkbox`, `RadioButton`, `SwitchButton`, `Toggle`) karena `aria-label` akan membungkam teks `{props.children}` di screen reader; gunakan `ariaLabel: ''` di `useDefaultProps` dan `aria-label={props.ariaLabel || undefined}`.
  - Gunakan `handleGroupKeyDown(event)` untuk *roving focus* keyboard (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Home`, `End`) pada `Tabs` (`role="tablist"`) dan `ToggleGroup` (`role="group"`), serta dukung tombol `Escape` untuk menutup overlay (`AlertDialog`, `Toast`, `Tooltip`, `InputDropdown`, `DatePicker`).
- **Preview Studio Wajib Mengekspos Kustomisasi Secara Live**:
  - Pada `apps/docs/.vitepress/theme/components/PreviewDefaults.ts` dan `FrameworkPreviewCard.vue`, pastikan properti kustomisasi utama (`label`, `hint`, `placeholder`, `timeLabel`, varian, dan boolean toggles) dapat diuji langsung secara interaktif oleh user dan langsung meng-update kode di *Usage Panel*.

## 5. Standar Dokumentasi & Proses Penulisan (`apps/docs`)

Saat memperbaiki atau menambah dokumentasi di `apps/docs`, ikuti proses dan struktur berikut agar konsisten dengan library UI modern (`shadcn/ui`, `Ark UI`, `Mantine`):

1. **Benchmark & Audit Terlebih Dahulu**: Sebelum merombak struktur dokumentasi, periksa pola library UI modern dan verifikasi seluruh simbol/signature aktual dari `packages/mitosis-compiler/src/core-*.ts` (jangan pernah menulis API fiktif).
2. **Consumer-First, Pisahkan dari Pipeline Kontributor**:
   - Halaman depan dan `Getting Started` (`apps/docs/guide/getting-started.md`) wajib langsung menjawab kebutuhan consumer (instalasi `@komerce-design/*`, setup `@komerce-design/tokens`, Tailwind v4, dan Dark Mode), sedangkan detail internal pipeline (`overview`, `architecture`, `figma-plugin`, `api-reference`) ditempatkan di grup terpisah (`Pipeline & Contributor Guide`).
3. **Satukan Headless dengan Domain Komponennya (Jangan Buat Silo Terpisah)**:
   - Di sidebar `apps/docs/.vitepress/config.mts`, letakkan panduan headless berdampingan dengan komponen yang ditenagainya (`Form Validation` di *Forms & Inputs*, `Data Table` & `Chart Engine` di *Data Display & Charts*, `Overlay, Date & A11y` di *Feedback, Overlays & Primitives*).
   - Gunakan model mental **3 Level Progresif** yang konsisten: (1) Komponen Siap Pakai → (2) Komponen + Headless Controller (`bind*`) → (3) Full Custom UI dengan Headless State/SVG Primitives.
4. **Contoh Nyata Sesuai Levelnya**:
   - Halaman **Headless** (`apps/docs/core/headless-*.md`) **WAJIB** menampilkan contoh kode yang benar-benar memanggil state engine/controller/primitif dan merender UI/SVG custom dari return value-nya di 5 framework—**dilarang** menaruh contoh komponen UI biasa (`<ChartBar />`) sebagai pengganti contoh headless.
   - Selalu cantumkan tabel perbandingan *"Kapan Pakai Komponen Biasa vs Headless"* dan cross-link dua arah ke halaman komponen pasangannya.
5. **Verifikasi Build**: Setelah mengubah file di `apps/docs`, selalu jalankan `pnpm --dir apps/docs build` untuk memastikan seluruh halaman, navigasi, dan bundle VitePress ter-build tanpa error.
