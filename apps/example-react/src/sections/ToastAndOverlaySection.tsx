import React, { useState } from 'react';
import {
  AlertDialog, Badge, Button, Checkbox, FLOATING_PLACEMENTS, IconTruckDelivery,
  Progressbar, SwitchButton, Toast, ToastViewport, Tooltip, parseFloatingPlacement,
  type FloatingPlacement, type OverlayToastType,
} from '@komerce-design/react';
import type { OverlayInstance, RichToastMeta } from '../OverlayHosts';
import { CodeShowcaseCard } from '../components/CodeShowcaseCard';
import { buildOverlayCodeSnippet } from '../snippets/overlayCodeSnippet';

interface StudioConfig {
  placement: FloatingPlacement; toastType: OverlayToastType; duration: number;
  showDescription: boolean; showAction: boolean; showClose: boolean; showTimestamp: boolean;
}

const TOAST_TYPES: readonly OverlayToastType[] = ['default', 'info', 'success', 'warning', 'error'];
const DURATIONS = [{ ms: 2500, label: '2500ms' }, { ms: 4500, label: '4500ms' }, { ms: 0, label: '0ms Persistent' }] as const;
const TOOLTIP_POSITIONS = ['top', 'bottom', 'left', 'right'] as const;

function PlacementScreenGrid(props: { placement: FloatingPlacement; onSelect: (pos: FloatingPlacement) => void }) {
  const parsed = parseFloatingPlacement(props.placement);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Screen Placement Grid (FLOATING_PLACEMENTS)</span>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline">vertical: {parsed.vertical}</Badge>
          <Badge variant="outline">horizontal: {parsed.horizontal}</Badge>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 rounded-xl border border-border-default bg-background-subtle p-4">
        {FLOATING_PLACEMENTS.map((pos) => {
          const active = props.placement === pos;
          return (
            <button
              key={pos} type="button" onClick={() => props.onSelect(pos)}
              className={`flex h-14 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border px-3 text-xs font-semibold transition-all ${
                active ? 'border-primary-default bg-primary-subtle text-primary-subtle-foreground shadow-xs'
                  : 'border-border-default bg-background-default text-foreground-muted hover:border-primary-default/50 hover:text-foreground-default'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${active ? 'bg-primary-default' : 'bg-foreground-subtle'}`} />
              <span>{pos}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StudioControlsGrid(props: {
  cfg: StudioConfig; forceExpanded: boolean;
  onForceExpandedChange: (expanded: boolean) => void; onPatch: (patch: Partial<StudioConfig>) => void;
}) {
  const { cfg } = props;
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-foreground-muted">Semantic Type</span>
          <div className="flex flex-wrap gap-2">
            {TOAST_TYPES.map((t) => <Button key={t} size="small" variant={cfg.toastType === t ? 'primary' : 'outline'} onClick={() => props.onPatch({ toastType: t })}>{t}</Button>)}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-foreground-muted">Auto-Dismiss Duration</span>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => <Button key={d.ms} size="small" variant={cfg.duration === d.ms ? 'secondary' : 'outline'} onClick={() => props.onPatch({ duration: d.ms })}>{d.label}</Button>)}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border-default bg-background-subtle p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground-default">Stack Layout Mode</span>
            <span className="text-xs text-foreground-muted">{props.forceExpanded ? 'Expanded & Scrollable Stack (Drag to dismiss)' : 'Collapsed 3D Deck (Hover expands & scrolls)'}</span>
          </div>
          <SwitchButton checked={props.forceExpanded} onCheckedChange={props.onForceExpandedChange}>Expanded</SwitchButton>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <Checkbox checked={cfg.showDescription} onCheckedChange={(v) => props.onPatch({ showDescription: v })}>Description</Checkbox>
          <Checkbox checked={cfg.showAction} onCheckedChange={(v) => props.onPatch({ showAction: v })}>Action ("Undo")</Checkbox>
          <Checkbox checked={cfg.showClose} onCheckedChange={(v) => props.onPatch({ showClose: v })}>Close Button</Checkbox>
          <Checkbox checked={cfg.showTimestamp} onCheckedChange={(v) => props.onPatch({ showTimestamp: v })}>Timestamp</Checkbox>
        </div>
      </div>
    </div>
  );
}

function StudioActionBar(props: { cfg: StudioConfig; overlay: OverlayInstance }) {
  const { cfg, overlay } = props;
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-border-default pt-5">
      <Button onClick={() => overlay.notify({
        type: cfg.toastType, placement: cfg.placement, title: `Notifikasi Pengiriman (${cfg.toastType})`,
        description: 'Paket telah melewati pemindaian hub sortir regional.', duration: cfg.duration,
        showDescription: cfg.showDescription, showAction: cfg.showAction, actionText: 'Undo',
        showClose: cfg.showClose, showTimestamp: cfg.showTimestamp, onAction: () => overlay.info('Undo Berhasil', { placement: cfg.placement }),
      })}>Trigger Toast</Button>
      <Button variant="secondary" onClick={() => (['info', 'success', 'warning', 'error', 'default', 'info'] as const).forEach((type, idx) =>
        overlay.notify({
          type, placement: cfg.placement,
          duration: idx % 2 === 0 ? (cfg.duration || 4500) + idx * 600 : 0,
          showDescription: true, showClose: true,
          title: `Manifest Batch #${idx + 1} (${type})`,
          description: idx % 2 === 0 ? `Auto-dismiss pada titik ${cfg.placement} atau drag mouse untuk dismiss.` : `Persistent (0ms) — scroll daftar aktif untuk melihat seluruh antrean.`,
        })
      )}>Burst 6 Scrollable Toasts</Button>
      <Button variant="outline" onClick={() => void overlay.promise(
        () => new Promise<{ synced: number }>((resolve) => setTimeout(() => resolve({ synced: 142 }), 1100)),
        { loading: 'Menyinkronkan API ekspedisi...', success: (d) => `${d.synced} resi tersinkronisasi!`, description: 'Sinkronisasi real-time gudang utama.', placement: cfg.placement }
      )}>Async overlay.promise()</Button>
      <Button variant="outline" onClick={() => {
        overlay.info('Hub Barat Aktif (top-left)', { placement: 'top-left', description: 'Region independen via groupByKey.' });
        overlay.success('Hub Pusat Siap (bottom-center)', { placement: 'bottom-center', description: 'Multi-viewport aktif bersamaan.' });
      }}>Multi-Corner Broadcast</Button>
      <Button variant="outline" onClick={() => overlay.notify({
        type: 'info', placement: cfg.placement, title: 'Mengunggah Dokumen Kargo', description: 'Komposisi terbuka dengan {children} & <Progressbar />.',
        showDescription: true, showClose: true, duration: 6000, meta: { progress: 76, progressLabel: 'Upload Manifest Gudang', customIcon: 'truck' } satisfies RichToastMeta,
      })}>Rich Custom Toast</Button>
      <Button variant="ghost" onClick={() => overlay.dismissAllToasts()}>Dismiss All</Button>
    </div>
  );
}

function ImperativeDialogCard(props: { overlay: OverlayInstance }) {
  const [confirmResult, setConfirmResult] = useState<'idle' | 'confirmed' | 'cancelled'>('idle');
  const runDestructiveConfirm = async () => {
    const ok = await props.overlay.confirm({
      heading: 'Hapus Batch Manifest?', description: 'Seluruh 48 resi dalam batch ini akan dibatalkan secara permanen dari jadwal penjemputan kurir.',
      destructive: true, confirmLabel: 'Ya, Hapus Permanen', cancelLabel: 'Batal',
    });
    setConfirmResult(ok ? 'confirmed' : 'cancelled');
  };
  return (
    <div className="flex flex-col justify-between gap-5 rounded-2xl border border-border-default bg-background-default p-6 shadow-xs lg:p-7">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-foreground-default">Imperative AlertDialog</h2>
          <Badge variant={confirmResult === 'confirmed' ? 'destructive' : confirmResult === 'cancelled' ? 'secondary' : 'outline'}>
            confirm(): {confirmResult === 'idle' ? 'Belum dipicu' : confirmResult === 'confirmed' ? 'true (Dihapus)' : 'false (Batal)'}
          </Badge>
        </div>
        <p className="text-sm text-foreground-muted">Panggil dialog konfirmasi secara async via Promise tanpa state boilerplate lokal.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => props.overlay.openDialog({
          heading: 'Sinkronisasi Jadwal Pickup', description: 'Kirim notifikasi penjemputan ke 12 armada kurir sekarang?',
          destructive: false, confirmLabel: 'Kirim Jadwal', cancelLabel: 'Nanti', onConfirm: () => { props.overlay.success('Jadwal Terkirim'); },
        })}>
          overlay.openDialog()
        </Button>
        <Button variant="destructive" onClick={() => void runDestructiveConfirm()}>await overlay.confirm()</Button>
      </div>
      <AlertDialog inline open heading="Preview Anatomi AlertDialog" description="Mode inline merender struktur dialog langsung di dalam kartu dokumentasi." confirmLabel="Konfirmasi" cancelLabel="Batal" showCloseButton={false} className="shadow-xs" />
    </div>
  );
}

function TooltipShowcaseCard() {
  const [trigger, setTrigger] = useState<'hover' | 'click'>('hover');
  return (
    <div className="flex flex-col justify-between gap-5 rounded-2xl border border-border-default bg-background-default p-6 shadow-xs lg:p-7">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-bold text-foreground-default">Tooltip 4-Arah & Trigger</h2>
          <p className="text-sm text-foreground-muted">Uji posisi top, bottom, left, right dengan pemicu hover atau click.</p>
        </div>
        <SwitchButton checked={trigger === 'click'} onCheckedChange={(c) => setTrigger(c ? 'click' : 'hover')}>Click Mode</SwitchButton>
      </div>
      <div className="grid grid-cols-2 place-items-center gap-6 rounded-xl border border-dashed border-border-default bg-background-subtle px-6 py-10">
        {TOOLTIP_POSITIONS.map((pos) => (
          <Tooltip key={pos} id={`tt-${pos}`} position={pos} trigger={trigger} text={`Tooltip ${pos} (${trigger})`}>
            <Button variant="outline" size="small">{pos.toUpperCase()}</Button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

export function ToastAndOverlaySection(props: {
  overlay: OverlayInstance;
  forceExpanded: boolean;
  onForceExpandedChange: (expanded: boolean) => void;
}) {
  const [cfg, setCfg] = useState<StudioConfig>({
    placement: props.overlay.getToastPlacement(), toastType: 'info', duration: 4500,
    showDescription: true, showAction: true, showClose: true, showTimestamp: true,
  });
  const patchCfg = (patch: Partial<StudioConfig>) => setCfg((prev) => ({ ...prev, ...patch }));

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-2xl border border-border-default bg-background-default p-6 shadow-xs lg:p-7">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-foreground-default">Interactive Toast Placement & Stack Studio</h2>
          <p className="text-sm text-foreground-muted">Klik titik layar untuk memindahkan toast aktif secara real-time, lalu uji 3D deck vs expanded stack.</p>
        </div>
        <PlacementScreenGrid placement={cfg.placement} onSelect={(pos) => { props.overlay.setToastPlacement(pos, true); patchCfg({ placement: pos }); }} />
        <StudioControlsGrid cfg={cfg} forceExpanded={props.forceExpanded} onForceExpandedChange={props.onForceExpandedChange} onPatch={patchCfg} />
        <StudioActionBar cfg={cfg} overlay={props.overlay} />
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-foreground-muted">Live Inline Anatomy Preview ({cfg.placement})</span>
          <ToastViewport inline placement={cfg.placement} className="max-w-none rounded-xl border border-dashed border-border-default bg-background-subtle p-4">
            <Toast open type={cfg.toastType} title={`Preview Anatomi Toast (${cfg.toastType})`} description="Komponen terbuka mendukung kustomisasi ikon, aksi, dan children." showDescription={cfg.showDescription} showAction={cfg.showAction} actionText="Undo" showClose={cfg.showClose} timestamp="Baru saja" showTimestamp={cfg.showTimestamp} icon={IconTruckDelivery}>
              <div className="mt-1.5 w-full"><Progressbar value={76} showLabel label="Upload Manifest Gudang" /></div>
            </Toast>
          </ToastViewport>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ImperativeDialogCard overlay={props.overlay} />
        <TooltipShowcaseCard />
      </section>
      <CodeShowcaseCard
        title="Composable Overlay Controller & Multi-Viewport Toast"
        description="Kode mandiri yang dapat langsung disalin untuk merakit 6-corner ToastViewport, kalkulasi offset 3D deck, dan imperative AlertDialog."
        helpers={['createOverlayController', 'parseFloatingPlacement', 'computeDeckOffset', 'computeStackOffset', 'computeStackTrackHeight', 'groupByKey']}
        code={buildOverlayCodeSnippet({ placement: cfg.placement, toastType: cfg.toastType, expanded: props.forceExpanded, duration: cfg.duration, showDescription: cfg.showDescription, showAction: cfg.showAction, showClose: cfg.showClose })}
      />
    </div>
  );
}
