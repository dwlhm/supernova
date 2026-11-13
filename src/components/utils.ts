import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function cva<T>(key: string | undefined, map: Record<string, T>, fallback: string): T {
  return (key && key in map ? map[key] : map[fallback])!;
}

export function resolveId(id: string | undefined, fallback: string): string {
  return id && id.trim() !== '' ? id.trim() : fallback;
}

export function resolveControllable<T>(
  controlled: T | undefined,
  internal: T | undefined,
  fallback: T
): T {
  if (controlled !== undefined) return controlled;
  if (internal !== undefined) return internal;
  return fallback;
}

export function clampPercent(val: number | undefined, min = 0, max = 100): number {
  const num = Number(val);
  if (!Number.isFinite(num)) return 0;
  const span = max - min;
  if (span <= 0) return 0;
  const pct = ((num - min) / span) * 100;
  return Math.min(100, Math.max(0, Math.round(pct)));
}

export function getNextRovingIndex(
  key: string,
  currentIndex: number,
  totalItems: number
): number {
  if (totalItems <= 0) return -1;
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (currentIndex + 1) % totalItems;
    case 'ArrowLeft':
    case 'ArrowUp':
      return (currentIndex - 1 + totalItems) % totalItems;
    case 'Home':
      return 0;
    case 'End':
      return totalItems - 1;
    default:
      return -1;
  }
}

export function focusElementSafely(el: unknown): void {
  if (el && typeof (el as { focus?: () => void }).focus === 'function') {
    (el as { focus: () => void }).focus();
  }
}

export function focusSiblingInput(event: unknown, offset: number): void {
  const target = (event as { currentTarget?: unknown; target?: unknown })?.currentTarget ??
    (event as { target?: unknown })?.target;
  const parent = (target as { parentElement?: { querySelectorAll?: (s: string) => unknown[] } })
    ?.parentElement;
  if (!parent || typeof parent.querySelectorAll !== 'function') return;
  const inputs = Array.from(parent.querySelectorAll('input'));
  const idx = inputs.indexOf(target);
  if (idx >= 0 && inputs[idx + offset]) {
    focusElementSafely(inputs[idx + offset]);
  }
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface A11yElement {
  focus?: () => void;
  contains?: (node: any) => boolean;
  querySelector?: (selector: string) => A11yElement | null;
  querySelectorAll?: (selector: string) => ArrayLike<A11yElement>;
  addEventListener?: (type: string, listener: (event: any) => void, capture?: boolean) => void;
  removeEventListener?: (type: string, listener: (event: any) => void, capture?: boolean) => void;
  hasAttribute?: (name: string) => boolean;
  getAttribute?: (name: string) => string | null;
}

export interface A11yKeyboardEvent {
  key: string;
  shiftKey?: boolean;
  preventDefault?: () => void;
}

interface A11yDocument {
  activeElement?: A11yElement | null;
  addEventListener?: (type: string, listener: (event: any) => void, capture?: boolean) => void;
  removeEventListener?: (type: string, listener: (event: any) => void, capture?: boolean) => void;
}

function getDoc(): A11yDocument | undefined {
  return (globalThis as { document?: A11yDocument }).document;
}

function getFocusableElements(container: A11yElement): A11yElement[] {
  if (typeof container.querySelectorAll !== 'function') return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute?.('disabled') && el.getAttribute?.('aria-hidden') !== 'true'
  );
}

/**
 * Traps Tab/Shift+Tab focus within `container` and restores focus to the
 * previously active element when the returned cleanup function is called.
 */
export function createFocusTrap(container: A11yElement | null | undefined): () => void {
  const doc = getDoc();
  if (!container || !doc) return () => {};
  const previouslyFocused = doc.activeElement ?? null;
  const initialFocusable = getFocusableElements(container);
  if (initialFocusable.length > 0) {
    if (!container.contains?.(doc.activeElement)) {
      focusElementSafely(initialFocusable[0]);
    }
  } else {
    focusElementSafely(container);
  }

  const onKeyDown = (event: A11yKeyboardEvent) => {
    if (event.key !== 'Tab') return;
    const focusable = getFocusableElements(container);
    if (focusable.length === 0) {
      event.preventDefault?.();
      focusElementSafely(container);
      return;
    }
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    const active = doc.activeElement ?? null;
    if (event.shiftKey) {
      if (active === first || !container.contains?.(active)) {
        event.preventDefault?.();
        focusElementSafely(last);
      }
    } else if (active === last || !container.contains?.(active)) {
      event.preventDefault?.();
      focusElementSafely(first);
    }
  };

  container.addEventListener?.('keydown', onKeyDown);
  return () => {
    container.removeEventListener?.('keydown', onKeyDown);
    focusElementSafely(previouslyFocused);
  };
}

/**
 * Registers a document-level mousedown listener that invokes `onOutsideClick`
 * when a pointer interaction occurs outside `element`.
 */
export function registerClickOutside(
  element: A11yElement | null | undefined,
  onOutsideClick: () => void
): () => void {
  const doc = getDoc();
  if (!element || !doc?.addEventListener) return () => {};
  const handleMouseDown = (event: { target?: unknown }) => {
    const target = event?.target ?? null;
    if (!target || !element.contains?.(target)) {
      onOutsideClick();
    }
  };
  doc.addEventListener('mousedown', handleMouseDown, true);
  return () => {
    doc.removeEventListener?.('mousedown', handleMouseDown, true);
  };
}

/**
 * Handles ArrowUp/ArrowDown/Home/End/Escape keyboard navigation for dropdown
 * triggers and `[role="listbox"]` options.
 */
export function handleDropdownKeyDown(
  event: A11yKeyboardEvent,
  container: A11yElement | null | undefined,
  isOpen: boolean,
  onOpenChange?: (open: boolean) => void
): void {
  if (!container) return;
  const key = event.key;
  if (key === 'Escape' && isOpen) {
    event.preventDefault?.();
    onOpenChange?.(false);
    focusElementSafely(container.querySelector?.('[aria-haspopup="listbox"]'));
    return;
  }
  if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Home' && key !== 'End') return;
  if (!isOpen) {
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault?.();
      onOpenChange?.(true);
    }
    return;
  }
  const listbox = container.querySelector?.('[role="listbox"]');
  if (!listbox || typeof listbox.querySelectorAll !== 'function') return;
  const options = Array.from(
    listbox.querySelectorAll('[role="option"]:not([aria-disabled="true"]), button:not([disabled])')
  );
  if (options.length === 0) return;
  const doc = getDoc();
  const active = doc?.activeElement ?? null;
  const currentIdx = active ? options.indexOf(active) : -1;
  const baseIdx = currentIdx >= 0 ? currentIdx : key === 'ArrowUp' || key === 'End' ? 0 : -1;
  const nextIdx = getNextRovingIndex(key, baseIdx, options.length);
  if (nextIdx >= 0 && options[nextIdx]) {
    event.preventDefault?.();
    focusElementSafely(options[nextIdx]);
  }
}

export type FloatingPlacement = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export const FLOATING_PLACEMENTS: readonly FloatingPlacement[] = [
  'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right',
] as const;

export interface ParsedFloatingPlacement {
  placement: FloatingPlacement;
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

export function parseFloatingPlacement(placement?: string, fallback: FloatingPlacement = 'top-right'): ParsedFloatingPlacement {
  const safeFallback: FloatingPlacement = (FLOATING_PLACEMENTS as readonly string[]).includes(fallback) ? fallback : 'top-right';
  const valid: FloatingPlacement = placement && (FLOATING_PLACEMENTS as readonly string[]).includes(placement)
    ? (placement as FloatingPlacement)
    : safeFallback;
  const [vertical, horizontal] = valid.split('-') as ['top' | 'bottom', 'left' | 'center' | 'right'];
  return { placement: valid, vertical, horizontal };
}

export function computeDeckOffset(
  slot: number,
  vertical: 'top' | 'bottom' = 'top',
  peek = 10
): { offsetY: number; scale: number; opacity: number; zIndex: number; hidden: boolean } {
  const safeSlot = Math.max(0, Math.floor(slot || 0));
  const clamped = Math.min(safeSlot, 3);
  const sign = vertical === 'bottom' ? -1 : 1;
  const offsetY = sign * clamped * Math.max(0, peek);
  const scale = Number((1 - clamped * 0.045).toFixed(4));
  const opacity = safeSlot > 2 ? 0 : Number((1 - clamped * 0.16).toFixed(4));
  const zIndex = Math.max(1, 50 - safeSlot);
  const hidden = safeSlot > 2;
  return { offsetY, scale, opacity, zIndex, hidden };
}

export function computeStackOffset(
  slot: number,
  heights: ReadonlyArray<number>,
  vertical: 'top' | 'bottom' = 'top',
  gap = 10
): { offsetY: number; zIndex: number } {
  const safeSlot = Math.max(0, Math.floor(slot || 0));
  const sumHeights = (heights || [])
    .slice(0, safeSlot)
    .reduce((sum, h) => sum + (Number.isFinite(h) && h > 0 ? h : 52), 0);
  const sign = vertical === 'bottom' ? -1 : 1;
  const offsetY = sign * (sumHeights + safeSlot * Math.max(0, gap));
  const zIndex = Math.max(1, 50 - safeSlot);
  return { offsetY, zIndex };
}

export function computeStackTrackHeight(
  heights: ReadonlyArray<number>,
  expanded: boolean,
  gap = 10,
  peek = 10
): number {
  if (!heights || heights.length === 0) return 0;
  const norm = heights.map((h) => (Number.isFinite(h) && h > 0 ? h : 52));
  if (!expanded) {
    return norm[0]! + Math.min(norm.length - 1, 2) * Math.max(0, peek) + 8;
  }
  const total = norm.reduce((sum, h) => sum + h, 0);
  return total + (norm.length - 1) * Math.max(0, gap) + 8;
}

export interface SwipeDisplacement {
  offsetX: number;
  offsetY: number;
  opacity: number;
  progress: number;
  shouldDismiss: boolean;
}

function makeSwipeResult(offsetX: number, offsetY: number, rawProgress: number, shouldDismiss: boolean): SwipeDisplacement {
  const progress = Math.min(1, Math.max(0, rawProgress));
  return {
    offsetX: Math.round(offsetX),
    offsetY: Math.round(offsetY),
    opacity: Number(Math.max(0, 1 - progress * 0.85).toFixed(4)),
    progress: Number(progress.toFixed(4)),
    shouldDismiss,
  };
}

export function computeSwipeDisplacement(
  deltaX: number,
  deltaY: number,
  placement?: string,
  threshold = 88
): SwipeDisplacement {
  const safeThreshold = Number.isFinite(threshold) && threshold > 12 ? threshold : 88;
  const dx = Number.isFinite(deltaX) ? deltaX : 0;
  const dy = Number.isFinite(deltaY) ? deltaY : 0;
  if (dx === 0 && dy === 0) return { offsetX: 0, offsetY: 0, opacity: 1, progress: 0, shouldDismiss: false };
  if (!placement || placement === 'inline') {
    return makeSwipeResult(dx, 0, Math.abs(dx) / safeThreshold, Math.abs(dx) >= safeThreshold);
  }
  const { vertical, horizontal } = parseFloatingPlacement(placement);
  if (horizontal === 'right') {
    return makeSwipeResult(dx >= 0 ? dx : dx * 0.2, 0, dx > 0 ? dx / safeThreshold : 0, dx >= safeThreshold);
  }
  if (horizontal === 'left') {
    return makeSwipeResult(dx <= 0 ? dx : dx * 0.2, 0, dx < 0 ? Math.abs(dx) / safeThreshold : 0, dx <= -safeThreshold);
  }
  const verticalDismiss = vertical === 'top' ? dy < 0 : dy > 0;
  if (Math.abs(dy) > Math.abs(dx) && (verticalDismiss || Math.abs(dx) < 8)) {
    const vThresh = safeThreshold * 0.75;
    return makeSwipeResult(0, verticalDismiss ? dy : dy * 0.2, verticalDismiss ? Math.abs(dy) / vThresh : 0, verticalDismiss && Math.abs(dy) >= vThresh);
  }
  return makeSwipeResult(dx, 0, Math.abs(dx) / safeThreshold, Math.abs(dx) >= safeThreshold);
}

export function isInteractiveDragTarget(target: unknown): boolean {
  let node = target as { tagName?: string; getAttribute?: (k: string) => string | null; parentElement?: unknown } | null;
  for (let depth = 0; node && depth < 6; depth++) {
    const tag = typeof node.tagName === 'string' ? node.tagName.toUpperCase() : '';
    if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    const role = typeof node.getAttribute === 'function' ? node.getAttribute('role') : null;
    if (role === 'button' || role === 'link') return true;
    node = (node.parentElement as typeof node) || null;
  }
  return false;
}

export function mergeDragStyle(
  baseStyle: Record<string, string> | undefined,
  dragging: boolean,
  deltaX: number,
  deltaY: number,
  placement?: string,
  threshold = 88
): Record<string, string> | undefined {
  if (!dragging && deltaX === 0 && deltaY === 0) return baseStyle;
  const swipe = computeSwipeDisplacement(deltaX, deltaY, placement, threshold);
  if (!dragging && swipe.offsetX === 0 && swipe.offsetY === 0) return baseStyle;
  const baseTransform = baseStyle?.transform ? `${baseStyle.transform} ` : '';
  const baseOpacity = baseStyle?.opacity !== undefined ? Number(baseStyle.opacity) : 1;
  const mergedOpacity = Number.isFinite(baseOpacity) ? Number((baseOpacity * swipe.opacity).toFixed(4)) : swipe.opacity;
  return {
    ...(baseStyle || {}),
    transform: `${baseTransform}translate3d(${swipe.offsetX}px, ${swipe.offsetY}px, 0)`.trim(),
    opacity: String(mergedOpacity),
    transition: dragging ? 'none' : (baseStyle?.transition || 'transform 180ms ease, opacity 150ms ease'),
    userSelect: dragging ? 'none' : (baseStyle?.userSelect || ''),
    touchAction: 'pan-y',
  };
}

export function setPointerCaptureSafe(target: unknown, pointerId?: number, capture = true): void {
  if (typeof pointerId !== 'number') return;
  const el = target as { setPointerCapture?: (id: number) => void; releasePointerCapture?: (id: number) => void } | null;
  try {
    if (capture) el?.setPointerCapture?.(pointerId);
    else el?.releasePointerCapture?.(pointerId);
  } catch {
    // Ignore detached or synthetic DOM elements
  }
}

export interface DragTimerBag {
  isDragging: boolean;
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  timerId: number;
  startedAt: number;
  remainingMs: number;
  isPaused: boolean;
}

export function createDragTimerBag(): DragTimerBag {
  return { isDragging: false, startX: 0, startY: 0, deltaX: 0, deltaY: 0, timerId: 0, startedAt: 0, remainingMs: 0, isPaused: false };
}

export function getBagDeltaX(bag: DragTimerBag): number { return bag.deltaX; }
export function getBagDeltaY(bag: DragTimerBag): number { return bag.deltaY; }

export function stopBagTimer(bag: DragTimerBag): void {
  if (bag.timerId) {
    clearTimeout(bag.timerId);
    bag.timerId = 0;
  }
}

export function armBagTimer(bag: DragTimerBag, ms: number, open: boolean | undefined, onExpire?: () => void): void {
  stopBagTimer(bag);
  bag.remainingMs = ms;
  if (ms > 0 && open !== false && !bag.isPaused) {
    bag.startedAt = Date.now();
    bag.timerId = Number(setTimeout(() => { bag.timerId = 0; onExpire?.(); }, ms));
  }
}

export function pauseBagTimer(bag: DragTimerBag): void {
  if (bag.timerId && !bag.isPaused) {
    stopBagTimer(bag);
    bag.remainingMs = Math.max(1, bag.remainingMs - (Date.now() - bag.startedAt));
    bag.isPaused = true;
  }
}

export function resumeBagTimer(bag: DragTimerBag, open: boolean | undefined, onExpire?: () => void): void {
  if (bag.isPaused && !bag.isDragging) {
    bag.isPaused = false;
    if (bag.remainingMs > 0) armBagTimer(bag, bag.remainingMs, open, onExpire);
  }
}

export function startBagDrag(
  bag: DragTimerBag,
  e: { button?: number; clientX?: number; clientY?: number; pointerId?: number; target?: unknown; currentTarget?: unknown },
  draggable?: boolean
): boolean {
  if (draggable === false || (typeof e.button === 'number' && e.button !== 0) || isInteractiveDragTarget(e.target)) return false;
  pauseBagTimer(bag);
  bag.isDragging = true;
  bag.startX = e.clientX || 0;
  bag.startY = e.clientY || 0;
  bag.deltaX = 0;
  bag.deltaY = 0;
  setPointerCaptureSafe(e.currentTarget, e.pointerId, true);
  return true;
}

export function moveBagDrag(bag: DragTimerBag, e: { clientX?: number; clientY?: number }): boolean {
  if (!bag.isDragging) return false;
  bag.deltaX = (e.clientX || 0) - bag.startX;
  bag.deltaY = (e.clientY || 0) - bag.startY;
  return true;
}

export function endBagDrag(
  bag: DragTimerBag,
  e: { pointerId?: number; currentTarget?: unknown },
  placement?: string,
  threshold?: number,
  cancelled = false
): boolean {
  if (!bag.isDragging) return false;
  setPointerCaptureSafe(e.currentTarget, e.pointerId, false);
  const hit = !cancelled && computeSwipeDisplacement(bag.deltaX, bag.deltaY, placement, threshold).shouldDismiss;
  bag.isDragging = false;
  bag.deltaX = 0;
  bag.deltaY = 0;
  return hit;
}

export function groupByKey<T, K extends string>(
  items: ReadonlyArray<T>,
  getKey: (item: T) => K
): Partial<Record<K, T[]>> {
  const out: Partial<Record<K, T[]>> = {};
  for (const item of items || []) {
    const key = getKey(item);
    const list = out[key];
    if (list) list.push(item);
    else out[key] = [item];
  }
  return out;
}

export function toggleListItem<T>(items: ReadonlyArray<T>, value: T): T[] {
  const list = items || [];
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function filterByCriteria<T extends Record<string, any>>(
  items: ReadonlyArray<T>,
  criteria?: Record<string, unknown>
): T[] {
  const list = items || [];
  if (!criteria) return [...list];
  const entries = Object.entries(criteria).filter(
    ([, val]) => val !== undefined && val !== null && val !== '' && val !== 'all'
  );
  if (entries.length === 0) return [...list];
  return list.filter((item) => entries.every(([k, val]) => String(item?.[k] ?? '') === String(val)));
}

export function retainValidIds(
  validIds: ReadonlyArray<string>,
  selectedIds: ReadonlyArray<string>
): string[] {
  const validSet = new Set(validIds || []);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of selectedIds || []) {
    if (validSet.has(id) && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

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

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MONTH_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export type DatePickerMode = 'single' | 'range' | 'month' | 'year';

export type DatePickerViewMode = 'days' | 'months' | 'years';

export interface DatePickerValueContext {
  year: number;
  month: number;
  day: number;
  iso: string;
  formatted: string;
  time: string;
  startDate: Date | null;
  endDate: Date | null;
  range: string;
  mode: DatePickerMode;
  hasValue: boolean;
}

export type DatePickerFormatArg = Date & DatePickerValueContext;

export function createDatePickerFormatArg(ctx: DatePickerValueContext): DatePickerFormatArg {
  const d = new Date(Date.UTC(ctx.year || 2025, Math.min(11, Math.max(0, (ctx.month || 6) - 1)), Math.max(1, ctx.day || 1)));
  return Object.assign(d, ctx, {
    toString() {
      return ctx.mode === 'range' ? ctx.range : ctx.formatted;
    },
  });
}

export interface TimePickerValueContext {
  hour: number;
  minute: number;
  second: number;
  hour12: number;
  period: 'AM' | 'PM';
  formatted: string;
  iso: string;
  hasValue: boolean;
}

export type TimePickerFormatArg = TimePickerValueContext & {
  toString(): string;
};

export function createTimePickerFormatArg(ctx: TimePickerValueContext): TimePickerFormatArg {
  return Object.assign({}, ctx, {
    toString() {
      return ctx.formatted;
    },
  });
}

export function parseTimeInput(text?: string | null): { hour: number; minute: number; second: number; period?: 'AM' | 'PM' } | null {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))(?::(\d{2}))?(?:\s*(am|pm))?$/i);
  if (!match) return null;
  let hour = parseInt(match[1]!, 10);
  const minute = parseInt(match[2]!, 10);
  const second = match[3] ? parseInt(match[3]!, 10) : 0;
  const ampm = match[4] ? (match[4].toUpperCase() as 'AM' | 'PM') : undefined;

  if (minute < 0 || minute > 59 || second < 0 || second > 59) return null;

  if (ampm) {
    if (hour < 1 || hour > 12) return null;
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
  } else {
    if (hour < 0 || hour > 23) return null;
  }

  return { hour, minute, second, period: ampm };
}

export function formatTimeDisplay(hour: number, minute: number, second = 0, format: 'HH:mm' | 'HH:mm:ss' = 'HH:mm', use12Hours = false): string {
  const safeH = Math.max(0, Math.min(23, hour));
  const safeM = Math.max(0, Math.min(59, minute));
  const safeS = Math.max(0, Math.min(59, second));
  const mStr = String(safeM).padStart(2, '0');
  const sStr = String(safeS).padStart(2, '0');

  if (use12Hours) {
    const h12 = safeH % 12 === 0 ? 12 : safeH % 12;
    const period = safeH >= 12 ? 'PM' : 'AM';
    const hStr = String(h12).padStart(2, '0');
    return format === 'HH:mm:ss' ? `${hStr}:${mStr}:${sStr} ${period}` : `${hStr}:${mStr} ${period}`;
  }

  const hStr = String(safeH).padStart(2, '0');
  return format === 'HH:mm:ss' ? `${hStr}:${mStr}:${sStr}` : `${hStr}:${mStr}`;
}

export interface CalendarCell {
  key: string;
  day: number;
  month: number;
  year: number;
  isBlank: boolean;
  isOutside: boolean;
  isToday: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
}

export interface CalendarPanel {
  key: string;
  year: number;
  month: number;
  monthLabel: string;
  monthShortLabel: string;
  yearLabel: string;
  showPrev: boolean;
  showNext: boolean;
  cells: CalendarCell[];
}

export interface MonthGridEntry {
  key: string;
  month: number;
  label: string;
  fullLabel: string;
  isSelected: boolean;
}

export interface YearGridEntry {
  key: string;
  year: number;
  label: string;
  isSelected: boolean;
}

export function toDateKey(year: number, month: number, day: number): number {
  if (!year || !month || !day || day <= 0) return 0;
  return year * 10000 + month * 100 + day;
}

export function shiftYearMonth(
  year: number,
  month: number,
  delta: number
): { year: number; month: number } {
  const d = new Date(Date.UTC(year || 2025, (month || 1) - 1 + delta, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}

export function getCalendarDays(year = 2025, month = 1) {
  const safeYear = year > 1900 ? year : 2025;
  const safeMonth = Math.min(12, Math.max(1, month || 1));
  const daysInMonth = new Date(Date.UTC(safeYear, safeMonth, 0)).getUTCDate();
  const prevMonthDays = new Date(Date.UTC(safeYear, safeMonth - 1, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(safeYear, safeMonth - 1, 1)).getUTCDay();
  const leadingBlanks = Array.from({ length: firstWeekday }, (_, i) => i);
  const leadingDays = Array.from({ length: firstWeekday }, (_, i) => prevMonthDays - firstWeekday + 1 + i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalOccupied = firstWeekday + daysInMonth;
  const totalCells = totalOccupied > 35 ? 42 : 35;
  const trailingDays = Array.from({ length: Math.max(0, totalCells - totalOccupied) }, (_, i) => i + 1);
  const monthLabel = `${MONTH_NAMES[safeMonth - 1]} ${safeYear}`;
  const monthShortLabel = MONTH_ABBR[safeMonth - 1] || 'Jan';
  return {
    year: safeYear,
    month: safeMonth,
    daysInMonth,
    leadingBlanks,
    leadingDays,
    days,
    trailingDays,
    monthLabel,
    monthShortLabel,
  };
}

export function buildCalendarPanel(
  year: number,
  month: number,
  opts: {
    selectedKey?: number;
    rangeStartKey?: number;
    rangeEndKey?: number;
    todayDay?: number;
    showPrev?: boolean;
    showNext?: boolean;
  } = {}
): CalendarPanel {
  const cal = getCalendarDays(year, month);
  const prevYM = shiftYearMonth(cal.year, cal.month, -1);
  const nextYM = shiftYearMonth(cal.year, cal.month, 1);
  const rStart = opts.rangeStartKey && opts.rangeEndKey ? Math.min(opts.rangeStartKey, opts.rangeEndKey) : (opts.rangeStartKey || 0);
  const rEnd = opts.rangeStartKey && opts.rangeEndKey ? Math.max(opts.rangeStartKey, opts.rangeEndKey) : 0;

  const makeCell = (prefix: string, y: number, m: number, d: number, isOutside: boolean): CalendarCell => {
    const k = toDateKey(y, m, d);
    const isRangeStart = rStart > 0 && k === rStart;
    const isRangeEnd = rEnd > 0 && k === rEnd;
    const isInRange = rStart > 0 && rEnd > 0 && k >= rStart && k <= rEnd;
    const isSelected = (!isOutside && opts.selectedKey === k) || isRangeStart || isRangeEnd;
    const isToday = !isOutside && !isSelected && d === (opts.todayDay ?? 25);
    return {
      key: `${prefix}-${y}-${m}-${d}`,
      day: d,
      month: m,
      year: y,
      isBlank: false,
      isOutside,
      isToday,
      isSelected,
      isRangeStart,
      isRangeEnd,
      isInRange,
    };
  };

  const cells: CalendarCell[] = [
    ...cal.leadingDays.map((d) => makeCell('p', prevYM.year, prevYM.month, d, true)),
    ...cal.days.map((d) => makeCell('c', cal.year, cal.month, d, false)),
    ...cal.trailingDays.map((d) => makeCell('n', nextYM.year, nextYM.month, d, true)),
  ];

  return {
    key: `panel-${cal.year}-${cal.month}`,
    year: cal.year,
    month: cal.month,
    monthLabel: cal.monthLabel,
    monthShortLabel: cal.monthShortLabel,
    yearLabel: String(cal.year),
    showPrev: opts.showPrev ?? true,
    showNext: opts.showNext ?? true,
    cells,
  };
}

export function getMonthGridEntries(selectedMonth = 1): MonthGridEntry[] {
  const safe = Math.min(12, Math.max(1, selectedMonth || 1));
  return MONTH_ABBR.map((label, idx) => {
    const month = idx + 1;
    return {
      key: `m-${month}`,
      month,
      label,
      fullLabel: MONTH_NAMES[idx] || label,
      isSelected: month === safe,
    };
  });
}

export function getYearGridEntries(selectedYear = 2026, baseYear?: number): YearGridEntry[] {
  const target = (baseYear && baseYear > 1900) ? baseYear : (selectedYear > 1900 ? selectedYear : 2026);
  const startYear = Math.floor((target - 2021) / 9) * 9 + 2021;
  return Array.from({ length: 9 }, (_, i) => {
    const year = startYear + i;
    return {
      key: `y-${year}`,
      year,
      label: String(year),
      isSelected: year === selectedYear,
    };
  });
}

export function formatDateDisplay(
  year = 2025,
  month = 1,
  day = 0,
  displayValue = ''
): string {
  if (displayValue && displayValue.trim() !== '') return displayValue;
  if (!day || day <= 0) return '';
  const m = String(Math.min(12, Math.max(1, month || 1))).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year || 2025}-${m}-${d}`;
}

export function formatHumanDate(year = 2025, month = 6, day = 1): string {
  if (!day || day <= 0) return '';
  const mName = MONTH_NAMES[Math.min(12, Math.max(1, month || 1)) - 1] || 'June';
  const dStr = String(day).padStart(2, '0');
  return `${mName} ${dStr}, ${year || 2025}`;
}

const ID_MONTH_MAP: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, mei: 5, jun: 6,
  jul: 7, aug: 8, agu: 8, sep: 9, oct: 10, okt: 10, nov: 11, dec: 12, des: 12,
};

const WEEKDAY_NAME_MAP: Record<string, number> = {
  sunday: 0, sun: 0, minggu: 0,
  monday: 1, mon: 1, senin: 1,
  tuesday: 2, tue: 2, selasa: 2,
  wednesday: 3, wed: 3, rabu: 3,
  thursday: 4, thu: 4, kamis: 4,
  friday: 5, fri: 5, jumat: 5,
  saturday: 6, sat: 6, sabtu: 6,
};

export function parseDateInput(
  raw: string,
  fallbackYear = 2025,
  fallbackMonth = 6
): { year: number; month: number; day: number } | null {
  const text = (raw || '').trim();
  if (!text) return null;
  const lower = text.toLowerCase();
  const baseDate = new Date(Date.UTC(fallbackYear || 2025, (fallbackMonth || 6) - 1, 1));
  const addDays = (days: number) => {
    const d = new Date(baseDate.getTime() + days * 86400000);
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
  };
  if (lower === 'today' || lower === 'hari ini' || lower === 'now') return addDays(0);
  if (lower === 'tomorrow' || lower === 'besok') return addDays(1);
  if (lower === 'yesterday' || lower === 'kemarin') return addDays(-1);
  if (lower === 'next week' || lower === 'minggu depan') return addDays(7);
  if (lower === 'next month' || lower === 'bulan depan') {
    const next = shiftYearMonth(baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1, 1);
    return { year: next.year, month: next.month, day: 1 };
  }
  const inDaysMatch = lower.match(/^(?:in\s+(\d+)\s+days?|(\d+)\s+days?\s+from\s+now|(\d+)\s+hari\s+lagi)$/);
  if (inDaysMatch) return addDays(parseInt((inDaysMatch[1] || inDaysMatch[2] || inDaysMatch[3])!, 10));
  const agoDaysMatch = lower.match(/^(?:(\d+)\s+days?\s+ago|(\d+)\s+hari\s+(?:yang\s+)?lalu)$/);
  if (agoDaysMatch) return addDays(-parseInt((agoDaysMatch[1] || agoDaysMatch[2])!, 10));
  const inWeeksMatch = lower.match(/^(?:in\s+(\d+)\s+weeks?|(\d+)\s+minggu\s+lagi)$/);
  if (inWeeksMatch) return addDays(parseInt((inWeeksMatch[1] || inWeeksMatch[2])!, 10) * 7);
  const inMonthsMatch = lower.match(/^(?:in\s+(\d+)\s+months?|(\d+)\s+bulan\s+lagi)$/);
  if (inMonthsMatch) {
    const next = shiftYearMonth(baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1, parseInt((inMonthsMatch[1] || inMonthsMatch[2])!, 10));
    return { year: next.year, month: next.month, day: 1 };
  }
  const nextWeekdayMatch = lower.match(/^(?:next|hari)\s+([a-z]+)$/);
  if (nextWeekdayMatch && WEEKDAY_NAME_MAP[nextWeekdayMatch[1]!] !== undefined) {
    const targetDow = WEEKDAY_NAME_MAP[nextWeekdayMatch[1]!]!;
    const currentDow = baseDate.getUTCDay();
    const diff = ((targetDow - currentDow + 7) % 7) || 7;
    return addDays(diff);
  }
  const isoMatch = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1]!, 10);
    const m = Math.min(12, Math.max(1, parseInt(isoMatch[2]!, 10)));
    const maxD = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const d = Math.min(maxD, Math.max(1, parseInt(isoMatch[3]!, 10)));
    return { year: y, month: m, day: d };
  }
  const dmySlashMatch = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmySlashMatch) {
    const y = parseInt(dmySlashMatch[3]!, 10);
    const p1 = parseInt(dmySlashMatch[1]!, 10);
    const p2 = parseInt(dmySlashMatch[2]!, 10);
    const m = p2 <= 12 ? Math.max(1, p2) : Math.min(12, Math.max(1, p1));
    const rawD = p2 <= 12 ? p1 : p2;
    const maxD = new Date(Date.UTC(y, m, 0)).getUTCDate();
    return { year: y, month: m, day: Math.min(maxD, Math.max(1, rawD)) };
  }
  const namedMatch = text.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (namedMatch) {
    const mNum = ID_MONTH_MAP[namedMatch[1]!.slice(0, 3).toLowerCase()];
    if (mNum) {
      const y = parseInt(namedMatch[3]!, 10);
      const maxD = new Date(Date.UTC(y, mNum, 0)).getUTCDate();
      const d = Math.min(maxD, Math.max(1, parseInt(namedMatch[2]!, 10)));
      return { year: y, month: mNum, day: d };
    }
  }
  const dmyNamedMatch = text.match(/^(\d{1,2})\s+([A-Za-z]+),?\s+(\d{4})$/);
  if (dmyNamedMatch) {
    const mNum = ID_MONTH_MAP[dmyNamedMatch[2]!.slice(0, 3).toLowerCase()];
    if (mNum) {
      const y = parseInt(dmyNamedMatch[3]!, 10);
      const maxD = new Date(Date.UTC(y, mNum, 0)).getUTCDate();
      const d = Math.min(maxD, Math.max(1, parseInt(dmyNamedMatch[1]!, 10)));
      return { year: y, month: mNum, day: d };
    }
  }
  return null;
}

export interface PaginationEntry {
  key: string;
  label: string;
  page: number;
  isEllipsis: boolean;
  isCurrent: boolean;
}

export function getPaginationEntries(current = 1, total = 1): PaginationEntry[] {
  const safeTotal = Math.max(1, total || 1);
  const safeCurrent = Math.min(Math.max(1, current || 1), safeTotal);
  const raw: number[] = [];
  for (let p = 1; p <= safeTotal; p++) {
    if (p === 1 || p === safeTotal || Math.abs(p - safeCurrent) <= 1) raw.push(p);
  }
  const entries: PaginationEntry[] = [];
  let prev = 0;
  for (const page of raw) {
    if (prev > 0 && page - prev > 1) {
      entries.push({ key: `e-${prev}`, label: '...', page: -1, isEllipsis: true, isCurrent: false });
    }
    entries.push({ key: `p-${page}`, label: String(page), page, isEllipsis: false, isCurrent: page === safeCurrent });
    prev = page;
  }
  return entries;
}

export function getBreadcrumbItems<T extends { label: string; href?: string; current?: boolean }>(
  items: T[] = [],
  collapsed = false
): Array<T & { originalIndex: number; isEllipsis?: boolean }> {
  const indexed = (items || []).map((item, idx) => ({ ...item, originalIndex: idx }));
  if (!collapsed || indexed.length <= 4) return indexed;
  return [
    indexed[0]!,
    { label: '...', href: '#', current: false, originalIndex: -1, isEllipsis: true } as unknown as T & { originalIndex: number; isEllipsis?: boolean },
    indexed[indexed.length - 2]!,
    indexed[indexed.length - 1]!,
  ];
}

export function computeOtpDigits(value = '', length = 6): string[] {
  const safeLen = Math.max(1, length || 6), raw = String(value ?? '');
  return Array.from({ length: safeLen }, (_, idx) => (raw[idx] && raw[idx] !== ' ' ? raw[idx]! : ''));
}

export function applyOtpChar(value = '', index = 0, rawChar = '', length = 6): string {
  const safeLen = Math.max(1, length || 6);
  const slots = Array.from({ length: safeLen }, (_, idx) => value[idx] ?? ' ');
  const clean = String(rawChar ?? '').replace(/\s/g, '');
  slots[index] = clean ? clean[clean.length - 1]! : ' ';
  return slots.join('').replace(/\s+$/, '');
}

export function applyOtpPasteString(pasted = '', length = 6): string {
  return String(pasted ?? '').replace(/\s/g, '').slice(0, Math.max(1, length || 6));
}

export function handleOtpInputEvent(event: unknown, index: number, currentValue: string | undefined, length: number, onChange?: (val: string) => void): void {
  const raw = (event as { target?: { value?: string } })?.target?.value ?? '';
  onChange?.(applyOtpChar(currentValue ?? '', index, raw, length));
  if (raw && index < length - 1) focusSiblingInput(event, 1);
}

export function handleOtpKeyDownEvent(
  event: { key?: string; preventDefault?: () => void; currentTarget?: unknown },
  index: number, currentValue: string | undefined, length: number, onChange?: (val: string) => void
): void {
  const digits = computeOtpDigits(currentValue, length);
  if (event?.key === 'Backspace' && !digits[index] && index > 0) {
    event.preventDefault?.(); onChange?.(applyOtpChar(currentValue ?? '', index - 1, '', length)); focusSiblingInput(event, -1);
  } else if (event?.key === 'ArrowLeft' && index > 0) {
    event.preventDefault?.(); focusSiblingInput(event, -1);
  } else if (event?.key === 'ArrowRight' && index < length - 1) {
    event.preventDefault?.(); focusSiblingInput(event, 1);
  }
}

export function handleOtpPasteEvent(
  event: { preventDefault?: () => void; clipboardData?: { getData?: (t: string) => string } },
  length: number, onChange?: (val: string) => void
): void {
  const text = event?.clipboardData?.getData?.('text') ?? '';
  if (text) { event.preventDefault?.(); onChange?.(applyOtpPasteString(text, length)); }
}

export type DropdownOptionInput = string | { label: string; value: string; disabled?: boolean };
export interface DropdownOptionEntry { label: string; value: string; selected: boolean; disabled: boolean }

export function filterDropdownOptions<T extends { label: string; value: string }>(options: T[] = [], query = ''): T[] {
  const q = String(query ?? '').trim().toLowerCase();
  return !q ? options || [] : (options || []).filter((opt) => opt.label.toLowerCase().includes(q));
}

export function getDropdownOptions(
  options: ReadonlyArray<DropdownOptionInput> = [], query = '', selectedValue = ''
): DropdownOptionEntry[] {
  const normalized = (options || []).map((item) =>
    typeof item === 'string'
      ? { label: item, value: item, selected: item === selectedValue, disabled: false }
      : { label: item.label, value: item.value, selected: item.value === selectedValue, disabled: Boolean(item.disabled) }
  );
  return filterDropdownOptions(normalized, query);
}

export function handleTextInput(event: unknown, disabled?: boolean, onValueChange?: (val: string) => void, onChange?: (event: unknown) => void): void {
  if (disabled) return;
  onValueChange?.(String((event as { target?: { value?: string } })?.target?.value ?? ''));
  onChange?.(event);
}

export interface FormFieldRule<V = string, All = Record<string, any>> {
  required?: boolean | string;
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (value: V, values: All) => string | null | undefined;
  asyncValidate?: (value: V, signal: AbortSignal, values: All) => Promise<string | null | undefined>;
  debounceMs?: number;
}

export interface FormFieldState<V = any> {
  value: V; errorMessage: string; error: boolean; validating: boolean; touched: boolean; dirty: boolean;
}

export interface FormControllerOptions<T extends Record<string, any>> {
  initialValues: T;
  rules?: { [K in keyof T]?: FormFieldRule<T[K], T> };
}

function runSyncRule<V, All>(val: V, allValues: All, rule?: FormFieldRule<V, All>): string {
  if (!rule) return '';
  const isEmpty = typeof val === 'boolean' ? !val : String(val ?? '').trim() === '';
  if (rule.required && isEmpty) return typeof rule.required === 'string' ? rule.required : 'This field is required.';
  const str = typeof val === 'boolean' ? '' : String(val ?? '');
  if (str !== '' && rule.minLength !== undefined) {
    const min = typeof rule.minLength === 'number' ? rule.minLength : rule.minLength.value;
    if (str.length < min) return typeof rule.minLength === 'number' ? `Minimum ${min} characters required.` : rule.minLength.message;
  }
  if (str !== '' && rule.maxLength !== undefined) {
    const max = typeof rule.maxLength === 'number' ? rule.maxLength : rule.maxLength.value;
    if (str.length > max) return typeof rule.maxLength === 'number' ? `Maximum ${max} characters allowed.` : rule.maxLength.message;
  }
  if (str !== '' && rule.pattern !== undefined) {
    const regex = rule.pattern instanceof RegExp ? rule.pattern : rule.pattern.value;
    if (!regex.test(str)) return rule.pattern instanceof RegExp ? 'Invalid format.' : rule.pattern.message;
  }
  return (rule.validate && rule.validate(val, allValues)) || '';
}

function scheduleAsyncRule<T>(
  st: FormFieldState, rule: FormFieldRule<any, T>, allValues: () => T, delay: number,
  isCurrent: () => boolean, signal: AbortSignal, onTimer: (t: ReturnType<typeof setTimeout>) => void, notify: () => void
): Promise<string> {
  return new Promise<string>((resolve) => {
    const exec = async () => {
      try {
        const asyncErr = (await rule.asyncValidate!(st.value, signal, allValues())) || '';
        if (!isCurrent() || signal.aborted) return resolve('');
        Object.assign(st, { validating: false, errorMessage: asyncErr, error: Boolean(asyncErr) });
        notify(); resolve(asyncErr);
      } catch (err: any) {
        if (!isCurrent() || signal.aborted || err?.name === 'AbortError') return resolve('');
        Object.assign(st, { validating: false, errorMessage: err?.message || 'Validation failed.', error: true });
        notify(); resolve(st.errorMessage);
      }
    };
    if (delay <= 0) void exec(); else onTimer(setTimeout(() => void exec(), delay));
  });
}

export function createFormController<T extends Record<string, any>>(options: FormControllerOptions<T>) {
  let baseValues: T = { ...options.initialValues };
  const rules = (options.rules || {}) as Record<string, FormFieldRule<any, T> | undefined>;
  const fields: Record<string, FormFieldState> = {};
  const fieldListeners: Record<string, Set<(s: FormFieldState) => void>> = {};
  const formListeners = new Set<() => void>();
  const timers: Record<string, ReturnType<typeof setTimeout> | undefined> = {};
  const aborters: Record<string, AbortController | undefined> = {};
  const seqs: Record<string, number> = {};

  const ensureField = (name: string): FormFieldState =>
    (fields[name] ||= { value: baseValues[name] ?? '', errorMessage: '', error: false, validating: false, touched: false, dirty: false });
  for (const k of new Set([...Object.keys(baseValues), ...Object.keys(rules)])) ensureField(k);

  const cancelAsync = (name: string) => {
    if (timers[name]) { clearTimeout(timers[name]); delete timers[name]; }
    if (aborters[name]) { aborters[name]!.abort(); delete aborters[name]; }
  };
  const notifyField = (name: string) => {
    const snap = { ...ensureField(name) };
    fieldListeners[name]?.forEach((fn) => fn(snap)); formListeners.forEach((fn) => fn());
  };
  const getValues = (): T => {
    const out: Record<string, any> = { ...baseValues };
    for (const [k, st] of Object.entries(fields)) out[k] = st.value;
    return out as T;
  };
  const validateField = (name: keyof T & string, trigger: 'change' | 'blur' | 'submit' = 'blur'): Promise<string> => {
    const st = ensureField(name), rule = rules[name], syncErr = runSyncRule(st.value, getValues(), rule);
    cancelAsync(name);
    const seq = (seqs[name] = (seqs[name] || 0) + 1);
    const isEmpty = typeof st.value === 'boolean' ? !st.value : String(st.value ?? '').trim() === '';
    if (syncErr || !rule?.asyncValidate || isEmpty) {
      const changed = st.errorMessage !== syncErr || st.error !== Boolean(syncErr) || st.validating;
      Object.assign(st, { errorMessage: syncErr, error: Boolean(syncErr), validating: false });
      if (changed) notifyField(name);
      return Promise.resolve(syncErr);
    }
    const ctrl = (aborters[name] = new AbortController());
    if (!st.validating || st.errorMessage !== '') {
      Object.assign(st, { validating: true, errorMessage: '', error: false }); notifyField(name);
    }
    const delay = trigger === 'submit' ? 0 : (rule.debounceMs ?? 300);
    return scheduleAsyncRule(st, rule, getValues, delay, () => seqs[name] === seq, ctrl.signal, (t) => { timers[name] = t; }, () => notifyField(name));
  };
  const setValue = <K extends keyof T & string>(name: K, value: T[K], opts?: { shouldValidate?: boolean }) => {
    const st = ensureField(name);
    if (st.value === value && !opts?.shouldValidate) return;
    Object.assign(st, { value, dirty: value !== baseValues[name] }); notifyField(name);
    if (opts?.shouldValidate || st.error || (st.touched && rules[name]?.asyncValidate)) void validateField(name, 'change');
  };
  const handleBlur = (name: keyof T & string) => { ensureField(name).touched = true; void validateField(name, 'blur'); };

  return {
    getFieldState: <K extends keyof T & string>(name: K): FormFieldState<T[K]> => ({ ...ensureField(name) }),
    getValues, setValue, handleBlur, validateField,
    bindField: <K extends keyof T & string>(name: K) => {
      const st = ensureField(name);
      return { name, value: st.value, errorMessage: st.errorMessage, error: st.error, validating: st.validating, onValueChange: (val: T[K]) => setValue(name, val), onBlur: () => handleBlur(name) };
    },
    bindCheckboxField: <K extends keyof T & string>(name: K) => {
      const st = ensureField(name);
      return { name, checked: Boolean(st.value), errorMessage: st.errorMessage, error: st.error, onCheckedChange: (checked: boolean) => setValue(name, checked as unknown as T[K], { shouldValidate: true }), onBlur: () => handleBlur(name) };
    },
    bindRadioField: <K extends keyof T & string>(name: K, optionValue: T[K]) => {
      const st = ensureField(name);
      return { name, value: String(optionValue), checked: st.value === optionValue, errorMessage: st.errorMessage, error: st.error, onValueChange: () => setValue(name, optionValue, { shouldValidate: true }), onChange: () => setValue(name, optionValue, { shouldValidate: true }), onBlur: () => handleBlur(name) };
    },
    setFieldError: <K extends keyof T & string>(name: K, message: string) => {
      cancelAsync(name); Object.assign(ensureField(name), { errorMessage: message || '', error: Boolean(message), validating: false }); notifyField(name);
    },
    clearFieldErrors: () => {
      for (const k of Object.keys(fields)) {
        const st = fields[k]!;
        if (st.error || st.errorMessage) { Object.assign(st, { errorMessage: '', error: false }); notifyField(k); }
      }
    },
    subscribeField: <K extends keyof T & string>(name: K, listener: (state: FormFieldState<T[K]>) => void) => {
      ensureField(name); (fieldListeners[name] ||= new Set()).add(listener);
      return () => { fieldListeners[name]?.delete(listener); };
    },
    subscribe: (listener: () => void) => { formListeners.add(listener); return () => { formListeners.delete(listener); }; },
    handleSubmit: async (onValid: (values: T) => void | Promise<void>, onInvalid?: (errors: Record<string, string>) => void) => {
      const keys = Array.from(new Set([...Object.keys(fields), ...Object.keys(rules)])) as (keyof T & string)[];
      keys.forEach((k) => { ensureField(k).touched = true; });
      const results = await Promise.all(keys.map(async (k) => [k, await validateField(k, 'submit')] as const));
      const errors = Object.fromEntries(results.filter(([, err]) => Boolean(err)));
      if (Object.keys(errors).length > 0) { onInvalid?.(errors); return false; }
      await onValid(getValues()); return true;
    },
    reset: (nextInitialValues?: T) => {
      if (nextInitialValues) baseValues = { ...nextInitialValues };
      for (const k of Object.keys(fields)) {
        cancelAsync(k); seqs[k] = (seqs[k] || 0) + 1;
        fields[k] = { value: baseValues[k] ?? '', errorMessage: '', error: false, validating: false, touched: false, dirty: false };
        notifyField(k);
      }
    },
    dispose: () => { for (const k of Object.keys(fields)) cancelAsync(k); formListeners.clear(); },
  };
}

export interface ExtractedFileResult {
  files: unknown[];
  firstFileName: string;
  previewUrl: string;
}

export function extractFilesFromEvent(event: unknown): ExtractedFileResult {
  const ev = event as {
    target?: { files?: ArrayLike<{ name?: string; type?: string }> };
    dataTransfer?: { files?: ArrayLike<{ name?: string; type?: string }> };
  };
  const rawList = ev?.target?.files ?? ev?.dataTransfer?.files;
  const files = rawList ? Array.from(rawList) : [];
  const first = files[0] as { name?: string; type?: string } | undefined;
  const firstFileName = first?.name ?? '';
  let previewUrl = '';
  if (
    first &&
    typeof URL !== 'undefined' &&
    typeof URL.createObjectURL === 'function' &&
    typeof Blob !== 'undefined' &&
    first instanceof Blob
  ) {
    previewUrl = URL.createObjectURL(first);
  }
  return { files, firstFileName, previewUrl };
}

export function handleFileSelectEvent(
  event: unknown,
  onFileNameChange?: (name: string) => void,
  onFilesChange?: (files: unknown[]) => void,
  onPreviewChange?: (url: string) => void
): ExtractedFileResult {
  const ev = event as { preventDefault?: () => void };
  ev?.preventDefault?.();
  const res = extractFilesFromEvent(event);
  if (res.firstFileName) {
    onFileNameChange?.(res.firstFileName);
  }
  if (res.files.length > 0) {
    onFilesChange?.(res.files);
  }
  if (res.previewUrl) {
    onPreviewChange?.(res.previewUrl);
  }
  return res;
}

export function clearFileInputEvent(
  event: unknown,
  onFileNameChange?: (name: string) => void,
  onFilesChange?: (files: unknown[]) => void,
  onClear?: () => void,
  onPreviewChange?: (url: string) => void,
  onValueChange?: (val: string) => void
): void {
  const ev = event as {
    preventDefault?: () => void;
    stopPropagation?: () => void;
    currentTarget?: {
      parentElement?: { querySelector?: (s: string) => { value?: string } | null };
    };
  };
  ev?.preventDefault?.();
  ev?.stopPropagation?.();
  const input = ev?.currentTarget?.parentElement?.querySelector?.('input[type="file"]');
  if (input) {
    input.value = '';
  }
  onFileNameChange?.('');
  onFilesChange?.([]);
  onPreviewChange?.('');
  onValueChange?.('');
  onClear?.();
}

export function handleFileDragEnter(
  event: unknown,
  onDragStateChange?: (dragging: boolean) => void
): void {
  const ev = event as {
    preventDefault?: () => void;
    currentTarget?: {
      _dragDepth?: number;
      setAttribute?: (name: string, value: string) => void;
    };
  };
  ev?.preventDefault?.();
  const el = ev?.currentTarget;
  if (!el) return;
  el._dragDepth = (el._dragDepth || 0) + 1;
  if (el._dragDepth === 1) {
    el.setAttribute?.('data-dragging', 'true');
    onDragStateChange?.(true);
  }
}

export function handleFileDragOver(event: unknown): void {
  const ev = event as { preventDefault?: () => void };
  ev?.preventDefault?.();
}

export function handleFileDragLeave(
  event: unknown,
  onDragStateChange?: (dragging: boolean) => void
): void {
  const ev = event as {
    preventDefault?: () => void;
    currentTarget?: {
      _dragDepth?: number;
      removeAttribute?: (name: string) => void;
    };
  };
  ev?.preventDefault?.();
  const el = ev?.currentTarget;
  if (!el) return;
  el._dragDepth = Math.max(0, (el._dragDepth || 0) - 1);
  if (el._dragDepth === 0) {
    el.removeAttribute?.('data-dragging');
    onDragStateChange?.(false);
  }
}

export function handleFileDropEvent(
  event: unknown,
  onFileNameChange?: (name: string) => void,
  onFilesChange?: (files: unknown[]) => void,
  onDragStateChange?: (dragging: boolean) => void
): ExtractedFileResult {
  const ev = event as {
    preventDefault?: () => void;
    currentTarget?: {
      _dragDepth?: number;
      removeAttribute?: (name: string) => void;
    };
  };
  ev?.preventDefault?.();
  const el = ev?.currentTarget;
  if (el) {
    el._dragDepth = 0;
    el.removeAttribute?.('data-dragging');
    onDragStateChange?.(false);
  }
  return handleFileSelectEvent(event, onFileNameChange, onFilesChange);
}

export function sortTableRows<T>(
  rows: T[],
  sortKey: keyof T | string,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  if (!sortKey || !Array.isArray(rows)) return rows ? [...rows] : [];
  const key = sortKey as keyof T;
  const modifier = direction === 'desc' ? -1 : 1;

  return [...rows].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA === valB) return 0;
    if (valA == null) return 1;
    if (valB == null) return -1;
    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * modifier;
    }
    return String(valA).localeCompare(String(valB), undefined, { numeric: true }) * modifier;
  });
}

export function paginateTableRows<T>(rows: T[], page = 1, pageSize = 10) {
  const totalItems = rows ? rows.length : 0;
  const safePageSize = pageSize > 0 ? pageSize : 10;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * safePageSize;
  const data = rows ? rows.slice(start, start + safePageSize) : [];
  return {
    data,
    totalPages,
    totalItems,
    currentPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

export function filterTableRows<T>(rows: T[], query: string, searchKeys?: Array<keyof T>): T[] {
  if (!query || !query.trim() || !Array.isArray(rows)) return rows ? [...rows] : [];
  const q = query.toLowerCase().trim();
  return rows.filter((row) => {
    const keys = searchKeys || (Object.keys(row as Record<string, unknown>) as Array<keyof T>);
    return keys.some((k) => {
      const val = row[k];
      return val != null && String(val).toLowerCase().includes(q);
    });
  });
}

export interface SelectionState {
  checked: boolean;
  indeterminate: boolean;
  count: number;
}

export function getSelectionState(ids: string[], selected: string[]): SelectionState {
  const picked = new Set(selected || []);
  const visible = Array.from(new Set(ids || []));
  const count = visible.filter((id) => picked.has(id)).length;
  const checked = visible.length > 0 && count === visible.length;
  return { checked, indeterminate: count > 0 && !checked, count };
}

export function toggleSelection(selected: string[], ids: string[], checked: boolean): string[] {
  const next = new Set(selected || []);
  for (const id of ids || []) {
    if (checked) next.add(id);
    else next.delete(id);
  }
  return Array.from(next);
}

export type TableSortDirection = 'asc' | 'desc' | 'none';

export interface TableControllerOptions<T extends Record<string, any>> {
  rows?: T[];
  data?: T[];
  getRowId?: (row: T, index: number) => string;
  searchKeys?: Array<keyof T>;
  initialQuery?: string;
  initialFilters?: Record<string, string>;
  filterFn?: (row: T) => boolean;
  initialSortKey?: keyof T | string;
  initialSortDirection?: TableSortDirection;
  initialPage?: number;
  initialPageSize?: number;
  initialSelectedIds?: string[];
}

export function createTableController<T extends Record<string, any>>(options: TableControllerOptions<T>) {
  const initialList = options.rows ?? options.data;
  let sourceRows = Array.isArray(initialList) ? [...initialList] : [];
  let query = options.initialQuery ?? '';
  let filters: Record<string, string> = { ...(options.initialFilters || {}) };
  let sortKey = options.initialSortKey ? String(options.initialSortKey) : '';
  let sortDirection: TableSortDirection = options.initialSortDirection ?? 'none';
  let page = options.initialPage ?? 1;
  let pageSize = options.initialPageSize ?? 10;
  let selectedIds = Array.isArray(options.initialSelectedIds) ? [...options.initialSelectedIds] : [];
  const resolveRowId = options.getRowId ?? ((row: T, idx: number) => (row.id !== undefined ? String(row.id) : String(idx)));
  const listeners = new Set<() => void>();
  const notify = () => { for (const fn of listeners) fn(); };

  const computeSnapshot = () => {
    const step1 = filterByCriteria(sourceRows, filters);
    const step2 = options.filterFn ? step1.filter(options.filterFn) : step1;
    const filteredRows = filterTableRows(step2, query, options.searchKeys);
    const sortedRows =
      sortKey && (sortDirection === 'asc' || sortDirection === 'desc')
        ? sortTableRows(filteredRows, sortKey, sortDirection)
        : filteredRows;
    const paged = paginateTableRows(sortedRows, page, pageSize);
    const visibleIds = paged.data.map((r, i) => resolveRowId(r, (paged.currentPage - 1) * pageSize + i));
    const selectionState = getSelectionState(visibleIds, selectedIds);
    return {
      rows: paged.data, allRows: sourceRows, filteredRows, sortedRows, visibleRows: paged.data, visibleIds,
      query, filters: { ...filters }, sortKey, sortDirection,
      page: paged.currentPage, currentPage: paged.currentPage, pageSize,
      totalPages: paged.totalPages, totalItems: paged.totalItems, hasNext: paged.hasNext, hasPrev: paged.hasPrev,
      selectedIds: [...selectedIds], selectionState, isEmpty: paged.data.length === 0,
    };
  };

  const setQuery = (nextQuery: string) => { query = nextQuery ?? ''; page = 1; notify(); };
  const setFilter = (key: keyof T | string, value: string) => {
    const k = String(key);
    if (!value || value === 'all') delete filters[k];
    else filters[k] = value;
    page = 1; notify();
  };
  const clearFilters = () => { filters = {}; page = 1; notify(); };

  const toggleSort = (key: keyof T | string) => {
    const k = String(key);
    if (sortKey !== k) { sortKey = k; sortDirection = 'asc'; }
    else if (sortDirection === 'asc') sortDirection = 'desc';
    else if (sortDirection === 'desc') { sortDirection = 'none'; sortKey = ''; }
    else sortDirection = 'asc';
    page = 1; notify();
  };

  const setSort = (key: keyof T | string, direction: TableSortDirection) => {
    sortKey = direction === 'none' ? '' : String(key);
    sortDirection = direction; page = 1; notify();
  };

  const setPage = (nextPage: number) => { page = Math.max(1, nextPage || 1); notify(); };
  const setPageSize = (nextSize: number) => { pageSize = Math.max(1, nextSize || 10); page = 1; notify(); };
  const toggleRow = (id: string, checked?: boolean) => {
    const nextChecked = checked !== undefined ? checked : !selectedIds.includes(id);
    selectedIds = toggleSelection(selectedIds, [id], nextChecked); notify();
  };
  const toggleAllVisible = (checked: boolean) => {
    selectedIds = toggleSelection(selectedIds, computeSnapshot().visibleIds, checked); notify();
  };
  const clearSelection = () => { selectedIds = []; notify(); };
  const setRows = (nextRows: T[]) => {
    sourceRows = Array.isArray(nextRows) ? [...nextRows] : [];
    const allValidIds = sourceRows.map((r, i) => resolveRowId(r, i));
    selectedIds = retainValidIds(allValidIds, selectedIds);
    notify();
  };

  const reset = () => {
    query = options.initialQuery ?? '';
    filters = { ...(options.initialFilters || {}) };
    sortKey = options.initialSortKey ? String(options.initialSortKey) : '';
    sortDirection = options.initialSortDirection ?? 'none';
    page = options.initialPage ?? 1;
    pageSize = options.initialPageSize ?? 10;
    selectedIds = Array.isArray(options.initialSelectedIds) ? [...options.initialSelectedIds] : [];
    notify();
  };

  return {
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    getState: computeSnapshot, setRows, setQuery, setFilter, clearFilters, toggleSort, setSort,
    setPage, setPageSize, toggleRow, toggleAllVisible, clearSelection, reset,
    bindSearch: () => ({ value: query, onValueChange: (q: string) => setQuery(q) }),
    bindHeaderSort: (key: keyof T | string) => {
      const k = String(key);
      const dir: TableSortDirection = sortKey === k ? sortDirection : 'none';
      return { sortable: true, sortDirection: dir, onSort: () => toggleSort(k) };
    },
    bindHeaderCheckbox: () => {
      const snap = computeSnapshot();
      return { checked: snap.selectionState.checked, indeterminate: snap.selectionState.indeterminate, onCheckedChange: (checked: boolean) => toggleAllVisible(checked) };
    },
    bindRow: (id: string) => ({ selected: selectedIds.includes(id) }),
    bindRowCheckbox: (id: string) => ({ checked: selectedIds.includes(id), onCheckedChange: (checked: boolean) => toggleRow(id, checked) }),
    bindPagination: () => {
      const snap = computeSnapshot();
      return { currentPage: snap.page, totalPages: snap.totalPages, onPageChange: (nextPage: number) => setPage(nextPage) };
    },
  };
}

export function scaleLinear(options: { domain: [number, number]; range: [number, number] }) {
  const [d0, d1] = options.domain;
  const [r0, r1] = options.range;
  const spanD = d1 - d0 === 0 ? 1 : d1 - d0;
  const spanR = r1 - r0;
  const fn = (value: number): number => r0 + ((value - d0) / spanD) * spanR;
  fn.ticks = (count = 5): number[] => {
    const step = (d1 - d0) / Math.max(1, count - 1);
    return Array.from({ length: count }, (_, i) => d0 + i * step);
  };
  return fn;
}

export function scaleBand(options: { domain: string[]; range: [number, number]; padding?: number }) {
  const { domain, range, padding = 0.1 } = options;
  const n = domain.length;
  const span = range[1] - range[0];
  const step = n > 0 ? span / (n - padding) : 0;
  const bandwidth = step * (1 - padding);
  const fn = (key: string): number => {
    const idx = domain.indexOf(key);
    return idx >= 0 ? range[0] + idx * step : range[0];
  };
  fn.bandwidth = bandwidth;
  fn.step = step;
  return fn;
}

export function getSmoothBezierPath(points: Array<{ x: number; y: number }>): string {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0]!.x} ${points[0]!.y}`;
  if (points.length === 2) return `M ${points[0]!.x} ${points[0]!.y} L ${points[1]!.x} ${points[1]!.y}`;
  let path = `M ${points[0]!.x} ${points[0]!.y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return path;
}

export function getAreaPath(points: Array<{ x: number; y: number }>, baselineY = 100): string {
  if (!points || points.length === 0) return '';
  const curve = getSmoothBezierPath(points);
  const first = points[0]!;
  const last = points[points.length - 1]!;
  return `${curve} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}

export function getPieSlices(values: number[], radius = 50, innerRadius = 0) {
  const total = values.reduce((acc, v) => acc + (v > 0 ? v : 0), 0);
  if (total <= 0) return [];
  let currentAngle = 0;
  return values.map((val, index) => {
    const fraction = val > 0 ? val / total : 0;
    const startAngle = currentAngle;
    const endAngle = currentAngle + fraction * 2 * Math.PI;
    currentAngle = endAngle;
    const x1 = radius + radius * Math.sin(startAngle);
    const y1 = radius - radius * Math.cos(startAngle);
    const x2 = radius + radius * Math.sin(endAngle);
    const y2 = radius - radius * Math.cos(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    const ix1 = radius + innerRadius * Math.sin(endAngle);
    const iy1 = radius - innerRadius * Math.cos(endAngle);
    const ix2 = radius + innerRadius * Math.sin(startAngle);
    const iy2 = radius - innerRadius * Math.cos(startAngle);
    const path = innerRadius > 0
      ? `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${ix1.toFixed(2)} ${iy1.toFixed(2)} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2.toFixed(2)} ${iy2.toFixed(2)} Z`
      : `M ${radius} ${radius} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
    return { index, value: val, fraction, startAngle, endAngle, path, isDonut: innerRadius > 0 };
  });
}

export interface ChartTooltipContext {
  label: string;
  value: number;
  seriesIndex?: number;
  total?: number;
  percentage?: number;
  x?: number;
  y?: number;
  kind?: string;
}

export interface ChartPt {
  label: string;
  value?: number;
  values?: number[];
  tooltip?: string | ((ctx: ChartTooltipContext) => string);
}

export interface ChartScatterPt {
  label?: string;
  x: number;
  y: number;
  series?: number;
  tooltip?: string | ((ctx: ChartTooltipContext) => string);
}

export interface ChartWaterfallPt {
  label: string;
  value: number;
  isTotal?: boolean;
  tooltip?: string | ((ctx: ChartTooltipContext) => string);
}

function resolveChartTooltip(
  itemTooltip: string | ((ctx: ChartTooltipContext) => string) | undefined,
  formatTooltip: ((ctx: ChartTooltipContext) => string) | undefined,
  ctx: ChartTooltipContext,
  fallback: string
): string {
  if (typeof itemTooltip === 'function') return itemTooltip(ctx);
  if (itemTooltip) return itemTooltip;
  if (typeof formatTooltip === 'function') return formatTooltip(ctx);
  return fallback;
}

const SERIES_BG = ['bg-chart-series-1', 'bg-chart-series-2', 'bg-chart-series-3', 'bg-chart-series-4', 'bg-chart-series-5'];
const SERIES_STROKE = ['stroke-chart-series-1', 'stroke-chart-series-2', 'stroke-chart-series-3', 'stroke-chart-series-4', 'stroke-chart-series-5'];
const SERIES_FILL = ['fill-chart-series-1', 'fill-chart-series-2', 'fill-chart-series-3', 'fill-chart-series-4', 'fill-chart-series-5'];

export function getChartBarState(
  data?: ChartPt[],
  defaultColorClass = 'bg-chart-series-1',
  stacked = false,
  maxScale?: number,
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const rawRows = data || [];
  let max = 0;
  let total = 0;

  for (const r of rawRows) {
    const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
    let rowSum = 0;
    for (const v of vals) {
      if (v > max) max = v;
      if (v > 0) rowSum += v;
      total += v;
    }
    if (stacked && rowSum > max) max = rowSum;
  }

  const scaleMax = maxScale && maxScale > 0 ? maxScale : max;
  const toPct = (val: number) => (scaleMax <= 0 || val < 0 ? '0%' : `${Math.min(100, (val / scaleMax) * 100)}%`);
  const fmtVal = (v: number) => (typeof formatValue === 'function' ? formatValue(v) : String(v));

  const rows = rawRows.map((r, rIdx) => {
    const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
    const rowSum = vals.reduce((acc, v) => acc + (v > 0 ? v : 0), 0);
    const primaryVal = stacked ? rowSum : (vals[0] ?? 0);
    const bars = vals.map((v, sIdx) => ({
      key: `${r.label || rIdx}-bar-${sIdx}`,
      value: v,
      displayValue: fmtVal(v),
      height: toPct(v),
      seriesIndex: sIdx,
      colorClass: sIdx === 0 && defaultColorClass ? defaultColorClass : SERIES_BG[sIdx % SERIES_BG.length]!,
      tooltipText: resolveChartTooltip(
        r.tooltip,
        formatTooltip,
        { label: r.label, value: v, seriesIndex: sIdx, total: rowSum },
        vals.length > 1 ? `${r.label} • Series ${sIdx + 1}: ${fmtVal(v)} (Total: ${fmtVal(rowSum)})` : `${r.label}: ${fmtVal(v)}`
      ),
    }));
    return {
      key: `bar-row-${rIdx}`,
      label: r.label,
      value: primaryVal,
      displayValue: fmtVal(primaryVal),
      height: toPct(primaryVal),
      tooltipText: resolveChartTooltip(
        r.tooltip,
        formatTooltip,
        { label: r.label, value: primaryVal, total: rowSum },
        vals.length > 1
          ? `${r.label}: ${vals.map((v, i) => `S${i + 1} ${fmtVal(v)}`).join(' • ')} (Total: ${fmtVal(rowSum)})`
          : `${r.label}: ${fmtVal(vals[0] ?? 0)}`
      ),
      bars,
    };
  });

  return {
    rows,
    max,
    total,
    barHeight: (val: number) => toPct(val),
  };
}

export function getChartLineState(
  data?: ChartPt[],
  defaultStroke = 'stroke-chart-series-1',
  defaultFill = 'fill-chart-series-1',
  maxScale?: number,
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const rawRows = data || [];
  let max = 0;
  let total = 0;
  let maxSeriesCount = 1;

  for (const r of rawRows) {
    const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
    if (vals.length > maxSeriesCount) maxSeriesCount = vals.length;
    for (const v of vals) {
      if (v > max) max = v;
      total += v;
    }
  }
  const scaleMax = maxScale && maxScale > 0 ? maxScale : (max > 0 ? max : 1);
  if (max <= 0) max = 1;
  const count = rawRows.length;
  const fmtVal = (v: number) => (typeof formatValue === 'function' ? formatValue(v) : String(v));

  const lines = Array.from({ length: maxSeriesCount }, (_, sIdx) => {
    const pts = rawRows.map((r, i) => {
      const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
      const val = vals[sIdx] ?? (sIdx === 0 ? vals[0] ?? 0 : 0);
      const x = count > 1 ? (i / (count - 1)) * 100 : 50;
      const y = 100 - Math.min(100, Math.max(0, (val / scaleMax) * 100));
      return { x, y, val };
    });
    const linePoints = pts.map((p) => `${p.x},${p.y}`).join(' ');
    const firstX = pts[0]?.x ?? 0;
    const lastX = pts[pts.length - 1]?.x ?? 100;
    const areaPoints = pts.length === 0 ? '' : `${firstX},100 ${linePoints} ${lastX},100`;
    return {
      key: `series-line-${sIdx}`,
      seriesIndex: sIdx,
      linePoints,
      areaPoints,
      strokeClass: sIdx === 0 && defaultStroke ? defaultStroke : SERIES_STROKE[sIdx % SERIES_STROKE.length]!,
      fillClass: sIdx === 0 && defaultFill ? defaultFill : SERIES_FILL[sIdx % SERIES_FILL.length]!,
    };
  });

  const points = rawRows.map((r, i) => {
    const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
    const x = count > 1 ? (i / (count - 1)) * 100 : 50;
    const primaryVal = vals[0] ?? 0;
    const y = 100 - Math.min(100, Math.max(0, (primaryVal / scaleMax) * 100));
    const valuesList = vals.map((v, sIdx) => ({
      key: `${r.label || i}-val-${sIdx}`,
      value: v,
      seriesIndex: sIdx,
      colorClass: sIdx === 0 && defaultFill ? defaultFill.replace('fill-', 'bg-') : SERIES_BG[sIdx % SERIES_BG.length]!,
    }));
    return {
      key: `pt-${i}`,
      label: r.label,
      value: primaryVal,
      displayValue: fmtVal(primaryVal),
      x,
      y,
      tooltipText: resolveChartTooltip(
        r.tooltip,
        formatTooltip,
        { label: r.label, value: primaryVal, total },
        vals.length > 1
          ? `${r.label}: ${vals.map((v, idx) => `S${idx + 1} ${fmtVal(v)}`).join(' • ')}`
          : `${r.label}: ${fmtVal(primaryVal)}`
      ),
      valuesList,
    };
  });

  return {
    lines,
    points,
    linePoints: lines[0]?.linePoints ?? '',
    areaPoints: lines[0]?.areaPoints ?? '',
    max,
    total,
  };
}

export function getChartPieState(
  data?: ChartPt[],
  innerRadius = 0,
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const rows = data || [];
  const ringRadius = innerRadius > 0 && innerRadius < 50 ? (50 + innerRadius) / 2 : 25;
  const ringWidth = innerRadius > 0 && innerRadius < 50 ? 50 - innerRadius : 50;
  const circumference = 2 * Math.PI * ringRadius;
  const total = rows.reduce((sum, r) => sum + (r.value ?? 0), 0);
  const hotspotRadius = innerRadius > 0 && innerRadius < 50 ? ringRadius : 28;
  const fmtVal = (v: number) => (typeof formatValue === 'function' ? formatValue(v) : String(v));
  let running = 0;
  const slices = rows.map((r, i) => {
    const val = r.value ?? 0;
    const fraction = total > 0 ? val / total : 0;
    const len = fraction * circumference;
    const offset = -running * circumference;
    const midFraction = running + fraction / 2;
    running += fraction;
    const angle = midFraction * 2 * Math.PI - Math.PI / 2;
    const pct = total > 0 ? Math.round(fraction * 100) : 0;
    const hx = 50 + hotspotRadius * Math.cos(angle);
    const hy = 50 + hotspotRadius * Math.sin(angle);
    return {
      key: `slice-${i}`,
      label: r.label,
      value: val,
      displayValue: fmtVal(val),
      fraction,
      percentage: pct,
      dashArray: `${len} ${circumference - len}`,
      dashOffset: String(offset),
      seriesIndex: i % 5,
      left: `${hx.toFixed(1)}%`,
      top: `${hy.toFixed(1)}%`,
      tooltipText: resolveChartTooltip(
        r.tooltip,
        formatTooltip,
        { label: r.label, value: val, total, percentage: pct, seriesIndex: i },
        `${r.label}: ${fmtVal(val)} (${pct}%)`
      ),
    };
  });
  return { ringRadius, ringWidth, slices, total, displayTotal: fmtVal(total) };
}

export function getChartHorizontalBarState(
  data?: ChartPt[],
  defaultColorClass = 'bg-chart-series-1',
  maxScale = 100,
  valueSuffix = '%',
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const rawRows = data || [];
  let max = 0;
  let total = 0;
  for (const r of rawRows) {
    const v = r.value ?? (r.values && r.values[0]) ?? 0;
    if (v > max) max = v;
    total += v;
  }
  const scaleMax = maxScale > 0 ? Math.max(max, maxScale) : (max > 0 ? max : 100);
  const rows = rawRows.map((r, idx) => {
    const val = r.value ?? (r.values && r.values[0]) ?? 0;
    const pct = scaleMax <= 0 || val <= 0 ? 0 : Math.min(100, Math.round((val / scaleMax) * 100));
    const sharePct = total <= 0 || val <= 0 ? 0 : Math.max(2, Math.round((val / total) * 100));
    const displayValue = typeof formatValue === 'function' ? formatValue(val) : `${val}${valueSuffix}`;
    return {
      key: `hbar-${idx}`,
      label: r.label,
      value: val,
      displayValue,
      width: `${pct}%`,
      shareWidth: `${sharePct}%`,
      colorClass: defaultColorClass || SERIES_BG[idx % SERIES_BG.length]!,
      seriesColorClass: SERIES_BG[idx % SERIES_BG.length]!,
      tooltipText: resolveChartTooltip(
        r.tooltip,
        formatTooltip,
        { label: r.label, value: val, total, percentage: pct, seriesIndex: idx },
        `${r.label}: ${displayValue}`
      ),
    };
  });
  return { rows, max, total };
}

export function getChartScatterState(
  data?: ChartScatterPt[],
  maxX = 100,
  maxY = 100,
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const raw = data || [];
  const safeMaxX = maxX > 0 ? maxX : 100;
  const safeMaxY = maxY > 0 ? maxY : 100;
  const fmtVal = (v: number) => (typeof formatValue === 'function' ? formatValue(v) : String(v));
  const points = raw.map((p, idx) => {
    const sIdx = (p.series ?? 0) % SERIES_BG.length;
    const xPct = Math.min(100, Math.max(0, (p.x / safeMaxX) * 100));
    const yPct = 100 - Math.min(100, Math.max(0, (p.y / safeMaxY) * 100));
    const lbl = p.label || `(${fmtVal(p.x)}, ${fmtVal(p.y)})`;
    return {
      key: `scatter-${idx}`,
      label: lbl,
      x: p.x,
      y: p.y,
      left: `${xPct.toFixed(1)}%`,
      top: `${yPct.toFixed(1)}%`,
      seriesIndex: sIdx,
      colorClass: SERIES_BG[sIdx]!,
      tooltipText: resolveChartTooltip(
        p.tooltip,
        formatTooltip,
        { label: lbl, value: p.y, x: p.x, y: p.y, seriesIndex: sIdx },
        `${p.label ? `${p.label}: ` : `Series ${sIdx + 1}: `}(${fmtVal(p.x)}, ${fmtVal(p.y)})`
      ),
    };
  });
  return { points, maxX: safeMaxX, maxY: safeMaxY };
}

export function getChartRadarState(
  data?: ChartPt[],
  rings = 3,
  maxScale = 100,
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const rows = data || [];
  const n = rows.length;
  if (n < 3) {
    return {
      ringPolygons: [] as Array<{ key: string; points: string }>,
      spokes: [] as Array<{ key: string; x1: number; y1: number; x2: number; y2: number }>,
      axes: [] as Array<{ key: string; label: string; x: number; y: number }>,
      hotspots: [] as Array<{ key: string; left: string; top: string; tooltipText: string }>,
      series: [] as Array<{
        key: string;
        points: string;
        strokeClass: string;
        fillClass: string;
        dots: Array<{ key: string; cx: number; cy: number; fillClass: string }>;
      }>,
    };
  }
  const cx = 100;
  const cy = 100;
  const rMax = 62;
  const rLabel = 82;
  const safeRings = Math.max(1, rings || 3);
  const safeMax = maxScale > 0 ? maxScale : 100;

  let maxSeriesCount = 1;
  for (const r of rows) {
    if (r.values && r.values.length > maxSeriesCount) maxSeriesCount = r.values.length;
  }

  const angleAt = (i: number) => (2 * Math.PI * i) / n - Math.PI / 2;

  const ringPolygons = Array.from({ length: safeRings }, (_, rIdx) => {
    const radius = (rMax * (rIdx + 1)) / safeRings;
    const pts = rows
      .map((_, i) => {
        const a = angleAt(i);
        return `${(cx + radius * Math.cos(a)).toFixed(1)},${(cy + radius * Math.sin(a)).toFixed(1)}`;
      })
      .join(' ');
    return { key: `ring-${rIdx}`, points: pts };
  });

  const spokes = rows.map((_, i) => {
    const a = angleAt(i);
    return {
      key: `spoke-${i}`,
      x1: cx,
      y1: cy,
      x2: Number((cx + rMax * Math.cos(a)).toFixed(1)),
      y2: Number((cy + rMax * Math.sin(a)).toFixed(1)),
    };
  });

  const axes = rows.map((r, i) => {
    const a = angleAt(i);
    return {
      key: `axis-${i}`,
      label: r.label,
      x: Number((cx + rLabel * Math.cos(a)).toFixed(1)),
      y: Number((cy + rLabel * Math.sin(a)).toFixed(1)),
    };
  });

  const fmtVal = (v: number) => (typeof formatValue === 'function' ? formatValue(v) : String(v));
  const hotspots = rows.map((r, i) => {
    const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
    const primaryVal = vals[0] ?? 0;
    const ratio = Math.min(1, Math.max(0, primaryVal / safeMax));
    const a = angleAt(i);
    const hx = cx + rMax * ratio * Math.cos(a);
    const hy = cy + rMax * ratio * Math.sin(a);
    return {
      key: `radar-hotspot-${i}`,
      left: `${(hx / 2).toFixed(1)}%`,
      top: `${(hy / 2).toFixed(1)}%`,
      tooltipText: resolveChartTooltip(
        r.tooltip,
        formatTooltip,
        { label: r.label, value: primaryVal, percentage: Math.round(ratio * 100) },
        vals.length > 1
          ? `${r.label}: ${vals.map((v, idx) => `S${idx + 1} ${fmtVal(v)}`).join(' • ')}`
          : `${r.label}: ${fmtVal(primaryVal)}`
      ),
    };
  });

  const series = Array.from({ length: maxSeriesCount }, (_, sIdx) => {
    const strokeClass = SERIES_STROKE[sIdx % SERIES_STROKE.length]!;
    const fillClass = SERIES_FILL[sIdx % SERIES_FILL.length]!;
    const dots = rows.map((r, i) => {
      const vals = r.values && r.values.length > 0 ? r.values : [r.value ?? 0];
      const val = vals[sIdx] ?? 0;
      const ratio = Math.min(1, Math.max(0, val / safeMax));
      const a = angleAt(i);
      return {
        key: `radar-dot-${sIdx}-${i}`,
        cx: Number((cx + rMax * ratio * Math.cos(a)).toFixed(1)),
        cy: Number((cy + rMax * ratio * Math.sin(a)).toFixed(1)),
        fillClass,
      };
    });
    const points = dots.map((d) => `${d.cx},${d.cy}`).join(' ');
    return { key: `radar-series-${sIdx}`, points, strokeClass, fillClass, dots };
  });

  return { ringPolygons, spokes, axes, hotspots, series };
}

export function getChartGaugeState(
  value = 0,
  min = 0,
  max = 100,
  customTooltip?: string | ((ctx: ChartTooltipContext) => string),
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const num = Number(value);
  const safeVal = Number.isFinite(num) ? num : 0;
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) && max > safeMin ? max : 100;
  const span = safeMax - safeMin;
  const rawPct = span > 0 ? ((safeVal - safeMin) / span) * 100 : 0;
  const percentage = Math.min(100, Math.max(0, Math.round(rawPct)));
  const radius = 44;
  const arcLen = Math.PI * radius;
  const filledLen = (percentage / 100) * arcLen;
  const displayValue = typeof formatValue === 'function' ? formatValue(percentage) : `${percentage}%`;
  const tooltipText = resolveChartTooltip(
    customTooltip,
    formatTooltip,
    { label: 'Gauge', value: safeVal, total: safeMax, percentage },
    `${safeVal} / ${safeMax} (${percentage}%)`
  );
  return {
    percentage,
    arcPath: 'M 16 58 A 44 44 0 0 1 104 58',
    dashArray: `${filledLen.toFixed(2)} ${arcLen.toFixed(2)}`,
    displayValue,
    minLabel: String(safeMin),
    maxLabel: String(safeMax),
    tooltipText,
  };
}

export function getChartFunnelState(
  data?: ChartPt[],
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const raw = data || [];
  let max = 0;
  let total = 0;
  for (const r of raw) {
    const v = r.value ?? (r.values && r.values[0]) ?? 0;
    if (v > max) max = v;
    total += v;
  }
  const steps = raw.map((r, idx) => {
    const val = r.value ?? (r.values && r.values[0]) ?? 0;
    const pct = max <= 0 || val <= 0 ? 0 : Math.max(6, Math.min(100, Math.round((val / max) * 100)));
    const displayValue = typeof formatValue === 'function' ? formatValue(val) : val.toLocaleString('en-US');
    return {
      key: `funnel-${idx}`,
      label: r.label,
      value: val,
      displayValue,
      width: `${pct}%`,
      colorClass: SERIES_BG[idx % SERIES_BG.length]!,
      tooltipText: resolveChartTooltip(
        r.tooltip,
        formatTooltip,
        { label: r.label, value: val, total, percentage: pct, seriesIndex: idx },
        `${r.label}: ${displayValue} (${pct}%)`
      ),
    };
  });
  return { steps, max, total };
}

export function getChartWaterfallState(
  data?: ChartWaterfallPt[],
  maxScale?: number,
  formatTooltip?: (ctx: ChartTooltipContext) => string,
  formatValue?: (val: number) => string
) {
  const raw = data || [];
  let running = 0;
  let maxPeak = 0;

  const computed = raw.map((item, idx) => {
    const val = item.value ?? 0;
    let start = 0;
    let end = val;
    if (idx === 0) {
      start = 0;
      end = val;
      running = val;
    } else if (item.isTotal) {
      start = 0;
      end = val !== 0 ? val : running;
      running = end;
    } else {
      start = running;
      end = running + val;
      running = end;
    }
    const peak = Math.max(Math.abs(start), Math.abs(end));
    if (peak > maxPeak) maxPeak = peak;
    const kind = idx === 0 || item.isTotal ? 'total' : val >= 0 ? 'positive' : 'negative';
    const colorClass =
      kind === 'total'
        ? 'bg-chart-series-1'
        : kind === 'positive'
          ? 'bg-chart-series-2'
          : 'bg-chart-series-4';
    return { item, idx, val, start, end, kind, colorClass };
  });

  const scaleMax = maxScale && maxScale > 0 ? maxScale : Math.max(1, maxPeak);

  const bars = computed.map(({ item, idx, val, start, end, kind, colorClass }) => {
    const low = Math.max(0, Math.min(start, end));
    const span = Math.abs(end - start);
    const bottomPct = Math.min(100, Math.max(0, (low / scaleMax) * 100));
    const heightPct = scaleMax <= 0 || span <= 0 ? 0 : Math.min(100 - bottomPct, Math.max(3, (span / scaleMax) * 100));
    const rawDisp = kind === 'total' ? end : val;
    const displayValue =
      typeof formatValue === 'function'
        ? formatValue(rawDisp)
        : kind === 'total'
          ? String(end)
          : val >= 0
            ? `+${val}`
            : String(val);
    return {
      key: `wf-${idx}`,
      label: item.label,
      value: val,
      displayValue,
      bottom: `${bottomPct.toFixed(1)}%`,
      height: `${heightPct.toFixed(1)}%`,
      kind,
      colorClass,
      tooltipText: resolveChartTooltip(
        item.tooltip,
        formatTooltip,
        { label: item.label, value: rawDisp, total: end, kind },
        kind === 'total' ? `${item.label}: ${displayValue}` : `${item.label}: ${displayValue} (Total: ${end})`
      ),
    };
  });

  return { bars, max: scaleMax, netTotal: running };
}

export interface VirtualWindowOptions {
  totalItems: number;
  itemHeight: number;
  containerHeight: number;
  scrollTop: number;
  overscan?: number;
}

export function getVirtualWindow(options: VirtualWindowOptions) {
  const { totalItems, itemHeight, containerHeight, scrollTop, overscan = 3 } = options;
  if (totalItems <= 0 || itemHeight <= 0) {
    return {
      startIndex: 0,
      endIndex: 0,
      virtualItems: [] as Array<{ index: number; start: number; size: number }>,
      paddingTop: 0,
      paddingBottom: 0,
      totalHeight: 0,
    };
  }
  const totalHeight = totalItems * itemHeight;
  const rawStart = Math.floor(Math.max(0, scrollTop) / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, rawStart - overscan);
  const endIndex = Math.min(totalItems, rawStart + visibleCount + overscan);
  const virtualItems = Array.from({ length: Math.max(0, endIndex - startIndex) }, (_, i) => {
    const index = startIndex + i;
    return { index, start: index * itemHeight, size: itemHeight };
  });
  return {
    startIndex,
    endIndex,
    virtualItems,
    paddingTop: startIndex * itemHeight,
    paddingBottom: Math.max(0, (totalItems - endIndex) * itemHeight),
    totalHeight,
  };
}

export function muteSeriesValues<T extends { values?: number[]; value?: number }>(
  data: ReadonlyArray<T>,
  mutedIndices: ReadonlyArray<number>
): T[] {
  const list = data || [];
  const muted = mutedIndices || [];
  if (muted.length === 0) {
    return list.map((d) => ({ ...d, ...(Array.isArray(d.values) ? { values: [...d.values] } : {}) }));
  }
  const mutedSet = new Set(muted);
  return list.map((item, itemIdx) => {
    if (Array.isArray(item.values)) {
      return { ...item, values: item.values.map((v, sIdx) => (mutedSet.has(sIdx) ? 0 : v)) };
    }
    if (typeof item.value === 'number') {
      return { ...item, value: mutedSet.has(itemIdx) ? 0 : item.value };
    }
    return { ...item };
  });
}

export function filterActiveSeries<T extends { series?: number }>(
  items: ReadonlyArray<T>,
  mutedIndices: ReadonlyArray<number>
): T[] {
  const list = items || [];
  const muted = mutedIndices || [];
  if (muted.length === 0) return [...list];
  const mutedSet = new Set(muted);
  return list.filter((item, idx) => !mutedSet.has(typeof item.series === 'number' ? item.series : idx));
}

export function computeNiceTicks(maxValue: number, count = 5): { max: number; ticks: number[] } {
  const safeCount = Math.max(2, Math.floor(count || 5));
  if (!Number.isFinite(maxValue) || maxValue <= 0) {
    const step = 100 / (safeCount - 1);
    return {
      max: 100,
      ticks: Array.from({ length: safeCount }, (_, i) => Number((100 - i * step).toFixed(4))),
    };
  }
  const rawStep = maxValue / (safeCount - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const residual = rawStep / mag;
  const niceMult = residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 2.5 ? 2.5 : residual <= 5 ? 5 : 10;
  const step = niceMult * mag;
  const niceMax = Number((step * (safeCount - 1)).toPrecision(12));
  const ticks = Array.from({ length: safeCount }, (_, i) =>
    i === safeCount - 1 ? 0 : Number((niceMax - i * step).toPrecision(12))
  );
  return { max: niceMax, ticks };
}

export type ChartZoomRange = [number, number];

export function clampZoomRange(
  range: readonly [number, number] | undefined,
  totalCount: number,
  minSpan = 2
): ChartZoomRange {
  const total = Math.max(0, Math.floor(totalCount || 0));
  if (total === 0) return [0, 0];
  const safeMin = Math.min(total, Math.max(1, Math.floor(minSpan || 1)));
  if (!range || range.length < 2) return [0, total];
  const rawStart = Number.isFinite(range[0]) ? Math.floor(range[0]) : 0;
  const rawEnd = Number.isFinite(range[1]) ? Math.floor(range[1]) : total;
  let start = Math.max(0, Math.min(rawStart, rawEnd));
  let end = Math.min(total, Math.max(rawStart, rawEnd));
  if (end - start < safeMin) {
    const center = Math.round((start + end) / 2);
    start = Math.max(0, Math.min(total - safeMin, center - Math.floor(safeMin / 2)));
    end = Math.min(total, start + safeMin);
  }
  return [start, end];
}

export function zoomRangeAt(
  range: readonly [number, number] | undefined,
  factor: number,
  anchorRatio = 0.5,
  totalCount = 0,
  minSpan = 2
): ChartZoomRange {
  const total = Math.max(0, Math.floor(totalCount || 0));
  if (total === 0) return [0, 0];
  const safeMin = Math.min(total, Math.max(1, Math.floor(minSpan || 1)));
  const [curStart, curEnd] = clampZoomRange(range, total, safeMin);
  const curSpan = curEnd - curStart;
  const safeFactor = Number.isFinite(factor) && factor > 0 ? factor : 1;
  let nextSpan = Math.round(curSpan * safeFactor);
  if (safeFactor < 1 && nextSpan >= curSpan && curSpan > safeMin) nextSpan = curSpan - 1;
  if (safeFactor > 1 && nextSpan <= curSpan && curSpan < total) nextSpan = curSpan + 1;
  nextSpan = Math.max(safeMin, Math.min(total, nextSpan));
  const ratio = Number.isFinite(anchorRatio) ? Math.max(0, Math.min(1, anchorRatio)) : 0.5;
  const anchor = curStart + curSpan * ratio;
  let nextStart = Math.round(anchor - nextSpan * ratio);
  nextStart = Math.max(0, Math.min(total - nextSpan, nextStart));
  return [nextStart, nextStart + nextSpan];
}

export function panZoomRange(
  range: readonly [number, number] | undefined,
  deltaItems: number,
  totalCount: number,
  minSpan = 2
): ChartZoomRange {
  const total = Math.max(0, Math.floor(totalCount || 0));
  if (total === 0) return [0, 0];
  const [curStart, curEnd] = clampZoomRange(range, total, minSpan);
  const span = curEnd - curStart;
  const shift = Number.isFinite(deltaItems) ? Math.round(deltaItems) : 0;
  const nextStart = Math.max(0, Math.min(total - span, curStart + shift));
  return [nextStart, nextStart + span];
}

export function sliceChartWindow<T>(
  data?: ReadonlyArray<T>,
  range?: readonly [number, number]
): T[] {
  const list = data || [];
  if (!range || range.length < 2 || list.length === 0) return [...list];
  const [start, end] = clampZoomRange(range, list.length, 1);
  return list.slice(start, end);
}

export function getNearestPointIndex(ratio: number, count: number): number {
  const total = Math.floor(count || 0);
  if (total <= 0) return -1;
  if (total === 1) return 0;
  const safeRatio = Number.isFinite(ratio) ? Math.max(0, Math.min(1, ratio)) : 0;
  return Math.round(safeRatio * (total - 1));
}

export interface ChartTooltipAnchor {
  open: boolean;
  text: string;
  x: number;
  y: number;
  left: string;
  top: string;
}

export function getChartTooltipAnchor(
  text: string,
  target?: { getBoundingClientRect?: () => { left: number; top: number; width: number; height: number } } | null,
  container?: { getBoundingClientRect?: () => { left: number; top: number; width: number; height: number } } | null,
  offset = 8
): ChartTooltipAnchor {
  if (!target?.getBoundingClientRect || !container?.getBoundingClientRect) {
    return { open: false, text: '', x: 0, y: 0, left: '0px', top: '0px' };
  }
  const tRect = target.getBoundingClientRect();
  const cRect = container.getBoundingClientRect();
  const x = Math.round(tRect.left - cRect.left + tRect.width / 2);
  const y = Math.round(tRect.top - cRect.top - offset);
  return { open: true, text, x, y, left: `${x}px`, top: `${y}px` };
}

export function getSvgTooltipAnchor(
  text: string,
  cx: number,
  cy: number,
  viewWidth: number,
  viewHeight: number,
  offsetPx = 10
): ChartTooltipAnchor {
  const safeW = viewWidth > 0 ? viewWidth : 100;
  const safeH = viewHeight > 0 ? viewHeight : 100;
  const xPct = Number(((cx / safeW) * 100).toFixed(2));
  const yPct = Number(((cy / safeH) * 100).toFixed(2));
  return {
    open: true,
    text,
    x: cx,
    y: cy,
    left: `${xPct}%`,
    top: offsetPx ? `calc(${yPct}% - ${offsetPx}px)` : `${yPct}%`,
  };
}

export const ICON_PATHS: Record<string, string> = {
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  check: 'M20 6 9 17l-5-5',
  checkCircle: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
  arrowLeft: 'M19 12H5M12 19l-7-7 7-7',
  chevronDown: 'm6 9 6 6 6-6',
  chevronUp: 'm18 15-6-6-6 6',
  chevronLeft: 'm15 18-6-6 6-6',
  chevronRight: 'm9 18 6-6-6-6',
  close: 'M18 6 6 18M6 6l12 12',
  search: 'm21 21-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  clock: 'M12 6v6l4 2M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6',
  image: 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM21 15l-5-5L5 21',
  video: 'm22 8-6 4 6 4V8ZM14 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Z',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  info: 'M12 16v-4M12 8h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  warning: 'M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z',
  error: 'm15 9-6 6M9 9l6 6M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  menu: 'M3 12h18M3 6h18M3 18h18',
  external: 'M7 17 17 7M7 7h10v10',
  folder: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
  circle: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
  star: 'm12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  truck: 'M10 17h4V5H2v12h3m15 0h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1',
  trash: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  edit: 'M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z',
  copy: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z',
  refresh: 'M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41',
  send: 'm22 2-7 20-4-9-9-4ZM22 2 11 13',
  heart: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Zm18 2-10 7L2 6',
  eye: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2ZM7 11V7a5 5 0 0 1 10 0v4',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3Z',
  share: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
  loader: 'M21 12a9 9 0 1 1-6.219-8.56',
};

export function getIconPath(name?: string, fallback = 'circle'): string {
  if (!name) return ICON_PATHS[fallback] || ICON_PATHS.circle!;
  if (ICON_PATHS[name]) return ICON_PATHS[name]!;
  const camel = name.replace(/[-_]+([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase());
  if (ICON_PATHS[camel]) return ICON_PATHS[camel]!;
  const trimmed = name.trim();
  if (/^[Mm]\s*[-+\d.]/.test(trimmed)) return trimmed;
  return ICON_PATHS[fallback] || ICON_PATHS.circle!;
}

export function getToastIconPath(type?: string): string {
  if (type === 'success') return ICON_PATHS.checkCircle!;
  if (type === 'error') return ICON_PATHS.error!;
  if (type === 'warning') return ICON_PATHS.warning!;
  return ICON_PATHS.info!;
}

export function getChoiceState(props: { label?: string; leftLabel?: boolean; rightLabel?: boolean; error?: boolean; errorMessage?: string }) {
  const hasLabel = Boolean(props.label && props.label !== '');
  const hasErrorText = Boolean(props.errorMessage && props.errorMessage !== '');
  const hasError = Boolean(props.error || hasErrorText);
  return {
    hasLabel,
    hasError,
    helpText: hasErrorText ? props.errorMessage! : '',
    showLeft: Boolean(props.leftLabel && hasLabel),
    showRight: Boolean(!props.leftLabel && props.rightLabel !== false && hasLabel),
  };
}

export function getSliderState(props: {
  value?: number;
  min?: number;
  max?: number;
  label?: string | ((value: number) => string);
  hint?: string | ((value: number) => string);
  formatValue?: (value: number) => string;
  error?: boolean;
  errorMessage?: string;
}) {
  const val = Number.isFinite(Number(props.value)) ? Number(props.value) : 0;
  const pct = clampPercent(val, props.min ?? 0, props.max ?? 100);
  const hasErrorText = Boolean(props.errorMessage && props.errorMessage !== '');
  const hasError = Boolean(props.error || hasErrorText);
  const resolvedLabel = typeof props.label === 'function' ? props.label(val) : (props.label ?? '');
  const resolvedHint = typeof props.hint === 'function' ? props.hint(val) : (props.hint ?? '');
  const displayValue = typeof props.formatValue === 'function' ? props.formatValue(val) : `${val}`;
  return {
    pct,
    barStyle: { width: `${pct}%` },
    thumbStyle: { left: `${pct}%` },
    resolvedLabel,
    displayValue,
    hasError,
    helpText: hasErrorText ? props.errorMessage! : resolvedHint,
  };
}

export function getInputState(props: { value?: string; defaultValue?: string; error?: boolean; errorMessage?: string; hint?: string | ((value: string) => string); maxLength?: number; validating?: boolean; state?: string }) {
  const hasErrorText = Boolean(props.errorMessage && props.errorMessage !== '');
  const hasError = Boolean(props.error || props.state === 'error' || hasErrorText);
  const valStr = String((props.value !== undefined && props.value !== '' ? props.value : props.defaultValue) ?? '');
  const resolvedHint = typeof props.hint === 'function' ? props.hint(valStr) : (props.hint ?? '');
  return {
    hasError,
    isValidating: Boolean(props.validating),
    helpText: hasErrorText ? props.errorMessage! : resolvedHint,
    countText: `${valStr.length} / ${props.maxLength ?? 200}`,
  };
}

export function getOtpState(props: { value?: string; length?: number; error?: boolean; errorMessage?: string; hint?: string | ((value: string) => string); validating?: boolean; state?: string }) {
  const hasErrorText = Boolean(props.errorMessage && props.errorMessage !== '');
  const hasError = Boolean(props.error || props.state === 'error' || hasErrorText);
  const valStr = String(props.value ?? '');
  const resolvedHint = typeof props.hint === 'function' ? props.hint(valStr) : (props.hint ?? '');
  const digits = computeOtpDigits(props.value, props.length ?? 6).map((char, index) => ({ index, char }));
  return { hasError, isValidating: Boolean(props.validating), digits, helpText: hasErrorText ? props.errorMessage! : resolvedHint };
}

export function getDropdownState<T extends { label: string; value: string }>(props: {
  options?: T[];
  value?: string;
  displayValue?: string | ((value: string) => string);
  placeholder?: string;
  searchQuery?: string;
  open?: boolean;
  error?: boolean;
  errorMessage?: string;
  hint?: string | ((value: string) => string);
  validating?: boolean;
  state?: string;
}) {
  const hasErrorText = Boolean(props.errorMessage && props.errorMessage !== '');
  const hasError = Boolean(props.error || props.state === 'error' || hasErrorText);
  const options = Array.isArray(props.options) ? props.options : [];
  const filtered = filterDropdownOptions(options, props.searchQuery);
  const matched = options.find((o) => o.value === props.value);
  const valStr = String(props.value ?? '');
  const resolvedHint = typeof props.hint === 'function' ? props.hint(valStr) : (props.hint ?? '');
  const customDisplay =
    typeof props.displayValue === 'function'
      ? (valStr !== '' ? props.displayValue(valStr) : '')
      : (props.displayValue ?? '');
  const selectedLabel = matched ? matched.label : '';
  const displayText =
    valStr !== ''
      ? (customDisplay || selectedLabel || valStr)
      : (props.placeholder || 'Select option');
  return {
    hasError,
    isValidating: Boolean(props.validating),
    isOpen: Boolean(props.open || props.state === 'focus'),
    filtered,
    selectedLabel,
    displayText,
    helpText: hasErrorText ? props.errorMessage! : resolvedHint,
  };
}

const DEFAULT_LABEL_BY_MODE: Record<DatePickerMode, string> = {
  single: 'Date',
  range: 'Date range',
  month: 'Month',
  year: 'Year',
};

export interface DatePickerStateInput {
  id?: string;
  name?: string;
  mode?: DatePickerMode;
  editable?: boolean;
  state?: 'closed' | 'open' | 'default' | 'focus' | 'filled' | 'error' | 'disabled';
  open?: boolean;
  viewMode?: string;
  year?: number;
  month?: number;
  value?: number | string;
  selectedYear?: number;
  selectedMonth?: number;
  startYear?: number;
  startMonth?: number;
  endYear?: number;
  endMonth?: number;
  endValue?: number;
  hoverYear?: number;
  hoverMonth?: number;
  hoverValue?: number;
  yearGridTitle?: string;
  inputText?: string;
  displayValue?: string | ((date: DatePickerFormatArg) => string);
  placeholder?: string;
  label?: string;
  hint?: string | ((date: DatePickerFormatArg) => string);
  error?: boolean;
  errorMessage?: string;
  validating?: boolean;
  disabled?: boolean;
  required?: boolean;
  showHint?: boolean;
  hintText?: boolean;
  showLabel?: boolean;
}

export function getDatePickerState(props: DatePickerStateInput) {
  const mode: DatePickerMode =
    props.mode === 'range' || props.mode === 'month' || props.mode === 'year'
      ? props.mode
      : 'single';
  const isDisabled = Boolean(props.disabled || props.state === 'disabled');
  const hasErrorText = Boolean(props.errorMessage && props.errorMessage.trim() !== '');
  const hasError = Boolean(!isDisabled && (props.error || props.state === 'error' || hasErrorText));
  const isValidating = Boolean(props.validating);
  const isOpen = Boolean(!isDisabled && (props.open || props.state === 'open'));
  const defaultYear = mode === 'year' ? 2026 : 2025;
  const cal = getCalendarDays(props.year || defaultYear, props.month || 6);
  const nextYM = shiftYearMonth(cal.year, cal.month, 1);

  const viewMode: DatePickerViewMode =
    props.viewMode === 'days' || props.viewMode === 'months' || props.viewMode === 'years'
      ? props.viewMode
      : mode === 'year'
        ? 'years'
        : mode === 'month'
          ? 'months'
          : 'days';

  const isRangeMode = mode === 'range';
  const isInputMode = Boolean(props.editable);
  const isBottomTriggerMode = false;

  const rawValStr = typeof props.value === 'string' ? props.value.trim() : '';
  const numericVal = typeof props.value === 'number' ? props.value : 0;
  const rangeParts = isRangeMode && rawValStr ? rawValStr.split(/\s*(?:–|—|\s+to\s+)\s*/) : [];
  const parsedRangeStart = rangeParts[0] ? parseDateInput(rangeParts[0], cal.year, cal.month) : null;
  const parsedRangeEnd = rangeParts[1] ? parseDateInput(rangeParts[1], nextYM.year, nextYM.month) : null;
  const parsedValDate =
    !isRangeMode && rawValStr !== ''
      ? parseDateInput(rawValStr.replace(/\s+\d{1,2}:\d{2}(?::\d{2})?$/, ''), cal.year, cal.month)
      : null;

  const defaultSelectedDay = isRangeMode ? (typeof props.value === 'string' && rawValStr === '' ? 0 : 25) : 1;
  const activeDay =
    numericVal > 0
      ? numericVal
      : parsedRangeStart
        ? parsedRangeStart.day
        : parsedValDate
          ? parsedValDate.day
          : defaultSelectedDay;
  const selY =
    props.selectedYear && props.selectedYear > 1900
      ? props.selectedYear
      : parsedValDate
        ? parsedValDate.year
        : cal.year;
  const selM =
    props.selectedMonth && props.selectedMonth >= 1 && props.selectedMonth <= 12
      ? props.selectedMonth
      : parsedValDate
        ? parsedValDate.month
        : cal.month;
  const parsedFromInput =
    props.inputText && props.inputText.trim() !== '' && numericVal <= 0 && !parsedValDate
      ? parseDateInput(props.inputText, cal.year, cal.month)
      : null;
  const effSelY = parsedFromInput ? parsedFromInput.year : selY;
  const effSelM = parsedFromInput ? parsedFromInput.month : selM;
  const effDay = numericVal > 0 ? numericVal : parsedValDate ? parsedValDate.day : parsedFromInput ? parsedFromInput.day : activeDay;
  const startY = props.startYear && props.startYear > 1900 ? props.startYear : parsedRangeStart ? parsedRangeStart.year : selY;
  const startM = props.startMonth && props.startMonth >= 1 && props.startMonth <= 12 ? props.startMonth : parsedRangeStart ? parsedRangeStart.month : selM;
  const endY = props.endYear && props.endYear > 1900 ? props.endYear : parsedRangeEnd ? parsedRangeEnd.year : nextYM.year;
  const endM = props.endMonth && props.endMonth >= 1 && props.endMonth <= 12 ? props.endMonth : parsedRangeEnd ? parsedRangeEnd.month : nextYM.month;
  const endD =
    props.endValue !== undefined && props.endValue >= 0
      ? (typeof props.value === 'string' && rawValStr === '' && !props.selectedYear ? 0 : props.endValue)
      : parsedRangeEnd
        ? parsedRangeEnd.day
        : 9;
  const isHoveringEnd = isRangeMode && endD === 0 && Boolean(props.hoverValue && props.hoverValue > 0);
  const effEndY = isHoveringEnd ? (props.hoverYear && props.hoverYear > 1900 ? props.hoverYear : cal.year) : endY;
  const effEndM = isHoveringEnd ? (props.hoverMonth && props.hoverMonth >= 1 && props.hoverMonth <= 12 ? props.hoverMonth : cal.month) : endM;
  const effEndD = isHoveringEnd ? props.hoverValue! : endD;

  const rangeStartKey = isRangeMode && activeDay > 0 ? toDateKey(startY, startM, activeDay) : 0;
  const rangeEndKey = isRangeMode && effEndD > 0 ? toDateKey(effEndY, effEndM, effEndD) : 0;
  const hasSingleSelection = numericVal > 0 || Boolean(parsedValDate) || Boolean(parsedFromInput);
  const selectedKey = !isRangeMode && hasSingleSelection ? toDateKey(effSelY, effSelM, effDay) : 0;

  const firstPanel = buildCalendarPanel(cal.year, cal.month, {
    selectedKey,
    rangeStartKey,
    rangeEndKey,
    todayDay: 25,
    showPrev: true,
    showNext: !isRangeMode,
  });
  const panels = isRangeMode
    ? [
        firstPanel,
        buildCalendarPanel(nextYM.year, nextYM.month, {
          selectedKey: 0,
          rangeStartKey,
          rangeEndKey,
          todayDay: -1,
          showPrev: false,
          showNext: true,
        }),
      ]
    : [firstPanel];

  const legacyCells = [
    ...cal.leadingBlanks.map((i) => ({ key: `b-${i}`, day: 0, isBlank: true, isSelected: false })),
    ...cal.days.map((day) => ({ key: `d-${day}`, day, isBlank: false, isSelected: hasSingleSelection && day === effDay })),
  ];

  const selectedYearForGrid = mode === 'year' && (!props.year || props.year === 2025) ? 2026 : selY;
  const effDate = { year: effSelY, month: effSelM, day: effDay || 25 };
  const dateStr = formatHumanDate(effDate.year, effDate.month, effDate.day);
  const startDateStr = formatHumanDate(isRangeMode ? startY : selY, isRangeMode ? startM : selM, activeDay || 1);
  const endDateStr = endD > 0 ? formatHumanDate(endY, endM, endD) : '';
  const rangeStr = endDateStr ? `${startDateStr} – ${endDateStr}` : `${startDateStr} – ...`;
  const monthStr = `${MONTH_NAMES[selM - 1]} ${selY}`;
  const yearStr = String(selectedYearForGrid);
  const formatArg = createDatePickerFormatArg({
    year: mode === 'year' ? selectedYearForGrid : effDate.year,
    month: effDate.month,
    day: effDate.day,
    iso: formatDateDisplay(effDate.year, effDate.month, hasSingleSelection ? effDay : effDate.day),
    formatted: mode === 'year' ? yearStr : mode === 'month' ? monthStr : isRangeMode ? rangeStr : dateStr,
    time: '00:00:00',
    startDate: isRangeMode && activeDay > 0 ? new Date(Date.UTC(startY, startM - 1, activeDay)) : (hasSingleSelection ? new Date(Date.UTC(effDate.year, effDate.month - 1, effDate.day)) : null),
    endDate: isRangeMode && endD > 0 ? new Date(Date.UTC(endY, endM - 1, endD)) : null,
    range: rangeStr,
    mode,
    hasValue: isRangeMode ? activeDay > 0 : (mode === 'year' || mode === 'month' || hasSingleSelection),
  });
  const customDisplay =
    typeof props.displayValue === 'function'
      ? (formatArg.hasValue ? props.displayValue(formatArg) : '')
      : (props.displayValue || '');
  const formattedSingle = formatDateDisplay(effSelY, effSelM, hasSingleSelection ? effDay : 0, customDisplay);
  let displayText = formattedSingle;
  let hasValue = formattedSingle !== '';

  if (isRangeMode) {
    if (activeDay <= 0 && (!customDisplay || customDisplay.trim() === '')) {
      displayText = props.placeholder && props.placeholder.trim() !== '' ? props.placeholder : 'Select date range';
      hasValue = false;
    } else {
      const defaultRangeText =
        endD > 0
          ? `${MONTH_ABBR[startM - 1]} ${String(activeDay).padStart(2, '0')}, ${startY} – ${MONTH_ABBR[endM - 1]} ${String(endD).padStart(2, '0')}, ${endY}`
          : `${MONTH_ABBR[startM - 1]} ${String(activeDay).padStart(2, '0')}, ${startY} – ...`;
      displayText = customDisplay && customDisplay.trim() !== '' ? customDisplay : defaultRangeText;
      hasValue = true;
    }
  } else if (mode === 'year') {
    displayText = customDisplay && customDisplay.trim() !== '' ? customDisplay : String(selectedYearForGrid);
    hasValue = true;
  } else if (mode === 'month') {
    displayText = customDisplay || `${MONTH_NAMES[selM - 1]} ${selY}`;
    hasValue = true;
  } else if (formattedSingle === '') {
    displayText = props.placeholder && props.placeholder.trim() !== ''
      ? props.placeholder
      : 'Select a date';
    hasValue = false;
  }

  const inputText =
    props.inputText === '' && (numericVal === -1 || (typeof props.value === 'string' && rawValStr === ''))
      ? ''
      : props.inputText !== undefined && props.inputText !== ''
        ? props.inputText
        : customDisplay || (hasSingleSelection ? formatHumanDate(effSelY, effSelM, effDay) : '');

  const resolvedLabel =
    props.label && props.label.trim() !== ''
      ? props.label
      : DEFAULT_LABEL_BY_MODE[mode];
  const hasLabel = Boolean(props.showLabel !== false && resolvedLabel !== '');
  const defaultHint =
    isRangeMode
      ? endDateStr
        ? `Selected range: ${rangeStr}.`
        : `Start date: ${startDateStr} — select an end date.`
      : mode === 'year'
        ? `Selected year: ${yearStr}.`
        : mode === 'month'
          ? `Selected month: ${monthStr}.`
          : hasSingleSelection
            ? `Selected date: ${dateStr}.`
            : 'Select a date from the calendar.';
  const rawHint =
    typeof props.hint === 'function'
      ? props.hint(formatArg)
      : props.hint && props.hint.trim() !== ''
        ? props.hint
        : defaultHint;
  const resolvedHint = hasErrorText ? props.errorMessage! : rawHint;
  const showHintText = Boolean(
    hasErrorText ||
    props.showHint ||
    props.hintText ||
    typeof props.hint === 'function' ||
    (typeof props.hint === 'string' && props.hint.trim() !== '')
  );

  const isGridMode = viewMode === 'years' || viewMode === 'months';
  const gridTitle =
    viewMode === 'years'
      ? (props.yearGridTitle && props.yearGridTitle.trim() !== '' ? props.yearGridTitle : 'Select Year')
      : `${MONTH_NAMES[cal.month - 1]} ${cal.year}`;
  const yearGridBase = mode === 'year' && (!props.year || props.year === 2025) ? 2026 : cal.year;
  const gridEntries =
    viewMode === 'years'
      ? getYearGridEntries(selectedYearForGrid, yearGridBase).map((y) => ({ key: y.key, value: y.year, label: y.label, isSelected: y.isSelected }))
      : getMonthGridEntries(selM).map((m) => ({ key: m.key, value: m.month, label: m.label, isSelected: m.isSelected }));

  return {
    mode,
    isOpen,
    hasError,
    isDisabled,
    isValidating,
    viewMode,
    isGridMode,
    gridTitle,
    gridEntries,
    isRangeMode,
    isInputMode,
    isBottomTriggerMode,
    weekdays: WEEKDAY_LABELS,
    monthLabel: cal.monthLabel,
    monthShortLabel: cal.monthShortLabel,
    yearLabel: String(cal.year),
    cells: legacyCells,
    panels,
    monthEntries: getMonthGridEntries(selM),
    yearEntries: getYearGridEntries(selectedYearForGrid, yearGridBase),
    hasValue,
    displayText,
    inputText,
    resolvedLabel,
    hasLabel,
    resolvedHint,
    showHintText,
  };
}

export interface TimePickerStateInput {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  editable?: boolean;
  inputText?: string;
  format?: 'HH:mm' | 'HH:mm:ss';
  use12Hours?: boolean;
  stepMinute?: number;
  minuteStep?: number;
  secondStep?: number;
  hourStep?: number;
  label?: string;
  showLabel?: boolean;
  placeholder?: string;
  hint?: string | ((time: TimePickerFormatArg) => string);
  showHint?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  validating?: boolean;
  open?: boolean;
  state?: 'default' | 'open' | 'disabled' | 'error';
  selectedHour?: number;
  selectedMinute?: number;
  selectedSecond?: number;
  selectedPeriod?: 'AM' | 'PM';
}

export function getTimePickerState(props: TimePickerStateInput) {
  const isDisabled = Boolean(props.disabled || props.state === 'disabled');
  const hasErrorText = Boolean(props.errorMessage && props.errorMessage.trim() !== '');
  const hasError = Boolean(!isDisabled && (props.error || props.state === 'error' || hasErrorText));
  const isValidating = Boolean(props.validating);
  const isOpen = Boolean(!isDisabled && (props.open || props.state === 'open'));
  const resolvedLabel = props.label || '';
  const hasLabel = Boolean(props.showLabel !== false && resolvedLabel.trim() !== '');
  const format: 'HH:mm' | 'HH:mm:ss' = props.format === 'HH:mm:ss' ? 'HH:mm:ss' : 'HH:mm';
  const use12Hours = Boolean(props.use12Hours);
  const isInputMode = Boolean(props.editable);
  const hourStep = Math.max(1, Math.min(24, props.hourStep || 1));
  const minuteStep = Math.max(1, Math.min(60, props.minuteStep || props.stepMinute || 1));
  const secondStep = Math.max(1, Math.min(60, props.secondStep || 1));

  const rawVal = props.value !== undefined ? String(props.value) : (props.defaultValue !== undefined ? String(props.defaultValue) : '');
  const parsed = parseTimeInput(rawVal);
  const hasValue = Boolean(parsed);

  const selH = props.selectedHour !== undefined && props.selectedHour >= 0 && props.selectedHour <= 23
    ? props.selectedHour
    : (parsed ? parsed.hour : (use12Hours ? 12 : 0));
  const selM = props.selectedMinute !== undefined && props.selectedMinute >= 0 && props.selectedMinute <= 59
    ? props.selectedMinute
    : (parsed ? parsed.minute : 0);
  const selS = props.selectedSecond !== undefined && props.selectedSecond >= 0 && props.selectedSecond <= 59
    ? props.selectedSecond
    : (parsed ? parsed.second : 0);

  const h12 = selH % 12 === 0 ? 12 : selH % 12;
  const period: 'AM' | 'PM' = props.selectedPeriod || (selH >= 12 ? 'PM' : 'AM');

  const formattedValue = hasValue ? formatTimeDisplay(parsed!.hour, parsed!.minute, parsed!.second, format, use12Hours) : '';
  const iso = hasValue ? `${String(parsed!.hour).padStart(2, '0')}:${String(parsed!.minute).padStart(2, '0')}:${String(parsed!.second).padStart(2, '0')}` : '';

  const formatArg = createTimePickerFormatArg({
    hour: selH,
    minute: selM,
    second: selS,
    hour12: h12,
    period,
    formatted: formattedValue,
    iso,
    hasValue,
  });

  const customDisplay = typeof props.hint === 'function' ? props.hint(formatArg) : '';
  const resolvedHint = hasErrorText ? props.errorMessage! : (customDisplay || (typeof props.hint === 'string' ? props.hint : ''));
  const showHintText = Boolean(props.showHint || hasErrorText);

  // Hour options
  const hourOptions: Array<{ value: number; label: string; isSelected: boolean }> = [];
  if (use12Hours) {
    for (let h = 1; h <= 12; h++) {
      const active24 = period === 'PM' ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h);
      hourOptions.push({
        value: active24,
        label: String(h).padStart(2, '0'),
        isSelected: hasValue && selH === active24,
      });
    }
  } else {
    for (let h = 0; h < 24; h++) {
      hourOptions.push({
        value: h,
        label: String(h).padStart(2, '0'),
        isSelected: hasValue && selH === h,
      });
    }
  }

  // Minute options (pure 60: 00..59 by default)
  const minuteOptions: Array<{ value: number; label: string; isSelected: boolean }> = [];
  for (let m = 0; m < 60; m += minuteStep) {
    minuteOptions.push({
      value: m,
      label: String(m).padStart(2, '0'),
      isSelected: hasValue && selM === m,
    });
  }

  // Second options (pure 60: 00..59 by default)
  const secondOptions: Array<{ value: number; label: string; isSelected: boolean }> = [];
  if (format === 'HH:mm:ss') {
    for (let s = 0; s < 60; s += secondStep) {
      secondOptions.push({
        value: s,
        label: String(s).padStart(2, '0'),
        isSelected: hasValue && selS === s,
      });
    }
  }

  const periodOptions = [
    { value: 'AM', label: 'AM', isSelected: hasValue && period === 'AM' },
    { value: 'PM', label: 'PM', isSelected: hasValue && period === 'PM' },
  ];

  return {
    isDisabled,
    hasError,
    isValidating,
    isOpen,
    resolvedLabel,
    hasLabel,
    hasValue,
    isInputMode,
    inputText: props.inputText !== undefined ? props.inputText : (hasValue ? formattedValue : ''),
    displayText: formattedValue || props.placeholder || (use12Hours ? '12:00 AM' : '00:00'),
    iso,
    format,
    use12Hours,
    hour: selH,
    minute: selM,
    second: selS,
    period,
    showHintText,
    resolvedHint,
    hourOptions,
    minuteOptions,
    secondOptions,
    periodOptions,
    formatArg,
  };
}

export function getFileState<T extends { id: string; name: string; status: string } = { id: string; name: string; status: string }>(props: {
  fileName?: string;
  value?: string;
  placeholder?: string;
  fileCount?: string | ((count: number) => string);
  error?: boolean;
  errorMessage?: string;
  validating?: boolean;
  hint?: string | ((fileName: string) => string);
  files?: T[];
  state?: string;
}) {
  const hasErrorText = Boolean(props.errorMessage && props.errorMessage !== '');
  const hasError = Boolean(props.error || props.state === 'error' || hasErrorText);
  const rawFileName = typeof props.fileName === 'string' ? props.fileName.trim() : '';
  const rawValue = typeof props.value === 'string' ? props.value.trim() : '';
  const effFileName = rawFileName !== '' ? rawFileName : rawValue;
  const hasFile = Boolean(effFileName !== '');
  const files = Array.isArray(props.files) ? props.files : [];
  const resolvedHint = typeof props.hint === 'function' ? props.hint(effFileName) : (props.hint ?? '');
  const resolvedFileCount = typeof props.fileCount === 'function' ? props.fileCount(files.length) : (props.fileCount ?? '');
  return {
    hasError,
    isValidating: Boolean(props.validating),
    hasFile,
    helpText: hasErrorText ? props.errorMessage! : resolvedHint,
    displayName: hasFile ? effFileName : (props.placeholder || 'No file chosen'),
    resolvedFileCount,
    files,
  };
}

export interface CrumbItem { label: string; href?: string; }
export interface CrumbEntry { key: string; label: string; href: string; isEllipsis: boolean; isCurrent: boolean; originalIndex: number; }

export function getBreadcrumbState(props: { items?: CrumbItem[]; type?: string; showEllipsis?: boolean; maxItems?: number }): CrumbEntry[] {
  const all = props.items || [];
  const total = all.length;
  const rows: CrumbEntry[] = [];
  if (total === 0) return rows;
  let start = 0;
  const end = total - 1;
  let collapsed = false;
  if (props.type === '1') start = total - 1;
  else if (props.type === '2') start = total > 1 ? total - 2 : total - 1;
  else if (props.showEllipsis && total > (props.maxItems || 4)) collapsed = true;
  if (!collapsed) {
    for (let i = start; i <= end; i++) {
      rows.push({ key: `crumb-${i}`, label: all[i]!.label, href: all[i]!.href || '#', isEllipsis: false, isCurrent: i === end, originalIndex: i });
    }
    return rows;
  }
  rows.push({ key: 'crumb-first', label: all[0]!.label, href: all[0]!.href || '#', isEllipsis: false, isCurrent: false, originalIndex: 0 });
  rows.push({ key: 'crumb-ellipsis', label: '...', href: '#', isEllipsis: true, isCurrent: false, originalIndex: -1 });
  for (let i = end - 1; i <= end; i++) {
    rows.push({ key: `crumb-${i}`, label: all[i]!.label, href: all[i]!.href || '#', isEllipsis: false, isCurrent: i === end, originalIndex: i });
  }
  return rows;
}

export function getPaginationState(currentPage = 1, totalPages = 1, getPageAriaLabel?: (page: number) => string) {
  const total = totalPages > 0 ? totalPages : 1;
  const current = Math.min(Math.max(1, currentPage || 1), total);
  const entries = getPaginationEntries(current, total).map((e) => ({
    ...e,
    ariaLabel: e.isEllipsis ? undefined : (typeof getPageAriaLabel === 'function' ? getPageAriaLabel(e.page) : `Page ${e.label}`),
  }));
  return { current, total, canPrev: current > 1, canNext: current < total, entries };
}

export function getStepperStepState(index: number, current = 1, total = 0) {
  const pos = index + 1;
  return {
    isCompleted: pos < current,
    isCurrent: pos === current,
    isLast: index === total - 1,
    stepKey: pos < current ? 'completed' : pos === current ? 'active' : 'upcoming',
    prevCompleted: index < current,
  };
}

export function getProgressState(value = 0, label?: string | ((percentage: number) => string)) {
  const percentage = Math.min(100, Math.max(0, value || 0));
  const resolvedLabel = typeof label === 'function' ? label(percentage) : (label ?? 'Progress');
  return { percentage, barStyle: { width: `${percentage}%` }, resolvedLabel };
}

export function getAvatarState(props: { showStatus?: boolean; status?: string; alt?: string; initialsText?: string }) {
  const baseName = props.alt || props.initialsText || 'Avatar';
  const accessibleName = props.showStatus && props.status ? `${baseName} (${props.status})` : baseName;
  return { accessibleName };
}

export interface TableColItem { id: string; label: string; align?: 'left' | 'center' | 'right'; }
export interface TableCellConfig {
  value?: string;
  secondaryValue?: string;
  badgeLabel?: string;
  buttonLabel?: string;
  imageSrc?: string;
  avatarInitials?: string;
  statusLabel?: string;
  href?: string;
  align?: 'left' | 'center' | 'right';
}
export type TableCellInput = string | TableCellConfig;
export interface TableRowItem { id: string; cells: TableCellInput[]; selected?: boolean; }
export interface TableRowCellItem {
  value: string;
  secondaryValue: string;
  badgeLabel: string;
  buttonLabel: string;
  imageSrc: string;
  avatarInitials: string;
  statusLabel: string;
  href: string;
  align: 'left' | 'center' | 'right';
}

export function getTableBodyRowCells(cells: TableCellInput[] = [], columns?: TableColItem[]): TableRowCellItem[] {
  return (cells || []).map((cell, index) => {
    const colAlign = columns?.[index]?.align || 'left';
    if (typeof cell === 'string') {
      return { value: cell, secondaryValue: '', badgeLabel: '', buttonLabel: '', imageSrc: '', avatarInitials: '', statusLabel: '', href: '', align: colAlign };
    }
    return {
      value: cell?.value || '',
      secondaryValue: cell?.secondaryValue || '',
      badgeLabel: cell?.badgeLabel || '',
      buttonLabel: cell?.buttonLabel || '',
      imageSrc: cell?.imageSrc || '',
      avatarInitials: cell?.avatarInitials || '',
      statusLabel: cell?.statusLabel || '',
      href: cell?.href || '',
      align: cell?.align || colAlign,
    };
  });
}

export function getTableState(props: {
  state?: string;
  columns?: TableColItem[];
  rows?: TableRowItem[];
  showNo?: boolean;
  showCheckbox?: boolean;
  pageSizeOptions?: number[];
}) {
  const columns = props.columns || [];
  const rows = props.state === 'empty' ? [] : (props.rows || []);
  const isEmpty = props.state === 'empty' || rows.length === 0;
  const colSpan = Math.max(1, columns.length + (props.showNo ? 1 : 0) + (props.showCheckbox ? 1 : 0));
  const selectedCount = rows.filter((r) => r.selected).length;
  const allSelected = rows.length > 0 && selectedCount === rows.length;
  const indeterminate = selectedCount > 0 && selectedCount < rows.length;
  const pageSizeOptions = props.pageSizeOptions && props.pageSizeOptions.length > 0 ? props.pageSizeOptions : [10, 20, 50];
  return { columns, rows, isEmpty, colSpan, allSelected, indeterminate, pageSizeOptions };
}

const TRACKED_KEYS = [
  'value', 'checked', 'pressed', 'activeTab', 'currentPage', 'pageSize', 'sortDirection',
  'open', 'state', 'mode', 'editable', 'type', 'viewMode', 'searchQuery', 'searchValue', 'fileName', 'imageSrc',
  'files', 'month', 'year', 'selectedMonth', 'selectedYear', 'startMonth', 'startYear', 'endValue', 'endMonth', 'endYear', 'hoverValue', 'hoverMonth', 'hoverYear', 'label', 'inputText', 'displayValue', 'error', 'errorMessage', 'validating', 'disabled', 'required',
  'selectedHour', 'selectedMinute', 'selectedSecond', 'selectedPeriod',
] as const;

function isSamePropValue(a: any, b: any): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}

export function bindControllerProps<P extends Record<string, any>>(
  rawProps: P,
  state: Record<string, any>,
  setState: (updater: (prev: Record<string, any>) => Record<string, any>) => void
): P {
  if (rawProps.__store && typeof rawProps.__store.getSnapshot === 'function') {
    if (state.__boundStore !== rawProps.__store && typeof rawProps.__store.subscribeChanges === 'function') {
      state.__unsubStore?.();
      state.__boundStore = rawProps.__store;
      state.__unsubStore = rawProps.__store.subscribeChanges(() => {
        setState((prev) => ({ ...prev, __storeTick: (prev.__storeTick || 0) + 1 }));
      });
    }
    const { onAction: _a, onClose: _c, onCancel: _x, onConfirm: _ok, ...snapProps } = rawProps.__store.getSnapshot();
    const { onAction: _oa, onClose: _oc, onCancel: _ox, onConfirm: _ook, ...overProps } = rawProps.__overrides || {};
    rawProps = { ...rawProps, ...snapProps, ...overProps };
  }
  const prevProps = (state.__prevProps || {}) as Record<string, any>;
  const synced: Record<string, any> = { ...state };
  let propChanged = false;
  for (const key of TRACKED_KEYS) {
    if (key in rawProps && !isSamePropValue(rawProps[key], prevProps[key])) {
      synced[key] = rawProps[key];
      propChanged = true;
    }
  }
  if (propChanged) {
    if ('mode' in rawProps && rawProps.mode !== prevProps.mode) {
      delete synced.viewMode;
      delete synced.displayValue;
      delete synced.inputText;
      delete synced.selectedMonth;
      delete synced.selectedYear;
      delete synced.startMonth;
      delete synced.startYear;
      delete synced.hoverValue;
      delete synced.hoverMonth;
      delete synced.hoverYear;
    }
    state.__prevProps = { ...rawProps };
    for (const key of TRACKED_KEYS) {
      if (key in synced) state[key] = synced[key];
    }
  }
  const update = (patch: Record<string, any>) => {
    setState((prev) => ({ ...prev, __prevProps: { ...rawProps }, ...patch }));
  };
  const resolved: Record<string, any> = { ...rawProps };
  for (const key of TRACKED_KEYS) {
    if (state[key] !== undefined && isSamePropValue(rawProps[key], prevProps[key])) {
      resolved[key] = state[key];
    }
  }
  if (state.value === undefined && (resolved.value === undefined || resolved.value === '') && rawProps.defaultValue) {
    resolved.value = rawProps.defaultValue;
  }
  if (typeof resolved.value === 'boolean' && rawProps.checked === undefined && state.checked === undefined) {
    resolved.checked = resolved.value;
  }
  if (!resolved.fileName && typeof resolved.value === 'string' && resolved.value !== '' && 'fileName' in rawProps) {
    resolved.fileName = resolved.value;
  }
  const applyDateSelection = (sel: { year: number; month: number; day: number }) => {
    const mode = resolved.mode || 'single';
    if (mode === 'range') {
      if (!state.__rangeSelectingEnd) {
        const disp = `${MONTH_ABBR[sel.month - 1]} ${String(sel.day).padStart(2, '0')}, ${sel.year} – ...`;
        update({
          year: sel.year,
          month: sel.month,
          startYear: sel.year,
          startMonth: sel.month,
          selectedYear: sel.year,
          selectedMonth: sel.month,
          value: sel.day,
          endValue: 0,
          hoverValue: 0,
          hoverMonth: 0,
          hoverYear: 0,
          displayValue: disp,
          __rangeSelectingEnd: true,
        });
      } else {
        const sY = resolved.startYear || resolved.selectedYear || resolved.year || sel.year;
        const sM = resolved.startMonth || resolved.selectedMonth || resolved.month || sel.month;
        const sD = resolved.value || sel.day;
        const startKey = toDateKey(sY, sM, sD);
        const endKey = toDateKey(sel.year, sel.month, sel.day);
        const [fY, fM, fD, tY, tM, tD] =
          endKey < startKey
            ? [sel.year, sel.month, sel.day, sY, sM, sD]
            : [sY, sM, sD, sel.year, sel.month, sel.day];
        const disp = `${MONTH_ABBR[fM - 1]} ${String(fD).padStart(2, '0')}, ${fY} – ${MONTH_ABBR[tM - 1]} ${String(tD).padStart(2, '0')}, ${tY}`;
        const isoRange = `${fY}-${String(fM).padStart(2, '0')}-${String(fD).padStart(2, '0')} – ${tY}-${String(tM).padStart(2, '0')}-${String(tD).padStart(2, '0')}`;
        update({
          year: fY,
          month: fM,
          startYear: fY,
          startMonth: fM,
          selectedYear: fY,
          selectedMonth: fM,
          value: fD,
          endYear: tY,
          endMonth: tM,
          endValue: tD,
          hoverValue: 0,
          hoverMonth: 0,
          hoverYear: 0,
          displayValue: disp,
          __rangeSelectingEnd: false,
        });
        rawProps.onValueChange?.(isoRange);
        rawProps.onBlur?.();
      }
      return;
    }
    const human = formatHumanDate(sel.year, sel.month, sel.day);
    const isoDate = `${sel.year}-${String(sel.month).padStart(2, '0')}-${String(sel.day).padStart(2, '0')}`;
    const outVal = isoDate;
    update({
      year: sel.year,
      month: sel.month,
      selectedYear: sel.year,
      selectedMonth: sel.month,
      value: sel.day,
      displayValue: human,
      inputText: human,
      open: false,
      state: 'closed',
    });
    rawProps.onValueChange?.(outVal);
    rawProps.onBlur?.();
  };

  return {
    ...resolved,
    onHourSelect: (hour: number) => {
      const curM = resolved.selectedMinute ?? (parseTimeInput(resolved.value)?.minute ?? 0);
      const curS = resolved.selectedSecond ?? (parseTimeInput(resolved.value)?.second ?? 0);
      const curFmt = resolved.format || 'HH:mm';
      const cur12 = Boolean(resolved.use12Hours);
      const timeStr = formatTimeDisplay(hour, curM, curS, curFmt, cur12);
      update({ selectedHour: hour, value: timeStr, inputText: timeStr });
      rawProps.onHourSelect?.(hour);
      rawProps.onValueChange?.(timeStr);
    },
    onMinuteSelect: (minute: number) => {
      const curH = resolved.selectedHour ?? (parseTimeInput(resolved.value)?.hour ?? 0);
      const curS = resolved.selectedSecond ?? (parseTimeInput(resolved.value)?.second ?? 0);
      const curFmt = resolved.format || 'HH:mm';
      const cur12 = Boolean(resolved.use12Hours);
      const timeStr = formatTimeDisplay(curH, minute, curS, curFmt, cur12);
      update({ selectedMinute: minute, value: timeStr, inputText: timeStr, open: false, state: 'closed' });
      rawProps.onMinuteSelect?.(minute);
      rawProps.onValueChange?.(timeStr);
      rawProps.onBlur?.();
    },
    onSecondSelect: (second: number) => {
      const curH = resolved.selectedHour ?? (parseTimeInput(resolved.value)?.hour ?? 0);
      const curM = resolved.selectedMinute ?? (parseTimeInput(resolved.value)?.minute ?? 0);
      const curFmt = resolved.format || 'HH:mm:ss';
      const cur12 = Boolean(resolved.use12Hours);
      const timeStr = formatTimeDisplay(curH, curM, second, curFmt, cur12);
      update({ selectedSecond: second, value: timeStr, inputText: timeStr });
      rawProps.onSecondSelect?.(second);
      rawProps.onValueChange?.(timeStr);
    },
    onPeriodSelect: (period: 'AM' | 'PM') => {
      let curH = resolved.selectedHour ?? (parseTimeInput(resolved.value)?.hour ?? 0);
      const curM = resolved.selectedMinute ?? (parseTimeInput(resolved.value)?.minute ?? 0);
      const curS = resolved.selectedSecond ?? (parseTimeInput(resolved.value)?.second ?? 0);
      if (period === 'PM' && curH < 12) curH += 12;
      if (period === 'AM' && curH >= 12) curH -= 12;
      const curFmt = resolved.format || 'HH:mm';
      const timeStr = formatTimeDisplay(curH, curM, curS, curFmt, true);
      update({ selectedPeriod: period, selectedHour: curH, value: timeStr, inputText: timeStr });
      rawProps.onPeriodSelect?.(period);
      rawProps.onValueChange?.(timeStr);
    },
    onValueChange: (val: any) => { update({ value: val, ...(typeof val === 'boolean' ? { checked: val } : {}) }); rawProps.onValueChange?.(val); },
    onChange: (val: any) => {
      if (val && typeof val === 'object' && ('target' in val || 'nativeEvent' in val || 'currentTarget' in val)) {
        rawProps.onChange?.(val);
        return;
      }
      update({ value: val, checked: typeof val === 'boolean' ? val : true });
      rawProps.onChange?.(val);
      rawProps.onValueChange?.(val);
    },
    onCheckedChange: (checked: boolean) => { update({ checked, value: checked }); rawProps.onCheckedChange?.(checked); rawProps.onValueChange?.(checked); },
    onPressedChange: (val: boolean) => { update({ pressed: val }); rawProps.onPressedChange?.(val); },
    onTabChange: (id: string) => { update({ activeTab: id }); rawProps.onTabChange?.(id); },
    onPageChange: (p: number) => { update({ currentPage: p }); rawProps.onPageChange?.(p); },
    onPageSizeChange: (size: number) => { update({ pageSize: size, currentPage: 1 }); rawProps.onPageSizeChange?.(size); },
    onOpenChange: (o: boolean) => { update({ open: o, state: o ? 'open' : 'closed', ...(!o ? { searchQuery: '', searchValue: '' } : {}) }); rawProps.onOpenChange?.(o); if (!o) rawProps.onBlur?.(); },
    onCancel: () => { update({ open: false, state: 'closed' }); rawProps.onCancel?.(); rawProps.onClose?.(); },
    onConfirm: () => { update({ open: false, state: 'closed' }); rawProps.onConfirm?.(); },
    onClose: () => { update({ open: false, state: 'closed' }); rawProps.onClose?.(); },
    onSort: () => {
      const cur = resolved.sortDirection || 'none';
      const next = cur === 'asc' ? 'desc' : cur === 'desc' ? 'none' : 'asc';
      update({ sortDirection: next });
      rawProps.onSort?.();
    },
    onSearchChange: (q: string) => { update({ searchQuery: q, searchValue: q }); rawProps.onSearchChange?.(q); },
    onFileNameChange: (name: string) => { update({ fileName: name, value: name, ...(name === '' ? { imageSrc: '' } : {}) }); rawProps.onFileNameChange?.(name); rawProps.onValueChange?.(name); },
    onFilesChange: (files: any[]) => {
      const isMultiFile = 'files' in rawProps || !('fileName' in rawProps);
      update({ files, ...(isMultiFile ? {} : (files.length === 0 ? { fileName: '', value: '' } : {})) });
      rawProps.onFilesChange?.(files);
      if (isMultiFile) {
        rawProps.onValueChange?.(files);
      }
    },
    onRemove: (id?: string) => {
      if ('fileName' in rawProps) {
        update({ fileName: '', value: '', imageSrc: '' });
      }
      rawProps.onRemove?.(id);
    },
    onPreviewChange: (url: string) => { update({ imageSrc: url }); rawProps.onPreviewChange?.(url); },
    onSelect: (val: any, second?: boolean) => {
      if (typeof second === 'boolean') {
        update({ checked: second });
      } else if (typeof val === 'number') {
        applyDateSelection({ year: resolved.year || 2025, month: resolved.month || 6, day: val });
      } else if (val && typeof val === 'object' && typeof val.day === 'number') {
        applyDateSelection(val);
      } else {
        update({ value: val, open: false, state: 'closed', searchQuery: '', searchValue: '' });
      }
      rawProps.onSelect?.(val, second);
    },
    onRangeSelect: (sel: { year: number; month: number; day: number }) => {
      applyDateSelection(sel);
      rawProps.onRangeSelect?.(sel);
      rawProps.onSelect?.(sel.day);
    },
    onHoverDate: (sel: { year: number; month: number; day: number }) => {
      const mode = resolved.mode || 'single';
      if ((mode === 'range' && (state.__rangeSelectingEnd || resolved.endValue === 0)) || (sel.day === 0 && resolved.hoverValue)) {
        update({ hoverYear: sel.year, hoverMonth: sel.month, hoverValue: sel.day });
      }
      rawProps.onHoverDate?.(sel);
    },
    onMonthStep: (delta: number) => {
      const mode = resolved.mode || 'single';
      const vMode = resolved.viewMode || (mode === 'year' ? 'years' : mode === 'month' ? 'months' : 'days');
      const curY = resolved.year || (mode === 'year' ? 2026 : 2025);
      const curM = resolved.month || 6;
      const selY = resolved.selectedYear || curY;
      const selM = resolved.selectedMonth || curM;
      if (vMode === 'years') {
        update({ year: curY + delta * 9, selectedYear: selY, selectedMonth: selM });
      } else if (vMode === 'months') {
        update({ year: curY + delta, selectedYear: selY, selectedMonth: selM });
      } else {
        const next = shiftYearMonth(curY, curM, delta);
        if (mode === 'range') {
          const nextPanelYM = shiftYearMonth(curY, curM, 1);
          update({
            year: next.year,
            month: next.month,
            startYear: resolved.startYear || selY,
            startMonth: resolved.startMonth || selM,
            selectedYear: selY,
            selectedMonth: selM,
            endYear: resolved.endYear || nextPanelYM.year,
            endMonth: resolved.endMonth || nextPanelYM.month,
          });
        } else {
          update({ year: next.year, month: next.month, selectedYear: selY, selectedMonth: selM });
        }
      }
      rawProps.onMonthStep?.(delta);
    },
    onMonthChange: (m: number) => {
      const safeM = Math.min(12, Math.max(1, m));
      const y = resolved.year || 2025;
      if ((resolved.mode || 'single') === 'month') {
        update({ month: safeM, selectedMonth: safeM, selectedYear: y, displayValue: `${MONTH_NAMES[safeM - 1]} ${y}`, open: false, state: 'closed' });
        rawProps.onValueChange?.(`${y}-${String(safeM).padStart(2, '0')}`);
        rawProps.onBlur?.();
      } else {
        update({ month: safeM, viewMode: 'days', selectedYear: resolved.selectedYear || y, selectedMonth: resolved.selectedMonth || (resolved.month || 6) });
      }
      rawProps.onMonthChange?.(safeM);
    },
    onYearChange: (y: number) => {
      if ((resolved.mode || 'single') === 'year') {
        update({ year: y, selectedYear: y, displayValue: String(y), open: false, state: 'closed' });
        rawProps.onValueChange?.(String(y));
        rawProps.onBlur?.();
      } else {
        update({ year: y, viewMode: 'days', selectedYear: resolved.selectedYear || (resolved.year || 2025), selectedMonth: resolved.selectedMonth || (resolved.month || 6) });
      }
      rawProps.onYearChange?.(y);
    },
    onGridSelect: (val: number) => {
      const mode = resolved.mode || 'single';
      const vMode = resolved.viewMode || (mode === 'year' ? 'years' : mode === 'month' ? 'months' : 'days');
      if (vMode === 'years') {
        if (mode === 'year') {
          update({ year: val, selectedYear: val, displayValue: String(val), open: false, state: 'closed' });
          rawProps.onValueChange?.(String(val));
          rawProps.onBlur?.();
        } else {
          update({ year: val, viewMode: 'days', selectedYear: resolved.selectedYear || (resolved.year || 2025), selectedMonth: resolved.selectedMonth || (resolved.month || 6) });
        }
        rawProps.onYearChange?.(val);
      } else {
        const safeM = Math.min(12, Math.max(1, val));
        const y = resolved.year || 2025;
        if (mode === 'month') {
          update({ month: safeM, selectedMonth: safeM, selectedYear: y, displayValue: `${MONTH_NAMES[safeM - 1]} ${y}`, open: false, state: 'closed' });
          rawProps.onValueChange?.(`${y}-${String(safeM).padStart(2, '0')}`);
          rawProps.onBlur?.();
        } else {
          update({ month: safeM, viewMode: 'days', selectedYear: resolved.selectedYear || y, selectedMonth: resolved.selectedMonth || (resolved.month || 6) });
        }
        rawProps.onMonthChange?.(safeM);
      }
    },
    onViewModeChange: (mode: DatePickerViewMode) => {
      update({ viewMode: mode });
      rawProps.onViewModeChange?.(mode);
    },
    onInputChange: (text: string) => {
      const isTime = 'onHourSelect' in rawProps || 'selectedHour' in rawProps || ('format' in rawProps && !('mode' in rawProps));
      if (isTime) {
        if (text === '') {
          update({ inputText: '', value: '', selectedHour: 0, selectedMinute: 0, selectedSecond: 0 });
          rawProps.onValueChange?.('');
        } else {
          const parsed = parseTimeInput(text);
          if (parsed) {
            const curFmt = resolved.format || 'HH:mm';
            const cur12 = Boolean(resolved.use12Hours);
            const timeStr = formatTimeDisplay(parsed.hour, parsed.minute, parsed.second, curFmt, cur12);
            update({
              inputText: text,
              value: timeStr,
              selectedHour: parsed.hour,
              selectedMinute: parsed.minute,
              selectedSecond: parsed.second,
              selectedPeriod: parsed.period || (parsed.hour >= 12 ? 'PM' : 'AM'),
            });
            rawProps.onValueChange?.(timeStr);
          } else {
            update({ inputText: text });
          }
        }
      } else {
        if (text === '') {
          update({ inputText: '', value: -1, displayValue: '' });
          rawProps.onValueChange?.('');
        } else {
          const parsed = parseDateInput(text, resolved.year || 2025, resolved.month || 6);
          if (parsed) {
            const isoDate = `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`;
            const outVal = isoDate;
            update({
              inputText: text,
              year: parsed.year,
              month: parsed.month,
              selectedYear: parsed.year,
              selectedMonth: parsed.month,
              value: parsed.day,
              displayValue: formatHumanDate(parsed.year, parsed.month, parsed.day),
            });
            rawProps.onValueChange?.(outVal);
          } else {
            update({ inputText: text });
          }
        }
      }
      rawProps.onInputChange?.(text);
    },
  } as unknown as P;
}
