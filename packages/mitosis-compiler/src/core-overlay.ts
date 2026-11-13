import { focusElementSafely, getNextRovingIndex, resolveId } from './core-a11y.js';
import { parseFloatingPlacement, type FloatingPlacement } from './core-floating.js';

export interface DialogStateOptions { id?: string; open?: boolean; showDescription?: boolean; onClose?: () => void }

export function createDialogState(options: DialogStateOptions = {}) {
  const baseId = resolveId(options.id, 'dialog');
  const titleId = `${baseId}-title`, descriptionId = `${baseId}-description`, hasDesc = options.showDescription !== false;
  return {
    isOpen: options.open ?? false, titleId, descriptionId,
    getBackdropProps: () => ({ 'aria-hidden': 'true' as const, onClick: () => options.onClose?.() }),
    getContentProps: (role: 'dialog' | 'alertdialog' = 'alertdialog') => ({
      role, 'aria-modal': 'true' as const, 'aria-labelledby': titleId, 'aria-describedby': hasDesc ? descriptionId : undefined,
      tabIndex: -1, onKeyDown: (event: { key?: string }) => { if (event?.key === 'Escape') options.onClose?.(); },
    }),
    getTitleProps: () => ({ id: titleId }), getDescriptionProps: () => ({ id: descriptionId }),
  };
}

export function handleRovingFocus(
  event: { key: string; preventDefault?: () => void; currentTarget?: unknown },
  currentIndex: number, totalItems: number, onSelect: (index: number) => void
): void {
  const nextIndex = getNextRovingIndex(event?.key, currentIndex, totalItems);
  if (nextIndex < 0) return;
  event.preventDefault?.(); onSelect(nextIndex);
  const container = event?.currentTarget as { querySelectorAll?: (s: string) => unknown[] } | undefined;
  if (container && typeof container.querySelectorAll === 'function') {
    focusElementSafely(container.querySelectorAll('[role="tab"], button')[nextIndex]);
  }
}

export function handleGroupKeyDown(event: { key?: string; preventDefault?: () => void; currentTarget?: unknown; target?: unknown }): void {
  if (!event || !event.key) return;
  const container = event.currentTarget as { querySelectorAll?: (s: string) => unknown[] } | undefined;
  if (!container || typeof container.querySelectorAll !== 'function') return;
  const items = Array.from(container.querySelectorAll('[role="tab"]:not([disabled]), button:not([disabled])'));
  if (items.length === 0) return;
  const nextIdx = getNextRovingIndex(event.key, Math.max(0, items.indexOf(event.target)), items.length);
  if (nextIdx < 0) return;
  event.preventDefault?.();
  const nextEl = items[nextIdx] as { focus?: () => void; click?: () => void; getAttribute?: (attr: string) => string | null };
  focusElementSafely(nextEl);
  if (typeof nextEl?.getAttribute === 'function' && nextEl.getAttribute('role') === 'tab') nextEl.click?.();
}

export interface TabsStateOptions<T extends { id: string }> { tabs: T[]; activeId?: string; onSelect?: (id: string) => void }

export function createTabsState<T extends { id: string }>(options: TabsStateOptions<T>) {
  const activeId = options.activeId || (options.tabs[0]?.id ?? '');
  return {
    activeId,
    getTabListProps: () => ({
      role: 'tablist' as const,
      onKeyDown: (event: { key: string; preventDefault?: () => void; currentTarget?: unknown }) => {
        const idx = Math.max(0, options.tabs.findIndex((t) => t.id === activeId));
        handleRovingFocus(event, idx, options.tabs.length, (next) => { if (options.tabs[next]) options.onSelect?.(options.tabs[next]!.id); });
      },
    }),
    getTabTriggerProps: (id: string) => ({
      role: 'tab' as const, id: `tab-${id}`, 'aria-selected': id === activeId, 'aria-controls': `panel-${id}`, tabIndex: id === activeId ? 0 : -1, onClick: () => options.onSelect?.(id),
    }),
    getTabPanelProps: (id: string) => ({
      role: 'tabpanel' as const, id: `panel-${id}`, 'aria-labelledby': `tab-${id}`, tabIndex: 0, hidden: id !== activeId,
    }),
  };
}

export function createTooltipState(options: { id?: string } = {}) {
  const id = resolveId(options.id, 'tooltip');
  return { id, getTriggerProps: () => ({ 'aria-describedby': id }), getContentProps: () => ({ role: 'tooltip' as const, id }) };
}

export type OverlayToastType = 'default' | 'info' | 'success' | 'warning' | 'error';

export interface OverlayToastEntry<TMeta = Record<string, unknown>> {
  id: string; open: boolean; type: OverlayToastType; title: string; description: string;
  actionText: string; timestamp: string; duration: number; placement: FloatingPlacement;
  showDescription: boolean; showAction: boolean; showClose: boolean; showTimestamp: boolean;
  meta?: TMeta; onAction?: () => void;
}

export interface OverlayDialogState {
  id: string; open: boolean; heading: string; description: string;
  cancelLabel: string; confirmLabel: string; destructive: boolean;
  showDescription: boolean; showCloseButton: boolean; loading: boolean;
}

export type OverlayUnsubscribe = (() => void) & { unsubscribe: () => void };
export type OverlayObserver<T> = ((value: T) => void) | { next?: (value: T) => void };

export interface OverlaySubscribableStore<T> {
  subscribe: (observerOrNext: OverlayObserver<T>) => OverlayUnsubscribe;
  subscribeChanges: (listener: (value: T) => void) => OverlayUnsubscribe;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
}

export interface OverlayControllerOptions {
  maxToasts?: number; defaultDuration?: number; defaultPlacement?: FloatingPlacement;
  initialToast?: Partial<OverlayToastEntry>; initialDialog?: Partial<OverlayDialogState>;
}

function createSubscribableChannel<T extends object>(initial: T, onAnyChange?: () => void) {
  let snapshot: T = Object.freeze(Array.isArray(initial) ? [...initial] : { ...initial }) as T;
  const listeners = new Set<(val: T) => void>();
  const subscribeChanges = (listener: (val: T) => void): OverlayUnsubscribe => {
    listeners.add(listener);
    const unsub = () => { listeners.delete(listener); };
    return Object.assign(unsub, { unsubscribe: unsub });
  };
  const subscribe = (observerOrNext: OverlayObserver<T>): OverlayUnsubscribe => {
    const fn = typeof observerOrNext === 'function' ? observerOrNext : (v: T) => observerOrNext?.next?.(v);
    fn(snapshot); return subscribeChanges(fn);
  };
  const obsKey = (typeof Symbol !== 'undefined' && (Symbol as any).observable) || '@@observable';
  const store: OverlaySubscribableStore<T> & Record<string, any> = {
    subscribe, subscribeChanges, getSnapshot: () => snapshot, getServerSnapshot: () => snapshot, '@@observable': () => store, [obsKey]: () => store,
  };
  return {
    store, getSnapshot: () => snapshot, clear: () => listeners.clear(),
    setSnapshot: (next: T) => { snapshot = Object.freeze(Array.isArray(next) ? [...next] : { ...next }) as T; listeners.forEach((fn) => fn(snapshot)); onAnyChange?.(); },
  };
}

function normalizeToastEntry<TMeta = Record<string, unknown>>(
  patch: Partial<OverlayToastEntry<TMeta>>, fallbackId: string, defaultDuration: number, defaultPlacement: FloatingPlacement
): OverlayToastEntry<TMeta> {
  const description = patch.description ?? '', timestamp = patch.timestamp ?? 'Baru saja';
  return {
    id: patch.id || fallbackId, open: patch.open ?? true, type: patch.type || 'info', title: patch.title ?? '',
    description, actionText: patch.actionText ?? 'Dismiss', timestamp,
    duration: patch.duration !== undefined ? Math.max(0, patch.duration) : defaultDuration,
    placement: parseFloatingPlacement(patch.placement, defaultPlacement).placement,
    showDescription: patch.showDescription ?? Boolean(description), showAction: patch.showAction ?? true,
    showClose: patch.showClose ?? false, showTimestamp: patch.showTimestamp ?? Boolean(timestamp), meta: patch.meta, onAction: patch.onAction,
  };
}

function normalizeDialogState(patch: Partial<OverlayDialogState>, cur?: OverlayDialogState): OverlayDialogState {
  const description = patch.description ?? cur?.description ?? '';
  return {
    id: patch.id ?? cur?.id ?? 'alert-dialog', open: patch.open ?? cur?.open ?? false, heading: patch.heading ?? cur?.heading ?? '', description,
    cancelLabel: patch.cancelLabel ?? cur?.cancelLabel ?? 'Cancel', confirmLabel: patch.confirmLabel ?? cur?.confirmLabel ?? 'Continue',
    destructive: patch.destructive ?? cur?.destructive ?? false, showDescription: patch.showDescription ?? (cur ? Boolean(description) : true),
    showCloseButton: patch.showCloseButton ?? cur?.showCloseButton ?? true, loading: patch.loading ?? false,
  };
}

export function createOverlayController(options: OverlayControllerOptions = {}) {
  const maxToasts = Math.max(1, options.maxToasts ?? 20);
  const defaultDuration = options.defaultDuration !== undefined ? Math.max(0, options.defaultDuration) : 4000;
  let defaultPlacement: FloatingPlacement = parseFloatingPlacement(options.defaultPlacement, 'top-right').placement;
  const globalListeners = new Set<() => void>();
  const notifyGlobal = () => globalListeners.forEach((fn) => fn());
  let seq = 0, globallyPaused = false;
  interface ToastTimerRecord { timer: ReturnType<typeof setTimeout> | null; startedAt: number; remainingMs: number; paused: boolean }
  const timers = new Map<string, ToastTimerRecord>();

  const initialToast = normalizeToastEntry({ open: false, ...options.initialToast }, 'toast-0', defaultDuration, defaultPlacement);
  let queue: OverlayToastEntry[] = initialToast.open ? [initialToast] : [];
  const toastChan = createSubscribableChannel<OverlayToastEntry>(initialToast, notifyGlobal);
  const queueChan = createSubscribableChannel<readonly OverlayToastEntry[]>(queue);
  const dialogChan = createSubscribableChannel<OverlayDialogState>(normalizeDialogState(options.initialDialog || {}), notifyGlobal);
  let dialogCbs: { onConfirm?: () => void | Promise<void>; onCancel?: () => void; resolve?: (ok: boolean) => void } = {};

  const clearEntryTimer = (id: string) => {
    const rec = timers.get(id);
    if (rec?.timer) clearTimeout(rec.timer);
    timers.delete(id);
  };
  const clearAllTimers = () => {
    timers.forEach((rec) => { if (rec.timer) clearTimeout(rec.timer); });
    timers.clear();
  };
  const scheduleEntryTimer = (id: string, ms: number) => {
    clearEntryTimer(id);
    if (ms <= 0) return;
    if (globallyPaused) {
      timers.set(id, { timer: null, startedAt: 0, remainingMs: ms, paused: true });
      return;
    }
    const startedAt = Date.now();
    const t = setTimeout(() => dismissToast(id), ms);
    timers.set(id, { timer: t, startedAt, remainingMs: ms, paused: false });
  };
  const syncToastSnapshot = () => {
    const cur = toastChan.getSnapshot();
    queueChan.setSnapshot([...queue]);
    if (queue.length > 0) {
      toastChan.setSnapshot({ ...queue[0]! });
    } else if (cur.open) {
      toastChan.setSnapshot({ ...cur, open: false });
    } else {
      notifyGlobal();
    }
  };
  const dismissToast = (id?: string) => {
    const cur = toastChan.getSnapshot();
    if (!cur.open && queue.length === 0) return;
    const targetId = id || queue[0]?.id || cur.id;
    if (targetId) clearEntryTimer(targetId);
    const prevLen = queue.length;
    queue = id ? queue.filter((item) => item.id !== id) : queue.slice(1);
    if (queue.length === prevLen && id && cur.id !== id) return;
    syncToastSnapshot();
  };
  if (initialToast.open && initialToast.duration > 0) scheduleEntryTimer(initialToast.id, initialToast.duration);
  const notify = (patch: Partial<OverlayToastEntry>) => {
    const existing = patch.id ? queue.find((t) => t.id === patch.id) : undefined;
    const entry = normalizeToastEntry(existing ? { ...existing, ...patch, open: patch.open ?? true } : patch, `toast-${++seq}`, defaultDuration, defaultPlacement);
    const nextQueue = [entry, ...queue.filter((t) => t.id !== entry.id)];
    if (nextQueue.length > maxToasts) {
      for (const evicted of nextQueue.slice(maxToasts)) clearEntryTimer(evicted.id);
    }
    queue = nextQueue.slice(0, maxToasts);
    scheduleEntryTimer(entry.id, entry.duration);
    queueChan.setSnapshot([...queue]);
    toastChan.setSnapshot(entry);
    return toastChan.getSnapshot();
  };
  const openDialog = (patch: Partial<OverlayDialogState> & { onConfirm?: () => void | Promise<void>; onCancel?: () => void } = {}) => {
    dialogCbs.resolve?.(false); dialogCbs = { onConfirm: patch.onConfirm, onCancel: patch.onCancel };
    dialogChan.setSnapshot(normalizeDialogState({ ...patch, open: true, loading: false }, dialogChan.getSnapshot()));
    return dialogChan.getSnapshot();
  };
  const closeDialog = () => {
    const cur = dialogChan.getSnapshot(); if (!cur.open) return;
    const { onCancel, resolve } = dialogCbs; dialogCbs = {};
    dialogChan.setSnapshot({ ...cur, open: false, loading: false }); resolve?.(false); onCancel?.();
  };
  const confirmDialog = async (): Promise<boolean> => {
    const cur = dialogChan.getSnapshot(); if (!cur.open || cur.loading) return false;
    const { onConfirm, resolve } = dialogCbs;
    try {
      const res = onConfirm?.();
      if (res && typeof (res as Promise<void>).then === 'function') { dialogChan.setSnapshot({ ...cur, loading: true }); await res; }
      dialogCbs = {}; dialogChan.setSnapshot({ ...dialogChan.getSnapshot(), open: false, loading: false }); resolve?.(true); return true;
    } catch { dialogChan.setSnapshot({ ...dialogChan.getSnapshot(), loading: false }); return false; }
  };
  const pauseSingle = (id: string) => {
    const rec = timers.get(id);
    if (!rec || rec.paused || !rec.timer) return;
    clearTimeout(rec.timer);
    rec.timer = null;
    rec.remainingMs = Math.max(1, rec.remainingMs - (Date.now() - rec.startedAt));
    rec.paused = true;
  };
  const resumeSingle = (id: string) => {
    const rec = timers.get(id);
    if (!rec || !rec.paused || globallyPaused) return;
    if (!queue.some((t) => t.id === id)) { timers.delete(id); return; }
    rec.paused = false;
    rec.startedAt = Date.now();
    rec.timer = setTimeout(() => dismissToast(id), rec.remainingMs);
  };

  return {
    toastStore: toastChan.store, toastQueueStore: queueChan.store, dialogStore: dialogChan.store,
    getToastSnapshot: toastChan.getSnapshot, getToastQueueSnapshot: queueChan.getSnapshot, getDialogSnapshot: dialogChan.getSnapshot, getToastQueue: () => [...queue],
    getToastPlacement: () => defaultPlacement,
    setToastPlacement: (nextPlacement: FloatingPlacement, moveActive = true) => {
      defaultPlacement = parseFloatingPlacement(nextPlacement, defaultPlacement).placement;
      if (moveActive && queue.length > 0) { queue = queue.map((t) => ({ ...t, placement: defaultPlacement })); queueChan.setSnapshot([...queue]); toastChan.setSnapshot({ ...queue[0]! }); }
      else notifyGlobal();
      return defaultPlacement;
    },
    dismissAllToasts: () => { clearAllTimers(); globallyPaused = false; queue = []; queueChan.setSnapshot([]); const cur = toastChan.getSnapshot(); if (cur.open) toastChan.setSnapshot({ ...cur, open: false }); else notifyGlobal(); },
    getState: () => ({ toast: toastChan.getSnapshot(), dialog: dialogChan.getSnapshot(), queue: [...queue] }),
    subscribeToast: (fn: (s: OverlayToastEntry) => void) => toastChan.store.subscribeChanges(fn),
    subscribeToastQueue: (fn: (q: readonly OverlayToastEntry[]) => void) => queueChan.store.subscribeChanges(fn),
    subscribeDialog: (fn: (s: OverlayDialogState) => void) => dialogChan.store.subscribeChanges(fn),
    subscribe: (fn: () => void) => { globalListeners.add(fn); return () => { globalListeners.delete(fn); }; },
    notify, dismissToast, openDialog, closeDialog, confirmDialog,
    info: (title: string, opts?: Partial<OverlayToastEntry>) => notify({ ...opts, type: 'info', title }),
    success: (title: string, opts?: Partial<OverlayToastEntry>) => notify({ ...opts, type: 'success', title }),
    warning: (title: string, opts?: Partial<OverlayToastEntry>) => notify({ ...opts, type: 'warning', title }),
    error: (title: string, opts?: Partial<OverlayToastEntry>) => notify({ ...opts, type: 'error', title }),
    promise: async <R>(p: Promise<R> | (() => Promise<R>), m: { id?: string; loading: string; success: string | ((d: R) => string); error?: string | ((e: unknown) => string); description?: string; placement?: FloatingPlacement; meta?: Record<string, unknown> }) => {
      const id = m.id || `toast-promise-${++seq}`;
      notify({ id, type: 'info', title: m.loading, description: m.description ?? '', duration: 0, placement: m.placement, meta: m.meta });
      try { const d = await (typeof p === 'function' ? p() : p); notify({ id, type: 'success', title: typeof m.success === 'function' ? m.success(d) : m.success, duration: defaultDuration, placement: m.placement, meta: m.meta }); return d; }
      catch (e) { notify({ id, type: 'error', title: typeof m.error === 'function' ? m.error(e) : (m.error || (e as Error)?.message || 'Operation failed'), duration: defaultDuration, placement: m.placement, meta: m.meta }); throw e; }
    },
    pauseToast: (id?: string) => {
      if (id) { pauseSingle(id); return; }
      globallyPaused = true;
      for (const tid of timers.keys()) pauseSingle(tid);
    },
    resumeToast: (id?: string) => {
      if (id) { resumeSingle(id); return; }
      globallyPaused = false;
      for (const tid of [...timers.keys()]) resumeSingle(tid);
    },
    triggerToastAction: (id?: string) => {
      const target = id ? queue.find((t) => t.id === id) : toastChan.getSnapshot();
      if (!target) return;
      target.onAction?.();
      dismissToast(target.id);
    },
    confirm: (patch: Partial<OverlayDialogState> = {}) => new Promise<boolean>((resolve) => { openDialog(patch); dialogCbs.resolve = resolve; }),
    bindToast: (overrides?: Partial<OverlayToastEntry>) => {
      const s = toastChan.getSnapshot();
      return { id: s.id, placement: s.placement, open: s.open, type: s.type, title: s.title, description: s.description, showDescription: s.showDescription, actionText: s.actionText, showAction: s.showAction, showClose: s.showClose, timestamp: s.timestamp, showTimestamp: s.showTimestamp, duration: 0, ...overrides, __store: toastChan.store, __overrides: overrides, onClose: () => dismissToast(toastChan.getSnapshot().id), onAction: () => { const cur = toastChan.getSnapshot(); cur.onAction?.(); dismissToast(cur.id); } };
    },
    bindDialog: (overrides?: Partial<OverlayDialogState>) => {
      const s = dialogChan.getSnapshot();
      return { id: s.id, open: s.open, heading: s.heading, description: s.description, showDescription: s.showDescription, showCloseButton: s.showCloseButton, cancelLabel: s.cancelLabel, confirmLabel: s.confirmLabel, destructive: s.destructive, ...overrides, __store: dialogChan.store, __overrides: overrides, onCancel: () => closeDialog(), onConfirm: () => { void confirmDialog(); } };
    },
    dispose: () => { clearAllTimers(); globallyPaused = false; dialogCbs.resolve?.(false); dialogCbs = {}; queue = []; toastChan.clear(); queueChan.clear(); dialogChan.clear(); globalListeners.clear(); },
  };
}
