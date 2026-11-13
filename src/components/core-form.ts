import { focusSiblingInput } from './core-a11y.js';

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
