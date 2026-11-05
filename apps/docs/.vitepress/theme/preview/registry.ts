// Auto-generated component registry for VitePress Multi-Framework Preview
export interface ComponentLoader {
  vue3?: () => Promise<any>;
  react?: () => Promise<any>;
  svelte?: () => Promise<any>;
}

export interface ComponentMeta {
  name: string;
  group?: string;
  variants?: Record<string, string[]>;
  booleans?: string[];
  totalVariants?: number;
}

export const componentRegistry: Record<string, ComponentLoader> = {
  'AlertDialog': { vue3: () => import('./vue3/AlertDialog.vue'), react: () => import('./react/AlertDialog.tsx'), svelte: () => import('./svelte/AlertDialog.svelte') },
  'Avatar': { vue3: () => import('./vue3/Avatar.vue'), react: () => import('./react/Avatar.tsx'), svelte: () => import('./svelte/Avatar.svelte') },
  'Badge': { vue3: () => import('./vue3/Badge.vue'), react: () => import('./react/Badge.tsx'), svelte: () => import('./svelte/Badge.svelte') },
  'Breadcrumb': { vue3: () => import('./vue3/Breadcrumb.vue'), react: () => import('./react/Breadcrumb.tsx'), svelte: () => import('./svelte/Breadcrumb.svelte') },
  'BubbleChat': { vue3: () => import('./vue3/BubbleChat.vue'), react: () => import('./react/BubbleChat.tsx'), svelte: () => import('./svelte/BubbleChat.svelte') },
  'Button': { vue3: () => import('./vue3/Button.vue'), react: () => import('./react/Button.tsx'), svelte: () => import('./svelte/Button.svelte') },
  'Chart': { vue3: () => import('./vue3/Chart.vue'), react: () => import('./react/Chart.tsx'), svelte: () => import('./svelte/Chart.svelte') },
  'ChartBar': { vue3: () => import('./vue3/ChartBar.vue'), react: () => import('./react/ChartBar.tsx'), svelte: () => import('./svelte/ChartBar.svelte') },
  'ChartLegend': { vue3: () => import('./vue3/ChartLegend.vue'), react: () => import('./react/ChartLegend.tsx'), svelte: () => import('./svelte/ChartLegend.svelte') },
  'ChartLine': { vue3: () => import('./vue3/ChartLine.vue'), react: () => import('./react/ChartLine.tsx'), svelte: () => import('./svelte/ChartLine.svelte') },
  'ChartPie': { vue3: () => import('./vue3/ChartPie.vue'), react: () => import('./react/ChartPie.tsx'), svelte: () => import('./svelte/ChartPie.svelte') },
  'Checkbox': { vue3: () => import('./vue3/Checkbox.vue'), react: () => import('./react/Checkbox.tsx'), svelte: () => import('./svelte/Checkbox.svelte') },
  'DatePicker': { vue3: () => import('./vue3/DatePicker.vue'), react: () => import('./react/DatePicker.tsx'), svelte: () => import('./svelte/DatePicker.svelte') },
  'FAB': { vue3: () => import('./vue3/FAB.vue'), react: () => import('./react/FAB.tsx'), svelte: () => import('./svelte/FAB.svelte') },
  'IconPlaceholder': { vue3: () => import('./vue3/IconPlaceholder.vue'), react: () => import('./react/IconPlaceholder.tsx'), svelte: () => import('./svelte/IconPlaceholder.svelte') },
  'IconTruckDelivery': { vue3: () => import('./vue3/IconTruckDelivery.vue'), react: () => import('./react/IconTruckDelivery.tsx'), svelte: () => import('./svelte/IconTruckDelivery.svelte') },
  'InputDropdown': { vue3: () => import('./vue3/InputDropdown.vue'), react: () => import('./react/InputDropdown.tsx'), svelte: () => import('./svelte/InputDropdown.svelte') },
  'InputFileDropZone': { vue3: () => import('./vue3/InputFileDropZone.vue'), react: () => import('./react/InputFileDropZone.tsx'), svelte: () => import('./svelte/InputFileDropZone.svelte') },
  'InputFileInput': { vue3: () => import('./vue3/InputFileInput.vue'), react: () => import('./react/InputFileInput.tsx'), svelte: () => import('./svelte/InputFileInput.svelte') },
  'InputImageUploader': { vue3: () => import('./vue3/InputImageUploader.vue'), react: () => import('./react/InputImageUploader.tsx'), svelte: () => import('./svelte/InputImageUploader.svelte') },
  'InputMultipleFileUpload': { vue3: () => import('./vue3/InputMultipleFileUpload.vue'), react: () => import('./react/InputMultipleFileUpload.tsx'), svelte: () => import('./svelte/InputMultipleFileUpload.svelte') },
  'InputOTP': { vue3: () => import('./vue3/InputOTP.vue'), react: () => import('./react/InputOTP.tsx'), svelte: () => import('./svelte/InputOTP.svelte') },
  'InputText': { vue3: () => import('./vue3/InputText.vue'), react: () => import('./react/InputText.tsx'), svelte: () => import('./svelte/InputText.svelte') },
  'InputTextArea': { vue3: () => import('./vue3/InputTextArea.vue'), react: () => import('./react/InputTextArea.tsx'), svelte: () => import('./svelte/InputTextArea.svelte') },
  'MainMenu': { vue3: () => import('./vue3/MainMenu.vue'), react: () => import('./react/MainMenu.tsx'), svelte: () => import('./svelte/MainMenu.svelte') },
  'MenuItem': { vue3: () => import('./vue3/MenuItem.vue'), react: () => import('./react/MenuItem.tsx'), svelte: () => import('./svelte/MenuItem.svelte') },
  'MetricCard': { vue3: () => import('./vue3/MetricCard.vue'), react: () => import('./react/MetricCard.tsx'), svelte: () => import('./svelte/MetricCard.svelte') },
  'Pagination': { vue3: () => import('./vue3/Pagination.vue'), react: () => import('./react/Pagination.tsx'), svelte: () => import('./svelte/Pagination.svelte') },
  'Progressbar': { vue3: () => import('./vue3/Progressbar.vue'), react: () => import('./react/Progressbar.tsx'), svelte: () => import('./svelte/Progressbar.svelte') },
  'RadioButton': { vue3: () => import('./vue3/RadioButton.vue'), react: () => import('./react/RadioButton.tsx'), svelte: () => import('./svelte/RadioButton.svelte') },
  'Sidebar': { vue3: () => import('./vue3/Sidebar.vue'), react: () => import('./react/Sidebar.tsx'), svelte: () => import('./svelte/Sidebar.svelte') },
  'Slider': { vue3: () => import('./vue3/Slider.vue'), react: () => import('./react/Slider.tsx'), svelte: () => import('./svelte/Slider.svelte') },
  'Spinner': { vue3: () => import('./vue3/Spinner.vue'), react: () => import('./react/Spinner.tsx'), svelte: () => import('./svelte/Spinner.svelte') },
  'Stepper': { vue3: () => import('./vue3/Stepper.vue'), react: () => import('./react/Stepper.tsx'), svelte: () => import('./svelte/Stepper.svelte') },
  'SwitchButton': { vue3: () => import('./vue3/SwitchButton.vue'), react: () => import('./react/SwitchButton.tsx'), svelte: () => import('./svelte/SwitchButton.svelte') },
  'TabItem': { vue3: () => import('./vue3/TabItem.vue'), react: () => import('./react/TabItem.tsx'), svelte: () => import('./svelte/TabItem.svelte') },
  'Table': { vue3: () => import('./vue3/Table.vue'), react: () => import('./react/Table.tsx'), svelte: () => import('./svelte/Table.svelte') },
  'TableBodyCell': { vue3: () => import('./vue3/TableBodyCell.vue'), react: () => import('./react/TableBodyCell.tsx'), svelte: () => import('./svelte/TableBodyCell.svelte') },
  'TableBodyRow': { vue3: () => import('./vue3/TableBodyRow.vue'), react: () => import('./react/TableBodyRow.tsx'), svelte: () => import('./svelte/TableBodyRow.svelte') },
  'TableCellValue': { vue3: () => import('./vue3/TableCellValue.vue'), react: () => import('./react/TableCellValue.tsx'), svelte: () => import('./svelte/TableCellValue.svelte') },
  'TableCheckboxBodyCell': { vue3: () => import('./vue3/TableCheckboxBodyCell.vue'), react: () => import('./react/TableCheckboxBodyCell.tsx'), svelte: () => import('./svelte/TableCheckboxBodyCell.svelte') },
  'TableCheckboxHeaderCell': { vue3: () => import('./vue3/TableCheckboxHeaderCell.vue'), react: () => import('./react/TableCheckboxHeaderCell.tsx'), svelte: () => import('./svelte/TableCheckboxHeaderCell.svelte') },
  'TableHeaderRow': { vue3: () => import('./vue3/TableHeaderRow.vue'), react: () => import('./react/TableHeaderRow.tsx'), svelte: () => import('./svelte/TableHeaderRow.svelte') },
  'TableNoBodyCell': { vue3: () => import('./vue3/TableNoBodyCell.vue'), react: () => import('./react/TableNoBodyCell.tsx'), svelte: () => import('./svelte/TableNoBodyCell.svelte') },
  'TableNoHeaderCell': { vue3: () => import('./vue3/TableNoHeaderCell.vue'), react: () => import('./react/TableNoHeaderCell.tsx'), svelte: () => import('./svelte/TableNoHeaderCell.svelte') },
  'Tabs': { vue3: () => import('./vue3/Tabs.vue'), react: () => import('./react/Tabs.tsx'), svelte: () => import('./svelte/Tabs.svelte') },
  'Toast': { vue3: () => import('./vue3/Toast.vue'), react: () => import('./react/Toast.tsx'), svelte: () => import('./svelte/Toast.svelte') },
  'Toggle': { vue3: () => import('./vue3/Toggle.vue'), react: () => import('./react/Toggle.tsx'), svelte: () => import('./svelte/Toggle.svelte') },
  'ToggleGroup': { vue3: () => import('./vue3/ToggleGroup.vue'), react: () => import('./react/ToggleGroup.tsx'), svelte: () => import('./svelte/ToggleGroup.svelte') },
  'Tooltip': { vue3: () => import('./vue3/Tooltip.vue'), react: () => import('./react/Tooltip.tsx'), svelte: () => import('./svelte/Tooltip.svelte') },
  'Topbar': { vue3: () => import('./vue3/Topbar.vue'), react: () => import('./react/Topbar.tsx'), svelte: () => import('./svelte/Topbar.svelte') },
};

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
      "showLabel",
      "showLeftIcon",
      "showRightIcon"
    ]
  },
  "Chart": {
    "name": "Chart",
    "group": "components",
    "variants": {
      "type": [
        "bar",
        "line",
        "area",
        "pie",
        "donut"
      ]
    },
    "totalVariants": 12,
    "booleans": [
      "showTitle",
      "showDescription",
      "showTooltip",
      "showLegend"
    ]
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
      "disabled",
      "showLabel"
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
    "variants": {},
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
    "variants": {
      "state": [
        "default",
        "empty"
      ]
    },
    "totalVariants": 2,
    "booleans": [
      "showCheckbox",
      "showNo",
      "showPagination",
      "showEmptyCta"
    ]
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
    "booleans": [
      "showNo",
      "showCheckbox",
      "checked"
    ]
  },
  "TableCellValue": {
    "name": "TableCellValue",
    "group": "components",
    "variants": {
      "align": [
        "left",
        "center",
        "right"
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
  "TableHeaderRow": {
    "name": "TableHeaderRow",
    "group": "components",
    "variants": {},
    "totalVariants": 0,
    "booleans": [
      "showCheckbox",
      "showNo"
    ]
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
      "showText"
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
    "booleans": [
      "showLabel"
    ]
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
