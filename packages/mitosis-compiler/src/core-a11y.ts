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
