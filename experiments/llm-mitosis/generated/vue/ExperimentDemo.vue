<template>
  <main class="demo max-w-6xl mx-auto p-6 space-y-8 font-sans">
    <header class="hero text-center py-6 border-b border-gray-200">
      <span
        class="eyebrow inline-block text-xs font-semibold tracking-wider text-blue-600 uppercase mb-2"
      >
        DESIGN SYSTEM / COMPONENT LAB
      </span>
      <h1
        class="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl"
      >
        From design to interaction.
      </h1>
      <p class="mt-2 text-base text-gray-600 max-w-2xl mx-auto">
        A production-grade workspace showcasing Tailwind-styled Mitosis
        components across React, Vue 3, Vue 2, and Svelte.
      </p>
    </header>
    <section
      class="panel bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6"
      aria-label="Form controls"
    >
      <div
        class="section-title flex items-center gap-2 border-b border-gray-100 pb-3"
      >
        <span
          class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded"
          >01</span
        >
        <h2 class="text-lg font-bold text-gray-900">
          Every detail, interactive.
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-4">
          <h3
            class="text-sm font-semibold text-gray-800 uppercase tracking-wider"
          >
            Button Showcase
          </h3>
          <div class="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              :label="'Clicked ' + buttonClicks + ' times'"
              :disabled="buttonDisabled"
              :onClick="(event) => incrementButton()"
            ></Button
            ><Button
              variant="secondary"
              styleType="outline"
              :label="buttonDisabled ? 'Enable button' : 'Disable button'"
              :onClick="(event) => toggleButtonDisabled()"
            ></Button>
          </div>
          <div class="flex flex-wrap items-center gap-2 pt-2">
            <Button
              label="Primary"
              variant="primary"
              styleType="solid"
              size="small"
            ></Button
            ><Button
              label="Secondary"
              variant="secondary"
              styleType="outline"
              size="small"
            ></Button
            ><Button
              label="Positive"
              variant="positive"
              styleType="ghost"
              size="small"
            ></Button
            ><Button
              label="Gradient"
              variant="gradient"
              styleType="solid"
              size="small"
            ></Button>
          </div>
        </div>
        <div class="space-y-4">
          <h3
            class="text-sm font-semibold text-gray-800 uppercase tracking-wider"
          >
            Avatar Showcase
          </h3>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer"
              @click="async (event) => toggleAvatarShape()"
            >
              Shape: {{ avatarShape }}</button
            ><button
              type="button"
              class="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer"
              @click="async (event) => toggleAvatarSize()"
            >
              Size: {{ avatarSize }}
            </button>
          </div>
          <div class="flex items-center gap-3 pt-1">
            <Avatar
              name="Sarah Connor"
              color="primary"
              :shape="avatarShape"
              :size="avatarSize"
            ></Avatar
            ><Avatar
              name="Alex Murphy"
              color="secondary"
              :shape="avatarShape"
              :size="avatarSize"
            ></Avatar
            ><Avatar
              name="Ellen Ripley"
              color="positive"
              :shape="avatarShape"
              :size="avatarSize"
            ></Avatar
            ><Avatar
              name="Komerce User"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              :shape="avatarShape"
              :size="avatarSize"
            ></Avatar>
          </div>
        </div>
      </div>
      <div class="space-y-4 pt-4 border-t border-gray-100">
        <h3
          class="text-sm font-semibold text-gray-800 uppercase tracking-wider"
        >
          Alert Showcase
        </h3>
        <div class="flex flex-wrap items-center gap-3">
          <label
            class="text-xs font-medium text-gray-700 flex items-center gap-1.5"
          >
            Color:
            <select
              aria-label="Alert color"
              class="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white"
              :value="alertColor"
              @change="async (e) => updateAlertColor(e.target.value)"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="positive">Positive</option>
            </select></label
          ><button
            type="button"
            class="px-3 py-1 text-xs font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer"
            @click="async (event) => resetAlert()"
          >
            Reset alert</button
          ><span class="text-xs text-gray-500">
            Actions clicked: {{ alertActionClicks }}</span
          >
        </div>
        <template v-if="!alertDismissed">
          <Alert
            title="System Notification"
            text="Your changes have been processed and distributed across all node regions."
            actionLabel="Review details"
            :color="alertColor"
            :showIcon="true"
            :showAction="true"
            :dismissible="true"
            :onAction="(event) => triggerAlertAction()"
            :onClose="(event) => dismissAlert()"
          ></Alert>
        </template>
      </div>
      <div
        class="control-grid grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100"
      >
        <div class="space-y-2">
          <Checkbox
            id="updates"
            name="updates"
            label="Receive product updates"
            :checked="checked"
            :onCheckedChange="(value) => handleCheckboxChange(value)"
          ></Checkbox
          ><Checkbox
            id="locked"
            label="Managed by your organization"
            :checked="false"
            :disabled="true"
            :onCheckedChange="(event) => handleLockedClick()"
          ></Checkbox
          ><output
            data-testid="checkbox-state"
            class="block text-xs text-gray-500 pt-1"
          >
            <template v-if="checked">
              <span>Subscribed</span>
            </template>

            <template v-else>
              <span>Not subscribed</span>
            </template>
            {{ " · " + checkboxEvents + " changes" }}</output
          >
        </div>
        <div class="space-y-2">
          <TextField
            id="project"
            name="project"
            label="Project name"
            placeholder="Give your project a name"
            helperText="Visible to your teammates."
            :value="text"
            :onValueChange="(value) => handleTextChange(value)"
            :error="error ? 'Please choose a different name.' : ''"
            :maxLength="40"
            :showCount="true"
          ></TextField>
          <div class="flex items-center justify-between">
            <output data-testid="text-state" class="text-xs text-gray-500">{{
              text || "No project name yet"
            }}</output
            ><button
              type="button"
              class="subtle text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              @click="async (event) => toggleValidationError()"
            >
              Toggle validation
            </button>
          </div>
        </div>
      </div>
    </section>
    <section
      class="panel bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4"
      aria-label="Table experiment"
    >
      <div
        class="section-title flex items-center gap-2 border-b border-gray-100 pb-3"
      >
        <span
          class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded"
          >02</span
        >
        <h2 class="text-lg font-bold text-gray-900">
          Your customers, at a glance.
        </h2>
      </div>
      <div
        class="toolbar flex flex-wrap items-center gap-4 text-sm text-gray-700"
      >
        <label class="flex items-center gap-2 font-medium">
          Rows
          <select
            aria-label="Row count"
            class="border border-gray-300 rounded-md px-2 py-1 bg-white text-sm"
            :value="rowCount"
            @change="
              async (event) => updateRowCount(Number(event.target.value))
            "
          >
            <option value="0">Empty</option>
            <option value="1">One</option>
            <option value="3">Three</option>
            <option value="12">Twelve</option>
          </select></label
        ><button
          type="button"
          class="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer"
          @click="async (event) => toggleReversed()"
        >
          Reverse rows</button
        ><output
          data-testid="selection-state"
          class="text-xs text-gray-600 font-mono"
        >
          Selected: {{ selected.join(", ") || "none" }}</output
        >
      </div>
      <Table
        caption="Customer directory"
        emptyTitle="No customers yet"
        emptyDescription="Start by adding your first customer."
        emptyActionLabel="Add customer"
        :columns="columns"
        :rows="rows"
        :selectedIds="selected"
        :onSelectionChange="(ids) => updateSelectedRows(ids)"
        :selectable="true"
        :showRowNumbers="true"
        :onEmptyAction="(event) => handleEmptyAction()"
      ></Table
      ><output data-testid="empty-state" class="block text-xs text-gray-500">
        Customers added: {{ emptyEvents }}</output
      >
    </section>
    <section
      class="panel bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4"
      aria-label="Chart experiment"
    >
      <div
        class="section-title flex items-center gap-2 border-b border-gray-100 pb-3"
      >
        <span
          class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded"
          >03</span
        >
        <h2 class="text-lg font-bold text-gray-900">
          A clearer view of progress.
        </h2>
      </div>
      <div
        class="toolbar flex flex-wrap items-center gap-4 text-sm text-gray-700"
      >
        <label class="flex items-center gap-2 font-medium">
          Display
          <select
            aria-label="Chart variant"
            class="border border-gray-300 rounded-md px-2 py-1 bg-white text-sm"
            :value="chartVariant"
            @change="async (event) => updateChartVariant(event.target.value)"
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="unsupported">Unsupported</option>
          </select></label
        ><label class="flex items-center gap-2 font-medium">
          Dataset
          <select
            aria-label="Chart dataset"
            class="border border-gray-300 rounded-md px-2 py-1 bg-white text-sm"
            :value="chartCase"
            @change="async (event) => updateChartCase(event.target.value)"
          >
            <option value="normal">This week</option>
            <option value="updated">Last week</option>
            <option value="single">Single value</option>
            <option value="zero">Zero values</option>
            <option value="negative">Mixed signs</option>
            <option value="invalid">Invalid value</option>
            <option value="empty">Empty</option>
          </select></label
        >
      </div>
      <Chart
        title="Weekly activity"
        description="Activity by day"
        seriesLabel="Activity"
        :variant="chartVariant"
        :data="points"
        :showLegend="true"
        :showGridLines="true"
        :showDataLabels="true"
      ></Chart>
    </section>
    <footer class="text-center text-xs text-gray-400 py-6">
      Component lab · Design tokens from Supernova · Component references from
      Figma
    </footer>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import Button from "./Button.vue";
import Alert from "./Alert.vue";
import Avatar from "./Avatar.vue";
import Table from "./Table.vue";
import Chart from "./Chart.vue";
import Checkbox from "./Checkbox.vue";
import TextField from "./TextField.vue";

const buttonClicks = ref(0);
const buttonDisabled = ref(false);
const alertColor = ref("primary");
const alertActionClicks = ref(0);
const alertDismissed = ref(false);
const avatarShape = ref("round");
const avatarSize = ref("medium");
const checked = ref(false);
const checkboxEvents = ref(0);
const text = ref("");
const error = ref(false);
const rowCount = ref(3);
const reversed = ref(false);
const selected = ref([]);
const emptyEvents = ref(0);
const columns = ref([
  {
    key: "name",
    label: "Customer",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "amount",
    label: "Amount",
  },
]);
const chartVariant = ref("bar");
const chartCase = ref("normal");

const rows = computed(() => {
  return Array.from(
    {
      length: rowCount.value,
    },
    (_, index) => ({
      id: "customer-" + index,
      cells: {
        name: "Customer " + (index + 1),
        status: index % 2 ? "Pending" : "Active",
        amount: (index + 1) * 120,
      },
    })
  ).sort((a, b) =>
    reversed.value ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id)
  );
});
const points = computed(() => {
  return chartCase.value === "empty"
    ? []
    : chartCase.value === "invalid"
    ? [
        {
          id: "a",
          label: "Invalid",
          value: NaN,
        },
      ]
    : chartCase.value === "single"
    ? [
        {
          id: "a",
          label: "One",
          value: 12,
        },
      ]
    : chartCase.value === "zero"
    ? [
        {
          id: "a",
          label: "One",
          value: 0,
        },
        {
          id: "b",
          label: "Two",
          value: 0,
        },
      ]
    : chartCase.value === "negative"
    ? [
        {
          id: "a",
          label: "One",
          value: -20,
        },
        {
          id: "b",
          label: "Two",
          value: 10,
        },
      ]
    : chartCase.value === "updated"
    ? [
        {
          id: "a",
          label: "Monday",
          value: 75,
        },
        {
          id: "b",
          label: "Tuesday",
          value: 15,
        },
        {
          id: "c",
          label: "Wednesday",
          value: 45,
        },
      ]
    : [
        {
          id: "a",
          label: "Monday",
          value: 20,
        },
        {
          id: "b",
          label: "Tuesday",
          value: 60,
        },
        {
          id: "c",
          label: "Wednesday",
          value: 35,
        },
      ];
});

function incrementButton() {
  buttonClicks.value = buttonClicks.value + 1;
}
function toggleButtonDisabled() {
  buttonDisabled.value = !buttonDisabled.value;
}
function updateAlertColor(color) {
  alertColor.value = color;
}
function triggerAlertAction() {
  alertActionClicks.value = alertActionClicks.value + 1;
}
function resetAlert() {
  alertDismissed.value = false;
}
function dismissAlert() {
  alertDismissed.value = true;
}
function toggleAvatarShape() {
  avatarShape.value = avatarShape.value === "round" ? "square" : "round";
}
function toggleAvatarSize() {
  avatarSize.value = avatarSize.value === "medium" ? "small" : "medium";
}
function handleCheckboxChange(val) {
  checked.value = val;
  checkboxEvents.value = checkboxEvents.value + 1;
}
function handleLockedClick() {
  checkboxEvents.value = checkboxEvents.value + 100;
}
function handleTextChange(val) {
  text.value = val;
}
function toggleValidationError() {
  error.value = !error.value;
}
function updateRowCount(count) {
  rowCount.value = count;
}
function toggleReversed() {
  reversed.value = !reversed.value;
}
function updateSelectedRows(ids) {
  selected.value = ids;
}
function handleEmptyAction() {
  emptyEvents.value = emptyEvents.value + 1;
  rowCount.value = 1;
}
function updateChartVariant(variant) {
  chartVariant.value = variant;
}
function updateChartCase(c) {
  chartCase.value = c;
}
</script>