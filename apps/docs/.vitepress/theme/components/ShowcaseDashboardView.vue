<template>
  <div class="my-2 flex flex-col gap-8 text-foreground-default">
    <!-- Header Controls -->
    <div class="rounded-2xl border border-border-default bg-background-subtle p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-foreground-default tracking-tight">
          Multi-Framework Live Showcase
        </h2>
        <p class="text-sm text-foreground-muted mt-1">
          Explore production components generated from Figma across React, Vue 3, and Svelte.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Mode Switcher -->
        <div class="flex items-center rounded-lg bg-background-interactive p-1 text-xs font-medium">
          <button
            type="button"
            :class="[
              'px-3 py-1.5 rounded-md cursor-pointer transition-all',
              viewMode === 'single'
                ? 'bg-background-default text-foreground-default font-semibold shadow-xs'
                : 'text-foreground-muted hover:text-foreground-default'
            ]"
            @click="viewMode = 'single'"
          >
            Single View
          </button>
          <button
            type="button"
            :class="[
              'px-3 py-1.5 rounded-md cursor-pointer transition-all',
              viewMode === 'split'
                ? 'bg-background-default text-foreground-default font-semibold shadow-xs'
                : 'text-foreground-muted hover:text-foreground-default'
            ]"
            @click="viewMode = 'split'"
          >
            Side-by-Side (React vs Vue)
          </button>
        </div>

        <!-- Framework Picker (when in single view) -->
        <div v-if="viewMode === 'single'" class="flex items-center rounded-lg bg-background-interactive p-1 text-xs font-medium">
          <button
            v-for="fw in frameworks"
            :key="fw.id"
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer transition-all',
              activeFramework === fw.id
                ? 'bg-background-default text-foreground-default font-semibold shadow-xs'
                : 'text-foreground-muted hover:text-foreground-default'
            ]"
            @click="activeFramework = fw.id"
          >
            <FrameworkIcon :name="fw.id" :size="14" />
            <span>{{ fw.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- SIDE-BY-SIDE VIEW -->
    <div v-if="viewMode === 'split'" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- React Column -->
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-2 pb-2 border-b border-border-default">
          <FrameworkIcon name="react" :size="18" />
          <h3 class="text-base font-bold text-foreground-default">React Output</h3>
          <span class="text-xs px-2 py-0.5 rounded-full bg-background-interactive text-primary-default font-medium">
            Compiled TSX
          </span>
        </div>
        <FrameworkPreviewCard name="Button" initial-framework="react" :default-props="{ variant: 'primary', children: 'React Primary', showLeftIcon: true }" />
        <FrameworkPreviewCard name="MetricCard" initial-framework="react" :default-props="{ label: 'Total Revenue', value: 'Rp 45.200.000', trendText: '+12.5%', showValue: true, showTrend: true }" />
        <FrameworkPreviewCard name="InputText" initial-framework="react" :default-props="{ label: 'Username', placeholder: 'Komerce Admin', showLeftIcon: true }" />
        <FrameworkPreviewCard name="RadioButton" initial-framework="react" :default-props="{ label: 'Fast Delivery', checked: true }" />
        <FrameworkPreviewCard name="ChartBar" initial-framework="react" :default-props="{ data: sampleChartData }" />
      </div>

      <!-- Vue 3 Column -->
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-2 pb-2 border-b border-border-default">
          <FrameworkIcon name="vue3" :size="18" />
          <h3 class="text-base font-bold text-foreground-default">Vue 3 Output</h3>
          <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-medium">
            Compiled Vue SFC
          </span>
        </div>
        <FrameworkPreviewCard name="Button" initial-framework="vue3" :default-props="{ variant: 'primary', children: 'Vue Primary', showLeftIcon: true }" />
        <FrameworkPreviewCard name="MetricCard" initial-framework="vue3" :default-props="{ label: 'Total Revenue', value: 'Rp 45.200.000', trendText: '+12.5%', showValue: true, showTrend: true }" />
        <FrameworkPreviewCard name="InputText" initial-framework="vue3" :default-props="{ label: 'Username', placeholder: 'Komerce Admin', showLeftIcon: true }" />
        <FrameworkPreviewCard name="RadioButton" initial-framework="vue3" :default-props="{ label: 'Fast Delivery', checked: true }" />
        <FrameworkPreviewCard name="ChartBar" initial-framework="vue3" :default-props="{ data: sampleChartData }" />
      </div>
    </div>

    <!-- SINGLE VIEW (COMPREHENSIVE CATALOG) -->
    <div v-else class="flex flex-col gap-10">
      <section class="flex flex-col gap-4">
        <div class="flex items-center justify-between border-b border-border-default pb-2">
          <h3 class="text-lg font-bold text-foreground-default">Actions &amp; Icons</h3>
          <span class="text-xs text-foreground-muted">Button, FAB, IconTruckDelivery</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FrameworkPreviewCard name="Button" :initial-framework="activeFramework" :default-props="{ variant: 'primary', children: 'Primary Action', showLeftIcon: true }" />
          <FrameworkPreviewCard name="Button" :initial-framework="activeFramework" :default-props="{ variant: 'secondary', children: 'Secondary Action', showRightIcon: true }" />
          <FrameworkPreviewCard name="FAB" :initial-framework="activeFramework" :default-props="{ children: 'New Order', size: 'extended' }" />
          <FrameworkPreviewCard name="IconTruckDelivery" :initial-framework="activeFramework" :default-props="{ size: 36 }" />
        </div>
      </section>

      <section class="flex flex-col gap-4">
        <div class="flex items-center justify-between border-b border-border-default pb-2">
          <h3 class="text-lg font-bold text-foreground-default">Form Controls Studio</h3>
          <span class="text-xs text-foreground-muted">InputText, Dropdown, Radio, Checkbox, Slider, OTP</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FrameworkPreviewCard name="InputText" :initial-framework="activeFramework" :default-props="{ label: 'Email Address', placeholder: 'admin@komerce.id', showLeftIcon: true }" />
          <FrameworkPreviewCard name="InputDropdown" :initial-framework="activeFramework" :default-props="{ label: 'Courier Service', placeholder: 'Select Courier', showLeftIcon: true }" />
          <FrameworkPreviewCard name="RadioButton" :initial-framework="activeFramework" :default-props="{ label: 'Cash on Delivery (COD)', checked: true }" />
          <FrameworkPreviewCard name="Checkbox" :initial-framework="activeFramework" :default-props="{ label: 'Send WhatsApp notification', checked: true }" />
          <FrameworkPreviewCard name="Slider" :initial-framework="activeFramework" :default-props="{ value: 65, min: 0, max: 100, showValue: true }" />
          <FrameworkPreviewCard name="InputOTP" :initial-framework="activeFramework" :default-props="{ length: 6, value: '482' }" />
        </div>
      </section>

      <section class="flex flex-col gap-4">
        <div class="flex items-center justify-between border-b border-border-default pb-2">
          <h3 class="text-lg font-bold text-foreground-default">Data Presentation &amp; Status</h3>
          <span class="text-xs text-foreground-muted">MetricCard, Badge, Progressbar, Avatar, Table</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FrameworkPreviewCard name="MetricCard" :initial-framework="activeFramework" :default-props="{ label: 'Shipped Packages', value: '1,420', trendText: '+8.4%', showValue: true, showTrend: true }" />
          <FrameworkPreviewCard name="Progressbar" :initial-framework="activeFramework" :default-props="{ value: 72, label: 'Shipment SLA', showLabel: true }" />
          <FrameworkPreviewCard name="Badge" :initial-framework="activeFramework" :default-props="{ children: 'Active Order', variant: 'success' }" />
          <FrameworkPreviewCard name="Avatar" :initial-framework="activeFramework" :default-props="{ initialsText: 'DI', type: 'initials', size: 'regular', showStatus: true }" />
        </div>
        <div>
          <FrameworkPreviewCard name="Table" :initial-framework="activeFramework" />
        </div>
      </section>

      <section class="flex flex-col gap-4">
        <div class="flex items-center justify-between border-b border-border-default pb-2">
          <h3 class="text-lg font-bold text-foreground-default">Analytics &amp; Charts</h3>
          <span class="text-xs text-foreground-muted">ChartBar, ChartLine with Figma Theme Tokens</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FrameworkPreviewCard name="ChartBar" :initial-framework="activeFramework" :default-props="{ data: sampleChartData, ariaLabel: 'Weekly Performance' }" />
          <FrameworkPreviewCard name="ChartLine" :initial-framework="activeFramework" :default-props="{ data: sampleChartData, ariaLabel: 'Revenue Trend' }" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FrameworkIcon from './FrameworkIcon.vue';
import FrameworkPreviewCard from './FrameworkPreviewCard.vue';
import { PREVIEW_FRAMEWORKS } from './PreviewDefaults';
import type { PreviewFramework } from '../preview/registry';

type Framework = PreviewFramework;
type ViewMode = 'single' | 'split';

const frameworks = PREVIEW_FRAMEWORKS;

const activeFramework = ref<Framework>('react');
const viewMode = ref<ViewMode>('single');

const sampleChartData = [
  { label: 'Mon', value: 34 },
  { label: 'Tue', value: 52 },
  { label: 'Wed', value: 89 },
  { label: 'Thu', value: 64 },
  { label: 'Fri', value: 95 },
  { label: 'Sat', value: 78 },
  { label: 'Sun', value: 45 },
];

</script>
