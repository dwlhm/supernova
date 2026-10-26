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
    "totalVariants": 0
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
    "totalVariants": 15
  },
  "Badge": {
    "name": "Badge",
    "group": "components",
    "variants": {
      "Variant": [
        "destructive",
        "info",
        "outline",
        "primary",
        "secondary",
        "success",
        "warning"
      ],
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
    "totalVariants": 7
  },
  "Breadcrumb": {
    "name": "Breadcrumb",
    "group": "components",
    "variants": {
      "Type": [
        "1",
        "2",
        "deep"
      ],
      "type": [
        "1",
        "2",
        "deep"
      ]
    },
    "totalVariants": 3
  },
  "BubbleChat": {
    "name": "BubbleChat",
    "group": "components",
    "variants": {
      "Direction": [
        "Incoming",
        "Outgoing"
      ],
      "State": [
        "Default",
        "Error"
      ],
      "Type": [
        "File",
        "Image",
        "Text",
        "Video"
      ],
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
    "totalVariants": 16
  },
  "Button": {
    "name": "Button",
    "group": "components",
    "variants": {
      "Roundness": [
        "Default",
        "Round"
      ],
      "Size": [
        "Large",
        "Mini",
        "Regular",
        "Small"
      ],
      "State": [
        "Default",
        "Disabled",
        "Focus",
        "Pressed"
      ],
      "Style": [
        "Destructive",
        "Link",
        "Outline",
        "Primary",
        "Secondary"
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
    "totalVariants": 160
  },
  "Chart": {
    "name": "Chart",
    "group": "components",
    "variants": {
      "Type": [
        "Area",
        "Bar",
        "Donut",
        "Funnel",
        "Gauge",
        "Horizontal Bar",
        "Line",
        "Pie",
        "Radar",
        "Scatter",
        "Stacked Bar",
        "Waterfall"
      ]
    },
    "totalVariants": 12
  },
  "ChartBar": {
    "name": "ChartBar",
    "group": "components",
    "variants": {},
    "totalVariants": 0
  },
  "ChartLegend": {
    "name": "ChartLegend",
    "group": "components",
    "variants": {},
    "totalVariants": 0
  },
  "ChartLine": {
    "name": "ChartLine",
    "group": "components",
    "variants": {},
    "totalVariants": 0
  },
  "ChartPie": {
    "name": "ChartPie",
    "group": "components",
    "variants": {},
    "totalVariants": 0
  },
  "Checkbox": {
    "name": "Checkbox",
    "group": "components",
    "variants": {
      "Disabled": [
        "false",
        "true"
      ],
      "Size": [
        "Large",
        "Medium",
        "Small"
      ],
      "State": [
        "off",
        "on"
      ],
      "size": [
        "small",
        "medium",
        "large"
      ]
    },
    "totalVariants": 12
  },
  "DatePicker": {
    "name": "DatePicker",
    "group": "components",
    "variants": {
      "State": [
        "Closed",
        "Open"
      ],
      "Type": [
        "Date and Time Picker",
        "Date of Birth Picker",
        "Natural Language Picker",
        "Picker with Input",
        "Range Picker",
        "Year Picker"
      ]
    },
    "totalVariants": 12
  },
  "FAB": {
    "name": "FAB",
    "group": "components",
    "variants": {
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
    "totalVariants": 0
  },
  "IconPlaceholder": {
    "name": "IconPlaceholder",
    "group": "icons",
    "variants": {},
    "totalVariants": 0
  },
  "IconTruckDelivery": {
    "name": "IconTruckDelivery",
    "group": "icons",
    "variants": {},
    "totalVariants": 0
  },
  "InputDropdown": {
    "name": "InputDropdown",
    "group": "components",
    "variants": {
      "State": [
        "Default",
        "Disabled",
        "Error",
        "Filled",
        "Focus"
      ]
    },
    "totalVariants": 5
  },
  "InputFileDropZone": {
    "name": "InputFileDropZone",
    "group": "components",
    "variants": {
      "State": [
        "Default",
        "Disabled",
        "Error",
        "Filled",
        "Focus"
      ]
    },
    "totalVariants": 5
  },
  "InputFileInput": {
    "name": "InputFileInput",
    "group": "components",
    "variants": {
      "State": [
        "Default",
        "Disabled",
        "Error",
        "Filled",
        "Focus"
      ]
    },
    "totalVariants": 5
  },
  "InputImageUploader": {
    "name": "InputImageUploader",
    "group": "components",
    "variants": {
      "State": [
        "Default",
        "Disabled",
        "Error",
        "Filled",
        "Focus"
      ]
    },
    "totalVariants": 5
  },
  "InputMultipleFileUpload": {
    "name": "InputMultipleFileUpload",
    "group": "components",
    "variants": {
      "State": [
        "Default",
        "Disabled",
        "Error",
        "Filled",
        "Focus"
      ]
    },
    "totalVariants": 5
  },
  "InputOTP": {
    "name": "InputOTP",
    "group": "components",
    "variants": {},
    "totalVariants": 0
  },
  "InputText": {
    "name": "InputText",
    "group": "components",
    "variants": {
      "State": [
        "Default",
        "Disabled",
        "Error",
        "Filled",
        "Focus"
      ],
      "type": [
        "text",
        "email",
        "password",
        "search",
        "tel",
        "url",
        "number"
      ]
    },
    "totalVariants": 5
  },
  "InputTextArea": {
    "name": "InputTextArea",
    "group": "components",
    "variants": {
      "State": [
        "Default",
        "Disabled",
        "Error",
        "Filled",
        "Focus"
      ]
    },
    "totalVariants": 5
  },
  "MainMenu": {
    "name": "MainMenu",
    "group": "components",
    "variants": {
      "State": [
        "Active",
        "Active-Hover",
        "Default",
        "Hover",
        "Pressed"
      ]
    },
    "totalVariants": 5
  },
  "MenuItem": {
    "name": "MenuItem",
    "group": "components",
    "variants": {
      "State": [
        "Active",
        "Default",
        "Hover"
      ]
    },
    "totalVariants": 3
  },
  "MetricCard": {
    "name": "MetricCard",
    "group": "components",
    "variants": {
      "Type": [
        "Comparison",
        "Default",
        "Leaderboard",
        "List",
        "Mini Bar",
        "Multi-Metric",
        "Progress",
        "Radial",
        "Sparkline",
        "Target"
      ],
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
    "totalVariants": 10
  },
  "Pagination": {
    "name": "Pagination",
    "group": "components",
    "variants": {},
    "totalVariants": 0
  },
  "Progressbar": {
    "name": "Progressbar",
    "group": "components",
    "variants": {},
    "totalVariants": 0
  },
  "RadioButton": {
    "name": "RadioButton",
    "group": "components",
    "variants": {
      "Disabled": [
        "false",
        "true"
      ],
      "Size": [
        "Large",
        "Medium",
        "Small"
      ],
      "State": [
        "off",
        "on"
      ],
      "size": [
        "small",
        "medium",
        "large"
      ]
    },
    "totalVariants": 12
  },
  "Sidebar": {
    "name": "Sidebar",
    "group": "components",
    "variants": {
      "Expanded": [
        "False",
        "True"
      ]
    },
    "totalVariants": 2
  },
  "Slider": {
    "name": "Slider",
    "group": "components",
    "variants": {},
    "totalVariants": 0
  },
  "Spinner": {
    "name": "Spinner",
    "group": "components",
    "variants": {
      "Size": [
        "12",
        "16",
        "24",
        "32"
      ],
      "size": [
        "12",
        "16",
        "24",
        "32"
      ]
    },
    "totalVariants": 4
  },
  "Stepper": {
    "name": "Stepper",
    "group": "components",
    "variants": {
      "Current": [
        "1",
        "2",
        "3",
        "4"
      ],
      "Type": [
        "Horizontal",
        "Vertical"
      ],
      "orientation": [
        "horizontal",
        "vertical"
      ]
    },
    "totalVariants": 8
  },
  "SwitchButton": {
    "name": "SwitchButton",
    "group": "components",
    "variants": {
      "Disabled": [
        "False",
        "True"
      ],
      "Size": [
        "Large",
        "Medium",
        "Small"
      ],
      "State": [
        "Off",
        "On"
      ],
      "size": [
        "small",
        "medium",
        "large"
      ]
    },
    "totalVariants": 12
  },
  "TabItem": {
    "name": "TabItem",
    "group": "components",
    "variants": {
      "State": [
        "Active",
        "Default"
      ]
    },
    "totalVariants": 2
  },
  "Table": {
    "name": "Table",
    "group": "components",
    "variants": {
      "State": [
        "Default",
        "Empty"
      ]
    },
    "totalVariants": 2
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
    "totalVariants": 0
  },
  "TableBodyRow": {
    "name": "TableBodyRow",
    "group": "components",
    "variants": {},
    "totalVariants": 0
  },
  "TableCellValue": {
    "name": "TableCellValue",
    "group": "components",
    "variants": {
      "Type": [
        "Action",
        "Action (Icon)",
        "Avatar Text",
        "Badge",
        "Checkbox",
        "Image",
        "Image Text",
        "Link",
        "Number",
        "Product",
        "Slot",
        "Stacked Text",
        "Status",
        "Text",
        "Toggle"
      ],
      "align": [
        "left",
        "center",
        "right"
      ]
    },
    "totalVariants": 15
  },
  "TableCheckboxBodyCell": {
    "name": "TableCheckboxBodyCell",
    "group": "components",
    "variants": {},
    "totalVariants": 0
  },
  "TableCheckboxHeaderCell": {
    "name": "TableCheckboxHeaderCell",
    "group": "components",
    "variants": {},
    "totalVariants": 0
  },
  "TableHeaderRow": {
    "name": "TableHeaderRow",
    "group": "components",
    "variants": {},
    "totalVariants": 0
  },
  "TableNoBodyCell": {
    "name": "TableNoBodyCell",
    "group": "components",
    "variants": {},
    "totalVariants": 0
  },
  "TableNoHeaderCell": {
    "name": "TableNoHeaderCell",
    "group": "components",
    "variants": {},
    "totalVariants": 0
  },
  "Tabs": {
    "name": "Tabs",
    "group": "components",
    "variants": {},
    "totalVariants": 0
  },
  "Toast": {
    "name": "Toast",
    "group": "components",
    "variants": {
      "State": [
        "Default",
        "Hover",
        "Pressed"
      ],
      "Type": [
        "Default",
        "Error",
        "Info",
        "Success",
        "Warning"
      ],
      "type": [
        "default",
        "success",
        "error",
        "warning",
        "info"
      ]
    },
    "totalVariants": 15
  },
  "Toggle": {
    "name": "Toggle",
    "group": "components",
    "variants": {
      "Size": [
        "Large",
        "Medium",
        "Small"
      ],
      "State": [
        "Active",
        "Default",
        "Disabled"
      ],
      "size": [
        "small",
        "medium",
        "large"
      ]
    },
    "totalVariants": 9
  },
  "ToggleGroup": {
    "name": "ToggleGroup",
    "group": "components",
    "variants": {
      "Size": [
        "Large",
        "Medium",
        "Small"
      ],
      "size": [
        "small",
        "medium",
        "large"
      ]
    },
    "totalVariants": 3
  },
  "Tooltip": {
    "name": "Tooltip",
    "group": "components",
    "variants": {
      "Position": [
        "Bottom",
        "Left",
        "Right",
        "Top"
      ],
      "position": [
        "top",
        "bottom",
        "left",
        "right"
      ]
    },
    "totalVariants": 4
  },
  "Topbar": {
    "name": "Topbar",
    "group": "components",
    "variants": {},
    "totalVariants": 0
  }
};
