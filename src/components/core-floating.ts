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
