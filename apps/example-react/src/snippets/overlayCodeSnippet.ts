import type { FloatingPlacement, OverlayToastType } from '@komerce-design/react';

export interface OverlaySnippetOptions {
  placement: FloatingPlacement;
  toastType: OverlayToastType;
  expanded: boolean;
  duration: number;
  showDescription: boolean;
  showAction: boolean;
  showClose: boolean;
}

const HEADER_TEMPLATE = `import React, { useMemo, useState, useSyncExternalStore } from 'react';
import {
  AlertDialog, Button, FLOATING_PLACEMENTS, IconTruckDelivery, Progressbar,
  Toast, ToastViewport, computeDeckOffset, computeStackOffset, computeStackTrackHeight,
  createOverlayController, groupByKey, parseFloatingPlacement, type FloatingPlacement,
} from '@komerce-design/react';`;

function buildTriggerBlock(opts: OverlaySnippetOptions): string {
  return `      <Button
        onClick={() => {
          overlay.setToastPlacement('${opts.placement}', true);
          overlay.notify({
            type: '${opts.toastType}',
            placement: '${opts.placement}',
            title: 'Manifest Gudang Tersinkronisasi',
            description: 'Resi pengiriman otomatis diteruskan ke mitra ekspedisi.',
            duration: ${opts.duration},
            showDescription: ${opts.showDescription},
            showAction: ${opts.showAction},
            actionText: 'Undo',
            showClose: ${opts.showClose},
            onAction: () => overlay.info('Undo Berhasil', { placement: '${opts.placement}' }),
          });
        }}
      >
        Trigger Toast (${opts.placement})
      </Button>`;
}

function buildViewportLoop(expanded: boolean): string {
  return `      {FLOATING_PLACEMENTS.map((pos: FloatingPlacement) => {
        const items = grouped[pos];
        if (!items?.length) return null;
        const { vertical } = parseFloatingPlacement(pos);
        const heights = items.map((t) => (t.showDescription || t.meta ? 84 : 52));
        const trackH = computeStackTrackHeight(heights, expanded, 10, 10);
        const viewportH = expanded ? Math.min(trackH + 8, 380) : trackH;
        return (
          <ToastViewport key={pos} placement={pos} expanded={expanded} scrollable={expanded}
            inlineStyle={{ height: \`\${viewportH}px\` }}
            onMouseEnter={() => { setExpanded(true); overlay.pauseToast(); }}
            onMouseLeave={() => { setExpanded(${expanded}); overlay.resumeToast(); }}>
            <div className="relative w-full shrink-0" style={{ height: \`\${trackH}px\` }}>
              {items.map((entry, slot) => {
                const off = expanded ? computeStackOffset(slot, heights, vertical, 10) : computeDeckOffset(slot, vertical, 10);
                return (
                  <Toast key={entry.id} open type={entry.type} placement="inline"
                    title={entry.title} description={entry.description}
                    showDescription={entry.showDescription} showAction={entry.showAction} showClose={entry.showClose}
                    draggable swipeThreshold={80} icon={IconTruckDelivery} onClose={() => overlay.dismissToast(entry.id)}
                    inlineStyle={{ position: 'absolute', left: '0px', right: '0px', [vertical === 'bottom' ? 'bottom' : 'top']: '0px',
                      transform: \`translate3d(0, \${off.offsetY}px, 0)\`, zIndex: String(off.zIndex) }}>
                    {typeof entry.meta?.progress === 'number' && (
                      <Progressbar value={Number(entry.meta.progress)} showLabel label="Upload Manifest" />
                    )}
                  </Toast>
                );
              })}
            </div>
          </ToastViewport>
        );
      })}`;
}

export function buildOverlayCodeSnippet(opts: OverlaySnippetOptions): string {
  return `${HEADER_TEMPLATE}

export function ShipmentOverlayDemo() {
  const [expanded, setExpanded] = useState(${opts.expanded});
  const overlay = useMemo(() => createOverlayController({
    defaultPlacement: '${opts.placement}',
    defaultDuration: ${opts.duration},
    maxToasts: 20,
  }), []);

  const queue = useSyncExternalStore(overlay.subscribeToastQueue, overlay.getToastQueueSnapshot, overlay.getToastQueueSnapshot);
  useSyncExternalStore(overlay.subscribeDialog, overlay.getDialogSnapshot, overlay.getDialogSnapshot);

  const grouped = groupByKey(queue, (entry) => entry.placement);

  const handleConfirmDelete = async () => {
    const approved = await overlay.confirm({
      heading: 'Hapus Batch Manifest?',
      description: 'Tindakan ini akan membatalkan seluruh resi yang belum diproses kurir.',
      destructive: true, confirmLabel: 'Ya, Hapus Permanen', cancelLabel: 'Batal',
    });
    if (approved) overlay.success('Batch Manifest Dihapus', { placement: '${opts.placement}' });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
${buildTriggerBlock(opts)}
      <Button variant="secondary" onClick={() => void overlay.promise(
        () => new Promise<{ synced: number }>((r) => setTimeout(() => r({ synced: 128 }), 1100)),
        { loading: 'Menyinkronkan resi...', success: (res) => \`\${res.synced} resi tersinkronisasi\`, placement: '${opts.placement}' }
      )}>
        Sync via overlay.promise()
      </Button>
      <Button variant="destructive" onClick={() => void handleConfirmDelete()}>Konfirmasi Hapus</Button>
${buildViewportLoop(opts.expanded)}
      <AlertDialog {...overlay.bindDialog()} />
    </div>
  );
}`;
}
