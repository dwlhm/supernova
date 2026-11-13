import type { FloatingPlacement } from '@komerce-design/react';

export interface FlowsSnippetOptions {
  fabPlacement: FloatingPlacement;
  stepperOrientation: 'horizontal' | 'vertical';
  currentStep: number;
}

function buildFlowsImportsAndSteps(): string {
  return [
    `import React, { useState } from 'react';`,
    `import {`,
    `  FAB, ToggleGroup, Toggle, Stepper, StepperItem, StepperIndicator,`,
    `  BubbleChat, BubbleChatMedia, BubbleChatFile, BubbleChatFooter,`,
    `  FLOATING_PLACEMENTS, parseFloatingPlacement, getStepperStepState, handleGroupKeyDown,`,
    `  type FloatingPlacement,`,
    `} from '@komerce-design/react';`,
    ``,
    `const STEPS = [`,
    `  { title: 'Order Dibuat', subtitle: 'Validasi alamat & COD' },`,
    `  { title: 'Pickup Kurir', subtitle: 'Scan manifest merchant' },`,
    `  { title: 'Sorting Hub', subtitle: 'Transit hub antar-kota' },`,
    `  { title: 'Delivered', subtitle: 'Diterima pembeli' },`,
    `];`,
  ].join('\n');
}

function buildStepperAndChatJsx(): string {
  return [
    `      <Stepper orientation={orientation} ariaLabel="Shipment Progress">`,
    `        {STEPS.map((step, i) => {`,
    `          const idx = i + 1;`,
    `          const st = getStepperStepState(idx, currentStep, STEPS.length);`,
    `          const status = st.isCompleted ? 'completed' : st.isCurrent ? 'active' : 'upcoming';`,
    `          return (`,
    `            <StepperItem key={step.title} index={idx} status={status} orientation={orientation} isLast={st.isLast} onClick={() => setCurrentStep(idx)}>`,
    `              <span>{step.title}</span>`,
    `            </StepperItem>`,
    `          );`,
    `        })}`,
    `      </Stepper>`,
    `      <div className="flex items-center gap-2"><StepperIndicator index={1} status="completed" /><StepperIndicator index={2} status="active" /></div>`,
    `      <BubbleChat direction="incoming">`,
    `        <BubbleChatFile>manifest-pickup.pdf</BubbleChatFile>`,
    `        <BubbleChatMedia kind="image">Foto Bukti Pickup</BubbleChatMedia>`,
    `        <p>Posisi FAB aktif: {parsed.vertical} / {parsed.horizontal}</p>`,
    `        <BubbleChatFooter align="end">14:05 WIB</BubbleChatFooter>`,
    `      </BubbleChat>`,
  ].join('\n');
}

export function buildFlowsCodeSnippet(opts: FlowsSnippetOptions): string {
  const header = buildFlowsImportsAndSteps();
  const midJsx = buildStepperAndChatJsx();
  const body = [
    `export function InteractiveShipmentFlows() {`,
    `  const [placement, setPlacement] = useState<FloatingPlacement>('${opts.fabPlacement}');`,
    `  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('${opts.stepperOrientation}');`,
    `  const [currentStep, setCurrentStep] = useState(${opts.currentStep});`,
    `  const [filter, setFilter] = useState<'all' | 'cod' | 'reg'>('all');`,
    `  const parsed = parseFloatingPlacement(placement);`,
    ``,
    `  return (`,
    `    <div className="flex flex-col gap-6">`,
    `      <div className="flex flex-wrap gap-2" onKeyDown={(e) => handleGroupKeyDown(e as unknown as { key?: string })}>`,
    `        <ToggleGroup size="small" ariaLabel="Filter Tipe Order">`,
    `          {(['all', 'cod', 'reg'] as const).map((m) => (`,
    `            <Toggle key={m} size="small" pressed={filter === m} onClick={() => setFilter(m)}>{m.toUpperCase()}</Toggle>`,
    `          ))}`,
    `        </ToggleGroup>`,
    `      </div>`,
    midJsx,
    `      <FAB variant="primary" size="extended" placement={placement} onClick={() => setPlacement(FLOATING_PLACEMENTS[0]!)}>`,
    `        Quick Dispatch ({placement})`,
    `      </FAB>`,
    `    </div>`,
    `  );`,
    `}`,
  ].join('\n');
  return `${header}\n\n${body}`;
}
