# Headless Form Controller (`createFormController`)

`@komerce-design/{react,vue3,svelte,vue2,angular}` menyediakan **Headless Form Controller terpusat** (`createFormController`) yang dirancang khusus untuk bekerja *plug-and-play* dengan **seluruh 14 komponen form & input** (`InputText`, `InputTextArea`, `InputDropdown`, `InputOTP`, `InputFileInput`, `InputFileDropZone`, `InputImageUploader`, `InputMultipleFileUpload`, `DatePicker`, `TimePicker`, `Checkbox`, `RadioButton`, `SwitchButton`, dan `Slider`) di **5 framework** tanpa dependency tambahan.

## Live Interactive Playground

Uji secara langsung perilaku **`createFormController`** pada komponen `InputText`, `InputTextArea`, dan `Button` asli di bawah ini:
- Ketik di **Username** (`admin` / `komerce` vs username lain) untuk melihat **spinner loading `validating={true}`** serta pembatalan otomatis `AbortSignal` di panel log kanan.
- Perhatikan badge **`updates: N`** di kanan atas tiap field: mengetik di 1 field **hanya meng-update field tersebut** (0 re-render pada field lain).
- Ketik email yang belum lengkap di **Work Email**, klik di luar input (*blur*) untuk memicu error (*Punish Late*), lalu perbaiki menjadi `nama@komerce.id` untuk melihat error hilang seketika saat mengetik (*Reward Early*).

<HeadlessFormPlayground />

---

## 1. Mengapa Satu Form Controller Terpusat?

Masalah umum saat membangun form di banyak aplikasi frontend:
1. **Re-render Satu Form Penuh**: Menyimpan seluruh nilai form di satu state induk yang di-update tiap `onInput` menyebabkan 20+ field ikut re-render setiap kali user mengetik 1 huruf.
2. **UX Validasi Tidak Konsisten**: Sebagian form langsung menampilkan error merah pada ketikan huruf pertama, sementara form lain baru memvalidasi saat tombol Submit ditekan.
3. **Race Condition pada Validasi Async (`fetch`)**: Validasi ke server (cek ketersediaan username, email, atau kode kupon) yang tidak di-debounce dan tidak memiliki `AbortController` rawan menimpa input terbaru dengan response lama yang lambat.
4. **Fragmentasi Antar Framework**: *React Hook Form* hanya untuk React, *VeeValidate* hanya untuk Vue, sementara *TanStack Form* tidak mendukung Vue 2.

`createFormController` menyelesaikan keempat masalah tersebut di satu pintu:

```
User Input / Blur
  │
  ▼
1. Per-Field Store (subscribeField) ──► Hanya meng-update field yang berubah (0 re-render di field lain)
  │
  ▼
2. Sync Rules Gate (required, minLength, maxLength, pattern, validate)
  ├── Gagal ──► Batalkan request async aktif + Tampilkan errorMessage
  │
  └── Lolos & Ada asyncValidate
        │
        ▼
3. Async Fetch Gate (validating = true + Debounce 300ms + AbortController + Sequence ID)
  ├── Request Baru Masuk ──► Abort request sebelumnya (anti race condition)
  └── Selesai & Sequence Cocok ──► validating = false + Update errorMessage
```

---

## 2. Fitur Utama

### A. Isolasi Re-render Per-Field (`subscribeField`)
Setiap field memiliki daftar subscriber sendiri (`form.subscribeField('username', callback)`). Saat nilai atau status validasi `username` berubah, subscriber milik `email`, `phone`, atau `address` **tidak akan dipanggil**.

### B. Timing Validasi *"Punish Late, Reward Early"*
- **Punish Late (`onBlur` / `handleSubmit`)**: Saat user baru mulai mengetik di field yang belum pernah disentuh (`touched: false`), error belum dimunculkan hingga user keluar dari field (`onBlur`) atau menekan Submit.
- **Reward Early (`onValueChange` saat `error: true`)**: Begitu field berstatus error (`error: true`), setiap ketikan berikutnya (`setValue` / `onValueChange`) langsung memvalidasi ulang sehingga **begitu input diperbaiki, border merah dan pesan error langsung hilang seketika**.

### C. Validasi Async / Fetch Data (`asyncValidate`)
- **Sync Gate Terlebih Dahulu**: `asyncValidate` **tidak akan pernah dipanggil** jika validasi sinkron (`required`, `minLength`, `pattern`, `validate`) belum lolos atau nilai masih kosong.
- **Debounce (`debounceMs`, default `300ms`)**: Menunggu user berhenti mengetik sebelum memanggil API. Saat `handleSubmit`, debounce otomatis dilewati (`0ms`) agar submit tidak tertunda.
- **Pembatalan Otomatis (`AbortSignal` + Sequence Guard)**: Meneruskan `signal: AbortSignal` langsung ke `fetch(url, { signal })`. Jika user mengetik lagi sebelum response selesai, request sebelumnya langsung di-`abort()` dan diabaikan.
- **Indikator Loading Otomatis (`validating: true`)**: Selama `asyncValidate` berjalan, `bindField` mengirimkan `validating: true` ke `<InputText>`, yang otomatis menampilkan icon spinner (`animate-spin`, `aria-busy="true"`) di sisi kanan input.

---

## 3. Contoh Penggunaan di 5 Framework

Gunakan `createFormController` dari paket `@komerce-design/*` sesuai framework proyek Anda:

::: code-group

```tsx [React]
import React from 'react';
import { createFormController, InputText, Button, type FormFieldState } from '@komerce-design/react';

// Helper hook ringan untuk berlangganan 1 field (isolasi re-render per-field)
function useFormField<T extends Record<string, any>, K extends keyof T & string>(
  form: ReturnType<typeof createFormController<T>>,
  name: K
): FormFieldState<T[K]> {
  const [state, setState] = React.useState(() => form.getFieldState(name));
  React.useEffect(() => form.subscribeField(name, setState), [form, name]);
  return state;
}

export function RegistrationForm() {
  const [form] = React.useState(() =>
    createFormController({
      initialValues: { username: '', email: '' },
      rules: {
        username: {
          required: 'Username wajib diisi.',
          minLength: { value: 3, message: 'Username minimal 3 karakter.' },
          debounceMs: 300,
          asyncValidate: async (val, signal) => {
            const res = await fetch(`/api/check-username?u=${encodeURIComponent(val)}`, { signal });
            const data = await res.json();
            return data.taken ? 'Username sudah digunakan.' : null;
          },
        },
        email: {
          required: 'Email wajib diisi.',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Format email tidak valid.',
          },
        },
      },
    })
  );

  React.useEffect(() => () => form.dispose(), [form]);

  // Masing-masing field terisolasi
  useFormField(form, 'username');
  useFormField(form, 'email');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await form.handleSubmit((values) => {
      console.log('Form valid, siap dikirim:', values);
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex max-w-md flex-col gap-4">
      <InputText
        label="Username"
        placeholder="pilih_username"
        hint="Minimal 3 karakter, dicek otomatis ke server."
        {...form.bindField('username')}
      />
      <InputText
        type="email"
        label="Email"
        placeholder="nama@komerce.id"
        showHint={false}
        {...form.bindField('email')}
      />
      <Button variant="primary" htmlType="submit">
        Daftar Sekarang
      </Button>
    </form>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { createFormController, InputText, Button } from '@komerce-design/vue3';

const form = createFormController({
  initialValues: { username: '', email: '' },
  rules: {
    username: {
      required: 'Username wajib diisi.',
      minLength: { value: 3, message: 'Username minimal 3 karakter.' },
      debounceMs: 300,
      asyncValidate: async (val, signal) => {
        const res = await fetch(`/api/check-username?u=${encodeURIComponent(val)}`, { signal });
        const data = await res.json();
        return data.taken ? 'Username sudah digunakan.' : null;
      },
    },
    email: {
      required: 'Email wajib diisi.',
      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid.' },
    },
  },
});

const usernameField = ref(form.bindField('username'));
const emailField = ref(form.bindField('email'));

let unsubUser: (() => void) | undefined;
let unsubEmail: (() => void) | undefined;

onMounted(() => {
  unsubUser = form.subscribeField('username', () => { usernameField.value = form.bindField('username'); });
  unsubEmail = form.subscribeField('email', () => { emailField.value = form.bindField('email'); });
});

onBeforeUnmount(() => {
  unsubUser?.();
  unsubEmail?.();
  form.dispose();
});

async function onSubmit() {
  await form.handleSubmit((values) => {
    console.log('Form valid:', values);
  });
}
</script>

<template>
  <form class="flex max-w-md flex-col gap-4" @submit.prevent="onSubmit">
    <InputText label="Username" placeholder="pilih_username" v-bind="usernameField" />
    <InputText type="email" label="Email" placeholder="nama@komerce.id" :showHint="false" v-bind="emailField" />
    <Button variant="primary" htmlType="submit">Daftar Sekarang</Button>
  </form>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { onDestroy } from 'svelte';
  import { createFormController, InputText, Button } from '@komerce-design/svelte';

  const form = createFormController({
    initialValues: { username: '', email: '' },
    rules: {
      username: {
        required: 'Username wajib diisi.',
        minLength: { value: 3, message: 'Username minimal 3 karakter.' },
        debounceMs: 300,
        asyncValidate: async (val, signal) => {
          const res = await fetch(`/api/check-username?u=${encodeURIComponent(val)}`, { signal });
          const data = await res.json();
          return data.taken ? 'Username sudah digunakan.' : null;
        },
      },
      email: {
        required: 'Email wajib diisi.',
        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid.' },
      },
    },
  });

  let usernameProps = form.bindField('username');
  let emailProps = form.bindField('email');

  const unsubUser = form.subscribeField('username', () => { usernameProps = form.bindField('username'); });
  const unsubEmail = form.subscribeField('email', () => { emailProps = form.bindField('email'); });

  onDestroy(() => {
    unsubUser();
    unsubEmail();
    form.dispose();
  });

  async function onSubmit(e: Event) {
    e.preventDefault();
    await form.handleSubmit((values) => {
      console.log('Form valid:', values);
    });
  }
</script>

<form class="flex max-w-md flex-col gap-4" on:submit={onSubmit}>
  <InputText label="Username" placeholder="pilih_username" {...usernameProps} />
  <InputText type="email" label="Email" placeholder="nama@komerce.id" showHint={false} {...emailProps} />
  <Button variant="primary" htmlType="submit">Daftar Sekarang</Button>
</form>
```

```vue [Vue 2]
<script>
import { createFormController, InputText, Button } from '@komerce-design/vue2';

export default {
  components: { InputText, Button },
  data() {
    const form = createFormController({
      initialValues: { username: '', email: '' },
      rules: {
        username: {
          required: 'Username wajib diisi.',
          minLength: { value: 3, message: 'Username minimal 3 karakter.' },
          debounceMs: 300,
          asyncValidate: async (val, signal) => {
            const res = await fetch(`/api/check-username?u=${encodeURIComponent(val)}`, { signal });
            const data = await res.json();
            return data.taken ? 'Username sudah digunakan.' : null;
          },
        },
        email: {
          required: 'Email wajib diisi.',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid.' },
        },
      },
    });
    return {
      form,
      usernameField: form.bindField('username'),
      emailField: form.bindField('email'),
    };
  },
  mounted() {
    this.unsubUser = this.form.subscribeField('username', () => {
      this.usernameField = this.form.bindField('username');
    });
    this.unsubEmail = this.form.subscribeField('email', () => {
      this.emailField = this.form.bindField('email');
    });
  },
  beforeDestroy() {
    if (this.unsubUser) this.unsubUser();
    if (this.unsubEmail) this.unsubEmail();
    this.form.dispose();
  },
  methods: {
    async onSubmit() {
      await this.form.handleSubmit((values) => {
        console.log('Form valid:', values);
      });
    },
  },
};
</script>

<template>
  <form class="flex max-w-md flex-col gap-4" @submit.prevent="onSubmit">
    <InputText label="Username" placeholder="pilih_username" v-bind="usernameField" />
    <InputText type="email" label="Email" placeholder="nama@komerce.id" :showHint="false" v-bind="emailField" />
    <Button variant="primary" htmlType="submit">Daftar Sekarang</Button>
  </form>
</template>
```

```ts [Angular]
import { Component, OnDestroy } from '@angular/core';
import { createFormController } from '@komerce-design/angular';

@Component({
  selector: 'app-registration-form',
  template: `
    <form class="flex max-w-md flex-col gap-4" (submit)="onSubmit($event)">
      <kd-input-text
        label="Username"
        placeholder="pilih_username"
        [value]="username.value"
        [errorMessage]="username.errorMessage"
        [validating]="username.validating"
        (onValueChange)="username.onValueChange($event)"
        (onBlur)="username.onBlur()"
      ></kd-input-text>
      <kd-input-text
        type="email"
        label="Email"
        placeholder="nama@komerce.id"
        [showHint]="false"
        [value]="email.value"
        [errorMessage]="email.errorMessage"
        (onValueChange)="email.onValueChange($event)"
        (onBlur)="email.onBlur()"
      ></kd-input-text>
      <kd-button variant="primary" htmlType="submit">Daftar Sekarang</kd-button>
    </form>
  `,
})
export class RegistrationFormComponent implements OnDestroy {
  form = createFormController({
    initialValues: { username: '', email: '' },
    rules: {
      username: {
        required: 'Username wajib diisi.',
        minLength: { value: 3, message: 'Username minimal 3 karakter.' },
        debounceMs: 300,
        asyncValidate: async (val, signal) => {
          const res = await fetch(`/api/check-username?u=${encodeURIComponent(val)}`, { signal });
          const data = await res.json();
          return data.taken ? 'Username sudah digunakan.' : null;
        },
      },
      email: {
        required: 'Email wajib diisi.',
        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid.' },
      },
    },
  });

  username = this.form.bindField('username');
  email = this.form.bindField('email');

  private unsubUser = this.form.subscribeField('username', () => {
    this.username = this.form.bindField('username');
  });
  private unsubEmail = this.form.subscribeField('email', () => {
    this.email = this.form.bindField('email');
  });

  async onSubmit(e: Event) {
    e.preventDefault();
    await this.form.handleSubmit((values) => {
      console.log('Form valid:', values);
    });
  }

  ngOnDestroy() {
    this.unsubUser();
    this.unsubEmail();
    this.form.dispose();
  }
}
```

:::

---

## 4. API Reference

### `createFormController(options)`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `initialValues` | `T extends Record<string, any>` | — | Nilai awal untuk setiap field di dalam form. |
| `rules` | `{ [K in keyof T]?: FormFieldRule<T[K], T> }` | `{}` | Konfigurasi aturan validasi sinkron & asinkron per field. |

### `FormFieldRule<V, All>`

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `required` | `boolean \| string` | `false` | Menolak nilai kosong/whitespace. Berikan `string` untuk pesan error custom. |
| `minLength` | `number \| { value: number; message: string }` | — | Panjang karakter minimum (dilewati jika nilai masih kosong). |
| `maxLength` | `number \| { value: number; message: string }` | — | Panjang karakter maksimum. |
| `pattern` | `RegExp \| { value: RegExp; message: string }` | — | Validasi pola RegExp (misal email, nomor telepon, kode pos). |
| `validate` | `(value: V, values: All) => string \| null \| undefined` | — | Fungsi validasi sinkron custom (dapat membaca field lain lewat `values`, misal konfirmasi password). |
| `asyncValidate` | `(value: V, signal: AbortSignal, values: All) => Promise<string \| null \| undefined>` | — | Fungsi validasi asinkron (`fetch`). Hanya dijalankan jika seluruh aturan sinkron di atas lolos. |
| `debounceMs` | `number` | `300` | Waktu tunda (ms) sebelum menjalankan `asyncValidate` saat `change`/`blur`. |

### Metode Instance Controller

| Method | Signature | Description |
| :--- | :--- | :--- |
| `bindField` | `(name) => { name, value, errorMessage, error, validating, onValueChange, onBlur }` | Menghasilkan object props siap pakai untuk seluruh 14 komponen form (`Input*`, `DatePicker`, `TimePicker`, `Checkbox`, `RadioButton`, `SwitchButton`, dan `Slider`). |
| `getFieldState` | `(name) => FormFieldState` | Membaca snapshot `{ value, errorMessage, error, validating, touched, dirty }` milik satu field. |
| `getValues` | `() => T` | Mengembalikan object seluruh nilai field saat ini. |
| `setValue` | `(name, value, opts?: { shouldValidate?: boolean }) => void` | Mengubah nilai field, memperbarui `dirty`, dan menjalankan validasi ulang jika field sedang error atau `shouldValidate: true`. |
| `handleBlur` | `(name) => void` | Menandai `touched = true` dan memicu validasi field. |
| `validateField` | `(name, trigger?: 'change' \| 'blur' \| 'submit') => Promise<string>` | Menjalankan validasi sinkron & asinkron untuk satu field dan mengembalikan pesan error (`''` jika valid). |
| `subscribeField` | `(name, listener: (state: FormFieldState) => void) => () => void` | Mendaftarkan listener yang hanya dipanggil saat field `name` berubah. Mengembalikan fungsi `unsubscribe`. |
| `subscribe` | `(listener: () => void) => () => void` | Mendaftarkan listener level form. |
| `handleSubmit` | `(onValid: (values: T) => void \| Promise<void>, onInvalid?: (errors: Record<string, string>) => void) => Promise<boolean>` | Memvalidasi seluruh field secara paralel (`debounce = 0ms`). Memanggil `onValid(values)` hanya jika seluruh field valid. |
| `reset` | `(nextInitialValues?: T) => void` | Membatalkan seluruh request async aktif dan mengembalikan semua field ke `initialValues`. |
| `dispose` | `() => void` | Membersihkan seluruh timer debounce dan membatalkan `AbortController` aktif saat komponen unmount. |

---

## 5. Matriks 13 Komponen Form *Plug-and-Play* (`form.bindField`)

Karena `bindControllerProps` menyinkronkan `value` dengan `checked`, `fileName`, dan `files` secara otomatis, Anda dapat menyebarkan `{...form.bindField('fieldName')}` (atau `v-bind="field"`) langsung ke seluruh 13 komponen form:

| Komponen | Tipe Nilai `value` di `initialValues` | Perilaku `bindField` & Callback Dinamis |
| :--- | :--- | :--- |
| `InputText`, `InputTextArea` | `string` | Mengikat `value`, `error`, `errorMessage`, `validating`, `onValueChange`, `onBlur`. Mendukung `hint?: string \| ((val: string) => string)`. |
| `InputDropdown` | `string` | Mengikat nilai opsi terpilih (`value`), menutup popup otomatis saat memilih opsi (`onBlur`), dan mendukung `displayValue?: string \| ((val: string) => string)`. |
| `InputOTP` | `string` | Mengikat string kode OTP (`length` digit) dan memvalidasi otomatis saat digit lengkap atau `onBlur`. |
| `InputFileInput`, `InputFileDropZone`, `InputImageUploader` | `string` | Menyinkronkan nama file terpilih (`fileName` ↔ `value`) serta memicu `onValueChange(fileName)` saat file dipilih atau dihapus. |
| `InputMultipleFileUpload` | `File[] \| any[]` | Menyinkronkan daftar file (`files` ↔ `value`) dan mendukung `fileCount?: string \| ((count: number) => string)`. |
| `DatePicker` | `string \| number` | Mengikat output tanggal/rentang ISO (`YYYY-MM-DD`, `YYYY-MM-DD – YYYY-MM-DD`, `YYYY-MM`, atau `YYYY`) dan mendukung `hint`/`displayValue` berbasis fungsi `(date: DatePickerFormatArg) => string`. |
| `TimePicker` | `string` | Mengikat waktu format (`HH:mm` atau `HH:mm:ss`), mendukung mode 12/24 jam, dan `hint` berbasis fungsi `(time: TimePickerFormatArg) => string`. |
| `Checkbox`, `RadioButton`, `SwitchButton` | `boolean` | Menyinkronkan `value: boolean` ↔ `checked: boolean` dan memicu `onValueChange(checked)` saat di-toggle. |
| `Slider` | `number` | Mengikat nilai numerik (`min..max`) dan mendukung `label`, `hint`, serta `formatValue?: (val: number) => string`. |

---

## 6. Headless Primitives untuk OTP, Dropdown & File Upload (`core-form` & `core-file`)

Selain `createFormController`, paket `@komerce-design/{react,vue3,svelte,vue2,angular}` juga mengekspor fungsi primitif murni (SSR-safe) untuk membangun input custom:

| Fungsi | Signature | Deskripsi |
| :--- | :--- | :--- |
| `computeOtpDigits` | `(value?: string, length?: number) => string[]` | Memecah string OTP menjadi array slot karakter sepanjang `length` (default `6`). |
| `applyOtpChar` | `(value?: string, index?: number, rawChar?: string, length?: number) => string` | Memperbarui 1 digit OTP pada `index` tertentu tanpa merusak digit di posisi lain. |
| `applyOtpPasteString` | `(pasted?: string, length?: number) => string` | Membersihkan whitespace dari teks clipboard dan memotong sesuai panjang slot OTP. |
| `handleOtpInputEvent` | `(event, index, currentValue, length, onChange?) => void` | Menangani input karakter OTP dan otomatis memindahkan fokus ke kotak input berikutnya (`focusSiblingInput(event, 1)`). |
| `handleOtpKeyDownEvent` | `(event, index, currentValue, length, onChange?) => void` | Menangani navigasi keyboard `Backspace`, `ArrowLeft`, dan `ArrowRight` antar slot OTP. |
| `handleOtpPasteEvent` | `(event, length, onChange?) => void` | Menangani event `paste` clipboard langsung ke seluruh kotak OTP. |
| `getDropdownOptions` | `(options?: ReadonlyArray<DropdownOptionInput>, query?: string, selectedValue?: string) => DropdownOptionEntry[]` | Menormalisasi array `string \| { label, value, disabled? }` menjadi `{ label, value, selected, disabled }[]` yang sudah difilter terhadap `query`. |
| `filterDropdownOptions` | `<T extends { label: string; value: string }>(options: T[], query?: string) => T[]` | Memfilter daftar opsi dropdown secara case-insensitive berdasarkan `query`. |
| `extractFilesFromEvent` | `(event: unknown) => { files: unknown[]; firstFileName: string; previewUrl: string }` | Mengekstrak daftar `File` dari event `<input type="file">` maupun drag-and-drop (`dataTransfer.files`) dan membuat Object URL preview gambar secara aman (SSR-safe). |
| `handleFileSelectEvent` | `(event, onFileNameChange?, onFilesChange?, onPreviewChange?) => ExtractedFileResult` | Handler terpadu untuk perubahan file input / drop zone. |
| `clearFileInputEvent` | `(event, onFileNameChange?, onFilesChange?, onClear?) => void` | Mereset elemen `<input type="file">` DOM dan mengosongkan state nama/daftar file. |

---

## 7. Kontrak Props Komponen `Input*` (Kompatibilitas Eksternal)

Seluruh komponen `Input*` tetap bersifat *presentational* dan mengekspos props standar HTML/form sehingga juga dapat dihubungkan langsung ke **TanStack Form** atau **React Hook Form** bila dibutuhkan pada proyek eksisting:

| Prop | Type | Digunakan Oleh |
| :--- | :--- | :--- |
| `value` / `defaultValue` | `string` | Controlled (`createFormController`, TanStack Form) & Uncontrolled (`RHF register`) |
| `onValueChange` | `(value: string) => void` | `createFormController`, TanStack Form (`field.handleChange`) |
| `onChange` | `(event: unknown) => void` | React Hook Form (`register('field').onChange`) |
| `onBlur` / `onFocus` | `(event: unknown) => void` | `createFormController`, TanStack Form (`field.handleBlur`), RHF (`field.onBlur`) |
| `error` / `errorMessage` | `boolean` / `string` | Mengaktifkan visual `State=Error` (`border-destructive-border ring-2 ring-focus-ring-error`) dan menampilkan pesan error walaupun `showHint={false}` |
| `validating` | `boolean` | Menampilkan spinner loading otomatis (`animate-spin`, `aria-busy="true"`) di sisi kanan `InputText` saat validasi `fetch` berjalan |
