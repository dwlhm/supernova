export interface ComponentItem {
  name: string;
  slug: string;
  category: 'general' | 'inputs' | 'data-display' | 'navigation' | 'feedback';
  description: string;
  isPrimitive?: boolean;
}

export const CATALOG_CATEGORIES = [
  { id: 'all', label: 'All Components', description: 'Complete library of 20 Figma component groups (36 primary components)' },
  { id: 'general', label: 'Buttons & Selection', description: 'Buttons, FABs, checkboxes, radios, switches, and toggle groups' },
  { id: 'inputs', label: 'Inputs, Date & Upload', description: 'Text fields, dropdowns, OTP, date pickers, sliders, and file uploaders' },
  { id: 'data-display', label: 'Data Display & Charts', description: 'Tables, metric cards, charts, badges, avatars, and progress bars' },
  { id: 'navigation', label: 'Navigation & Flows', description: 'Topbars, sidebars, menus, breadcrumbs, tabs, pagination, and steppers' },
  { id: 'feedback', label: 'Feedback & Overlays', description: 'Alert dialogs, toasts, tooltips, spinners, and chat bubbles' },
] as const;

export const KNOWN_COMPONENTS: ComponentItem[] = [
  // Buttons & Selection (Figma group: Button)
  { name: 'Button', slug: 'button', category: 'general', description: 'Versatile interactive button supporting 6 semantic variants, 4 sizes, and icon slots.' },
  { name: 'FAB', slug: 'fab', category: 'general', description: 'Floating action button supporting small, regular, large, and extended label modes.' },
  { name: 'Checkbox', slug: 'checkbox', category: 'general', description: 'Selection control supporting checked, indeterminate, 3 sizes, and left/right labels.' },
  { name: 'RadioButton', slug: 'radio-button', category: 'general', description: 'Mutually exclusive radio control supporting 3 sizes and left/right label alignment.' },
  { name: 'SwitchButton', slug: 'switch-button', category: 'general', description: 'Binary toggle switch supporting 3 sizes and immediate on/off state feedback.' },
  { name: 'Toggle', slug: 'toggle', category: 'general', description: 'Two-state pressable button supporting icon-only and icon+label layouts across 3 sizes.' },
  { name: 'ToggleGroup', slug: 'toggle-group', category: 'general', description: 'Segmented group of coordinated Toggle controls across 3 sizes.' },

  // Inputs, Date & Upload (Figma groups: Input text, selection & file upload, Input date picker, Slider)
  { name: 'InputText', slug: 'input-text', category: 'inputs', description: 'Single-line text input with label, leading/trailing icons, hint, error, and character count.' },
  { name: 'InputTextArea', slug: 'input-text-area', category: 'inputs', description: 'Multi-line textarea with validation states, helper text, and character counter.' },
  { name: 'InputDropdown', slug: 'input-dropdown', category: 'inputs', description: 'Searchable dropdown selector composed with InputDropdownItem options.' },
  { name: 'InputOTP', slug: 'input-otp', category: 'inputs', description: 'Segmented one-time passcode input with keyboard navigation and paste support.' },
  { name: 'InputFileInput', slug: 'input-file-input', category: 'inputs', description: 'Compact inline file input with browse trigger and clear action.' },
  { name: 'InputFileDropZone', slug: 'input-file-drop-zone', category: 'inputs', description: 'Drag-and-drop file upload zone with filled file metadata, replace, and remove actions.' },
  { name: 'InputImageUploader', slug: 'input-image-uploader', category: 'inputs', description: 'Media uploader with thumbnail preview, metadata display, and replace/remove controls.' },
  { name: 'InputMultipleFileUpload', slug: 'input-multiple-file-upload', category: 'inputs', description: 'Multi-file uploader composed with InputMultipleFileUploadItem status rows.' },
  { name: 'DatePicker', slug: 'date-picker', category: 'inputs', description: 'Multi-mode date picker supporting DOB, input, date-time, natural language, range, and year views.' },
  { name: 'Slider', slug: 'slider', category: 'inputs', description: 'Continuous range slider supporting both single-thumb and dual-thumb range selection.' },

  // Data Display & Charts (Figma groups: Table, Card, Chart, Badge, Avatar, Progress)
  { name: 'Table', slug: 'table', category: 'data-display', description: 'Composable data table supporting row selection, stacked/status cells, and empty states.' },
  { name: 'Card', slug: 'card', category: 'data-display', description: 'General-purpose card container composable with CardHeader, CardFooter, Stat, Divider, and Chart.' },
  { name: 'Stat', slug: 'stat', category: 'data-display', description: 'Domain-agnostic label and value display primitive for KPIs, comparisons, and multi-metric rows.' },
  { name: 'Divider', slug: 'divider', category: 'data-display', description: 'Horizontal or vertical separator for grouping content, stats, and comparisons.' },
  { name: 'ListItem', slug: 'list-item', category: 'data-display', description: 'Compact key-value or ranked row with optional badge, series dot, and trailing value.' },
  { name: 'Chart', slug: 'chart', category: 'data-display', description: '12-mode declarative chart suite (Bar, Stacked, Line, Area, Pie, Donut, Radar, Gauge, Funnel, Waterfall).' },
  { name: 'Badge', slug: 'badge', category: 'data-display', description: 'Compact semantic pill badge across 7 variants (primary, secondary, destructive, success, warning, info, outline).' },
  { name: 'Avatar', slug: 'avatar', category: 'data-display', description: 'Circular identity avatar across 5 sizes supporting image, initials, icon, and status dot.' },
  { name: 'Progressbar', slug: 'progressbar', category: 'data-display', description: 'Determinate horizontal progress bar with optional label and percentage readout.' },

  // Navigation & Flows (Figma groups: Navigation, Breadcrumb, Tabs, Pagination, Stepper)
  { name: 'Topbar', slug: 'topbar', category: 'navigation', description: 'Application header bar composable with TopbarTrigger, Breadcrumb, and TopbarContent.' },
  { name: 'Sidebar', slug: 'sidebar', category: 'navigation', description: 'Collapsible vertical navigation shell (expanded 240px / collapsed 64px) with brand, sections, and account footer.' },
  { name: 'MainMenu', slug: 'main-menu', category: 'navigation', description: 'Primary sidebar navigation button with leading icon, badge counter, and active highlight.' },
  { name: 'MenuItem', slug: 'menu-item', category: 'navigation', description: 'Expandable navigation item supporting nested submenu items, icons, and badges.' },
  { name: 'Breadcrumb', slug: 'breadcrumb', category: 'navigation', description: 'Hierarchical trail composed with BreadcrumbItem links and BreadcrumbEllipsis.' },
  { name: 'Tabs', slug: 'tabs', category: 'navigation', description: 'Segmented tablist container composed with interactive TabItem triggers.' },
  { name: 'Pagination', slug: 'pagination', category: 'navigation', description: 'Page navigation control with Previous/Next buttons, page numbers, and smart ellipsis.' },
  { name: 'Stepper', slug: 'stepper', category: 'navigation', description: 'Horizontal and vertical multi-step progress tracker with completed, active, and upcoming states.' },

  // Feedback & Overlays (Figma groups: Alert dialog, Toast, Tooltip, Spinner, Bubble)
  { name: 'AlertDialog', slug: 'alert-dialog', category: 'feedback', description: 'Modal confirmation dialog supporting standard and destructive confirmation actions.' },
  { name: 'Toast', slug: 'toast', category: 'feedback', description: 'Notification banner across 5 semantic types with solid icon badge, timestamp, action, and close button.' },
  { name: 'Tooltip', slug: 'tooltip', category: 'feedback', description: 'Floating contextual overlay supporting top, bottom, left, and right placements on hover or click.' },
  { name: 'Spinner', slug: 'spinner', category: 'feedback', description: 'Animated SVG loading indicator across 4 Figma pixel sizes (12, 16, 24, 32).' },
  { name: 'BubbleChat', slug: 'bubble-chat', category: 'feedback', description: 'Incoming and outgoing chat bubble composable with BubbleChatFile, BubbleChatMedia, and BubbleChatFooter.' },
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

export function buildCatalogComponents(_registry?: Record<string, any>): ComponentItem[] {
  return [...KNOWN_COMPONENTS];
}

