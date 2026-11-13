import {
  formatDateDisplay,
  formatHumanDate,
  formatTimeDisplay,
  MONTH_ABBR,
  MONTH_NAMES,
  parseDateInput,
  parseTimeInput,
  shiftYearMonth,
  toDateKey,
  type DatePickerViewMode,
} from './core-date.js';

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
