import type { FormSubTab } from '../sections/shipmentFormModel';

const SHIPMENT_DETAILS_SNIPPET = `import React, { useEffect, useMemo, useState } from 'react';
import {
  Button, Checkbox, DatePicker, InputDropdown, InputDropdownItem,
  InputOTP, InputText, InputTextArea, RadioButton, Slider, SwitchButton,
  createFormController, getDropdownOptions,
} from '@komerce-design/react';

const COURIER_OPTIONS = [
  { label: 'JNE Reguler (Estimasi 2-3 Hari)', value: 'jne-reg' },
  { label: 'SiCepat BEST (Besok Sampai)', value: 'sicepat-best' },
  { label: 'J&T Express EZ', value: 'jnt-ez' },
];

export function ShipmentFormExample() {
  const form = useMemo(() => createFormController({
    initialValues: {
      username: 'komerce_merchant', email: 'merchant@komerce.id', coupon: 'SUPERNOVA',
      courier: 'sicepat-best', deliveryDate: '2026-11-15', otpCode: '849201',
      insurance: 75, notes: '', paymentMethod: 'cod', instantDispatch: true, agreeTerms: true,
    },
    rules: {
      username: {
        required: 'Username wajib diisi', debounceMs: 300,
        asyncValidate: async (val, signal) => {
          const res = await fetch(\`/api/merchants/check?u=\${encodeURIComponent(val)}\`, { signal });
          const { taken } = await res.json();
          return taken ? \`Username "\${val}" sudah terdaftar.\` : '';
        },
      },
      email: { required: 'Email wajib diisi', pattern: { value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, message: 'Email tidak valid' } },
      agreeTerms: { required: 'Anda harus menyetujui syarat pengiriman' },
    },
  }), []);

  useEffect(() => () => form.dispose(), [form]);
  const [dropdown, setDropdown] = useState({ open: false, search: '' });

  function SubscribedField({ name, children }: { name: any; children: () => React.ReactNode }) {
    const [, setTick] = useState(0);
    useEffect(() => form.subscribeField(name, () => setTick((t) => t + 1)), [name]);
    return <>{children()}</>;
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); void form.handleSubmit((values) => console.log(values)); }}>
      <SubscribedField name="username">{() => <InputText label="Username Merchant" {...form.bindField('username')} />}</SubscribedField>
      <SubscribedField name="coupon">{() => <InputText label="Kode Promo" {...form.bindField('coupon')} />}</SubscribedField>
      <SubscribedField name="courier">
        {() => {
          const bind = form.bindField('courier');
          const filtered = getDropdownOptions(COURIER_OPTIONS, dropdown.search, String(bind.value));
          return (
            <InputDropdown
              label="Ekspedisi Pengiriman" showSearch open={dropdown.open} searchQuery={dropdown.search}
              displayValue={(v) => COURIER_OPTIONS.find((o) => o.value === v)?.label || v}
              {...bind}
              onOpenChange={(open) => setDropdown((s) => ({ ...s, open }))}
              onSearchChange={(search) => setDropdown((s) => ({ ...s, search }))}
            >
              {filtered.map((opt) => (
                <InputDropdownItem key={opt.value} value={opt.value} selected={opt.selected} onSelect={(v) => bind.onValueChange(v)}>
                  {opt.label}
                </InputDropdownItem>
              ))}
            </InputDropdown>
          );
        }}
      </SubscribedField>
      <SubscribedField name="deliveryDate">
        {() => (
          <DatePicker
            label="Jadwal Pickup" mode="single" editable showTime
            hint={(d) => (d.hasValue ? \`Jadwal: \${d.formatted} (\${d.time})\` : 'Ketik "besok" atau "3 hari lagi"')}
            {...form.bindField('deliveryDate')}
          />
        )}
      </SubscribedField>
      <SubscribedField name="otpCode">{() => <InputOTP length={6} label="PIN Gudang" {...form.bindField('otpCode')} />}</SubscribedField>
      <SubscribedField name="insurance">{() => <Slider showValue label="Proteksi Asuransi" {...form.bindField('insurance')} />}</SubscribedField>
      <SubscribedField name="notes">{() => <InputTextArea label="Instruksi Kurir" {...form.bindField('notes')} />}</SubscribedField>
      <SubscribedField name="paymentMethod">
        {() => (
          <>
            <RadioButton {...form.bindRadioField('paymentMethod', 'cod')}>Cash on Delivery (COD)</RadioButton>
            <RadioButton {...form.bindRadioField('paymentMethod', 'transfer')}>Saldo Komerce Pay</RadioButton>
          </>
        )}
      </SubscribedField>
      <SubscribedField name="instantDispatch">{() => <SwitchButton {...form.bindCheckboxField('instantDispatch')}>Instant Dispatch</SwitchButton>}</SubscribedField>
      <SubscribedField name="agreeTerms">{() => <Checkbox {...form.bindCheckboxField('agreeTerms')}>Setuju Syarat & SLA</Checkbox>}</SubscribedField>
      <Button type="button" onClick={() => form.setFieldError('coupon', 'Kuota kupon habis (Server 422)')}>Simulasi 422</Button>
      <Button type="button" onClick={() => form.clearFieldErrors()}>Bersihkan Error</Button>
      <Button type="submit">Kirim Pengiriman</Button>
    </form>
  );
}`;

const DOCUMENT_UPLOADS_SNIPPET = `import React, { useState } from 'react';
import {
  Badge, InputFileDropZone, InputFileInput, InputImageUploader,
  InputMultipleFileUpload, InputMultipleFileUploadItem, getFileState,
} from '@komerce-design/react';

export function DocumentUploadsExample({ form }: { form: any }) {
  const [files, setFiles] = useState([
    { id: '1', name: 'invoice-batch-01.pdf', status: 'completed' as const, statusText: 'Completed (420 KB)' },
    { id: '2', name: 'bukti-serah-terima.png', status: 'uploading' as const, statusText: 'Uploading 68%...' },
  ]);
  const [dropFile, setDropFile] = useState('kontrak-merchant-komerce.pdf');
  const [imgSrc, setImgSrc] = useState('');

  const snapshot = getFileState({
    fileName: dropFile, files,
    hint: (fn) => (fn ? \`Berkas siap: \${fn}\` : 'Belum ada berkas'),
    fileCount: (n) => \`\${n} lampiran aktif\`,
  });
  const invoiceBind = form.bindField('invoiceFile');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Badge variant="info">{snapshot.resolvedFileCount}</Badge>
      <InputFileInput
        label="Manifest Pengiriman (CSV)" buttonText="Pilih CSV"
        fileName={invoiceBind.value} {...invoiceBind} onFileNameChange={(name) => invoiceBind.onValueChange(name)}
      />
      <InputFileDropZone
        label="Kontrak Legal Merchant" fileName={dropFile}
        hint={(fn) => (fn ? \`Siap diunggah: \${fn}\` : 'PDF/DOCX maks 10 MB')}
        onFileNameChange={setDropFile} onRemove={() => setDropFile('')}
      />
      <InputImageUploader label="Foto Bukti Paket" imageSrc={imgSrc} onPreviewChange={setImgSrc} />
      <InputMultipleFileUpload label="Lampiran Klaim Kolektif" fileCount={(n) => \`\${n || files.length} berkas\`}>
        {files.map((item) => (
          <InputMultipleFileUploadItem key={item.id} status={item.status} statusText={item.statusText} onRemove={() => setFiles((s) => s.filter((f) => f.id !== item.id))}>
            {item.name}
          </InputMultipleFileUploadItem>
        ))}
      </InputMultipleFileUpload>
    </div>
  );
}`;

export function buildFormCodeSnippet(activeTab: FormSubTab): string {
  return activeTab === 'uploads' ? DOCUMENT_UPLOADS_SNIPPET : SHIPMENT_DETAILS_SNIPPET;
}
