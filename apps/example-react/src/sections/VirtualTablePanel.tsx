import React, { useRef, useState } from 'react';
import { Badge, Button, getVirtualWindow } from '@komerce-design/react';

const TOTAL_VIRTUAL_ROWS = 10_000;
const VIEWPORT_HEIGHT = 384;
const JUMP_TARGETS = [0, 2500, 7500, 9990] as const;
const CITIES = ['Jakarta Selatan', 'Bandung', 'Surabaya', 'Medan', 'Semarang', 'Yogyakarta', 'Makassar', 'Denpasar'];
const COURIERS = ['SiCepat BEST', 'JNE Reguler', 'J&T Express', 'SAP Cargo'];
const STATUSES: Array<{ label: string; variant: 'success' | 'info' | 'warning' }> = [
  { label: 'Delivered', variant: 'success' },
  { label: 'In Transit', variant: 'info' },
  { label: 'Sorting Hub', variant: 'warning' },
];

function VirtualStreamToolbar(props: {
  rowHeight: 36 | 48; scrollTop: number; activeJump: number | null;
  renderedCount: number; startIndex: number; endIndex: number;
  onRowHeightChange: (next: 36 | 48) => void; onJumpToRow: (rowIndex: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-default bg-background-subtle p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">O(1) Window Slicing</Badge>
          <span className="text-sm font-semibold text-foreground-default">
            Merender {props.renderedCount} node DOM aktif (baris #{props.startIndex.toLocaleString('id-ID')}–#{Math.max(0, props.endIndex - 1).toLocaleString('id-ID')}) dari 10.000 baris
          </span>
        </div>
        <Badge variant="outline">scrollTop: {Math.round(props.scrollTop).toLocaleString('id-ID')}px</Badge>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-default/70">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-foreground-muted mr-1">Lompat Instan:</span>
          {JUMP_TARGETS.map((idx) => (
            <Button key={idx} size="small" variant={props.activeJump === idx ? 'primary' : 'outline'} onClick={() => props.onJumpToRow(idx)}>
              Row #{idx.toLocaleString('id-ID')}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-foreground-muted mr-1">Tinggi Baris:</span>
          {([36, 48] as const).map((h) => (
            <Button key={h} size="small" variant={props.rowHeight === h ? 'primary' : 'outline'} onClick={() => props.onRowHeightChange(h)}>
              {h}px
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function VirtualStreamRow(props: { index: number; size: number; highlighted: boolean }) {
  const st = STATUSES[props.index % STATUSES.length]!;
  const rowCls = props.highlighted ? 'bg-primary-subtle/40 font-medium' : 'hover:bg-background-subtle/60';
  return (
    <div style={{ height: props.size }} className={`grid grid-cols-12 items-center gap-3 border-b border-border-default/60 px-5 transition-colors ${rowCls}`}>
      <span className="col-span-2 font-mono text-xs text-foreground-default">#{props.index.toLocaleString('id-ID')} • AWB-{100000 + props.index}</span>
      <span className="col-span-4 truncate text-foreground-default">Merchant #{(props.index % 450) + 1} — {CITIES[props.index % CITIES.length]}</span>
      <span className="col-span-2 truncate text-xs text-foreground-muted">{COURIERS[props.index % COURIERS.length]} • Hub {(props.index % 18) + 1}</span>
      <span className="col-span-2"><Badge variant={st.variant}>{st.label}</Badge></span>
      <span className="col-span-2 text-right font-mono font-medium tabular-nums text-foreground-default">Rp {(((props.index % 40) + 3) * 65000).toLocaleString('id-ID')}</span>
    </div>
  );
}

export function VirtualTablePanel() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [rowHeight, setRowHeight] = useState<36 | 48>(48);
  const [activeJump, setActiveJump] = useState<number | null>(0);
  const win = getVirtualWindow({ totalItems: TOTAL_VIRTUAL_ROWS, itemHeight: rowHeight, containerHeight: VIEWPORT_HEIGHT, scrollTop, overscan: 4 });

  const jumpToRow = (targetRow: number, height = rowHeight) => {
    const nextTop = Math.min(Math.max(0, TOTAL_VIRTUAL_ROWS * height - VIEWPORT_HEIGHT), targetRow * height);
    if (scrollRef.current) scrollRef.current.scrollTop = nextTop;
    setScrollTop(nextTop);
    setActiveJump(targetRow);
  };

  const handleHeightChange = (nextHeight: 36 | 48) => {
    const anchorRow = Math.floor(scrollTop / rowHeight);
    setRowHeight(nextHeight);
    jumpToRow(anchorRow, nextHeight);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <VirtualStreamToolbar rowHeight={rowHeight} scrollTop={scrollTop} activeJump={activeJump} renderedCount={win.virtualItems.length} startIndex={win.startIndex} endIndex={win.endIndex} onRowHeightChange={handleHeightChange} onJumpToRow={(idx) => jumpToRow(idx)} />
      <div className="overflow-hidden rounded-xl border border-border-default bg-background-default">
        <div className="grid grid-cols-12 gap-3 border-b border-border-default bg-background-subtle px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
          <span className="col-span-2">Baris / Resi</span><span className="col-span-4">Tujuan Pengiriman</span><span className="col-span-2">Ekspedisi &amp; Hub</span><span className="col-span-2">Status</span><span className="col-span-2 text-right">Nilai COD</span>
        </div>
        <div ref={scrollRef} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)} style={{ height: VIEWPORT_HEIGHT }} className="overflow-y-auto text-sm">
          <div style={{ paddingTop: win.paddingTop, paddingBottom: win.paddingBottom }}>
            {win.virtualItems.map((item) => (
              <VirtualStreamRow key={item.index} index={item.index} size={item.size} highlighted={activeJump === item.index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
