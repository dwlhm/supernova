<template>
  <div class="component-catalog-container my-6 flex flex-col gap-8">
    <!-- Header Banner & Search -->
    <div class="rounded-2xl border border-border-default bg-background-subtle p-6 md:p-8 shadow-xs flex flex-col gap-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-default text-white">
              Supernova UI
            </span>
            <span class="text-xs text-foreground-muted">
              {{ allComponents.length }} Production Components
            </span>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-foreground-default tracking-tight">
            Component Catalog
          </h1>
          <p class="text-sm text-foreground-muted mt-1 max-w-2xl">
            Explore universal design system components authored with Mitosis and compiled to React, Vue 3, and Svelte.
          </p>
        </div>

        <!-- Framework Badges -->
        <div class="flex items-center gap-2 self-start md:self-auto">
          <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-background-interactive text-xs font-medium text-foreground-default">
            ⚛️ React
          </span>
          <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-background-interactive text-xs font-medium text-foreground-default">
            🟢 Vue 3
          </span>
          <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-background-interactive text-xs font-medium text-foreground-default">
            🟠 Svelte
          </span>
        </div>
      </div>

      <!-- Controls: Search Input & Category Filter Tabs -->
      <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-border-default">
        <!-- Search Box -->
        <div class="relative flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search components (e.g. Button, Input, Table)..."
            class="w-full px-4 py-2 pl-9 rounded-xl border border-border-default bg-background-default text-sm text-foreground-default placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-default transition-all"
          />
          <svg
            class="absolute left-3 top-2.5 w-4 h-4 text-foreground-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Category Filter Pills -->
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer',
              selectedCategory === cat.id
                ? 'bg-primary-default text-white font-semibold shadow-xs'
                : 'bg-background-interactive text-foreground-muted hover:text-foreground-default'
            ]"
            @click="selectedCategory = cat.id"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredComponents.length === 0"
      class="text-center py-12 rounded-xl border border-dashed border-border-default text-foreground-muted"
    >
      <p class="text-base font-semibold">No components match your search "{{ searchQuery }}"</p>
      <button
        type="button"
        class="mt-3 px-4 py-1.5 rounded-lg bg-background-interactive text-xs font-medium text-foreground-default cursor-pointer"
        @click="resetFilters"
      >
        Clear filters
      </button>
    </div>

    <!-- Grouped Sections -->
    <div v-else class="flex flex-col gap-10">
      <div
        v-for="cat in visibleCategories"
        :key="cat.id"
        class="flex flex-col gap-4"
      >
        <div class="flex items-center justify-between pb-2 border-b border-border-default">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-bold text-foreground-default">
              {{ cat.label }}
            </h2>
            <span class="text-xs px-2 py-0.5 rounded-full bg-background-interactive text-foreground-muted font-medium">
              {{ getComponentsForCategory(cat.id).length }}
            </span>
          </div>
          <span class="text-xs text-foreground-muted hidden sm:inline">
            {{ cat.description }}
          </span>
        </div>

        <!-- Grid of Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            v-for="comp in getComponentsForCategory(cat.id)"
            :key="comp.slug"
            :href="`/components/${comp.slug}`"
            class="group p-5 rounded-xl border border-border-default bg-background-default hover:border-primary-default hover:shadow-md transition-all flex flex-col justify-between no-underline"
          >
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-base font-bold text-foreground-default group-hover:text-primary-default transition-colors">
                  {{ comp.name }}
                </span>
                <span class="text-xs px-2 py-0.5 rounded-md bg-background-interactive text-foreground-muted font-mono">
                  {{ comp.slug }}
                </span>
              </div>
              <p class="text-xs text-foreground-muted line-clamp-2 leading-relaxed">
                {{ comp.description }}
              </p>
            </div>

            <div class="flex items-center justify-between pt-4 mt-3 border-t border-border-subtle text-xs">
              <span class="text-primary-default font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                View Component &rarr;
              </span>
              <div class="flex items-center gap-1 text-[11px] text-foreground-muted opacity-80">
                <span>React</span> &bull; <span>Vue</span> &bull; <span>Svelte</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface ComponentItem {
  name: string;
  slug: string;
  category: 'general' | 'inputs' | 'data-display' | 'navigation' | 'feedback';
  description: string;
}

const searchQuery = ref('');
const selectedCategory = ref('all');

const categories = [
  { id: 'all', label: 'All Components', description: 'Complete library of design system components' },
  { id: 'general', label: 'General & Actions', description: 'Core interactive buttons, FABs, and icons' },
  { id: 'inputs', label: 'Forms & Inputs', description: 'Form controls, text fields, pickers, and uploaders' },
  { id: 'data-display', label: 'Data Display', description: 'Tables, metrics, charts, badges, and avatars' },
  { id: 'navigation', label: 'Navigation', description: 'Headers, sidebars, tabs, menus, and steppers' },
  { id: 'feedback', label: 'Feedback & Overlays', description: 'Alert dialogs, toasts, spinners, and tooltips' },
];

const allComponents: ComponentItem[] = [
  // General & Actions
  { name: 'Button', slug: 'button', category: 'general', description: 'Versatile interactive button supporting multiple styles, sizes, and states.' },
  { name: 'FAB', slug: 'fab', category: 'general', description: 'Floating action button representing the primary prominent action on a screen.' },
  { name: 'IconPlaceholder', slug: 'icon-placeholder', category: 'general', description: 'Default placeholder component for dynamic instance-swap icon slots.' },
  { name: 'TruckDelivery', slug: 'tabler-truck-delivery', category: 'general', description: 'Vector SVG delivery truck icon extracted from design system specifications.' },

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

  // Data Display
  { name: 'Table', slug: 'table', category: 'data-display', description: 'Data table container supporting populated and empty states.' },
  { name: 'TableHeaderRow', slug: 'table-header-row', category: 'data-display', description: 'Header row container for column titles.' },
  { name: 'TableBodyRow', slug: 'table-body-row', category: 'data-display', description: 'Data row container with configurable column cells.' },
  { name: 'TableBodyCell', slug: 'table-body-cell', category: 'data-display', description: 'Standard table cell container hosting typed cell values.' },
  { name: 'TableCellValue', slug: 'table-cell-value', category: 'data-display', description: 'Multi-pattern cell renderer for text, status, badges, or media.' },
  { name: 'TableCheckboxHeaderCell', slug: 'table-checkbox-header-cell', category: 'data-display', description: 'Bulk selection header checkbox cell.' },
  { name: 'TableCheckboxBodyCell', slug: 'table-checkbox-body-cell', category: 'data-display', description: 'Individual row selection checkbox cell.' },
  { name: 'TableNoHeaderCell', slug: 'table-no-header-cell', category: 'data-display', description: 'Row-index counter header cell.' },
  { name: 'TableNoBodyCell', slug: 'table-no-body-cell', category: 'data-display', description: 'Numeric row index body cell.' },
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

const filteredComponents = computed(() => {
  return allComponents.filter((comp) => {
    const matchesCategory =
      selectedCategory.value === 'all' || comp.category === selectedCategory.value;
    const q = searchQuery.value.trim().toLowerCase();
    const matchesSearch =
      !q ||
      comp.name.toLowerCase().includes(q) ||
      comp.slug.toLowerCase().includes(q) ||
      comp.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });
});

const visibleCategories = computed(() => {
  return categories.filter((cat) => {
    if (cat.id === 'all') return false;
    if (selectedCategory.value !== 'all' && selectedCategory.value !== cat.id) return false;
    return getComponentsForCategory(cat.id).length > 0;
  });
});

function getComponentsForCategory(catId: string) {
  return filteredComponents.value.filter((comp) => comp.category === catId);
}

function resetFilters() {
  searchQuery.value = '';
  selectedCategory.value = 'all';
}
</script>
