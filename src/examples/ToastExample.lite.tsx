import { For, Show, useStore } from '@builder.io/mitosis';
import Toast from '../components/Toast.lite';
import ToastViewport from '../components/ToastViewport.lite';

interface ToastDemoItem {
  id: string;
  type: 'default' | 'success' | 'error' | 'warning' | 'info';
  title: string;
  description: string;
  duration: number;
  timestamp: string;
}

export default function ToastExample() {
  const state = useStore({
    seq: 4,
    items: [
      { id: 't-1', type: 'success', title: 'Manifest ORD-401 Tersinkronisasi', description: 'Geser kartu ke samping (drag) atau tunggu 5 detik untuk auto-dismiss.', duration: 5000, timestamp: 'Baru saja' },
      { id: 't-2', type: 'info', title: 'Kurir Menuju Gudang Sortir', description: 'Toast persistent (duration=0) tetap aktif hingga di-dismiss.', duration: 0, timestamp: '1m lalu' },
      { id: 't-3', type: 'warning', title: 'Kapasitas Rak Hampir Penuh', description: 'Klik "+ Burst 4 Toast" di atas untuk menguji scroll daftar aktif.', duration: 0, timestamp: '2m lalu' },
    ] as ToastDemoItem[],
    removeItem(id: string) { state.items = state.items.filter((item) => item.id !== id); },
    addTimed() {
      state.seq = state.seq + 1;
      state.items = [{ id: 't-' + String(state.seq), type: 'success', title: 'Auto-Dismiss ORD-' + String(state.seq) + ' (3.5s)', description: 'Akan tertutup sendiri dalam 3.5 detik (jeda saat hover/drag).', duration: 3500, timestamp: '3.5s' }, ...state.items];
    },
    burstScrollable() {
      const types: Array<'info' | 'success' | 'warning' | 'error'> = ['info', 'success', 'warning', 'error'];
      const batch: ToastDemoItem[] = [0, 1, 2, 3].map((idx) => {
        state.seq = state.seq + 1;
        return { id: 't-' + String(state.seq), type: types[idx] || 'info', title: 'Antrean Paket ORD-' + String(state.seq), description: 'Scroll daftar aktif atau drag mouse ke kanan/kiri untuk dismiss.', duration: idx % 2 === 0 ? 6000 : 0, timestamp: idx % 2 === 0 ? '6s' : 'Tetap' };
      });
      state.items = [...batch, ...state.items];
    },
  });

  return (
    <div class="flex w-full flex-col gap-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xs font-medium text-foreground-muted">Aktif: {state.items.length} toast (scroll &amp; drag mouse untuk dismiss)</span>
        <div class="flex flex-wrap items-center gap-1.5">
          <button type="button" class="cursor-pointer rounded-md bg-primary-default px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary-hover" onClick={() => state.addTimed()}>+ Timed (3.5s)</button>
          <button type="button" class="cursor-pointer rounded-md border border-border-default bg-background-default px-2.5 py-1 text-xs font-medium text-foreground-default hover:bg-background-muted" onClick={() => state.burstScrollable()}>+ Burst 4 Toast</button>
          <Show when={state.items.length > 0}>
            <button type="button" class="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-foreground-muted hover:bg-background-muted hover:text-foreground-default" onClick={() => { state.items = []; }}>Clear</button>
          </Show>
        </div>
      </div>
      <ToastViewport inline={true} expanded={true} scrollable={true} placement="top-right" className="max-h-60 max-w-none">
        <Show when={state.items.length === 0}>
          <div class="flex w-full items-center justify-center py-8 text-xs text-foreground-muted">Tidak ada toast aktif. Klik tombol di atas untuk memicu notifikasi.</div>
        </Show>
        <For each={state.items}>
          {(item) => (
            <Toast
              key={item.id} id={item.id} open={true}
              type={item.type === 'success' ? 'success' : item.type === 'error' ? 'error' : item.type === 'warning' ? 'warning' : item.type === 'info' ? 'info' : 'default'}
              placement="inline"
              title={item.title} description={item.description} showDescription={true}
              showClose={true} timestamp={item.timestamp} showTimestamp={true}
              duration={item.duration} draggable={true} swipeThreshold={72}
              onClose={() => state.removeItem(item.id)}
            />
          )}
        </For>
      </ToastViewport>
    </div>
  );
}
