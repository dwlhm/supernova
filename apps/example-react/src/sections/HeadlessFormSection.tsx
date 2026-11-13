import React, { useEffect, useMemo, useState } from 'react';
import {
  Badge, Button, Checkbox, DatePicker, InputDropdown, InputDropdownItem,
  InputOTP, InputText, InputTextArea, RadioButton, Slider, SwitchButton,
  TabItem, Tabs, TimePicker, getDropdownOptions, useFormField,
} from '@komerce-design/react';
import { CodeShowcaseCard } from '../components/CodeShowcaseCard';
import { useRenderCount } from '../components/RerenderMonitor';
import { buildFormCodeSnippet } from '../snippets/formCodeSnippet';
import { FormUploadsPanel } from './FormUploadsPanel';
import {
  COURIER_OPTIONS, createShipmentForm,
  type FormSubTab, type NetworkLogEntry, type ShipmentFormInstance,
} from './shipmentFormModel';

function CourierDropdownField(props: { form: ShipmentFormInstance }) {
  const [dropdownUI, setDropdownUI] = useState({ open: false, search: '' });
  useRenderCount('field:courier', 'field');
  const { bind } = useFormField(props.form, 'courier');
  const filtered = getDropdownOptions(COURIER_OPTIONS, dropdownUI.search, String(bind.value));
  return (
    <InputDropdown
      id="f-courier" label="Ekspedisi Pengiriman" placeholder="Pilih kurir" required showHint showSearch
      open={dropdownUI.open} searchQuery={dropdownUI.search} searchPlaceholder="Cari layanan kurir..."
      displayValue={(val) => COURIER_OPTIONS.find((o) => o.value === val)?.label || val}
      hint="Terfilter real-time dengan getDropdownOptions(options, query, selected)"
      {...bind}
      onOpenChange={(open) => setDropdownUI((s) => ({ ...s, open }))}
      onSearchChange={(search) => setDropdownUI((s) => ({ ...s, search }))}
    >
      {filtered.map((opt) => (
        <InputDropdownItem key={opt.value} value={opt.value} selected={opt.selected} onSelect={(val) => { bind.onValueChange(val); setDropdownUI({ open: false, search: '' }); }}>
          {opt.label}
        </InputDropdownItem>
      ))}
    </InputDropdown>
  );
}

function DatePickerField(props: { form: ShipmentFormInstance }) {
  const [dateMode, setDateMode] = useState<'single' | 'range' | 'month' | 'year'>('single');
  const [timeState, setTimeState] = useState({ open: false, hour: 9, minute: 30, value: '09:30' });
  useRenderCount('field:deliveryDate', 'field');
  const { bind } = useFormField(props.form, 'deliveryDate');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-foreground-muted">Mode Kalender:</span>
        <div className="inline-flex rounded-lg border border-border-default bg-background-subtle p-0.5">
          {(['single', 'range', 'month', 'year'] as const).map((m) => (
            <button key={m} type="button" onClick={() => setDateMode(m)} className={`cursor-pointer rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${dateMode === m ? 'bg-primary-default text-primary-foreground' : 'text-foreground-muted hover:text-foreground-default'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-start gap-3">
        <DatePicker
          id="f-date" label="Jadwal Penjemputan Kurir" mode={dateMode}
          editable={dateMode === 'single'} showHint required
          placeholder="Ketik 'besok' atau '3 hari lagi'"
          hint={(d) => (d.hasValue ? `Jadwal terpilih: ${d.formatted}` : 'Mendukung natural language ("besok", "3 hari lagi")')}
          {...bind}
        />
        <TimePicker
          id="f-time" label="Jam Pickup" open={timeState.open} value={timeState.value}
          selectedHour={timeState.hour} selectedMinute={timeState.minute}
          onOpenChange={(open) => setTimeState((s) => ({ ...s, open }))}
          onHourSelect={(hour) => setTimeState((s) => ({ ...s, hour, value: `${String(hour).padStart(2, '0')}:${String(s.minute).padStart(2, '0')}` }))}
          onMinuteSelect={(minute) => setTimeState((s) => ({ ...s, minute, value: `${String(s.hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}` }))}
        />
      </div>
    </div>
  );
}

function PaymentMethodField(props: { form: ShipmentFormInstance }) {
  useRenderCount('field:paymentMethod', 'field');
  const { bindRadio } = useFormField(props.form, 'paymentMethod');
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Metode Pembayaran</span>
      <RadioButton id="f-pay-cod" {...bindRadio('cod')}>Cash on Delivery (COD)</RadioButton>
      <RadioButton id="f-pay-transfer" {...bindRadio('transfer')}>Saldo Komerce Pay</RadioButton>
    </div>
  );
}

function InstantDispatchField(props: { form: ShipmentFormInstance }) {
  useRenderCount('field:instantDispatch', 'field');
  const { bindCheckbox } = useFormField(props.form, 'instantDispatch');
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Prioritas Gudang</span>
      <SwitchButton id="f-switch" {...bindCheckbox()}>Instant Courier Dispatch</SwitchButton>
    </div>
  );
}

function AgreeTermsField(props: { form: ShipmentFormInstance }) {
  useRenderCount('field:agreeTerms', 'field');
  const { bindCheckbox } = useFormField(props.form, 'agreeTerms');
  const bind = bindCheckbox();
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Konfirmasi SLA</span>
      <Checkbox id="f-checkbox" {...bind}>Setuju Syarat &amp; SLA Pengiriman</Checkbox>
      {bind.error && <span className="text-xs text-destructive-foreground">{bind.errorMessage}</span>}
    </div>
  );
}

function FormChoiceGroup(props: { form: ShipmentFormInstance }) {
  return (
    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5 rounded-xl border border-border-default bg-background-subtle p-5">
      <PaymentMethodField form={props.form} />
      <InstantDispatchField form={props.form} />
      <AgreeTermsField form={props.form} />
    </div>
  );
}

function UsernameField(props: { form: ShipmentFormInstance }) {
  useRenderCount('field:username', 'field');
  const { bind } = useFormField(props.form, 'username');
  return <InputText id="f-username" label="Username Merchant" placeholder="cth: komerce_merchant" hint="Async debounce 300ms + pembatalan otomatis AbortSignal" showLeftIcon {...bind} />;
}

function EmailField(props: { form: ShipmentFormInstance }) {
  useRenderCount('field:email', 'field');
  const { bind } = useFormField(props.form, 'email');
  return <InputText id="f-email" type="email" label="Email Operasional" placeholder="merchant@komerce.id" hint="Strategi validasi Punish-Late & Reward-Early" showLeftIcon {...bind} />;
}

function CouponField(props: { form: ShipmentFormInstance }) {
  useRenderCount('field:coupon', 'field');
  const { bind } = useFormField(props.form, 'coupon');
  return <InputText id="f-coupon" required={false} label="Kode Promo Ongkir" placeholder="KOMERCE / SUPERNOVA" hint={(v) => (v ? `Memverifikasi kupon: ${v}` : 'Opsional — gunakan KOMERCE atau SUPERNOVA')} {...bind} />;
}

function OtpCodeField(props: { form: ShipmentFormInstance }) {
  useRenderCount('field:otpCode', 'field');
  const { bind } = useFormField(props.form, 'otpCode');
  return <InputOTP id="f-otp" length={6} required label="PIN Otorisasi Gudang" hint={(v) => `Terisi ${v.length}/6 digit angka`} {...bind} />;
}

function InsuranceField(props: { form: ShipmentFormInstance }) {
  useRenderCount('field:insurance', 'field');
  const { bind } = useFormField(props.form, 'insurance');
  return <Slider id="f-slider" min={0} max={100} step={5} showValue label="Proteksi Asuransi Pengiriman" formatValue={(v) => `${v}% Nilai Barang`} hint={(v) => `Pertanggungan klaim hingga ${v}% nilai invoice`} {...bind} />;
}

function NotesField(props: { form: ShipmentFormInstance }) {
  useRenderCount('field:notes', 'field');
  const { bind } = useFormField(props.form, 'notes');
  return <InputTextArea id="f-notes" rows={2} maxLength={120} showCharacterCount label="Instruksi Khusus Kurir" placeholder="Tulis instruksi penanganan paket..." hint="Maksimal 120 karakter" {...bind} />;
}

function InvoiceUploadField(props: { form: ShipmentFormInstance }) {
  useRenderCount('field:invoiceFile', 'field');
  const { bind } = useFormField(props.form, 'invoiceFile');
  return <FormUploadsPanel invoiceBind={bind} />;
}

function ShipmentDetailsGrid(props: { form: ShipmentFormInstance }) {
  const { form } = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <UsernameField form={form} />
      <EmailField form={form} />
      <CouponField form={form} />
      <CourierDropdownField form={form} />
      <DatePickerField form={form} />
      <OtpCodeField form={form} />
      <InsuranceField form={form} />
      <NotesField form={form} />
      <FormChoiceGroup form={form} />
    </div>
  );
}

function FormTelemetryDrawer(props: { form: ShipmentFormInstance; logs: NetworkLogEntry[] }) {
  const [, setTick] = useState(0);
  const renders = useRenderCount('panel:telemetry', 'field');
  useEffect(() => props.form.subscribe(() => setTick((t) => t + 1)), [props.form]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 rounded-xl border border-border-default bg-background-subtle p-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground-muted">Async Network &amp; AbortSignal Log</h3>
          <Badge variant="secondary">{props.logs.length} request</Badge>
        </div>
        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto rounded-lg border border-border-default bg-background-default p-3 font-mono text-[11px]">
          {props.logs.length === 0 ? (
            <span className="py-6 text-center text-foreground-muted">Ketik pada Username atau klik Simulasi Bentrok untuk memicu async request...</span>
          ) : (
            props.logs.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-2 py-0.5">
                <span className="truncate text-foreground-default">{l.endpoint}</span>
                <Badge variant={l.status === 'VALID' ? 'success' : l.status === 'INVALID' ? 'destructive' : 'secondary'}>{l.status}</Badge>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground-muted">Live Controller Snapshot</h3>
          <Badge variant="outline">Drawer commits: {renders}x</Badge>
        </div>
        <pre className="max-h-48 overflow-auto rounded-lg border border-border-default bg-background-default p-3 font-mono text-[11px] leading-relaxed">
          {JSON.stringify(props.form.getValues(), null, 2)}
        </pre>
      </div>
    </div>
  );
}

export function HeadlessFormSection(props: {
  onNotify: (type: 'default' | 'success' | 'error' | 'warning' | 'info', title: string, desc: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<FormSubTab>('details');
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [logs, setLogs] = useState<NetworkLogEntry[]>([]);
  const form = useMemo(() => createShipmentForm((entry) => setLogs((prev) => [entry, ...prev.filter((x) => x.id !== entry.id)].slice(0, 8))), []);
  useEffect(() => () => form.dispose(), [form]);

  const simulateServer422 = () => {
    setActiveTab('details');
    form.setFieldError('coupon', 'Kuota kupon SUPERNOVA habis di gudang tujuan (Server 422)');
    props.onNotify('error', 'Server 422 Unprocessable Entity', 'Error API disuntikkan langsung ke field Kode Promo via setFieldError().');
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border-default bg-background-default p-6 lg:p-7 shadow-xs flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-default pb-5">
          <Tabs ariaLabel="Sub-halaman Formulir Pengiriman">
            <TabItem active={activeTab === 'details'} state={activeTab === 'details' ? 'active' : 'default'} showNum num="9" onClick={() => setActiveTab('details')}>Detail Pengiriman Merchant</TabItem>
            <TabItem active={activeTab === 'uploads'} state={activeTab === 'uploads' ? 'active' : 'default'} showNum num="4" onClick={() => setActiveTab('uploads')}>Dokumen &amp; Media Upload</TabItem>
          </Tabs>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="small" variant="outline" onClick={() => { setActiveTab('details'); form.setValue('username', 'admin', { shouldValidate: true }); }}>Simulasi Username Bentrok (&quot;admin&quot;)</Button>
            <Button size="small" variant="outline" onClick={simulateServer422}>Simulasi Server Error (422)</Button>
            <Button size="small" variant="ghost" onClick={() => form.clearFieldErrors()}>Bersihkan Error</Button>
            <Button size="small" variant={showTelemetry ? 'primary' : 'secondary'} onClick={() => setShowTelemetry((v) => !v)}>{showTelemetry ? 'Tutup Live State' : 'Lihat Live State & Network Log'}</Button>
          </div>
        </div>
        {showTelemetry && <FormTelemetryDrawer form={form} logs={logs} />}
        <form onSubmit={(e) => { e.preventDefault(); void form.handleSubmit((v) => props.onNotify('success', 'Pengiriman Siap Diproses', `Manifest ${v.username} (${v.courier}) lolos seluruh validasi.`), (errs) => props.onNotify('error', 'Validasi Belum Lengkap', `Terdapat ${Object.keys(errs).length} field yang memerlukan perbaikan.`)); }} className="flex flex-col gap-6">
          {activeTab === 'details' ? <ShipmentDetailsGrid form={form} /> : <InvoiceUploadField form={form} />}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-default pt-5">
            <span className="text-xs text-foreground-muted">Setiap perubahan input terisolasi via <code className="font-mono">useFormField(form, name)</code> — aktifkan <strong>⚡ Profiler</strong> di Topbar untuk memverifikasi commit.</span>
            <div className="flex items-center gap-2.5">
              <Button type="button" variant="secondary" onClick={() => form.reset()}>Reset Form</Button>
              <Button type="submit" variant="primary">Simpan &amp; Validasi Pengiriman</Button>
            </div>
          </div>
        </form>
      </section>
      <CodeShowcaseCard title={activeTab === 'details' ? 'Headless Form Controller & Field-Isolated Bindings' : 'Document & Media Upload Suite + getFileState'} description="Salin pola lengkap integrasi createFormController, SubscribedField, bindCheckboxField, bindRadioField, dan setFieldError." helpers={['createFormController', 'subscribeField', 'bindField', 'bindCheckboxField', 'bindRadioField', 'setFieldError', 'getDropdownOptions', 'getFileState']} code={buildFormCodeSnippet(activeTab)} defaultExpanded={false} />
    </div>
  );
}
