export interface ComponentItem {
  name: string;
  slug: string;
  category: 'general' | 'inputs' | 'data-display' | 'navigation' | 'feedback';
  description: string;
  isPrimitive?: boolean;
}

export const CATALOG_CATEGORIES = [
  { id: 'all', label: 'All Components', description: 'Complete library of design system components' },
  { id: 'general', label: 'General & Actions', description: 'Core interactive buttons, FABs, and icons' },
  { id: 'inputs', label: 'Forms & Inputs', description: 'Form controls, text fields, pickers, and uploaders' },
  { id: 'data-display', label: 'Data Display', description: 'Tables, metrics, charts, badges, and avatars' },
  { id: 'navigation', label: 'Navigation', description: 'Headers, sidebars, tabs, menus, and steppers' },
  { id: 'feedback', label: 'Feedback & Overlays', description: 'Alert dialogs, toasts, spinners, and tooltips' },
] as const;

export const KNOWN_COMPONENTS: ComponentItem[] = [
  // General & Actions
  { name: 'Button', slug: 'button', category: 'general', description: 'Versatile interactive button supporting multiple styles, sizes, and states.' },
  { name: 'FAB', slug: 'fab', category: 'general', description: 'Floating action button representing the primary prominent action on a screen.' },
  { name: 'IconPlaceholder', slug: 'icon-placeholder', category: 'general', description: 'Default placeholder component for dynamic instance-swap icon slots.' },
  { name: 'IconTruckDelivery', slug: 'icon-truck-delivery', category: 'general', description: 'Vector SVG delivery truck icon extracted from design system specifications.' },

  // Forms & Inputs
  { name: 'InputText', slug: 'input-text', category: 'inputs', description: 'Single-line text input for short-form structured data entry.' },
  { name: 'InputTextArea', slug: 'input-text-area', category: 'inputs', description: 'Multi-line text field for extended user feedback or comments.' },
  { name: 'InputDropdown', slug: 'input-dropdown', category: 'inputs', description: 'Compact dropdown selector with options menu and optional search filtering.' },
  { name: 'Checkbox', slug: 'checkbox', category: 'inputs', description: 'Selection control for choosing one or multiple independent options.' },
  { name: 'RadioButton', slug: 'radio-button', category: 'inputs', description: 'Mutually exclusive selection control within an option group.' },
  { name: 'SwitchButton', slug: 'switch-button', category: 'inputs', description: 'Binary toggle switch for immediate on/off preferences.' },
  { name: 'Toggle', slug: 'toggle', category: 'inputs', description: 'Interactive toggle switch element with accessible states.' },
  { name: 'ToggleGroup', slug: 'toggle-group', category: 'inputs', description: 'Coordinated group of toggle buttons for segment selection.' },
  { name: 'Slider', slug: 'slider', category: 'inputs', description: 'Continuous range input with interactive thumb and filled track.' },
  { name: 'DatePicker', slug: 'date-picker', category: 'inputs', description: 'Date selection input with single, range, and format options.' },
  { name: 'InputOTP', slug: 'input-otp', category: 'inputs', description: 'Segmented verification input for one-time authentication codes.' },
  { name: 'InputFileInput', slug: 'input-file-input', category: 'inputs', description: 'Compact file selector with browse trigger and selected file display.' },
  { name: 'InputFileDropZone', slug: 'input-file-drop-zone', category: 'inputs', description: 'Large drag-and-drop file upload target with boundary feedback.' },
  { name: 'InputImageUploader', slug: 'input-image-uploader', category: 'inputs', description: 'Media uploader tailored for image assets with aspect-ratio guidance.' },
  { name: 'InputMultipleFileUpload', slug: 'input-multiple-file-upload', category: 'inputs', description: 'Multi-file attachment manager with individual file status tracking.' },

  // Data Display (Primary consumer components)
  { name: 'Table', slug: 'table', category: 'data-display', description: 'Data table container supporting sorting, pagination, selection, and empty states.' },
  { name: 'MetricCard', slug: 'metric-card', category: 'data-display', description: 'Dashboard KPI metric card with trend indicator and sparklines.' },
  { name: 'Chart', slug: 'chart', category: 'data-display', description: 'Multi-type data visualization component (Bar, Line, Pie, Radar).' },
  { name: 'Badge', slug: 'badge', category: 'data-display', description: 'Compact label communicating status, category, or metadata.' },
  { name: 'Avatar', slug: 'avatar', category: 'data-display', description: 'Circular identity component supporting initials, image, and status.' },
  { name: 'Progressbar', slug: 'progressbar', category: 'data-display', description: 'Determinate horizontal progress bar indicating completion ratio.' },

  // Navigation
  { name: 'Topbar', slug: 'topbar', category: 'navigation', description: 'Application header shell with navigation anchors and user actions.' },
  { name: 'Sidebar', slug: 'sidebar', category: 'navigation', description: 'Vertical navigation shell supporting expanded and collapsed states.' },
  { name: 'MainMenu', slug: 'main-menu', category: 'navigation', description: 'Primary vertical navigation item with icons and badges.' },
  { name: 'MenuItem', slug: 'menu-item', category: 'navigation', description: 'Secondary navigation item for nested navigation hierarchies.' },
  { name: 'Breadcrumb', slug: 'breadcrumb', category: 'navigation', description: 'Hierarchical page path navigation indicator.' },
  { name: 'Tabs', slug: 'tabs', category: 'navigation', description: 'Tabbed navigation container for switching between views.' },
  { name: 'TabItem', slug: 'tab-item', category: 'navigation', description: 'Individual tab item with status indicators and counters.' },
  { name: 'Pagination', slug: 'pagination', category: 'navigation', description: 'Numbered page selector for navigating large record collections.' },
  { name: 'Stepper', slug: 'stepper', category: 'navigation', description: 'Multi-step workflow progress tracker for onboarding or checkouts.' },

  // Feedback & Overlays
  { name: 'AlertDialog', slug: 'alert-dialog', category: 'feedback', description: 'Modal confirmation dialog for destructive or critical user choices.' },
  { name: 'Toast', slug: 'toast', category: 'feedback', description: 'Ephemeral notification alert communicating system status feedback.' },
  { name: 'Tooltip', slug: 'tooltip', category: 'feedback', description: 'Contextual hover/focus popup providing supporting guidance.' },
  { name: 'Spinner', slug: 'spinner', category: 'feedback', description: 'Indeterminate circular loading indicator for ongoing tasks.' },
  { name: 'BubbleChat', slug: 'bubble-chat', category: 'feedback', description: 'Message bubble for conversation threads with media attachments.' },
];

function camelToKebab(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function inferCategory(name: string): ComponentItem['category'] {
  const lower = name.toLowerCase();
  if (lower.includes('input') || lower.includes('checkbox') || lower.includes('radio') || lower.includes('switch') || lower.includes('toggle') || lower.includes('slider') || lower.includes('picker') || lower.includes('upload')) return 'inputs';
  if (lower.includes('table') || lower.includes('chart') || lower.includes('metric') || lower.includes('badge') || lower.includes('avatar') || lower.includes('progress')) return 'data-display';
  if (lower.includes('menu') || lower.includes('bar') || lower.includes('tab') || lower.includes('breadcrumb') || lower.includes('pagination') || lower.includes('stepper')) return 'navigation';
  if (lower.includes('dialog') || lower.includes('toast') || lower.includes('tooltip') || lower.includes('spinner') || lower.includes('chat')) return 'feedback';
  return 'general';
}

export function buildCatalogComponents(registry: Record<string, any> | undefined): ComponentItem[] {
  const seenNames = new Set(KNOWN_COMPONENTS.map((c) => c.name.toLowerCase()));
  const dynamicExtras: ComponentItem[] = [];
  for (const regName of Object.keys(registry || {})) {
    const lower = regName.toLowerCase();
    if (
      seenNames.has(lower) ||
      lower === 'icontruckdelivery' ||
      lower === 'placeholder' ||
      lower === 'fileinput' ||
      lower === 'multiplefileupload' ||
      lower.startsWith('chart') ||
      lower.startsWith('table')
    ) {
      continue;
    }
    dynamicExtras.push({
      name: regName,
      slug: camelToKebab(regName),
      category: inferCategory(regName),
      description: `${regName} universal design system component compiled from Figma.`,
    });
  }
  return [...KNOWN_COMPONENTS, ...dynamicExtras];
}

