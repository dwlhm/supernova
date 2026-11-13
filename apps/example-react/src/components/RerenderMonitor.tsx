import React, { Profiler, useEffect, useRef, useState } from 'react';
import { Badge, Button } from '@komerce-design/react';

export interface RenderMetric {
  id: string;
  category: 'section' | 'field';
  commits: number;
  lastDurationMs: number;
  totalDurationMs: number;
  lastPhase: string;
  updatedAt: number;
}

const metricsMap = new Map<string, RenderMetric>();
const listeners = new Set<() => void>();
let notifyScheduled = false;

function scheduleNotify() {
  if (notifyScheduled) return;
  notifyScheduled = true;
  queueMicrotask(() => {
    notifyScheduled = false;
    listeners.forEach((fn) => fn());
  });
}

export function recordRenderCommit(
  id: string,
  category: 'section' | 'field',
  phase: string,
  actualDuration: number,
) {
  const prev = metricsMap.get(id);
  const dur = Number(actualDuration.toFixed(2));
  metricsMap.set(id, {
    id,
    category,
    commits: (prev?.commits ?? 0) + 1,
    lastDurationMs: dur,
    totalDurationMs: Number(((prev?.totalDurationMs ?? 0) + dur).toFixed(2)),
    lastPhase: phase,
    updatedAt: Date.now(),
  });
  scheduleNotify();
}

export function resetRenderMetrics() {
  metricsMap.clear();
  scheduleNotify();
}

export function useRenderCount(id: string, category: 'section' | 'field' = 'field'): number {
  const countRef = useRef(0);
  countRef.current += 1;
  useEffect(() => {
    recordRenderCommit(id, category, countRef.current === 1 ? 'mount' : 'update', 0.1);
  });
  return countRef.current;
}

export function ProfiledSection(props: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <Profiler
      id={props.id}
      onRender={(id, phase, actualDuration) => {
        recordRenderCommit(id, 'section', phase, actualDuration);
      }}
    >
      {props.children}
    </Profiler>
  );
}

export function RerenderMonitorBar() {
  const [, setTick] = useState(0);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const all = Array.from(metricsMap.values());
  const sections = all.filter((m) => m.category === 'section');
  const fields = all.filter((m) => m.category === 'field');
  const latest = all.reduce<RenderMetric | null>(
    (best, cur) => (!best || cur.updatedAt > best.updatedAt ? cur : best),
    null,
  );

  return (
    <div className="rounded-xl border border-border-default bg-background-subtle p-4 shadow-xs flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground-default">
            React 19 Live Re-render Monitor (`&lt;Profiler&gt;` &amp; `subscribeField`)
          </span>
          {latest && (
            <Badge variant="info">
              Last Commit: {latest.id} ({latest.lastPhase} • {latest.lastDurationMs}ms)
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button size="mini" variant="outline" onClick={() => resetRenderMetrics()}>
            Reset Counters
          </Button>
          <Button size="mini" variant="ghost" onClick={() => setExpanded((e) => !e)}>
            {expanded ? 'Sembunyikan Detail' : 'Lihat Detail'}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-1 border-t border-border-default">
          <div className="lg:col-span-5 flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-foreground-muted">
              Section Commits (buktikan mengetik di Form tidak me-rerender Table/Chart):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sections.map((sec) => (
                <div
                  key={sec.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border-default bg-background-default px-2.5 py-1 font-mono text-[11px]"
                >
                  <span className="font-semibold text-foreground-default">{sec.id}:</span>
                  <span className="text-primary-default font-bold">{sec.commits}x</span>
                  <span className="text-foreground-muted">({sec.lastDurationMs}ms)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-foreground-muted">
              Isolated Field Re-renders (`form.subscribeField` — hanya field yang diketik yang bertambah):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {fields.map((f) => (
                <div
                  key={f.id}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                    latest?.id === f.id
                      ? 'border-primary-default bg-primary-default/10 text-foreground-default'
                      : 'border-border-default bg-background-default text-foreground-muted'
                  }`}
                >
                  <span>{f.id}:</span>
                  <span className="font-bold text-primary-default">{f.commits}x</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
