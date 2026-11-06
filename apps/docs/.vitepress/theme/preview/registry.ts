// Auto-generated component registry for VitePress Multi-Framework Preview
export type PreviewFramework = 'vue3' | 'react' | 'svelte' | 'vue2' | 'angular';

export type ComponentLoader = Partial<Record<PreviewFramework, () => Promise<any>>>;

export interface ComponentMeta {
  name: string;
  group?: string;
  variants?: Record<string, string[]>;
  booleans?: string[];
  totalVariants?: number;
}

export const componentRegistry: Record<string, ComponentLoader> = {
  'AlertDialog': { vue3: () => import('./vue3/AlertDialog.vue'), react: () => import('./react/AlertDialog.tsx'), svelte: () => import('./svelte/AlertDialog.svelte'), vue2: () => import('./vue2/AlertDialog.js'), angular: () => import('./angular/AlertDialog.js') },
  'Avatar': { vue3: () => import('./vue3/Avatar.vue'), react: () => import('./react/Avatar.tsx'), svelte: () => import('./svelte/Avatar.svelte'), vue2: () => import('./vue2/Avatar.js'), angular: () => import('./angular/Avatar.js') },
  'Badge': { vue3: () => import('./vue3/Badge.vue'), react: () => import('./react/Badge.tsx'), svelte: () => import('./svelte/Badge.svelte'), vue2: () => import('./vue2/Badge.js'), angular: () => import('./angular/Badge.js') },
  'Breadcrumb': { vue3: () => import('./vue3/Breadcrumb.vue'), react: () => import('./react/Breadcrumb.tsx'), svelte: () => import('./svelte/Breadcrumb.svelte'), vue2: () => import('./vue2/Breadcrumb.js'), angular: () => import('./angular/Breadcrumb.js') },
  'BreadcrumbItem': { vue3: () => import('./vue3/BreadcrumbItem.vue'), react: () => import('./react/BreadcrumbItem.tsx'), svelte: () => import('./svelte/BreadcrumbItem.svelte'), vue2: () => import('./vue2/BreadcrumbItem.js'), angular: () => import('./angular/BreadcrumbItem.js') },
  'BubbleChat': { vue3: () => import('./vue3/BubbleChat.vue'), react: () => import('./react/BubbleChat.tsx'), svelte: () => import('./svelte/BubbleChat.svelte'), vue2: () => import('./vue2/BubbleChat.js'), angular: () => import('./angular/BubbleChat.js') },
  'Button': { vue3: () => import('./vue3/Button.vue'), react: () => import('./react/Button.tsx'), svelte: () => import('./svelte/Button.svelte'), vue2: () => import('./vue2/Button.js'), angular: () => import('./angular/Button.js') },
  'Chart': { vue3: () => import('./vue3/Chart.vue'), react: () => import('./react/Chart.tsx'), svelte: () => import('./svelte/Chart.svelte'), vue2: () => import('./vue2/Chart.js'), angular: () => import('./angular/Chart.js') },
  'ChartBar': { vue3: () => import('./vue3/ChartBar.vue'), react: () => import('./react/ChartBar.tsx'), svelte: () => import('./svelte/ChartBar.svelte'), vue2: () => import('./vue2/ChartBar.js'), angular: () => import('./angular/ChartBar.js') },
  'ChartLegend': { vue3: () => import('./vue3/ChartLegend.vue'), react: () => import('./react/ChartLegend.tsx'), svelte: () => import('./svelte/ChartLegend.svelte'), vue2: () => import('./vue2/ChartLegend.js'), angular: () => import('./angular/ChartLegend.js') },
  'ChartLine': { vue3: () => import('./vue3/ChartLine.vue'), react: () => import('./react/ChartLine.tsx'), svelte: () => import('./svelte/ChartLine.svelte'), vue2: () => import('./vue2/ChartLine.js'), angular: () => import('./angular/ChartLine.js') },
  'ChartPie': { vue3: () => import('./vue3/ChartPie.vue'), react: () => import('./react/ChartPie.tsx'), svelte: () => import('./svelte/ChartPie.svelte'), vue2: () => import('./vue2/ChartPie.js'), angular: () => import('./angular/ChartPie.js') },
  'Checkbox': { vue3: () => import('./vue3/Checkbox.vue'), react: () => import('./react/Checkbox.tsx'), svelte: () => import('./svelte/Checkbox.svelte'), vue2: () => import('./vue2/Checkbox.js'), angular: () => import('./angular/Checkbox.js') },
  'DatePicker': { vue3: () => import('./vue3/DatePicker.vue'), react: () => import('./react/DatePicker.tsx'), svelte: () => import('./svelte/DatePicker.svelte'), vue2: () => import('./vue2/DatePicker.js'), angular: () => import('./angular/DatePicker.js') },
  'FAB': { vue3: () => import('./vue3/FAB.vue'), react: () => import('./react/FAB.tsx'), svelte: () => import('./svelte/FAB.svelte'), vue2: () => import('./vue2/FAB.js'), angular: () => import('./angular/FAB.js') },
  'IconPlaceholder': { vue3: () => import('./vue3/IconPlaceholder.vue'), react: () => import('./react/IconPlaceholder.tsx'), svelte: () => import('./svelte/IconPlaceholder.svelte'), vue2: () => import('./vue2/IconPlaceholder.js'), angular: () => import('./angular/IconPlaceholder.js') },
  'IconTruckDelivery': { vue3: () => import('./vue3/IconTruckDelivery.vue'), react: () => import('./react/IconTruckDelivery.tsx'), svelte: () => import('./svelte/IconTruckDelivery.svelte'), vue2: () => import('./vue2/IconTruckDelivery.js'), angular: () => import('./angular/IconTruckDelivery.js') },
  'InputDropdown': { vue3: () => import('./vue3/InputDropdown.vue'), react: () => import('./react/InputDropdown.tsx'), svelte: () => import('./svelte/InputDropdown.svelte'), vue2: () => import('./vue2/InputDropdown.js'), angular: () => import('./angular/InputDropdown.js') },
  'InputFileDropZone': { vue3: () => import('./vue3/InputFileDropZone.vue'), react: () => import('./react/InputFileDropZone.tsx'), svelte: () => import('./svelte/InputFileDropZone.svelte'), vue2: () => import('./vue2/InputFileDropZone.js'), angular: () => import('./angular/InputFileDropZone.js') },
  'InputFileInput': { vue3: () => import('./vue3/InputFileInput.vue'), react: () => import('./react/InputFileInput.tsx'), svelte: () => import('./svelte/InputFileInput.svelte'), vue2: () => import('./vue2/InputFileInput.js'), angular: () => import('./angular/InputFileInput.js') },
  'InputImageUploader': { vue3: () => import('./vue3/InputImageUploader.vue'), react: () => import('./react/InputImageUploader.tsx'), svelte: () => import('./svelte/InputImageUploader.svelte'), vue2: () => import('./vue2/InputImageUploader.js'), angular: () => import('./angular/InputImageUploader.js') },
  'InputMultipleFileUpload': { vue3: () => import('./vue3/InputMultipleFileUpload.vue'), react: () => import('./react/InputMultipleFileUpload.tsx'), svelte: () => import('./svelte/InputMultipleFileUpload.svelte'), vue2: () => import('./vue2/InputMultipleFileUpload.js'), angular: () => import('./angular/InputMultipleFileUpload.js') },
  'InputOTP': { vue3: () => import('./vue3/InputOTP.vue'), react: () => import('./react/InputOTP.tsx'), svelte: () => import('./svelte/InputOTP.svelte'), vue2: () => import('./vue2/InputOTP.js'), angular: () => import('./angular/InputOTP.js') },
  'InputText': { vue3: () => import('./vue3/InputText.vue'), react: () => import('./react/InputText.tsx'), svelte: () => import('./svelte/InputText.svelte'), vue2: () => import('./vue2/InputText.js'), angular: () => import('./angular/InputText.js') },
  'InputTextArea': { vue3: () => import('./vue3/InputTextArea.vue'), react: () => import('./react/InputTextArea.tsx'), svelte: () => import('./svelte/InputTextArea.svelte'), vue2: () => import('./vue2/InputTextArea.js'), angular: () => import('./angular/InputTextArea.js') },
  'MainMenu': { vue3: () => import('./vue3/MainMenu.vue'), react: () => import('./react/MainMenu.tsx'), svelte: () => import('./svelte/MainMenu.svelte'), vue2: () => import('./vue2/MainMenu.js'), angular: () => import('./angular/MainMenu.js') },
  'MenuItem': { vue3: () => import('./vue3/MenuItem.vue'), react: () => import('./react/MenuItem.tsx'), svelte: () => import('./svelte/MenuItem.svelte'), vue2: () => import('./vue2/MenuItem.js'), angular: () => import('./angular/MenuItem.js') },
  'MetricCard': { vue3: () => import('./vue3/MetricCard.vue'), react: () => import('./react/MetricCard.tsx'), svelte: () => import('./svelte/MetricCard.svelte'), vue2: () => import('./vue2/MetricCard.js'), angular: () => import('./angular/MetricCard.js') },
  'Pagination': { vue3: () => import('./vue3/Pagination.vue'), react: () => import('./react/Pagination.tsx'), svelte: () => import('./svelte/Pagination.svelte'), vue2: () => import('./vue2/Pagination.js'), angular: () => import('./angular/Pagination.js') },
  'Progressbar': { vue3: () => import('./vue3/Progressbar.vue'), react: () => import('./react/Progressbar.tsx'), svelte: () => import('./svelte/Progressbar.svelte'), vue2: () => import('./vue2/Progressbar.js'), angular: () => import('./angular/Progressbar.js') },
  'RadioButton': { vue3: () => import('./vue3/RadioButton.vue'), react: () => import('./react/RadioButton.tsx'), svelte: () => import('./svelte/RadioButton.svelte'), vue2: () => import('./vue2/RadioButton.js'), angular: () => import('./angular/RadioButton.js') },
  'Sidebar': { vue3: () => import('./vue3/Sidebar.vue'), react: () => import('./react/Sidebar.tsx'), svelte: () => import('./svelte/Sidebar.svelte'), vue2: () => import('./vue2/Sidebar.js'), angular: () => import('./angular/Sidebar.js') },
  'Slider': { vue3: () => import('./vue3/Slider.vue'), react: () => import('./react/Slider.tsx'), svelte: () => import('./svelte/Slider.svelte'), vue2: () => import('./vue2/Slider.js'), angular: () => import('./angular/Slider.js') },
  'Spinner': { vue3: () => import('./vue3/Spinner.vue'), react: () => import('./react/Spinner.tsx'), svelte: () => import('./svelte/Spinner.svelte'), vue2: () => import('./vue2/Spinner.js'), angular: () => import('./angular/Spinner.js') },
  'Stepper': { vue3: () => import('./vue3/Stepper.vue'), react: () => import('./react/Stepper.tsx'), svelte: () => import('./svelte/Stepper.svelte'), vue2: () => import('./vue2/Stepper.js'), angular: () => import('./angular/Stepper.js') },
  'StepperItem': { vue3: () => import('./vue3/StepperItem.vue'), react: () => import('./react/StepperItem.tsx'), svelte: () => import('./svelte/StepperItem.svelte'), vue2: () => import('./vue2/StepperItem.js'), angular: () => import('./angular/StepperItem.js') },
  'SwitchButton': { vue3: () => import('./vue3/SwitchButton.vue'), react: () => import('./react/SwitchButton.tsx'), svelte: () => import('./svelte/SwitchButton.svelte'), vue2: () => import('./vue2/SwitchButton.js'), angular: () => import('./angular/SwitchButton.js') },
  'TabItem': { vue3: () => import('./vue3/TabItem.vue'), react: () => import('./react/TabItem.tsx'), svelte: () => import('./svelte/TabItem.svelte'), vue2: () => import('./vue2/TabItem.js'), angular: () => import('./angular/TabItem.js') },
  'Table': { vue3: () => import('./vue3/Table.vue'), react: () => import('./react/Table.tsx'), svelte: () => import('./svelte/Table.svelte'), vue2: () => import('./vue2/Table.js'), angular: () => import('./angular/Table.js') },
  'TableBodyCell': { vue3: () => import('./vue3/TableBodyCell.vue'), react: () => import('./react/TableBodyCell.tsx'), svelte: () => import('./svelte/TableBodyCell.svelte'), vue2: () => import('./vue2/TableBodyCell.js'), angular: () => import('./angular/TableBodyCell.js') },
  'TableBodyRow': { vue3: () => import('./vue3/TableBodyRow.vue'), react: () => import('./react/TableBodyRow.tsx'), svelte: () => import('./svelte/TableBodyRow.svelte'), vue2: () => import('./vue2/TableBodyRow.js'), angular: () => import('./angular/TableBodyRow.js') },
  'TableCellValue': { vue3: () => import('./vue3/TableCellValue.vue'), react: () => import('./react/TableCellValue.tsx'), svelte: () => import('./svelte/TableCellValue.svelte'), vue2: () => import('./vue2/TableCellValue.js'), angular: () => import('./angular/TableCellValue.js') },
  'TableCheckboxBodyCell': { vue3: () => import('./vue3/TableCheckboxBodyCell.vue'), react: () => import('./react/TableCheckboxBodyCell.tsx'), svelte: () => import('./svelte/TableCheckboxBodyCell.svelte'), vue2: () => import('./vue2/TableCheckboxBodyCell.js'), angular: () => import('./angular/TableCheckboxBodyCell.js') },
  'TableCheckboxHeaderCell': { vue3: () => import('./vue3/TableCheckboxHeaderCell.vue'), react: () => import('./react/TableCheckboxHeaderCell.tsx'), svelte: () => import('./svelte/TableCheckboxHeaderCell.svelte'), vue2: () => import('./vue2/TableCheckboxHeaderCell.js'), angular: () => import('./angular/TableCheckboxHeaderCell.js') },
  'TableEmpty': { vue3: () => import('./vue3/TableEmpty.vue'), react: () => import('./react/TableEmpty.tsx'), svelte: () => import('./svelte/TableEmpty.svelte'), vue2: () => import('./vue2/TableEmpty.js'), angular: () => import('./angular/TableEmpty.js') },
  'TableHeaderCell': { vue3: () => import('./vue3/TableHeaderCell.vue'), react: () => import('./react/TableHeaderCell.tsx'), svelte: () => import('./svelte/TableHeaderCell.svelte'), vue2: () => import('./vue2/TableHeaderCell.js'), angular: () => import('./angular/TableHeaderCell.js') },
  'TableHeaderRow': { vue3: () => import('./vue3/TableHeaderRow.vue'), react: () => import('./react/TableHeaderRow.tsx'), svelte: () => import('./svelte/TableHeaderRow.svelte'), vue2: () => import('./vue2/TableHeaderRow.js'), angular: () => import('./angular/TableHeaderRow.js') },
  'TableNoBodyCell': { vue3: () => import('./vue3/TableNoBodyCell.vue'), react: () => import('./react/TableNoBodyCell.tsx'), svelte: () => import('./svelte/TableNoBodyCell.svelte'), vue2: () => import('./vue2/TableNoBodyCell.js'), angular: () => import('./angular/TableNoBodyCell.js') },
  'TableNoHeaderCell': { vue3: () => import('./vue3/TableNoHeaderCell.vue'), react: () => import('./react/TableNoHeaderCell.tsx'), svelte: () => import('./svelte/TableNoHeaderCell.svelte'), vue2: () => import('./vue2/TableNoHeaderCell.js'), angular: () => import('./angular/TableNoHeaderCell.js') },
  'Tabs': { vue3: () => import('./vue3/Tabs.vue'), react: () => import('./react/Tabs.tsx'), svelte: () => import('./svelte/Tabs.svelte'), vue2: () => import('./vue2/Tabs.js'), angular: () => import('./angular/Tabs.js') },
  'Toast': { vue3: () => import('./vue3/Toast.vue'), react: () => import('./react/Toast.tsx'), svelte: () => import('./svelte/Toast.svelte'), vue2: () => import('./vue2/Toast.js'), angular: () => import('./angular/Toast.js') },
  'Toggle': { vue3: () => import('./vue3/Toggle.vue'), react: () => import('./react/Toggle.tsx'), svelte: () => import('./svelte/Toggle.svelte'), vue2: () => import('./vue2/Toggle.js'), angular: () => import('./angular/Toggle.js') },
  'ToggleGroup': { vue3: () => import('./vue3/ToggleGroup.vue'), react: () => import('./react/ToggleGroup.tsx'), svelte: () => import('./svelte/ToggleGroup.svelte'), vue2: () => import('./vue2/ToggleGroup.js'), angular: () => import('./angular/ToggleGroup.js') },
  'ToggleGroupItem': { vue3: () => import('./vue3/ToggleGroupItem.vue'), react: () => import('./react/ToggleGroupItem.tsx'), svelte: () => import('./svelte/ToggleGroupItem.svelte'), vue2: () => import('./vue2/ToggleGroupItem.js'), angular: () => import('./angular/ToggleGroupItem.js') },
  'Tooltip': { vue3: () => import('./vue3/Tooltip.vue'), react: () => import('./react/Tooltip.tsx'), svelte: () => import('./svelte/Tooltip.svelte'), vue2: () => import('./vue2/Tooltip.js'), angular: () => import('./angular/Tooltip.js') },
  'Topbar': { vue3: () => import('./vue3/Topbar.vue'), react: () => import('./react/Topbar.tsx'), svelte: () => import('./svelte/Topbar.svelte'), vue2: () => import('./vue2/Topbar.js'), angular: () => import('./angular/Topbar.js') },
};

/** Composition examples keyed by their parent component; previews prefer these over prop-driven mounts. */
export const componentExamples: Record<string, ComponentLoader> = {
  'Breadcrumb': { vue3: () => import('./vue3/BreadcrumbExample.vue'), react: () => import('./react/BreadcrumbExample.tsx'), svelte: () => import('./svelte/BreadcrumbExample.svelte'), vue2: () => import('./vue2/BreadcrumbExample.js'), angular: () => import('./angular/BreadcrumbExample.js') },
  'Chart': { vue3: () => import('./vue3/ChartExample.vue'), react: () => import('./react/ChartExample.tsx'), svelte: () => import('./svelte/ChartExample.svelte'), vue2: () => import('./vue2/ChartExample.js'), angular: () => import('./angular/ChartExample.js') },
  'Stepper': { vue3: () => import('./vue3/StepperExample.vue'), react: () => import('./react/StepperExample.tsx'), svelte: () => import('./svelte/StepperExample.svelte'), vue2: () => import('./vue2/StepperExample.js'), angular: () => import('./angular/StepperExample.js') },
  'TableBodyRow': { vue3: () => import('./vue3/TableBodyRowExample.vue'), react: () => import('./react/TableBodyRowExample.tsx'), svelte: () => import('./svelte/TableBodyRowExample.svelte'), vue2: () => import('./vue2/TableBodyRowExample.js'), angular: () => import('./angular/TableBodyRowExample.js') },
  'Table': { vue3: () => import('./vue3/TableExample.vue'), react: () => import('./react/TableExample.tsx'), svelte: () => import('./svelte/TableExample.svelte'), vue2: () => import('./vue2/TableExample.js'), angular: () => import('./angular/TableExample.js') },
  'TableHeaderRow': { vue3: () => import('./vue3/TableHeaderRowExample.vue'), react: () => import('./react/TableHeaderRowExample.tsx'), svelte: () => import('./svelte/TableHeaderRowExample.svelte'), vue2: () => import('./vue2/TableHeaderRowExample.js'), angular: () => import('./angular/TableHeaderRowExample.js') },
  'Tabs': { vue3: () => import('./vue3/TabsExample.vue'), react: () => import('./react/TabsExample.tsx'), svelte: () => import('./svelte/TabsExample.svelte'), vue2: () => import('./vue2/TabsExample.js'), angular: () => import('./angular/TabsExample.js') },
  'ToggleGroup': { vue3: () => import('./vue3/ToggleGroupExample.vue'), react: () => import('./react/ToggleGroupExample.tsx'), svelte: () => import('./svelte/ToggleGroupExample.svelte'), vue2: () => import('./vue2/ToggleGroupExample.js'), angular: () => import('./angular/ToggleGroupExample.js') },
};

/** Why a component (or example, keyed by file name) has no preview module for a framework. */
export const previewBuildErrors: Record<string, Partial<Record<PreviewFramework, string>>> = {};

export const componentMetadata: Record<string, ComponentMeta> = {
  "AlertDialog": {
    "name": "AlertDialog",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": [
      "open",
      "showDescription",
      "showCloseButton",
      "destructive"
    ]
  },
  "Avatar": {
    "name": "Avatar",
    "group": "components",
    "variants": {
      "size": [
        "mini",
        "small",
        "regular",
        "large",
        "x-large"
      ],
      "type": [
        "image",
        "initials",
        "icon"
      ],
      "status": [
        "online",
        "offline",
        "busy",
        "away"
      ]
    },
    "totalVariants": 15,
    "booleans": [
      "showStatus"
    ]
  },
  "Badge": {
    "name": "Badge",
    "group": "components",
    "variants": {
      "variant": [
        "primary",
        "secondary",
        "destructive",
        "success",
        "warning",
        "info",
        "outline"
      ]
    },
    "totalVariants": 7,
    "booleans": []
  },
  "Breadcrumb": {
    "name": "Breadcrumb",
    "group": "components",
    "variants": {
      "type": [
        "1",
        "2",
        "deep"
      ]
    },
    "totalVariants": 3,
    "booleans": [
      "showEllipsis"
    ]
  },
  "BreadcrumbItem": {
    "name": "BreadcrumbItem",
    "group": "components",
    "variants": {},
    "booleans": [],
    "totalVariants": 0
  },
  "BubbleChat": {
    "name": "BubbleChat",
    "group": "components",
    "variants": {
      "direction": [
        "incoming",
        "outgoing"
      ],
      "type": [
        "text",
        "file",
        "image",
        "video"
      ],
      "messageState": [
        "default",
        "error"
      ]
    },
    "totalVariants": 16,
    "booleans": [
      "showCustomText",
      "showTime",
      "showStatus"
    ]
  },
  "Button": {
    "name": "Button",
    "group": "components",
    "variants": {
      "type": [
        "button",
        "submit",
        "reset"
      ],
      "variant": [
        "primary",
        "secondary",
        "outline",
        "ghost",
        "destructive",
        "link"
      ],
      "size": [
        "large",
        "regular",
        "small",
        "mini"
      ],
      "roundness": [
        "default",
        "round"
      ]
    },
    "totalVariants": 160,
    "booleans": [
      "disabled",
      "showLeftIcon",
      "showRightIcon"
    ]
  },
  "Chart": {
    "name": "Chart",
    "group": "components",
    "variants": {},
    "totalVariants": 12,
    "booleans": []
  },
  "ChartBar": {
    "name": "ChartBar",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": [
      "showGridLines",
      "showDataLabels",
      "showAxisLabels",
      "showTooltip"
    ]
  },
  "ChartLegend": {
    "name": "ChartLegend",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": []
  },
  "ChartLine": {
    "name": "ChartLine",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": [
      "showAxisLabels"
    ]
  },
  "ChartPie": {
    "name": "ChartPie",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": [
      "showTooltip"
    ]
  },
  "Checkbox": {
    "name": "Checkbox",
    "group": "components",
    "variants": {
      "size": [
        "small",
        "medium",
        "large"
      ]
    },
    "totalVariants": 12,
    "booleans": [
      "checked",
      "indeterminate",
      "disabled",
      "required"
    ]
  },
  "DatePicker": {
    "name": "DatePicker",
    "group": "components",
    "variants": {},
    "totalVariants": 12,
    "booleans": [
      "open",
      "showHint",
      "showLabel"
    ]
  },
  "FAB": {
    "name": "FAB",
    "group": "components",
    "variants": {
      "type": [
        "button",
        "submit",
        "reset"
      ],
      "variant": [
        "primary",
        "secondary",
        "outline"
      ],
      "size": [
        "small",
        "regular",
        "large",
        "extended"
      ]
    },
    "totalVariants": 36,
    "booleans": [
      "disabled"
    ]
  },
  "IconPlaceholder": {
    "name": "IconPlaceholder",
    "group": "icons",
    "variants": {},
    "booleans": [],
    "totalVariants": 0
  },
  "IconTruckDelivery": {
    "name": "IconTruckDelivery",
    "group": "icons",
    "variants": {},
    "booleans": [],
    "totalVariants": 0
  },
  "InputDropdown": {
    "name": "InputDropdown",
    "group": "components",
    "variants": {},
    "totalVariants": 5,
    "booleans": [
      "open",
      "disabled",
      "showLeftIcon"
    ]
  },
  "InputFileDropZone": {
    "name": "InputFileDropZone",
    "group": "components",
    "variants": {
      "previewState": [
        "default",
        "filled",
        "focus",
        "error",
        "disabled"
      ]
    },
    "totalVariants": 5,
    "booleans": [
      "disabled",
      "required",
      "showLabel",
      "showHint"
    ]
  },
  "InputFileInput": {
    "name": "InputFileInput",
    "group": "components",
    "variants": {
      "previewState": [
        "default",
        "filled",
        "focus",
        "error",
        "disabled"
      ]
    },
    "totalVariants": 5,
    "booleans": [
      "disabled",
      "required",
      "showLabel",
      "showHint"
    ]
  },
  "InputImageUploader": {
    "name": "InputImageUploader",
    "group": "components",
    "variants": {
      "previewState": [
        "default",
        "filled",
        "focus",
        "error",
        "disabled"
      ]
    },
    "totalVariants": 5,
    "booleans": [
      "disabled",
      "required",
      "showLabel",
      "showHint"
    ]
  },
  "InputMultipleFileUpload": {
    "name": "InputMultipleFileUpload",
    "group": "components",
    "variants": {
      "previewState": [
        "default",
        "filled",
        "focus",
        "error",
        "disabled"
      ]
    },
    "totalVariants": 5,
    "booleans": [
      "disabled",
      "required",
      "showLabel",
      "showHint"
    ]
  },
  "InputOTP": {
    "name": "InputOTP",
    "group": "components",
    "variants": {
      "previewState": [
        "default",
        "filled",
        "focus",
        "error",
        "disabled"
      ]
    },
    "totalVariants": 5,
    "booleans": [
      "disabled",
      "required",
      "showLabel",
      "showHint"
    ]
  },
  "InputText": {
    "name": "InputText",
    "group": "components",
    "variants": {
      "type": [
        "text",
        "email",
        "password",
        "search",
        "tel",
        "url",
        "number"
      ],
      "previewState": [
        "default",
        "filled",
        "focus",
        "error",
        "disabled"
      ]
    },
    "totalVariants": 5,
    "booleans": [
      "disabled",
      "required",
      "showLabel",
      "showHint",
      "showCharacterCount",
      "showLeftIcon",
      "showRightIcon"
    ]
  },
  "InputTextArea": {
    "name": "InputTextArea",
    "group": "components",
    "variants": {
      "previewState": [
        "default",
        "filled",
        "focus",
        "error",
        "disabled"
      ]
    },
    "totalVariants": 5,
    "booleans": [
      "disabled",
      "required",
      "showLabel",
      "showHint",
      "showCharacterCount",
      "showLeftIcon",
      "showRightIcon"
    ]
  },
  "MainMenu": {
    "name": "MainMenu",
    "group": "components",
    "variants": {},
    "totalVariants": 5,
    "booleans": [
      "active",
      "showLabel",
      "showLeadingIcon",
      "showTrailingIcon",
      "showBadge"
    ]
  },
  "MenuItem": {
    "name": "MenuItem",
    "group": "components",
    "variants": {},
    "totalVariants": 3,
    "booleans": [
      "active",
      "showLabel",
      "showLeadingIcon",
      "showTrailingIcon",
      "showBadge"
    ]
  },
  "MetricCard": {
    "name": "MetricCard",
    "group": "components",
    "variants": {
      "trendDirection": [
        "up",
        "down",
        "neutral"
      ],
      "statusVariant": [
        "default",
        "success",
        "warning",
        "error",
        "info"
      ]
    },
    "totalVariants": 10,
    "booleans": [
      "showValue",
      "showTrend",
      "showDescription",
      "showIcon",
      "showStatus",
      "showProgress"
    ]
  },
  "Pagination": {
    "name": "Pagination",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": []
  },
  "Progressbar": {
    "name": "Progressbar",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": [
      "showLabel"
    ]
  },
  "RadioButton": {
    "name": "RadioButton",
    "group": "components",
    "variants": {
      "size": [
        "small",
        "medium",
        "large"
      ]
    },
    "totalVariants": 12,
    "booleans": [
      "checked",
      "disabled",
      "required"
    ]
  },
  "Sidebar": {
    "name": "Sidebar",
    "group": "components",
    "variants": {},
    "totalVariants": 2,
    "booleans": [
      "expanded"
    ]
  },
  "Slider": {
    "name": "Slider",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": [
      "disabled",
      "showValue"
    ]
  },
  "Spinner": {
    "name": "Spinner",
    "group": "components",
    "variants": {
      "size": [
        "12",
        "16",
        "24",
        "32"
      ]
    },
    "totalVariants": 4,
    "booleans": []
  },
  "Stepper": {
    "name": "Stepper",
    "group": "components",
    "variants": {
      "orientation": [
        "horizontal",
        "vertical"
      ]
    },
    "totalVariants": 8,
    "booleans": []
  },
  "StepperItem": {
    "name": "StepperItem",
    "group": "components",
    "variants": {
      "status": [
        "completed",
        "active",
        "upcoming"
      ],
      "orientation": [
        "horizontal",
        "vertical"
      ]
    },
    "booleans": [],
    "totalVariants": 6
  },
  "SwitchButton": {
    "name": "SwitchButton",
    "group": "components",
    "variants": {
      "size": [
        "small",
        "medium",
        "large"
      ]
    },
    "totalVariants": 12,
    "booleans": [
      "checked",
      "disabled"
    ]
  },
  "TabItem": {
    "name": "TabItem",
    "group": "components",
    "variants": {
      "state": [
        "default",
        "active"
      ]
    },
    "totalVariants": 2,
    "booleans": [
      "active",
      "showIcon",
      "showNum"
    ]
  },
  "Table": {
    "name": "Table",
    "group": "components",
    "variants": {},
    "totalVariants": 2,
    "booleans": []
  },
  "TableBodyCell": {
    "name": "TableBodyCell",
    "group": "components",
    "variants": {
      "align": [
        "left",
        "center",
        "right"
      ]
    },
    "totalVariants": 3,
    "booleans": []
  },
  "TableBodyRow": {
    "name": "TableBodyRow",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": []
  },
  "TableCellValue": {
    "name": "TableCellValue",
    "group": "components",
    "variants": {
      "layout": [
        "row",
        "stacked"
      ],
      "align": [
        "left",
        "center",
        "right"
      ],
      "status": [
        "none",
        "success",
        "warning",
        "destructive",
        "info"
      ]
    },
    "totalVariants": 15,
    "booleans": []
  },
  "TableCheckboxBodyCell": {
    "name": "TableCheckboxBodyCell",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": [
      "checked"
    ]
  },
  "TableCheckboxHeaderCell": {
    "name": "TableCheckboxHeaderCell",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": [
      "checked",
      "indeterminate"
    ]
  },
  "TableEmpty": {
    "name": "TableEmpty",
    "group": "components",
    "variants": {},
    "booleans": [
      "showIcon"
    ],
    "totalVariants": 0
  },
  "TableHeaderCell": {
    "name": "TableHeaderCell",
    "group": "components",
    "variants": {
      "align": [
        "left",
        "center",
        "right"
      ]
    },
    "booleans": [],
    "totalVariants": 3
  },
  "TableHeaderRow": {
    "name": "TableHeaderRow",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": []
  },
  "TableNoBodyCell": {
    "name": "TableNoBodyCell",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": []
  },
  "TableNoHeaderCell": {
    "name": "TableNoHeaderCell",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": []
  },
  "Tabs": {
    "name": "Tabs",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": []
  },
  "Toast": {
    "name": "Toast",
    "group": "components",
    "variants": {
      "type": [
        "default",
        "success",
        "error",
        "warning",
        "info"
      ]
    },
    "totalVariants": 15,
    "booleans": [
      "showDescription",
      "showAction",
      "showClose",
      "showTimestamp"
    ]
  },
  "Toggle": {
    "name": "Toggle",
    "group": "components",
    "variants": {
      "size": [
        "small",
        "medium",
        "large"
      ]
    },
    "totalVariants": 9,
    "booleans": [
      "pressed",
      "disabled",
      "showText",
      "showIcon"
    ]
  },
  "ToggleGroup": {
    "name": "ToggleGroup",
    "group": "components",
    "variants": {
      "size": [
        "small",
        "medium",
        "large"
      ]
    },
    "totalVariants": 3,
    "booleans": []
  },
  "ToggleGroupItem": {
    "name": "ToggleGroupItem",
    "group": "components",
    "variants": {
      "size": [
        "small",
        "medium",
        "large"
      ]
    },
    "booleans": [
      "pressed",
      "disabled"
    ],
    "totalVariants": 3
  },
  "Tooltip": {
    "name": "Tooltip",
    "group": "components",
    "variants": {
      "position": [
        "top",
        "bottom",
        "left",
        "right"
      ]
    },
    "totalVariants": 4,
    "booleans": []
  },
  "Topbar": {
    "name": "Topbar",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": [
      "showSearch",
      "showSidebarToggle"
    ]
  }
};
