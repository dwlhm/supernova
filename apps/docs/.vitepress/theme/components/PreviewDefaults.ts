import { componentExamples, componentRegistry, type ComponentLoader, type PreviewFramework } from '../preview/registry';

/** Frameworks offered by every preview surface (tabs, usage snippets, showcase switcher). */
export const PREVIEW_FRAMEWORKS: ReadonlyArray<{ id: PreviewFramework; label: string }> = [
  { id: 'react', label: 'React' },
  { id: 'vue3', label: 'Vue 3' },
  { id: 'svelte', label: 'Svelte' },
  { id: 'vue2', label: 'Vue 2' },
  { id: 'angular', label: 'Angular' },
];

const SAMPLE_CHART_POINTS = [
  { label: 'Mon', value: 34, values: [34, 45] },
  { label: 'Tue', value: 52, values: [52, 60] },
  { label: 'Wed', value: 89, values: [89, 75] },
  { label: 'Thu', value: 64, values: [64, 70] },
  { label: 'Fri', value: 95, values: [95, 82] },
  { label: 'Sat', value: 78, values: [78, 65] },
  { label: 'Sun', value: 45, values: [45, 55] },
];

const SAMPLE_IMAGE_URI =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><rect width='96' height='96' rx='16' fill='%232563eb'/><circle cx='48' cy='38' r='16' fill='%23ffffff' fill-opacity='0.9'/><path d='M22 80c4-14 15-22 26-22s22 8 26 22' fill='%23ffffff' fill-opacity='0.9'/></svg>";

/**
 * Prop fixtures for prop-driven previews; `children` (string) is rendered as text content in every framework.
 * Compound components have no entry here: they preview their compiled `<Name>Example` instead.
 */
export const DEFAULT_PROPS_BY_COMPONENT: Record<string, Record<string, any>> = {
  Button: { children: 'Click Me', variant: 'primary', size: 'regular', roundness: 'default', showLeftIcon: true },
  FAB: { children: 'New Action', variant: 'primary', size: 'extended' },
  Badge: { children: 'Active', variant: 'primary' },
  Avatar: { initialsText: 'KM', src: SAMPLE_IMAGE_URI, type: 'initials', size: 'regular', showStatus: true, status: 'online' },
  InputText: { label: 'Email Address', placeholder: 'name@komerce.id', showLabel: true, showHint: true, showLeftIcon: true },
  InputTextArea: { label: 'Notes', placeholder: 'Enter description or comments...', showLabel: true, showHint: true, showCharacterCount: true, maxLength: 200 },
  InputDropdown: {
    label: 'Select Department', placeholder: 'Choose an option...', showLabel: true, showHint: true, showSearch: true, showLeftIcon: true,
    options: [
      { label: 'Engineering', value: 'engineering' },
      { label: 'Design System', value: 'design' },
      { label: 'Operations', value: 'operations' },
      { label: 'Marketing', value: 'marketing' },
    ],
  },
  InputOTP: { label: 'Verification Code', length: 6, value: '', showLabel: true, showHint: true },
  InputFileInput: { label: 'Attachment', buttonText: 'Browse file...', showLabel: true, showHint: true },
  InputFileDropZone: { label: 'Documents', primaryText: 'Drag and drop files here, or', browseText: 'browse', supportingText: 'PNG, JPG, PDF up to 10MB', showLabel: true, showHint: true },
  InputImageUploader: { label: 'Profile Image', primaryText: 'Upload image', supportingText: 'Recommended 1200x630px', showLabel: true, showHint: true },
  InputMultipleFileUpload: { label: 'Project Documents', instruction: 'Choose one or more files', hint: 'Upload up to 5 files (PDF, PNG, DOCX)', showLabel: true, showHint: true },
  Checkbox: { label: 'I agree to the terms and privacy policy', rightLabel: true, checked: true },
  RadioButton: { label: 'Fast Express Delivery (1-2 days)', rightLabel: true, checked: true },
  SwitchButton: { label: 'Enable email notifications', rightLabel: true, checked: true },
  Toggle: { children: 'Auto-sync', pressed: true, showText: true, size: 'medium' },
  Slider: { value: 65, min: 0, max: 100, step: 1, label: 'Volume', showValue: true },
  DatePicker: { label: 'Select Date', placeholder: 'Choose a date', month: 10, year: 2026, value: 26, displayValue: 'Oct 26, 2026', open: false, showLabel: true },
  Progressbar: { value: 72, label: 'Syncing assets', showLabel: true },
  Spinner: { size: '24', label: 'Loading...' },
  MetricCard: { label: 'Total Revenue', value: 'Rp 148.500.000', showValue: true, showTrend: true, trendDirection: 'up', trendText: '+18.4%', descriptionText: 'vs last month', showDescription: true, showIcon: true, showStatus: true, statusLabel: 'On track', statusVariant: 'success', progress: 68 },
  ChartBar: { data: SAMPLE_CHART_POINTS, showGridLines: true, showDataLabels: true, showAxisLabels: true, ariaLabel: 'Weekly Bar Chart' },
  ChartLine: { data: SAMPLE_CHART_POINTS, area: true, showGridLines: true, showDataLabels: false, showAxisLabels: true, ariaLabel: 'Revenue Trend Line Chart' },
  ChartPie: {
    data: [{ label: 'Express', value: 45 }, { label: 'Regular', value: 30 }, { label: 'Cargo', value: 15 }, { label: 'Instant', value: 10 }],
    innerRadius: 50, ariaLabel: 'Shipping Distribution',
  },
  ChartLegend: {
    items: [{ label: 'Revenue', colorClass: 'bg-chart-series-1' }, { label: 'Orders', colorClass: 'bg-chart-series-2' }, { label: 'Returns', colorClass: 'bg-chart-series-3' }],
  },
  AlertDialog: { open: true, inline: true, heading: 'Are you absolutely sure?', description: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.', showDescription: true, showCloseButton: true, cancelLabel: 'Cancel', confirmLabel: 'Continue', destructive: false },
  Toast: { type: 'success', title: 'Changes Saved', description: 'Your configuration was successfully updated.', showDescription: true, showAction: true, actionText: 'Undo', showClose: true, timestamp: 'Just now', showTimestamp: true },
  Tooltip: { children: 'Hover me', text: 'Label', position: 'top' },
  Pagination: { currentPage: 2, totalPages: 10, previousLabel: 'Previous', nextLabel: 'Next' },
  TabItem: { children: 'General', active: true, showIcon: true, showNum: true, num: '4' },
  BubbleChat: { direction: 'incoming', type: 'text', messageState: 'default', text: 'Hello! How can we assist your integration today?', showTime: true, showStatus: true, timeText: '10:24 AM', statusText: 'Delivered' },
  TableBodyCell: { children: 'ORD-9021' },
  TableCellValue: { children: 'ORD-9021' },
  TableCheckboxHeaderCell: { checked: true, indeterminate: false },
  TableCheckboxBodyCell: { checked: true, rowId: 'row-1' },
  TableNoHeaderCell: { label: 'No.' },
  TableNoBodyCell: { no: 1 },
  Sidebar: { expanded: true, brand: 'Komerce', accountLabel: 'Lionel Messi', accountMeta: 'messi@gmail.com', accountInitials: 'LM', brandInitials: 'K', className: 'min-h-[260px] rounded-xl border border-border-default' },
  Topbar: { showSearch: true, searchPlaceholder: 'Search components...', showSidebarToggle: true },
  MainMenu: { children: 'Dashboard', active: true, showLabel: true, showLeadingIcon: true, showTrailingIcon: true, showBadge: true, badgeLabel: 'New' },
  MenuItem: { label: 'Settings', active: false, showLabel: true, showLeadingIcon: true },
  IconPlaceholder: { size: 32 },
  IconTruckDelivery: { size: 36 },
  TablerTruckDelivery: { size: 36 },
  TruckDelivery: { size: 36 },
};

const STATE_PATCH_BY_COMPONENT: Record<string, { empty: Record<string, any>; filled: Record<string, any>; error: string }> = {
  InputText: { empty: { value: '' }, filled: { value: 'alex.morgan@komerce.id' }, error: 'Please enter a valid email address.' },
  InputTextArea: { empty: { value: '' }, filled: { value: 'Please leave the package with the receptionist on the ground floor.' }, error: 'Notes must be at least 20 characters long.' },
  InputDropdown: { empty: { value: '' }, filled: { value: 'engineering' }, error: 'Please select a department to continue.' },
  InputOTP: { empty: { value: '' }, filled: { value: '482910' }, error: 'Invalid verification code. Please try again.' },
  InputFileInput: { empty: { fileName: '' }, filled: { fileName: 'brand-guidelines-v2.pdf' }, error: 'Unsupported format. Please upload a PNG, JPG, or PDF.' },
  InputFileDropZone: { empty: { fileName: '', fileMetadata: '' }, filled: { fileName: 'quarterly-report-2026.pdf', fileMetadata: '2.4 MB • PDF Document' }, error: 'File size exceeds the 10 MB maximum limit.' },
  InputImageUploader: { empty: { fileName: '', fileMetadata: '', imageSrc: '' }, filled: { fileName: 'company-avatar.png', fileMetadata: '1200 × 1200px • 1.2 MB', imageSrc: SAMPLE_IMAGE_URI }, error: 'Image resolution is too low (minimum 400 × 400px).' },
  InputMultipleFileUpload: {
    empty: { files: [], fileCount: '0 of 5' },
    filled: {
      files: [
        { id: '1', name: 'shipping-manifest-2026.pdf', status: '2.4 MB • Uploaded' },
        { id: '2', name: 'warehouse-label.png', status: '840 KB • Uploaded' },
      ],
      fileCount: '2 of 5',
    },
    error: 'One or more files failed verification.',
  },
};

export function applyPreviewStatePatch(componentName: string, stateVal: string, current: Record<string, any>): Record<string, any> {
  const preset = STATE_PATCH_BY_COMPONENT[componentName];
  if (!preset) return { ...current, previewState: stateVal };
  const s = stateVal.toLowerCase();
  if (s === 'filled') return { ...current, ...preset.filled, errorMessage: '', disabled: false, previewState: stateVal };
  if (s === 'error') return { ...current, errorMessage: preset.error, showHint: true, disabled: false, previewState: stateVal };
  if (s === 'disabled') return { ...current, disabled: true, errorMessage: '', previewState: stateVal };
  return { ...current, ...preset.empty, errorMessage: '', disabled: false, previewState: stateVal };
}

export function resolvePascalName(name: string): string {
  if (!name) return '';
  return name
    .split(/[-_ ]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

export function normalizeRegistryComponentName(name: string): string {
  const pascal = resolvePascalName(name);
  if (pascal === 'TablerTruckDelivery' || pascal === 'TruckDelivery') return 'IconTruckDelivery';
  return pascal || name;
}

export function getComponentLoader(name: string): ComponentLoader | undefined {
  if (!name) return undefined;
  if (componentRegistry[name]) return componentRegistry[name];

  const pascal = resolvePascalName(name);
  if (componentRegistry[pascal]) return componentRegistry[pascal];

  if (pascal === 'TablerTruckDelivery' || pascal === 'TruckDelivery' || pascal === 'IconTruckDelivery') {
    return componentRegistry['IconTruckDelivery'] || componentRegistry['TruckDelivery'];
  }
  if (pascal === 'IconPlaceholder' || pascal === 'Placeholder') {
    return componentRegistry['IconPlaceholder'] || componentRegistry['Placeholder'];
  }
  if (pascal === 'InputFileInput' || pascal === 'FileInput') {
    return componentRegistry['InputFileInput'] || componentRegistry['FileInput'];
  }
  if (pascal === 'InputMultipleFileUpload' || pascal === 'MultipleFileUpload') {
    return componentRegistry['InputMultipleFileUpload'] || componentRegistry['MultipleFileUpload'];
  }

  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [key, loader] of Object.entries(componentRegistry)) {
    if (key.toLowerCase().replace(/[^a-z0-9]/g, '') === clean) {
      return loader;
    }
  }
  return undefined;
}

/** Compiled `<Name>Example` for compound components; it composes children, so it takes no props. */
export function getExampleLoader(name: string): ComponentLoader | undefined {
  return componentExamples[normalizeRegistryComponentName(name)];
}

export interface VariantOptionGroup {
  group: string;
  propKey: string;
  values: Array<{ label: string; value: string }>;
}

export function extractVariantOptions(variants: Record<string, string[]> | undefined): VariantOptionGroup[] {
  if (!variants) return [];
  const seenKeys = new Set<string>();
  const result: VariantOptionGroup[] = [];
  for (const [group, values] of Object.entries(variants)) {
    let propKey = group.charAt(0).toLowerCase() + group.slice(1);
    if (group === 'Style') propKey = 'variant';
    if (seenKeys.has(propKey)) continue;
    seenKeys.add(propKey);
    const label = group === 'previewState' ? 'State' : group.charAt(0).toUpperCase() + group.slice(1);
    result.push({
      group: label,
      propKey,
      values: (values as string[]).map((v) => ({ label: v, value: v })),
    });
  }
  return result;
}

const COMPACT_STAGE_COMPONENTS = new Set(['DatePicker', 'MainMenu', 'MenuItem']);
const FORM_STAGE_COMPONENTS = new Set([
  'InputText', 'InputTextArea', 'InputDropdown', 'InputOTP', 'InputFileInput',
  'InputFileDropZone', 'InputImageUploader', 'InputMultipleFileUpload',
  'Slider', 'ToggleGroup', 'Progressbar', 'MetricCard', 'BubbleChat', 'Toast', 'AlertDialog',
]);
const FULL_STAGE_COMPONENTS = new Set([
  'Table', 'TableHeaderRow', 'TableBodyRow', 'Chart', 'ChartBar',
  'ChartLine', 'ChartPie', 'ChartLegend', 'Topbar', 'Breadcrumb', 'Stepper',
]);

export function getPreviewStageWidthClass(componentName: string): string {
  if (COMPACT_STAGE_COMPONENTS.has(componentName)) return 'w-full max-w-xs flex flex-col items-center justify-center';
  if (FORM_STAGE_COMPONENTS.has(componentName)) return 'w-full max-w-md flex flex-col items-center justify-center';
  if (FULL_STAGE_COMPONENTS.has(componentName)) return 'w-full flex flex-col items-center justify-center';
  return 'inline-flex items-center justify-center';
}

export function measurePopoverSpacing(stage: HTMLElement | null): { top: number; bottom: number } {
  const compRoot = stage?.querySelector(':scope > .contents > *, :scope > *:not(.contents)') as HTMLElement | null;
  if (!compRoot) return { top: 0, bottom: 0 };
  const baseRect = compRoot.getBoundingClientRect();
  if (baseRect.width === 0 && baseRect.height === 0) return { top: 0, bottom: 0 };
  const win = compRoot.ownerDocument?.defaultView || window;
  const popovers = compRoot.querySelectorAll('[role="dialog"], [role="listbox"], [role="tooltip"], .absolute');
  let maxTop = 0;
  let maxBottom = 0;
  for (let i = 0; i < popovers.length; i++) {
    const node = popovers[i] as HTMLElement;
    const st = win.getComputedStyle(node);
    if (st.display === 'none' || st.visibility === 'hidden' || st.opacity === '0') continue;
    const r = node.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    maxTop = Math.max(maxTop, Math.ceil(baseRect.top - r.top));
    maxBottom = Math.max(maxBottom, Math.ceil(r.bottom - baseRect.bottom));
  }
  return { top: maxTop > 0 ? maxTop + 12 : 0, bottom: maxBottom > 0 ? maxBottom + 12 : 0 };
}

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function buildInteractivePreviewProps(
  currentProps: Record<string, any>,
  updateProps: (patch: Record<string, any>) => void
): Record<string, any> {
  return {
    ...currentProps,
    onCheckedChange: (val: any, second?: boolean) => updateProps({ checked: typeof second === 'boolean' ? second : Boolean(val) }),
    'onUpdate:checked': (val: boolean) => updateProps({ checked: val }),
    onPressedChange: (val: boolean) => updateProps({ pressed: val }),
    onValueChange: (val: any) => updateProps({ value: val }),
    onOpenChange: (open: boolean) => updateProps({ open }),
    onSearchChange: (q: string) => updateProps({ searchQuery: q, searchValue: q }),
    onPageChange: (page: number) => updateProps({ currentPage: page }),
    onPageSizeChange: (pageSize: number) => updateProps({ pageSize, currentPage: 1 }),
    onTabChange: (id: string) => updateProps({ activeTab: id }),
    onFileNameChange: (fileName: string) => updateProps({ fileName, ...(fileName === '' ? { imageSrc: '', fileMetadata: '' } : {}), previewState: fileName ? 'filled' : 'default' }),
    onPreviewChange: (url: string) => updateProps({ imageSrc: url, previewState: url ? 'filled' : 'default' }),
    onFilesChange: (rawFiles: unknown[]) => {
      const list = Array.isArray(rawFiles) ? rawFiles.slice(0, 5) : [];
      const mapped = list.map((f: any, idx: number) => ({
        id: f?.id || String(Date.now() + idx),
        name: f?.name || `document-${idx + 1}.pdf`,
        status: f?.status || (typeof f?.size === 'number' ? `${Math.max(1, Math.round(f.size / 1024))} KB • Uploaded` : 'Uploaded'),
      }));
      updateProps({ files: mapped, fileCount: `${mapped.length} of 5`, previewState: mapped.length ? 'filled' : 'default' });
    },
    onRemove: (id: string) => {
      const next = Array.isArray(currentProps.files) ? currentProps.files.filter((f: any) => f.id !== id) : [];
      updateProps({ files: next, fileCount: `${next.length} of 5`, previewState: next.length ? 'filled' : 'default' });
    },
    onMonthStep: (delta: number) => {
      const d = new Date(Date.UTC(currentProps.year || 2026, (currentProps.month || 10) - 1 + delta, 1));
      const nextYear = d.getUTCFullYear();
      const nextMonth = d.getUTCMonth() + 1;
      const nextDisplay = currentProps.value ? `${MONTH_ABBR[(nextMonth - 1) % 12]} ${currentProps.value}, ${nextYear}` : currentProps.displayValue;
      updateProps({ year: nextYear, month: nextMonth, displayValue: nextDisplay });
    },
    onRowSelect: (rowId: string, checked: boolean) => {
      if (Array.isArray(currentProps.rows)) {
        updateProps({ rows: currentProps.rows.map((r: any) => (r.id === rowId ? { ...r, selected: checked } : r)) });
      }
    },
    onSelectAll: (checked: boolean) => {
      if (Array.isArray(currentProps.rows)) {
        updateProps({ rows: currentProps.rows.map((r: any) => ({ ...r, selected: checked })) });
      }
    },
    onToggle: (id: string, checked: boolean) => {
      if (Array.isArray(currentProps.items)) {
        updateProps({ items: currentProps.items.map((item: any) => (item.id === id ? { ...item, checked } : item)) });
      }
    },
    onSelect: (val: any, second?: boolean) => {
      if (typeof val === 'number') {
        const m = currentProps.month || 10;
        const y = currentProps.year || 2026;
        updateProps({ value: val, displayValue: `${MONTH_ABBR[(m - 1) % 12]} ${val}, ${y}`, open: false });
      } else if (typeof second === 'boolean') {
        updateProps({ checked: second });
      } else if (typeof val === 'string') {
        updateProps({ value: val, open: false, previewState: val ? 'filled' : 'default' });
      }
    },
    onChange: (e: any) => {
      if (typeof e === 'boolean') updateProps({ checked: e });
      else if (typeof e === 'string') updateProps({ value: e });
      else if (e && typeof e.target?.checked === 'boolean') updateProps({ checked: e.target.checked });
    },
  };
}


