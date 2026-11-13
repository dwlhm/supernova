import { createFormController } from '@komerce-design/react/utils.ts';

export interface ShipmentFormValues {
  username: string;
  email: string;
  coupon: string;
  courier: string;
  otpCode: string;
  deliveryDate: string;
  insurance: number;
  notes: string;
  paymentMethod: string;
  agreeTerms: boolean;
  instantDispatch: boolean;
  invoiceFile: string;
}

export interface NetworkLogEntry {
  id: string;
  endpoint: string;
  status: 'PENDING' | 'VALID' | 'INVALID' | 'ABORTED';
}

export type FormSubTab = 'details' | 'uploads';

export const COURIER_OPTIONS = [
  { label: 'JNE Reguler (Estimasi 2-3 Hari)', value: 'jne-reg' },
  { label: 'SiCepat BEST (Besok Sampai)', value: 'sicepat-best' },
  { label: 'J&T Express EZ', value: 'jnt-ez' },
  { label: 'SAP Express Cargo', value: 'sap-cargo' },
];

export const INITIAL_SHIPMENT_VALUES: ShipmentFormValues = {
  username: 'komerce_merchant',
  email: 'merchant@komerce.id',
  coupon: 'SUPERNOVA',
  courier: 'sicepat-best',
  otpCode: '849201',
  deliveryDate: '2026-11-15',
  insurance: 75,
  notes: 'Mohon tempelkan stiker fragile pada bagian atas kardus.',
  paymentMethod: 'cod',
  agreeTerms: true,
  instantDispatch: true,
  invoiceFile: 'manifest-pengiriman-nov2026.csv',
};

function validateMerchantUsername(onLog: (entry: NetworkLogEntry) => void) {
  return async (val: string, signal: AbortSignal) => {
    const id = `${Date.now()}-${Math.random()}`;
    const endpoint = `GET /api/merchants/check?u=${encodeURIComponent(val)}`;
    onLog({ id, endpoint, status: 'PENDING' });
    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(resolve, 320);
      signal.addEventListener('abort', () => {
        clearTimeout(t);
        onLog({ id, endpoint, status: 'ABORTED' });
        reject(new DOMException('Aborted', 'AbortError'));
      });
    });
    const taken = ['admin', 'komerce', 'root'].includes(val.trim().toLowerCase());
    onLog({ id, endpoint, status: taken ? 'INVALID' : 'VALID' });
    return taken ? `Username "${val}" sudah terdaftar.` : '';
  };
}

export function createShipmentForm(onLog: (entry: NetworkLogEntry) => void) {
  return createFormController<ShipmentFormValues>({
    initialValues: INITIAL_SHIPMENT_VALUES,
    rules: {
      username: {
        required: 'Username wajib diisi',
        minLength: { value: 3, message: 'Minimal 3 karakter' },
        debounceMs: 300,
        asyncValidate: validateMerchantUsername(onLog),
      },
      email: {
        required: 'Email kerja wajib diisi',
        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid' },
      },
      coupon: {
        debounceMs: 280,
        asyncValidate: async (val) => {
          const clean = val.trim().toUpperCase();
          if (!clean) return '';
          return ['KOMERCE', 'SUPERNOVA'].includes(clean) ? '' : 'Gunakan kode KOMERCE atau SUPERNOVA';
        },
      },
      courier: { required: 'Pilih ekspedisi pengiriman' },
      otpCode: { required: 'Kode OTP wajib diisi', validate: (v) => (String(v).length === 6 ? '' : 'OTP harus 6 digit angka') },
      deliveryDate: { required: 'Tanggal pengiriman wajib dipilih' },
      notes: { maxLength: { value: 120, message: 'Catatan maksimal 120 karakter' } },
      agreeTerms: { required: 'Anda harus menyetujui syarat pengiriman' },
      invoiceFile: { required: 'Manifest CSV pengiriman wajib dilampirkan' },
    },
  });
}

export type ShipmentFormInstance = ReturnType<typeof createShipmentForm>;
