import React, { useState } from 'react';
import {
  Badge,
  Button,
  InputFileDropZone,
  InputFileInput,
  InputImageUploader,
  InputMultipleFileUpload,
  InputMultipleFileUploadItem,
  getFileState,
} from '@komerce-design/react';

export interface UploadItemEntry {
  id: string;
  name: string;
  sizeLabel: string;
  status: 'uploading' | 'completed' | 'error';
  statusText: string;
}

interface UploadPanelState {
  dropzoneFileName: string;
  dropzoneMeta: string;
  imageName: string;
  imageSrc: string;
  multiFiles: UploadItemEntry[];
}

const INITIAL_UPLOAD_STATE: UploadPanelState = {
  dropzoneFileName: 'kontrak-merchant-komerce.pdf',
  dropzoneMeta: 'PDF • 1.8 MB • Terverifikasi',
  imageName: 'foto-paket-resi-8821.jpg',
  imageSrc: '',
  multiFiles: [
    { id: 'f-1', name: 'invoice-batch-01.pdf', sizeLabel: '420 KB', status: 'completed', statusText: 'Completed (420 KB)' },
    { id: 'f-2', name: 'bukti-serah-terima.png', sizeLabel: '1.2 MB', status: 'uploading', statusText: 'Uploading 68%...' },
    { id: 'f-3', name: 'lampiran-pajak-corrupt.xlsx', sizeLabel: '890 KB', status: 'error', statusText: 'Format kolom tidak sesuai' },
  ],
};

export interface InvoiceFieldBinding {
  name: string;
  value: string;
  error: boolean;
  errorMessage: string;
  validating: boolean;
  onValueChange: (val: string) => void;
  onBlur: () => void;
}

function UploadSuiteHeader(props: { countLabel: string; onAddSimulated: () => void; onResetUploads: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border-default bg-background-subtle px-5 py-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-foreground-default">Dokumen Legal, Manifest &amp; Bukti Paket</h3>
          <Badge variant="info">{props.countLabel}</Badge>
        </div>
        <p className="text-xs text-foreground-muted">
          Empat komponen upload terhubung ke helper headless <code className="font-mono">getFileState</code> dan state form utama.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="small" variant="outline" onClick={props.onAddSimulated}>
          + Simulasi Lampiran Klaim
        </Button>
        <Button size="small" variant="ghost" onClick={props.onResetUploads}>
          Reset Berkas
        </Button>
      </div>
    </div>
  );
}

function UploadCard(props: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-border-default bg-background-default p-5">{props.children}</div>;
}

function UploadGridCards(props: {
  invoiceBind: InvoiceFieldBinding;
  uploads: UploadPanelState;
  setUploads: React.Dispatch<React.SetStateAction<UploadPanelState>>;
}) {
  const { invoiceBind, uploads, setUploads } = props;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UploadCard>
        <InputFileInput id="upload-single-input" label="Manifest Pengiriman Kolektif (CSV)" required buttonText="Pilih CSV" placeholder="Belum ada file manifest dipilih" fileName={invoiceBind.value} value={invoiceBind.value} error={invoiceBind.error} errorMessage={invoiceBind.errorMessage} hint={(name) => (name ? `Terhubung ke form.bindField('invoiceFile'): ${name}` : 'Format .csv atau .xlsx maksimal 5 MB')} onFileNameChange={(name) => invoiceBind.onValueChange(name)} onBlur={invoiceBind.onBlur} />
      </UploadCard>
      <UploadCard>
        <InputFileDropZone id="upload-dropzone" label="Perjanjian Kerjasama & SLA Ekspedisi" primaryText="Tarik & lepas dokumen kontrak atau" browseText="pilih dari komputer" supportingText="PDF atau DOCX maksimal 10 MB" fileName={uploads.dropzoneFileName} fileMetadata={uploads.dropzoneMeta} hint={(name) => (name ? `Siap diunggah: ${name}` : 'Wajib melampirkan dokumen legal merchant')} onFileNameChange={(name) => setUploads((s) => ({ ...s, dropzoneFileName: name, dropzoneMeta: 'Baru dipilih • Menunggu verifikasi' }))} onRemove={() => setUploads((s) => ({ ...s, dropzoneFileName: '', dropzoneMeta: '' }))} />
      </UploadCard>
      <UploadCard>
        <InputImageUploader id="upload-image" label="Foto Fisik Paket & Label Resi" primaryText="Unggah foto kondisi kemasan paket" supportingText="PNG, JPG, WEBP hingga 5 MB" chooseText="Pilih Foto" replaceText="Ganti Foto" removeText="Hapus" fileName={uploads.imageName} imageSrc={uploads.imageSrc} hint={(name) => (name ? `Resolusi tervalidasi: ${name}` : 'Pastikan barcode resi terlihat tajam')} onFileNameChange={(name) => setUploads((s) => ({ ...s, imageName: name }))} onPreviewChange={(url) => setUploads((s) => ({ ...s, imageSrc: url }))} />
      </UploadCard>
      <UploadCard>
        <InputMultipleFileUpload id="upload-multiple" label="Lampiran Pendukung Klaim Asuransi" instruction="Unggah faktur pembelian dan bukti serah terima kurir" browseText="Tambah Dokumen" fileCount={(count) => `${count || uploads.multiFiles.length} berkas dalam antrean`} hint="Mendukung status uploading, completed, dan error per item.">
          {uploads.multiFiles.map((item) => (
            <InputMultipleFileUploadItem key={item.id} status={item.status} statusText={item.statusText} removeText="Hapus" onRemove={() => setUploads((s) => ({ ...s, multiFiles: s.multiFiles.filter((f) => f.id !== item.id) }))}>
              {item.name}
            </InputMultipleFileUploadItem>
          ))}
        </InputMultipleFileUpload>
      </UploadCard>
    </div>
  );
}

export function FormUploadsPanel(props: { invoiceBind: InvoiceFieldBinding }) {
  const [uploads, setUploads] = useState<UploadPanelState>(INITIAL_UPLOAD_STATE);
  const fileStateSnapshot = getFileState({
    fileName: uploads.dropzoneFileName,
    files: uploads.multiFiles,
    hint: (fn) => (fn ? `Berkas siap: ${fn}` : 'Belum ada berkas'),
    fileCount: (n) => `${n} lampiran aktif`,
  });

  const addSimulatedFile = () => {
    const nextIdx = uploads.multiFiles.length + 1;
    const entry: UploadItemEntry = {
      id: `f-${Date.now()}`, name: `dokumen-klaim-0${nextIdx}.pdf`,
      sizeLabel: '512 KB', status: 'completed', statusText: 'Completed (512 KB)',
    };
    setUploads((s) => ({ ...s, multiFiles: [...s.multiFiles, entry] }));
  };

  return (
    <div className="flex flex-col gap-6">
      <UploadSuiteHeader
        countLabel={fileStateSnapshot.resolvedFileCount}
        onAddSimulated={addSimulatedFile}
        onResetUploads={() => {
          setUploads(INITIAL_UPLOAD_STATE);
          props.invoiceBind.onValueChange('manifest-pengiriman-nov2026.csv');
        }}
      />
      <UploadGridCards invoiceBind={props.invoiceBind} uploads={uploads} setUploads={setUploads} />
    </div>
  );
}
