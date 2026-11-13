import { componentExamples, componentRegistry, type ComponentLoader, type PreviewFramework } from '../preview/registry';
import { parseDateInput } from '../preview/utils';

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
  InputText: { label: 'Email Address', placeholder: 'name@komerce.id', hint: 'We will never share your email.', showLabel: true, showHint: true, showLeftIcon: true },
  InputTextArea: { label: 'Notes', placeholder: 'Enter description or comments...', hint: 'Provide additional context for your team.', showLabel: true, showHint: true, showCharacterCount: true, maxLength: 200 },
  InputDropdown: {
    label: 'Select Department', placeholder: 'Choose an option...', hint: 'Select your department or area of work.', showLabel: true, showHint: true, showSearch: true, showLeftIcon: true,
    options: [
      { label: 'Engineering', value: 'engineering' },
      { label: 'Design System', value: 'design' },
      { label: 'Operations', value: 'operations' },
      { label: 'Marketing', value: 'marketing' },
    ],
  },
  InputOTP: { label: 'Verification Code', hint: 'Enter the 6-digit code sent to your device.', length: 6, value: '', showLabel: true, showHint: true },
  InputFileInput: { label: 'Attachment', hint: 'Upload a PDF, PNG, or JPG file.', buttonText: 'Browse file...', showLabel: true, showHint: true },
  InputFileDropZone: { label: 'Documents', primaryText: 'Drag and drop files here, or', browseText: 'Browse', supportingText: 'PNG, JPG, or PDF up to 10 MB', hint: 'You can upload one file.', accept: '', maxSizeBytes: 10 * 1024 * 1024, showLabel: true, showHint: true },
  InputImageUploader: { label: 'Profile image', primaryText: 'Upload an image', supportingText: 'Square JPG or PNG, up to 5 MB', hint: 'For best results, use a 1:1 image.', showLabel: true, showHint: true },
  InputMultipleFileUpload: { label: 'Project Documents', instruction: 'Choose one or more files', hint: 'Upload up to 5 files (PDF, PNG, DOCX)', state: 'filled', showLabel: true, showHint: true },
  Checkbox: { children: 'I agree to the terms and privacy policy', size: 'medium', labelPosition: 'right', checked: true },
  RadioButton: { children: 'Fast Express Delivery (1-2 days)', size: 'medium', labelPosition: 'right', checked: true },
  SwitchButton: { children: 'Enable email notifications', size: 'medium', labelPosition: 'right', checked: true },
  Toggle: { children: 'Auto-sync', pressed: true, showText: true, showIcon: true, size: 'medium' },
  Slider: { value: 65, min: 0, max: 100, step: 1, label: 'Volume', showLabel: false, showValue: false, disabled: false },
  DatePicker: { mode: 'single', editable: false, label: '', placeholder: 'Select a date', hint: '', month: 6, year: 2025, value: 0, endMonth: 7, endYear: 2025, endValue: 9, open: true, showLabel: true, showHint: true },
  TimePicker: { value: '14:30', format: 'HH:mm', use12Hours: false, stepMinute: 15, label: 'Delivery Time', placeholder: 'Select time', hint: '', showLabel: true, showHint: true, open: true },
  Progressbar: { value: 72, label: 'Syncing assets', showLabel: true },
  Spinner: { size: '24', ariaLabel: 'Loading...' },
  Card: { children: 'General purpose card container composable with CardHeader, Stat, Divider, and Chart.' },
  Stat: { label: 'Total Revenue', value: 'Rp 148.500.000', size: 'md', muted: false, reversed: false },
  Divider: { orientation: 'horizontal' },
  ListItem: { badge: '#1', value: '5,420', dotTone: 'series-1', children: 'Organic Search' },
  ChartBar: { data: SAMPLE_CHART_POINTS, yTicks: [100, 75, 50, 25, 0], maxValue: 100, showGridLines: true, showDataLabels: true, ariaLabel: 'Weekly Bar Chart' },
  ChartLine: { data: SAMPLE_CHART_POINTS, yTicks: [100, 75, 50, 25, 0], maxValue: 100, area: true, showGridLines: true, showDataLabels: false, showAxisLabels: true, ariaLabel: 'Revenue Trend Line Chart' },
  ChartPie: {
    data: [{ label: 'Express', value: 45 }, { label: 'Regular', value: 30 }, { label: 'Cargo', value: 15 }, { label: 'Instant', value: 10 }],
    innerRadius: 30, centerLabel: '45.2K', ariaLabel: 'Shipping Distribution',
  },
  ChartHorizontalBar: {
    data: [{ label: 'Product A', value: 85 }, { label: 'Product B', value: 65 }, { label: 'Product C', value: 50 }, { label: 'Product D', value: 40 }, { label: 'Product E', value: 30 }],
    maxValue: 100, showDataLabels: true, ariaLabel: 'Product Performance',
  },
  ChartScatter: {
    yTicks: [100, 75, 50, 25, 0], xTicks: [0, 20, 40, 60, 80, 100], showGridLines: true,
    data: [{ x: 15, y: 30, series: 0 }, { x: 45, y: 60, series: 0 }, { x: 80, y: 75, series: 0 }, { x: 30, y: 20, series: 1 }, { x: 65, y: 50, series: 1 }, { x: 55, y: 25, series: 2 }],
  },
  ChartRadar: {
    data: [{ label: 'Speed', values: [85, 65] }, { label: 'Power', values: [75, 80] }, { label: 'Range', values: [65, 85] }, { label: 'Defense', values: [80, 60] }, { label: 'Health', values: [70, 75] }, { label: 'Magic', values: [75, 85] }],
  },
  ChartGauge: { value: 75, min: 0, max: 100, showDataLabels: true },
  ChartFunnel: {
    data: [{ label: 'Visitors', value: 12500 }, { label: 'Leads', value: 8200 }, { label: 'Qualified', value: 4100 }, { label: 'Proposals', value: 1800 }, { label: 'Closed', value: 620 }],
    showDataLabels: true,
  },
  ChartWaterfall: {
    yTicks: [200, 150, 100, 50, 0], maxValue: 200, showGridLines: true, showDataLabels: true,
    data: [{ label: 'Start', value: 120 }, { label: '+Rev', value: 35 }, { label: '+Svc', value: 20 }, { label: '-Cost', value: -30 }, { label: '-Tax', value: -20 }, { label: 'Total', value: 125, isTotal: true }],
  },
  ChartLegend: {
    items: [{ label: 'Revenue', colorClass: 'bg-chart-series-1' }, { label: 'Orders', colorClass: 'bg-chart-series-2' }, { label: 'Returns', colorClass: 'bg-chart-series-3' }],
  },
  AlertDialog: { open: true, inline: true, heading: 'Are you absolutely sure?', description: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.', showDescription: true, showCloseButton: true, cancelLabel: 'Cancel', confirmLabel: 'Continue', destructive: false },
  Toast: { type: 'success', title: 'Changes Saved', description: 'Your configuration was successfully updated.', showDescription: true, showAction: true, actionText: 'Undo', showClose: true, timestamp: 'Just now', showTimestamp: true },
  Tooltip: { children: 'Hover me', text: 'Label', position: 'top', trigger: 'hover' },
  Pagination: { currentPage: 2, totalPages: 10, previousLabel: 'Previous', nextLabel: 'Next' },
  TabItem: { children: 'General', active: true, showIcon: true, showNum: true, num: '4' },
  StepperItem: { children: 'Shipping', index: 1, status: 'active', orientation: 'horizontal' },
  StepperIndicator: { index: 1, status: 'active' },
  BreadcrumbItem: { children: 'Components', href: '#components', current: false },
  TableHeaderCell: { children: 'Customer', sortable: true, sortDirection: 'none' },
  TableBodyRow: { children: 'Order #9021 • Active', selected: false },
  BubbleChat: { direction: 'incoming', state: 'default', children: 'Hello! How can we assist your integration today?' },
  TableBodyCell: { children: 'ORD-9021' },
  TableCellValue: { children: 'ORD-9021' },
  TableCheckboxHeaderCell: { checked: true, indeterminate: false },
  TableCheckboxBodyCell: { checked: true },
  TableNoHeaderCell: { label: 'No.' },
  TableNoBodyCell: { no: 1 },
  Sidebar: { expanded: true, brand: 'Komerce', accountLabel: 'Lionel Messi', accountMeta: 'messi@gmail.com', accountInitials: 'LM', brandInitials: 'K', className: 'min-h-[260px] rounded-xl border border-border-default' },
  Topbar: { showSearch: true, searchPlaceholder: 'Search components...', showSidebarToggle: true },
  MainMenu: { children: 'Dashboard', active: true, showLabel: true, showLeadingIcon: true, showTrailingIcon: true, showBadge: true, badgeLabel: 'New' },
  MenuItem: { label: 'Products', children: 'Inventory & Variants', active: true, expanded: true, showLabel: true, showLeadingIcon: true, showTrailingIcon: true, showBadge: true, badgeLabel: '4' },
  IconPlaceholder: { size: 32 },
  IconTruckDelivery: { size: 36 },
  TablerTruckDelivery: { size: 36 },
  TruckDelivery: { size: 36 },
};

const STATE_PATCH_BY_COMPONENT: Record<string, { empty: Record<string, any>; filled: Record<string, any>; error: string }> = {
  DatePicker: { empty: { value: 0, displayValue: '', inputText: '' }, filled: { value: 15, selectedMonth: 6, selectedYear: 2025 }, error: 'Please select a valid date.' },
  TimePicker: { empty: { value: '' }, filled: { value: '14:30' }, error: 'Please select a valid time.' },
  InputText: { empty: { value: '' }, filled: { value: 'alex.morgan@komerce.id' }, error: 'Please enter a valid email address.' },
  InputTextArea: { empty: { value: '' }, filled: { value: 'Please leave the package with the receptionist on the ground floor.' }, error: 'Notes must be at least 20 characters long.' },
  InputDropdown: { empty: { value: '' }, filled: { value: 'engineering' }, error: 'Please select a department to continue.' },
  InputOTP: { empty: { value: '' }, filled: { value: '482910' }, error: 'Invalid verification code. Please try again.' },
  InputFileInput: { empty: { fileName: '', value: '' }, filled: { fileName: 'brand-guidelines-v2.pdf', value: 'brand-guidelines-v2.pdf' }, error: 'Unsupported format. Please upload a PNG, JPG, or PDF.' },
  InputFileDropZone: { empty: { fileName: '', fileMetadata: '' }, filled: { fileName: 'invoice-september.pdf', fileMetadata: '248 KB · Ready to upload' }, error: 'File size exceeds the 10 MB maximum limit.' },
  InputImageUploader: { empty: { fileName: '', fileMetadata: '', imageSrc: '' }, filled: { fileName: 'profile-photo.jpg', fileMetadata: '1200 × 1200 · 1.8 MB', imageSrc: SAMPLE_IMAGE_URI }, error: 'For best results, use a 1:1 image.' },
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
  if (!preset) return { ...current, state: stateVal, previewState: stateVal };
  const s = stateVal.toLowerCase();
  if (s === 'filled') return { ...current, ...preset.filled, state: 'filled', error: false, errorMessage: '', disabled: false, previewState: stateVal };
  if (s === 'error') return { ...current, state: 'error', error: true, errorMessage: preset.error, showHint: true, disabled: false, previewState: stateVal };
  if (s === 'disabled') return { ...current, state: 'disabled', disabled: true, error: false, errorMessage: '', previewState: stateVal };
  return { ...current, ...preset.empty, state: s, error: false, errorMessage: '', disabled: false, previewState: stateVal };
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
    const label =
      group === 'previewState'
        ? 'State'
        : group === 'icon'
          ? 'Icon'
          : group === 'leftIcon'
            ? 'Left Icon'
            : group === 'rightIcon'
              ? 'Right Icon'
              : group === 'leadingIcon'
                ? 'Leading Icon'
                : group === 'trailingIcon'
                  ? 'Trailing Icon'
                  : group.charAt(0).toUpperCase() + group.slice(1);
    result.push({
      group: label,
      propKey,
      values: (values as string[]).map((v) => ({ label: v, value: v })),
    });
  }
  return result;
}

const COMPACT_STAGE_COMPONENTS = new Set(['MainMenu', 'MenuItem']);
const FORM_STAGE_COMPONENTS = new Set([
  'InputText', 'InputTextArea', 'InputDropdown', 'InputOTP', 'InputFileInput',
  'InputFileDropZone', 'InputImageUploader', 'InputMultipleFileUpload',
  'Slider', 'ToggleGroup', 'Progressbar', 'Stat', 'Divider', 'ListItem', 'BubbleChat', 'Toast', 'AlertDialog',
]);
const FULL_STAGE_COMPONENTS = new Set([
  'Card', 'Table', 'TableHeaderRow', 'TableBodyRow', 'Chart', 'ChartBar',
  'ChartLine', 'ChartPie', 'ChartHorizontalBar', 'ChartScatter', 'ChartRadar',
  'ChartGauge', 'ChartFunnel', 'ChartWaterfall', 'ChartLegend', 'Topbar', 'Breadcrumb', 'Stepper',
]);

export function getPreviewStageWidthClass(componentName: string): string {
  if (componentName === 'Tooltip') return 'inline-flex items-center justify-center py-12 px-16';
  if (componentName === 'DatePicker' || componentName === 'TimePicker') return 'inline-flex flex-col items-center justify-center';
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
  const popovers = compRoot.querySelectorAll('[role="dialog"], [role="listbox"], .absolute:not([role="tooltip"])');
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

export function validateFileRestriction(
  file: { name?: string; size?: number; type?: string },
  accept?: string,
  maxSizeBytes?: number
): { valid: boolean; error?: string } {
  const fileName = file?.name || '';
  const fileSize = typeof file?.size === 'number' ? file.size : 0;
  const fileType = file?.type || '';

  if (maxSizeBytes && maxSizeBytes > 0 && fileSize > maxSizeBytes) {
    const mbLimit = Math.round(maxSizeBytes / (1024 * 1024));
    return {
      valid: false,
      error: `File size exceeds the ${mbLimit > 0 ? mbLimit + ' MB' : Math.round(maxSizeBytes / 1024) + ' KB'} maximum limit.`,
    };
  }

  if (accept && accept.trim() !== '') {
    const rules = accept
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (rules.length > 0) {
      const lowerName = fileName.toLowerCase();
      const lowerType = fileType.toLowerCase();
      const matches = rules.some((rule) => {
        if (rule.startsWith('.')) {
          return lowerName.endsWith(rule);
        }
        if (rule.endsWith('/*')) {
          const prefix = rule.slice(0, -2);
          return lowerType.startsWith(prefix);
        }
        return lowerType === rule || lowerName.endsWith('.' + rule);
      });
      if (!matches) {
        return {
          valid: false,
          error: `File format not supported. Only ${accept} files are allowed.`,
        };
      }
    }
  }

  return { valid: true };
}

export function buildInteractivePreviewProps(
  currentProps: Record<string, any>,
  updateProps: (patch: Record<string, any>) => void
): Record<string, any> {
  return {
    ...currentProps,
    onCheckedChange: (checked: boolean) => updateProps({ checked }),
    'onUpdate:checked': (val: boolean) => updateProps({ checked: val }),
    onPressedChange: (val: boolean) => updateProps({ pressed: val }),
    onValueChange: (val: any) => updateProps({ value: val, ...(val === '' ? { fileName: '', fileMetadata: '', imageSrc: '', state: 'default' } : {}) }),
    onOpenChange: (open: boolean) => updateProps({ open }),
    onSearchChange: (q: string) => updateProps({ searchQuery: q, searchValue: q }),
    onPageChange: (page: number) => updateProps({ currentPage: page }),
    onPageSizeChange: (pageSize: number) => updateProps({ pageSize, currentPage: 1 }),
    onTabChange: (id: string) => updateProps({ activeTab: id }),
    onFileNameChange: (fileName: string) => {
      if (!fileName) {
        updateProps({ fileName: '', value: '', imageSrc: '', fileMetadata: '', state: 'default', error: false, errorMessage: '', previewState: 'default' });
        return;
      }
      const check = validateFileRestriction({ name: fileName }, currentProps.accept, currentProps.maxSizeBytes);
      if (!check.valid) {
        updateProps({
          fileName,
          value: fileName,
          error: true,
          errorMessage: check.error || 'File violates upload restriction.',
          state: 'error',
          previewState: 'error',
        });
      } else {
        updateProps({
          fileName,
          value: fileName,
          state: 'filled',
          previewState: 'filled',
          error: false,
          errorMessage: '',
        });
      }
    },
    onPreviewChange: (url: string) => updateProps({ imageSrc: url, ...(url === '' ? { fileName: '', value: '', fileMetadata: '', state: 'default' } : {}), previewState: url ? 'filled' : 'default' }),
    onFilesChange: (rawFiles: unknown[]) => {
      const list = Array.isArray(rawFiles) ? rawFiles : [];
      if (list.length === 0) return;
      const first = list[0] as { name?: string; size?: number; type?: string };
      const check = validateFileRestriction(first, currentProps.accept, currentProps.maxSizeBytes);
      if (!check.valid) {
        updateProps({
          fileName: first?.name || '',
          value: first?.name || '',
          fileMetadata: typeof first?.size === 'number' ? `${Math.max(1, Math.round(first.size / 1024))} KB` : '',
          error: true,
          errorMessage: check.error || 'File violates upload restriction.',
          state: 'error',
          previewState: 'error',
        });
        return;
      }

      if (Array.isArray(currentProps.files)) {
        const mapped = list.slice(0, 5).map((f: any, idx: number) => ({
          id: f?.id || String(Date.now() + idx),
          name: f?.name || `document-${idx + 1}.pdf`,
          status: f?.status || (typeof f?.size === 'number' ? `${Math.max(1, Math.round(f.size / 1024))} KB • Uploaded` : 'Uploaded'),
        }));
        updateProps({ files: mapped, fileCount: `${mapped.length} of 5`, error: false, errorMessage: '', previewState: mapped.length ? 'filled' : 'default' });
      } else {
        const sizeStr = typeof first?.size === 'number' ? `${Math.max(1, Math.round(first.size / 1024))} KB · Ready to upload` : 'Ready to upload';
        updateProps({
          fileName: first?.name || '',
          value: first?.name || '',
          fileMetadata: sizeStr,
          error: false,
          errorMessage: '',
          state: 'filled',
          previewState: 'filled',
        });
      }
    },
    onRemove: (id?: string) => {
      if (Array.isArray(currentProps.files)) {
        const next = currentProps.files.filter((f: any) => f.id !== id);
        updateProps({ files: next, fileCount: `${next.length} of 5`, error: false, errorMessage: '', previewState: next.length ? 'filled' : 'default' });
      } else {
        updateProps({ fileName: '', value: '', fileMetadata: '', imageSrc: '', error: false, errorMessage: '', state: 'default', previewState: 'default' });
      }
    },
    onMonthStep: (delta: number) => {
      const mode = currentProps.mode || 'single';
      const vMode = currentProps.viewMode || (mode === 'year' ? 'years' : mode === 'month' ? 'months' : 'days');
      const curY = currentProps.year || (mode === 'year' ? 2026 : 2025);
      const curM = currentProps.month || 6;
      const selY = currentProps.selectedYear || curY;
      const selM = currentProps.selectedMonth || curM;
      if (vMode === 'years') {
        updateProps({ year: curY + delta * 9, selectedYear: selY, selectedMonth: selM });
        return;
      }
      if (vMode === 'months') {
        updateProps({ year: curY + delta, selectedYear: selY, selectedMonth: selM });
        return;
      }
      const d = new Date(Date.UTC(curY, curM - 1 + delta, 1));
      const nextYear = d.getUTCFullYear();
      const nextMonth = d.getUTCMonth() + 1;
      if (mode === 'range') {
        const nextPanel = new Date(Date.UTC(curY, curM, 1));
        updateProps({
          year: nextYear,
          month: nextMonth,
          startYear: currentProps.startYear || selY,
          startMonth: currentProps.startMonth || selM,
          selectedYear: selY,
          selectedMonth: selM,
          endYear: currentProps.endYear || nextPanel.getUTCFullYear(),
          endMonth: currentProps.endMonth || nextPanel.getUTCMonth() + 1,
        });
      } else {
        updateProps({ year: nextYear, month: nextMonth, selectedYear: selY, selectedMonth: selM });
      }
    },
    onMonthChange: (month: number) => {
      const safeM = Math.min(12, Math.max(1, month));
      const y = currentProps.year || 2025;
      if ((currentProps.mode || 'single') === 'month') {
        updateProps({ month: safeM, selectedMonth: safeM, selectedYear: y, displayValue: `${MONTH_ABBR[safeM - 1]} ${y}`, open: false, state: 'closed' });
      } else {
        updateProps({ month: safeM, viewMode: 'days', selectedYear: currentProps.selectedYear || y, selectedMonth: currentProps.selectedMonth || (currentProps.month || 6) });
      }
    },
    onYearChange: (year: number) => {
      if ((currentProps.mode || 'single') === 'year') {
        updateProps({ year, selectedYear: year, displayValue: String(year), open: false, state: 'closed' });
      } else {
        updateProps({ year, viewMode: 'days', selectedYear: currentProps.selectedYear || (currentProps.year || 2025), selectedMonth: currentProps.selectedMonth || (currentProps.month || 6) });
      }
    },
    onGridSelect: (val: number) => {
      const mode = currentProps.mode || 'single';
      const vMode = currentProps.viewMode || (mode === 'year' ? 'years' : mode === 'month' ? 'months' : 'days');
      if (vMode === 'years') {
        if (mode === 'year') {
          updateProps({ year: val, selectedYear: val, displayValue: String(val), open: false, state: 'closed' });
        } else {
          updateProps({ year: val, viewMode: 'days', selectedYear: currentProps.selectedYear || (currentProps.year || 2025), selectedMonth: currentProps.selectedMonth || (currentProps.month || 6) });
        }
      } else {
        const safeM = Math.min(12, Math.max(1, val));
        const y = currentProps.year || 2025;
        if (mode === 'month') {
          updateProps({ month: safeM, selectedMonth: safeM, selectedYear: y, displayValue: `${MONTH_ABBR[safeM - 1]} ${y}`, open: false, state: 'closed' });
        } else {
          updateProps({ month: safeM, viewMode: 'days', selectedYear: currentProps.selectedYear || y, selectedMonth: currentProps.selectedMonth || (currentProps.month || 6) });
        }
      }
    },
    onViewModeChange: (viewMode: 'days' | 'months' | 'years') => {
      updateProps({ viewMode });
    },
    onTimeChange: (timeValue: string) => {
      updateProps({ timeValue });
    },
    onInputChange: (inputText: string) => {
      if (inputText === '') {
        updateProps({ inputText: '', value: -1 });
        return;
      }
      const parsed = parseDateInput(inputText, currentProps.year || 2025, currentProps.month || 6);
      if (parsed) {
        const disp = `${MONTH_ABBR[(parsed.month - 1) % 12]} ${String(parsed.day).padStart(2, '0')}, ${parsed.year}`;
        updateProps({ inputText, year: parsed.year, month: parsed.month, selectedYear: parsed.year, selectedMonth: parsed.month, value: parsed.day, displayValue: disp });
      } else {
        updateProps({ inputText });
      }
    },
    onRangeSelect: (sel: { year: number; month: number; day: number }) => {
      if ((currentProps.mode || 'single') === 'range') {
        if (!currentProps.__rangeSelectingEnd) {
          const disp = `${MONTH_ABBR[(sel.month - 1) % 12]} ${String(sel.day).padStart(2, '0')}, ${sel.year} – ...`;
          updateProps({ year: sel.year, month: sel.month, startYear: sel.year, startMonth: sel.month, selectedYear: sel.year, selectedMonth: sel.month, value: sel.day, endValue: 0, hoverValue: 0, hoverMonth: 0, hoverYear: 0, displayValue: disp, __rangeSelectingEnd: true });
        } else {
          const sY = currentProps.startYear || currentProps.selectedYear || currentProps.year || sel.year;
          const sM = currentProps.startMonth || currentProps.selectedMonth || currentProps.month || sel.month;
          const sD = currentProps.value || sel.day;
          const startKey = sY * 10000 + sM * 100 + sD;
          const endKey = sel.year * 10000 + sel.month * 100 + sel.day;
          const [fY, fM, fD, tY, tM, tD] = endKey < startKey ? [sel.year, sel.month, sel.day, sY, sM, sD] : [sY, sM, sD, sel.year, sel.month, sel.day];
          const disp = `${MONTH_ABBR[(fM - 1) % 12]} ${String(fD).padStart(2, '0')}, ${fY} – ${MONTH_ABBR[(tM - 1) % 12]} ${String(tD).padStart(2, '0')}, ${tY}`;
          updateProps({ year: fY, month: fM, startYear: fY, startMonth: fM, selectedYear: fY, selectedMonth: fM, value: fD, endYear: tY, endMonth: tM, endValue: tD, hoverValue: 0, hoverMonth: 0, hoverYear: 0, displayValue: disp, __rangeSelectingEnd: false });
        }
        return;
      }
      const disp = `${MONTH_ABBR[(sel.month - 1) % 12]} ${String(sel.day).padStart(2, '0')}, ${sel.year}`;
      updateProps({ year: sel.year, month: sel.month, selectedYear: sel.year, selectedMonth: sel.month, value: sel.day, displayValue: disp, inputText: disp, open: false, state: 'closed' });
    },
    onHoverDate: (sel: { year: number; month: number; day: number }) => {
      if (((currentProps.mode || 'single') === 'range' && (currentProps.__rangeSelectingEnd || currentProps.endValue === 0)) || (sel.day === 0 && currentProps.hoverValue)) {
        updateProps({ hoverYear: sel.year, hoverMonth: sel.month, hoverValue: sel.day });
      }
    },
    onSelect: (val: any, second?: boolean) => {
      if (val && typeof val === 'object' && typeof val.day === 'number') {
        if ((currentProps.mode || 'single') === 'range') {
          if (!currentProps.__rangeSelectingEnd) {
            const disp = `${MONTH_ABBR[(val.month - 1) % 12]} ${String(val.day).padStart(2, '0')}, ${val.year} – ...`;
            updateProps({ year: val.year, month: val.month, startYear: val.year, startMonth: val.month, selectedYear: val.year, selectedMonth: val.month, value: val.day, endValue: 0, hoverValue: 0, hoverMonth: 0, hoverYear: 0, displayValue: disp, __rangeSelectingEnd: true });
          } else {
            const sY = currentProps.startYear || currentProps.selectedYear || currentProps.year || val.year;
            const sM = currentProps.startMonth || currentProps.selectedMonth || currentProps.month || val.month;
            const sD = currentProps.value || val.day;
            const startKey = sY * 10000 + sM * 100 + sD;
            const endKey = val.year * 10000 + val.month * 100 + val.day;
            const [fY, fM, fD, tY, tM, tD] = endKey < startKey ? [val.year, val.month, val.day, sY, sM, sD] : [sY, sM, sD, val.year, val.month, val.day];
            const disp = `${MONTH_ABBR[(fM - 1) % 12]} ${String(fD).padStart(2, '0')}, ${fY} – ${MONTH_ABBR[(tM - 1) % 12]} ${String(tD).padStart(2, '0')}, ${tY}`;
            updateProps({ year: fY, month: fM, startYear: fY, startMonth: fM, selectedYear: fY, selectedMonth: fM, value: fD, endYear: tY, endMonth: tM, endValue: tD, hoverValue: 0, hoverMonth: 0, hoverYear: 0, displayValue: disp, __rangeSelectingEnd: false });
          }
          return;
        }
        const disp = `${MONTH_ABBR[(val.month - 1) % 12]} ${String(val.day).padStart(2, '0')}, ${val.year}`;
        updateProps({ year: val.year, month: val.month, selectedYear: val.year, selectedMonth: val.month, value: val.day, displayValue: disp, inputText: disp, open: false, state: 'closed' });
      } else if (typeof val === 'number') {
        const m = currentProps.month || 6;
        const y = currentProps.year || 2025;
        updateProps({ value: val, selectedYear: y, selectedMonth: m, displayValue: `${MONTH_ABBR[(m - 1) % 12]} ${val}, ${y}`, open: false, state: 'closed' });
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
    onClose: () => updateProps({ open: false }),
    onCancel: () => updateProps({ open: false }),
    onConfirm: () => updateProps({ open: false }),
    onAction: () => updateProps({ open: false }),
    onSort: () => {
      const cur = currentProps.sortDirection || 'none';
      const next = cur === 'asc' ? 'desc' : cur === 'desc' ? 'none' : 'asc';
      updateProps({ sortDirection: next });
    },
    onClick: () => {
      if ('checked' in currentProps) updateProps({ checked: !currentProps.checked });
      else if ('pressed' in currentProps) updateProps({ pressed: !currentProps.pressed });
      else if ('active' in currentProps) updateProps({ active: !currentProps.active });
      else if ('selected' in currentProps) updateProps({ selected: !currentProps.selected });
      else if ('status' in currentProps) {
        const order = ['completed', 'active', 'upcoming'];
        const idx = order.indexOf(String(currentProps.status));
        if (idx >= 0) updateProps({ status: order[(idx + 1) % order.length] });
      }
    },
  };
}


