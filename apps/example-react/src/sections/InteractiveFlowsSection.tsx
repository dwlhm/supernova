import React, { useState } from 'react';
import {
  Badge, BubbleChat, BubbleChatFile, BubbleChatFooter, BubbleChatMedia,
  Button, FAB, IconPlaceholder, IconTruckDelivery, InputText, Spinner,
  Stepper, StepperConnector, StepperIndicator, StepperItem, Toggle, ToggleGroup, Tooltip,
  FLOATING_PLACEMENTS, buildCalendarPanel, createDialogState, createTabsState,
  createTooltipState, getStepperStepState, handleGroupKeyDown, parseDateInput,
  parseFloatingPlacement, type FloatingPlacement,
} from '@komerce-design/react';
import { CodeShowcaseCard } from '../components/CodeShowcaseCard';
import { buildFlowsCodeSnippet } from '../snippets/flowsCodeSnippet';

interface ChatMessage {
  id: string; direction: 'incoming' | 'outgoing'; text: string; time: string;
  attachment?: string; mediaLabel?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 'm-1', direction: 'incoming', text: 'Halo Admin Komerce, apakah resi #AWB-882910 sudah masuk manifest pickup sore ini?', time: '14:01 WIB', attachment: 'manifest-toko-berkah.pdf (312 KB)' },
  { id: 'm-2', direction: 'outgoing', text: 'Siap kak! Kurir SiCepat sudah scan pickup dan paket sedang menuju Hub Gudang Utama.', time: '14:03 WIB', mediaLabel: 'Foto Bukti Serah Terima Gudang' },
];

const SHIPMENT_STEPS = [
  { title: 'Order Dibuat', subtitle: 'Validasi alamat & COD' },
  { title: 'Pickup Kurir', subtitle: 'Scan manifest merchant' },
  { title: 'Sorting Hub', subtitle: 'Transit hub antar-kota' },
  { title: 'Delivered', subtitle: 'Diterima pembeli' },
];

const DATE_PRESETS = ['besok', '3 hari lagi', 'minggu depan', '17 agu 2026'] as const;

function FabPlacementStudio(props: { fabPlacement: FloatingPlacement; onFabPlacementChange: (p: FloatingPlacement) => void }) {
  const parsed = parseFloatingPlacement(props.fabPlacement);
  return (
    <div className="rounded-xl border border-border-default bg-background-default p-4 flex flex-col gap-3.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-default">Shared FloatingPlacement Engine</span>
          <h4 className="text-sm font-bold text-foreground-default">Live Viewport `&lt;FAB placement=&quot;{props.fabPlacement}&quot;&gt;` &amp; Inline Matrix</h4>
        </div>
        <code className="rounded-md border border-border-default bg-background-subtle px-2.5 py-1 font-mono text-xs text-foreground-default">
          parseFloatingPlacement(&apos;{props.fabPlacement}&apos;) → vertical: &apos;{parsed.vertical}&apos;, horizontal: &apos;{parsed.horizontal}&apos;
        </code>
      </div>
      <div className="flex flex-wrap gap-2">
        {FLOATING_PLACEMENTS.map((pos) => (
          <Button key={pos} size="small" variant={props.fabPlacement === pos ? 'primary' : 'outline'} onClick={() => props.onFabPlacementChange(pos)}>{pos}</Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-3">
        <div className="flex flex-wrap items-center gap-3">
          {(['small', 'regular', 'large', 'extended'] as const).map((sz) => (
            <FAB key={sz} placement="inline" size={sz} variant="primary" icon={sz === 'extended' ? IconTruckDelivery : undefined} ariaLabel={`FAB ${sz}`}>{sz === 'extended' ? 'Extended FAB' : undefined}</FAB>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {(['primary', 'secondary', 'outline'] as const).map((vr) => (
            <FAB key={vr} placement="inline" size="extended" variant={vr} ariaLabel={`FAB ${vr}`}>{vr}</FAB>
          ))}
        </div>
      </div>
    </div>
  );
}

function ButtonsAndTogglesCard(props: {
  fabPlacement: FloatingPlacement; onFabPlacementChange: (p: FloatingPlacement) => void;
  onNotify: (type: 'default' | 'success' | 'error' | 'warning' | 'info', title: string, desc: string) => void; onOpenDialog: () => void;
}) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'cod' | 'non-cod'>('all');
  const [pinned, setPinned] = useState(true);
  return (
    <div className="rounded-2xl border border-border-default bg-background-subtle p-6 flex flex-col gap-5">
      <FabPlacementStudio fabPlacement={props.fabPlacement} onFabPlacementChange={props.onFabPlacementChange} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const).map((v) => <Button key={v} variant={v} size="small" showLeftIcon={v === 'primary'} leftIcon={v === 'primary' ? IconTruckDelivery : undefined} onClick={() => props.onNotify('info', `Button (${v})`, `Varian "${v}" diklik.`)}>{v}</Button>)}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(['large', 'regular', 'small', 'mini'] as const).map((sz) => <Button key={sz} size={sz} variant="outline" roundness={sz === 'mini' ? 'round' : 'default'} rightIcon={IconPlaceholder} showRightIcon>{sz}</Button>)}
          <Button size="small" variant="destructive" onClick={props.onOpenDialog}>AlertDialog</Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-default pt-4">
        <div className="flex flex-wrap items-center gap-2.5" onKeyDown={(e) => handleGroupKeyDown(e as unknown as { key?: string })}>
          <ToggleGroup size="small" ariaLabel="Filter Tipe Order">{(['all', 'cod', 'non-cod'] as const).map((m) => <Toggle key={m} size="small" pressed={activeFilter === m} onClick={() => setActiveFilter(m)}>{m.toUpperCase()}</Toggle>)}</ToggleGroup>
          <Toggle size="small" pressed={pinned} onPressedChange={setPinned}>{pinned ? '📌 Pinned' : 'Pin Filter'}</Toggle>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {(['top', 'bottom', 'left', 'right'] as const).map((pos) => <Tooltip key={pos} text={`Tooltip posisi ${pos}`} position={pos} trigger="hover"><Badge variant="outline">Hover ({pos})</Badge></Tooltip>)}
          {(['12', '16', '24', '32'] as const).map((sz) => <Spinner key={sz} size={sz} ariaLabel={`Loading ${sz}px`} />)}
        </div>
      </div>
    </div>
  );
}

function StepperStudioCard(props: {
  orientation: 'horizontal' | 'vertical'; onOrientationChange: (o: 'horizontal' | 'vertical') => void;
  currentStep: number; onStepChange: (step: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-border-default bg-background-subtle p-6 flex flex-col justify-between gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-foreground-default">Interactive `Stepper` (`horizontal` | `vertical`)</h3>
          <p className="text-xs text-foreground-muted mt-0.5">Uji tata letak dua orientasi &amp; status via `getStepperStepState()`.</p>
        </div>
        <div className="flex items-center gap-1.5">
          {(['horizontal', 'vertical'] as const).map((ori) => <Button key={ori} size="mini" variant={props.orientation === ori ? 'primary' : 'outline'} onClick={() => props.onOrientationChange(ori)}>{ori}</Button>)}
        </div>
      </div>
      <div className="rounded-xl border border-border-default bg-background-default p-4 flex flex-col gap-3">
        <Stepper orientation={props.orientation} ariaLabel="Shipment Tracking Stepper">
          {SHIPMENT_STEPS.map((step, i) => {
            const idx = i + 1;
            const st = getStepperStepState(idx, props.currentStep, SHIPMENT_STEPS.length);
            const status = st.isCompleted ? 'completed' : st.isCurrent ? 'active' : 'upcoming';
            return (
              <StepperItem key={step.title} index={idx} status={status} orientation={props.orientation} isLast={st.isLast} onClick={() => props.onStepChange(idx)}>
                <span className="flex flex-col"><span className="text-xs font-semibold text-foreground-default">{step.title}</span><span className="text-[11px] text-foreground-muted">{step.subtitle}</span></span>
              </StepperItem>
            );
          })}
        </Stepper>
        <div className="flex items-center gap-2 border-t border-border-subtle pt-2.5 text-[11px] text-foreground-muted">
          <span>Standalone Indicator:</span>{(['completed', 'active', 'upcoming'] as const).map((st, i) => <StepperIndicator key={st} index={i + 1} status={st} />)}
          <div className="relative h-4 w-8"><StepperConnector status="completed" orientation="horizontal" /></div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border-default">
        <Button size="small" variant="outline" disabled={props.currentStep <= 1} onClick={() => props.onStepChange(Math.max(1, props.currentStep - 1))}>← Sebelumnya</Button>
        <Badge variant="primary">Step Aktif: {props.currentStep} / {SHIPMENT_STEPS.length}</Badge>
        <Button size="small" variant="primary" disabled={props.currentStep >= SHIPMENT_STEPS.length} onClick={() => props.onStepChange(Math.min(SHIPMENT_STEPS.length, props.currentStep + 1))}>Berikutnya →</Button>
      </div>
    </div>
  );
}

function BubbleChatThreadCard() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const sendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { id: `m-${Date.now()}`, direction: 'outgoing', text: draft.trim(), time: 'Baru saja' }]);
    setDraft('');
  };
  return (
    <div className="rounded-2xl border border-border-default bg-background-subtle p-6 flex flex-col justify-between gap-4">
      <div>
        <h3 className="text-sm font-bold text-foreground-default">Live `BubbleChat` Thread (`Media`, `File`, `Footer`)</h3>
        <p className="text-xs text-foreground-muted mt-0.5">Kirim balasan CS secara real-time di bawah.</p>
      </div>
      <div className="flex flex-col gap-3 max-h-60 overflow-y-auto rounded-xl border border-border-default bg-background-default p-4">
        {messages.map((msg) => (
          <BubbleChat key={msg.id} direction={msg.direction}>
            <div className="flex flex-col gap-1.5">
              {msg.mediaLabel && <BubbleChatMedia kind="image">{msg.mediaLabel}</BubbleChatMedia>}
              {msg.attachment && <BubbleChatFile>{msg.attachment}</BubbleChatFile>}
              <p className="text-xs leading-relaxed">{msg.text}</p>
              <BubbleChatFooter align="end"><span className="text-[10px] opacity-75">{msg.time}</span></BubbleChatFooter>
            </div>
          </BubbleChat>
        ))}
      </div>
      <form onSubmit={sendChat} className="flex items-end gap-2">
        <div className="flex-1"><InputText id="chat-draft" placeholder="Balas pesan tiket CS..." showLabel={false} showHint={false} value={draft} onValueChange={setDraft} /></div>
        <Button type="submit" size="regular" variant="primary">Kirim</Button>
      </form>
    </div>
  );
}

function DateAndAriaPrimitivesCard() {
  const [nlDateQuery, setNlDateQuery] = useState('3 hari lagi');
  const parsedDate = parseDateInput(nlDateQuery, 2026, 11);
  const calendarSample = buildCalendarPanel(parsedDate?.year ?? 2026, parsedDate?.month ?? 11);
  const dialogAria = createDialogState({ id: 'demo-dlg', open: true });
  const tabsAria = createTabsState({ tabs: [{ id: 't1' }, { id: 't2' }], activeId: 't1' });
  const tooltipAria = createTooltipState({ id: 'demo-tip' });
  return (
    <div className="rounded-2xl border border-border-default bg-background-subtle p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-5 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-foreground-default">Headless Natural-Language Date &amp; ARIA Primitives</h3>
        <InputText id="nl-date-tester" label="Uji `parseDateInput(query, 2026, 11)`" placeholder="Ketik tanggal natural..." hint="Mendukung ekspresi bahasa Indonesia & Inggris" value={nlDateQuery} onValueChange={setNlDateQuery} />
        <div className="flex flex-wrap gap-1.5">
          {DATE_PRESETS.map((preset) => (
            <Button key={preset} size="mini" variant={nlDateQuery === preset ? 'primary' : 'outline'} onClick={() => setNlDateQuery(preset)}>{preset}</Button>
          ))}
        </div>
      </div>
      <pre className="lg:col-span-7 max-h-48 overflow-auto rounded-xl border border-border-default bg-background-default p-4 font-mono text-[11px] leading-relaxed">
        {JSON.stringify({ parsedDate, calendarPanel: { monthLabel: calendarSample.monthLabel, totalCells: calendarSample.cells.length }, dialogAria: dialogAria.getContentProps(), tabsTrigger: tabsAria.getTabTriggerProps('t1'), tooltipContent: tooltipAria.getContentProps() }, null, 2)}
      </pre>
    </div>
  );
}

export function InteractiveFlowsSection(props: {
  fabPlacement: FloatingPlacement;
  onFabPlacementChange: (placement: FloatingPlacement) => void;
  onNotify: (type: 'default' | 'success' | 'error' | 'warning' | 'info', title: string, desc: string) => void;
  onOpenDialog: () => void;
}) {
  const [stepperOrientation, setStepperOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [currentStep, setCurrentStep] = useState(2);
  const snippet = buildFlowsCodeSnippet({ fabPlacement: props.fabPlacement, stepperOrientation, currentStep });

  return (
    <section className="flex flex-col gap-8">
      <ButtonsAndTogglesCard fabPlacement={props.fabPlacement} onFabPlacementChange={props.onFabPlacementChange} onNotify={props.onNotify} onOpenDialog={props.onOpenDialog} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StepperStudioCard orientation={stepperOrientation} onOrientationChange={setStepperOrientation} currentStep={currentStep} onStepChange={setCurrentStep} />
        <BubbleChatThreadCard />
      </div>
      <DateAndAriaPrimitivesCard />
      <CodeShowcaseCard title="Composable FAB Placement, Stepper & BubbleChat Recipe" description="Satu kontrak FloatingPlacement mentenagai ToastViewport sekaligus FAB, dipadukan dengan Stepper dua orientasi dan roving focus." helpers={['parseFloatingPlacement()', 'FLOATING_PLACEMENTS', 'getStepperStepState()', 'handleGroupKeyDown()']} code={snippet} />
    </section>
  );
}
