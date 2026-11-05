import { focusSiblingInput } from './core-a11y.js';

export function computeOtpDigits(value = '', length = 6): string[] {
  const safeLen = Math.max(1, length || 6);
  const raw = String(value ?? '');
  return Array.from({ length: safeLen }, (_, idx) => {
    const ch = raw[idx];
    return ch && ch !== ' ' ? ch : '';
  });
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

export function handleOtpInputEvent(
  event: unknown,
  index: number,
  currentValue: string | undefined,
  length: number,
  onChange?: (val: string) => void
): void {
  const raw = (event as { target?: { value?: string } })?.target?.value ?? '';
  onChange?.(applyOtpChar(currentValue ?? '', index, raw, length));
  if (raw && index < length - 1) focusSiblingInput(event, 1);
}

export function handleOtpKeyDownEvent(
  event: { key?: string; preventDefault?: () => void; currentTarget?: unknown },
  index: number,
  currentValue: string | undefined,
  length: number,
  onChange?: (val: string) => void
): void {
  const digits = computeOtpDigits(currentValue, length);
  if (event?.key === 'Backspace' && !digits[index] && index > 0) {
    event.preventDefault?.();
    onChange?.(applyOtpChar(currentValue ?? '', index - 1, '', length));
    focusSiblingInput(event, -1);
  } else if (event?.key === 'ArrowLeft' && index > 0) {
    event.preventDefault?.();
    focusSiblingInput(event, -1);
  } else if (event?.key === 'ArrowRight' && index < length - 1) {
    event.preventDefault?.();
    focusSiblingInput(event, 1);
  }
}

export function handleOtpPasteEvent(
  event: { preventDefault?: () => void; clipboardData?: { getData?: (t: string) => string } },
  length: number,
  onChange?: (val: string) => void
): void {
  const text = event?.clipboardData?.getData?.('text') ?? '';
  if (!text) return;
  event.preventDefault?.();
  onChange?.(applyOtpPasteString(text, length));
}

export function filterDropdownOptions<T extends { label: string; value: string }>(
  options: T[] = [],
  query = ''
): T[] {
  const q = String(query ?? '').trim().toLowerCase();
  return !q ? options || [] : (options || []).filter((opt) => opt.label.toLowerCase().includes(q));
}
