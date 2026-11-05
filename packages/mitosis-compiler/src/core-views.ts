import { clampPercent } from './core-a11y.js';
import { formatDateDisplay, getCalendarDays, getPaginationEntries, WEEKDAY_LABELS } from './core-date.js';
import { computeOtpDigits, filterDropdownOptions } from './core-form.js';

export function getChoiceState(props: { label?: string; leftLabel?: boolean; rightLabel?: boolean }) {
  const hasLabel = Boolean(props.label && props.label !== '');
  return {
    hasLabel,
    showLeft: Boolean(props.leftLabel && hasLabel),
    showRight: Boolean(!props.leftLabel && props.rightLabel !== false && hasLabel),
  };
}

export function getSliderState(props: { value?: number; min?: number; max?: number }) {
  const pct = clampPercent(props.value, props.min ?? 0, props.max ?? 100);
  return { pct, barStyle: { width: `${pct}%` }, thumbStyle: { left: `${pct}%` } };
}

export function getInputState(props: { value?: string; errorMessage?: string; hint?: string; maxLength?: number }) {
  const hasError = Boolean(props.errorMessage && props.errorMessage !== '');
  const valStr = String(props.value ?? '');
  return {
    hasError,
    helpText: hasError ? props.errorMessage : props.hint,
    countText: `${valStr.length} / ${props.maxLength ?? 200}`,
  };
}

export function getOtpState(props: { value?: string; length?: number; errorMessage?: string; hint?: string }) {
  const hasError = Boolean(props.errorMessage && props.errorMessage !== '');
  const digits = computeOtpDigits(props.value, props.length ?? 6).map((char, index) => ({ index, char }));
  return { hasError, digits, helpText: hasError ? props.errorMessage : props.hint };
}

export function getDropdownState<T extends { label: string; value: string }>(props: { options?: T[]; value?: string; searchQuery?: string; open?: boolean; errorMessage?: string; hint?: string }) {
  const hasError = Boolean(props.errorMessage && props.errorMessage !== '');
  const options = Array.isArray(props.options) ? props.options : [];
  const filtered = filterDropdownOptions(options, props.searchQuery);
  const matched = options.find((o) => o.value === props.value);
  return {
    hasError, isOpen: Boolean(props.open), filtered,
    selectedLabel: matched ? matched.label : '',
    helpText: hasError ? props.errorMessage : props.hint,
  };
}

export function getDatePickerState(props: { year?: number; month?: number; value?: number; displayValue?: string; placeholder?: string }) {
  const cal = getCalendarDays(props.year || 2025, props.month || 1);
  const cells = [
    ...cal.leadingBlanks.map((i) => ({ key: `b-${i}`, day: 0, isBlank: true, isSelected: false })),
    ...cal.days.map((day) => ({ key: `d-${day}`, day, isBlank: false, isSelected: day === props.value })),
  ];
  const formatted = formatDateDisplay(cal.year, cal.month, props.value, props.displayValue);
  return {
    weekdays: WEEKDAY_LABELS, monthLabel: cal.monthLabel, cells,
    hasValue: formatted !== '',
    displayText: formatted !== '' ? formatted : (props.placeholder || 'Select a date'),
  };
}

export function getFileState<T extends { id: string; name: string; status: string } = { id: string; name: string; status: string }>(props: { fileName?: string; errorMessage?: string; hint?: string; files?: T[] }) {
  const hasError = Boolean(props.errorMessage && props.errorMessage !== '');
  const hasFile = Boolean(props.fileName && props.fileName !== '');
  return {
    hasError, hasFile,
    helpText: hasError ? props.errorMessage : props.hint,
    displayName: hasFile ? props.fileName : 'No file chosen',
    files: Array.isArray(props.files) ? props.files : [],
  };
}
