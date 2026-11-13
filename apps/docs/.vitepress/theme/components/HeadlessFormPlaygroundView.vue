<template>
  <div class="my-2 flex flex-col gap-5 rounded-2xl border border-border-default bg-background-default p-6 text-foreground-default shadow-xs">
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-border-default pb-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="inline-block h-2.5 w-2.5 rounded-full bg-primary-default"></span>
          <h3 class="text-base font-bold tracking-tight text-foreground-default">
            Interactive Headless Form Playground (`createFormController`)
          </h3>
        </div>
        <p class="mt-1 text-xs text-foreground-muted">
          Uji langsung isolasi re-render per-field (`subscribeField`), validasi *Punish Late / Reward Early*, serta *Async Fetch + AbortSignal* pada komponen `Input*` asli.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button type="button" class="cursor-pointer rounded-lg border border-border-default bg-background-subtle px-2.5 py-1.5 text-xs font-medium text-foreground-default hover:bg-background-muted" @click="simulateTakenUsername">
          Uji Username Terpakai ("admin")
        </button>
        <button type="button" class="cursor-pointer rounded-lg border border-border-default bg-background-subtle px-2.5 py-1.5 text-xs font-medium text-foreground-default hover:bg-background-muted" @click="simulateRapidTyping">
          Simulasi Rapid Typing (Uji AbortSignal)
        </button>
        <button type="button" class="cursor-pointer rounded-lg border border-border-default bg-background-subtle px-2.5 py-1.5 text-xs font-medium text-foreground-default hover:bg-background-muted" @click="resetForm">
          Reset
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <form class="flex flex-col gap-4 lg:col-span-7" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-medium text-foreground-muted">Async Fetch (`debounceMs: 350` + `AbortSignal`) • Ketik `admin` / `komerce` untuk simulasi bentrok</span>
            <span class="rounded-full bg-primary-default/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-primary-default">username updates: {{ renderCounts.username }}</span>
          </div>
          <InputText id="pg-username" name="username" label="Username" placeholder="ketik minimal 3 karakter (misal: admin atau komerce_dev)" hint="Username dicek otomatis ke server dengan AbortController." :showLeftIcon="true" :value="usernameField.value" :error="usernameField.error" :errorMessage="usernameField.errorMessage" :validating="usernameField.validating" :onValueChange="usernameField.onValueChange" :onBlur="usernameField.onBlur" />
        </div>

        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-medium text-foreground-muted">Sync Pattern (`Punish Late` saat Blur, `Reward Early` saat diperbaiki)</span>
            <span class="rounded-full bg-primary-default/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-primary-default">email updates: {{ renderCounts.email }}</span>
          </div>
          <InputText id="pg-email" name="email" type="email" label="Work Email" placeholder="nama@komerce.id" :showHint="false" :showLeftIcon="true" :value="emailField.value" :error="emailField.error" :errorMessage="emailField.errorMessage" :onValueChange="emailField.onValueChange" :onBlur="emailField.onBlur" />
        </div>

        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-medium text-foreground-muted">Async Fetch Kupon • Kode valid: `KOMERCE` atau `SUPERNOVA`</span>
            <span class="rounded-full bg-primary-default/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-primary-default">coupon updates: {{ renderCounts.coupon }}</span>
          </div>
          <InputText id="pg-coupon" name="coupon" label="Promo Code (Opsional)" placeholder="Coba ketik KOMERCE atau SALAH123" :required="false" hint="Kosongkan jika tidak ada, atau masukkan KOMERCE." :value="couponField.value" :error="couponField.error" :errorMessage="couponField.errorMessage" :validating="couponField.validating" :onValueChange="couponField.onValueChange" :onBlur="couponField.onBlur" />
        </div>

        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-medium text-foreground-muted">DatePicker (`mode="single"` + `editable` + `showTime`) • Terikat langsung ke `form.bindField('deliveryDate')`</span>
            <span class="rounded-full bg-primary-default/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-primary-default">deliveryDate updates: {{ renderCounts.deliveryDate }}</span>
          </div>
          <DatePicker id="pg-delivery-date" name="deliveryDate" label="Tanggal Pengiriman" timeLabel="Jam Kirim" placeholder="Ketik 'besok' atau pilih tanggal" :editable="true" :showTime="true" :required="true" :showHint="true" :hint="(date: any) => date.hasValue ? `Jadwal pengiriman: ${date.toLocaleDateString('id-ID', { dateStyle: 'long' })} pukul ${date.time}` : 'Pilih tanggal dan jam pengiriman.'" :value="deliveryDateField.value" :error="deliveryDateField.error" :errorMessage="deliveryDateField.errorMessage" :onValueChange="deliveryDateField.onValueChange" :onBlur="deliveryDateField.onBlur" />
        </div>

        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-medium text-foreground-muted">Sync MaxLength + Character Counter</span>
            <span class="rounded-full bg-primary-default/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-primary-default">notes updates: {{ renderCounts.notes }}</span>
          </div>
          <InputTextArea id="pg-notes" name="notes" label="Catatan Tambahan" placeholder="Tulis catatan pengiriman (maksimal 80 karakter)..." :rows="2" :maxLength="80" :showCharacterCount="true" hint="Maksimal 80 karakter." :value="notesField.value" :error="notesField.error" :errorMessage="notesField.errorMessage" :onValueChange="notesField.onValueChange" :onBlur="notesField.onBlur" />
        </div>

        <div class="flex items-center gap-3 pt-1">
          <Button variant="primary" htmlType="submit">Submit &amp; Validasi Semua Field</Button>
          <span v-if="submitBanner" :class="['text-xs font-medium', submitBanner.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive-foreground']">{{ submitBanner.text }}</span>
        </div>
      </form>

      <div class="flex flex-col gap-4 rounded-xl border border-border-default bg-background-subtle p-4 lg:col-span-5">
        <div>
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold uppercase tracking-wider text-foreground-muted">1. Live Async Fetch &amp; AbortSignal Log</h4>
            <button type="button" class="cursor-pointer text-[11px] text-foreground-muted hover:text-foreground-default" @click="networkLogs = []">Clear</button>
          </div>
          <div class="mt-2 flex max-h-48 min-h-28 flex-col gap-1.5 overflow-y-auto rounded-lg border border-border-default bg-background-default p-2.5 font-mono text-[11px]">
            <div v-if="networkLogs.length === 0" class="py-6 text-center text-foreground-subtle">
              Ketik di field Username atau Promo Code untuk melihat log fetch &amp; pembatalan AbortController...
            </div>
            <div v-for="item in networkLogs" :key="item.id" class="flex items-center justify-between gap-2 rounded bg-background-subtle px-2 py-1">
              <span class="truncate text-foreground-default">{{ item.endpoint }}</span>
              <span :class="['shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold', item.status === 'PENDING' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : item.status === 'ABORTED' ? 'bg-slate-500/15 text-foreground-muted line-through' : item.status === 'VALID' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 text-destructive-foreground']">
                {{ item.badge }}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-foreground-muted">2. Live Field State Snapshot (`getFieldState`)</h4>
          <pre class="mt-2 max-h-56 overflow-x-auto rounded-lg border border-border-default bg-background-default p-3 font-mono text-[11px] leading-relaxed text-foreground-default">{{ liveStateJson }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue';
import { createFormController } from '../preview/utils';

const InputText = defineAsyncComponent(() => import('../preview/vue3/InputText.vue'));
const InputTextArea = defineAsyncComponent(() => import('../preview/vue3/InputTextArea.vue'));
const DatePicker = defineAsyncComponent(() => import('../preview/vue3/DatePicker.vue'));
const Button = defineAsyncComponent(() => import('../preview/vue3/Button.vue'));

interface NetLog {
  id: number;
  endpoint: string;
  status: 'PENDING' | 'ABORTED' | 'VALID' | 'INVALID';
  badge: string;
}

let logSeq = 0;
const networkLogs = ref<NetLog[]>([]);
const submitBanner = ref<{ ok: boolean; text: string } | null>(null);
const renderCounts = reactive({ username: 0, email: 0, coupon: 0, deliveryDate: 0, notes: 0 });

function pushLog(endpoint: string): NetLog {
  const entry: NetLog = { id: ++logSeq, endpoint, status: 'PENDING', badge: 'FETCHING...' };
  networkLogs.value = [entry, ...networkLogs.value.slice(0, 14)];
  return entry;
}

const form = createFormController({
  initialValues: { username: '', email: '', coupon: '', deliveryDate: '', notes: '' },
  rules: {
    username: {
      required: 'Username wajib diisi.',
      minLength: { value: 3, message: 'Username minimal 3 karakter.' },
      pattern: { value: /^[a-z0-9_]+$/i, message: 'Hanya huruf, angka, dan underscore (_).' },
      debounceMs: 350,
      asyncValidate: async (val, signal) => {
        const entry = pushLog(`GET /api/username?u=${val}`);
        signal.addEventListener('abort', () => { entry.status = 'ABORTED'; entry.badge = 'ABORTED (Signal)'; });
        await new Promise((r) => setTimeout(r, 480));
        if (signal.aborted) return null;
        const taken = ['admin', 'komerce', 'root', 'taken'].includes(val.toLowerCase());
        entry.status = taken ? 'INVALID' : 'VALID';
        entry.badge = taken ? '409 TAKEN' : '200 AVAILABLE';
        return taken ? `Username "${val}" sudah dipakai.` : null;
      },
    },
    email: {
      required: 'Email wajib diisi.',
      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid (contoh: nama@komerce.id).' },
    },
    coupon: {
      minLength: { value: 4, message: 'Kode promo minimal 4 karakter.' },
      debounceMs: 350,
      asyncValidate: async (val, signal) => {
        const entry = pushLog(`GET /api/coupon?code=${val}`);
        signal.addEventListener('abort', () => { entry.status = 'ABORTED'; entry.badge = 'ABORTED (Signal)'; });
        await new Promise((r) => setTimeout(r, 420));
        if (signal.aborted) return null;
        const ok = ['KOMERCE', 'SUPERNOVA', 'MERDEKA'].includes(val.toUpperCase());
        entry.status = ok ? 'VALID' : 'INVALID';
        entry.badge = ok ? '200 VALID' : '404 INVALID';
        return ok ? null : 'Kode promo tidak ditemukan atau kadaluarsa.';
      },
    },
    deliveryDate: {
      required: 'Tanggal pengiriman wajib dipilih.',
    },
    notes: { maxLength: { value: 80, message: 'Catatan maksimal 80 karakter.' } },
  },
});

const usernameField = ref(form.bindField('username'));
const emailField = ref(form.bindField('email'));
const couponField = ref(form.bindField('coupon'));
const deliveryDateField = ref(form.bindField('deliveryDate'));
const notesField = ref(form.bindField('notes'));

const unsubs: Array<() => void> = [];
onMounted(() => {
  unsubs.push(
    form.subscribeField('username', () => { renderCounts.username++; usernameField.value = form.bindField('username'); }),
    form.subscribeField('email', () => { renderCounts.email++; emailField.value = form.bindField('email'); }),
    form.subscribeField('coupon', () => { renderCounts.coupon++; couponField.value = form.bindField('coupon'); }),
    form.subscribeField('deliveryDate', () => { renderCounts.deliveryDate++; deliveryDateField.value = form.bindField('deliveryDate'); }),
    form.subscribeField('notes', () => { renderCounts.notes++; notesField.value = form.bindField('notes'); })
  );
});
onBeforeUnmount(() => { unsubs.forEach((u) => u()); form.dispose(); });

const liveStateJson = computed(() =>
  JSON.stringify(
    {
      username: { value: usernameField.value.value, error: usernameField.value.error, validating: usernameField.value.validating, errorMessage: usernameField.value.errorMessage },
      email: { value: emailField.value.value, error: emailField.value.error, errorMessage: emailField.value.errorMessage },
      coupon: { value: couponField.value.value, error: couponField.value.error, validating: couponField.value.validating, errorMessage: couponField.value.errorMessage },
      deliveryDate: { value: deliveryDateField.value.value, error: deliveryDateField.value.error, errorMessage: deliveryDateField.value.errorMessage },
    },
    null,
    2
  )
);

function simulateTakenUsername() {
  submitBanner.value = null;
  form.handleBlur('username');
  form.setValue('username', 'admin', { shouldValidate: true });
}

async function simulateRapidTyping() {
  submitBanner.value = null;
  form.handleBlur('username');
  for (const text of ['kom', 'kome', 'komer', 'komerce_dev']) {
    form.setValue('username', text, { shouldValidate: true });
    await new Promise((r) => setTimeout(r, 390));
  }
}

function resetForm() {
  submitBanner.value = null;
  networkLogs.value = [];
  form.reset();
}

async function onSubmit() {
  submitBanner.value = null;
  return form.handleSubmit(
    (values) => { submitBanner.value = { ok: true, text: `Berhasil! Payload valid: ${JSON.stringify(values)}` }; },
    (errors) => { submitBanner.value = { ok: false, text: `Gagal submit (${Object.keys(errors).length} field error)` }; }
  );
}
</script>
