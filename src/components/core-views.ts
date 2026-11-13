import { clampPercent } from './core-a11y.js';
import {
  buildCalendarPanel,
  createDatePickerFormatArg,
  createTimePickerFormatArg,
  formatDateDisplay,
  formatHumanDate,
  formatTimeDisplay,
  getCalendarDays,
  getMonthGridEntries,
  getPaginationEntries,
  getYearGridEntries,
  MONTH_ABBR,
  MONTH_NAMES,
  parseDateInput,
  parseTimeInput,
  shiftYearMonth,
  toDateKey,
  WEEKDAY_LABELS,
  type DatePickerFormatArg,
  type DatePickerMode,
  type DatePickerViewMode,
  type TimePickerFormatArg,
} from './core-date.js';
import { computeOtpDigits, filterDropdownOptions } from './core-form.js';

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
