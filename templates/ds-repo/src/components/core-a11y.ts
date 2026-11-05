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
