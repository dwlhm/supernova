<template>
  <div class="showcase-dashboard my-8 flex flex-col gap-8">
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

      <div class="flex items-center gap-3">
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
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer transition-all',
              activeFramework === fw.id
                ? 'bg-background-default text-foreground-default font-semibold shadow-xs'
                : 'text-foreground-muted hover:text-foreground-default'
            ]"
            @click="activeFramework = fw.id"
          >
            <span>{{ fw.icon }}</span>
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
          <span class="text-lg">⚛️</span>
          <h3 class="text-base font-bold text-foreground-default">React Output</h3>
          <span class="text-xs px-2 py-0.5 rounded-full bg-primary-subtle text-primary-default font-medium">
            Compiled TSX
          </span>
        </div>
        <FrameworkPreview name="Button" :defaultProps="{ variant: 'primary', label: 'React Primary' }" />
        <FrameworkPreview name="MetricCard" :defaultProps="{ title: 'Total Revenue', value: 'Rp 45.200.000', change: '+12.5%' }" />
        <FrameworkPreview name="InputText" :defaultProps="{ label: 'Username', placeholder: 'Komerce Admin' }" />
        <FrameworkPreview name="RadioButton" :defaultProps="{ label: 'Fast Delivery', checked: true }" />
        <FrameworkPreview name="ChartBar" :defaultProps="{ data: sampleChartData }" />
      </div>

      <!-- Vue 3 Column -->
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-2 pb-2 border-b border-border-default">
          <span class="text-lg">🟢</span>
          <h3 class="text-base font-bold text-foreground-default">Vue 3 Output</h3>
          <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
            Compiled Vue SFC
          </span>
        </div>
        <FrameworkPreview name="Button" :defaultProps="{ variant: 'primary', label: 'Vue Primary' }" />
        <FrameworkPreview name="MetricCard" :defaultProps="{ title: 'Total Revenue', value: 'Rp 45.200.000', change: '+12.5%' }" />
        <FrameworkPreview name="InputText" :defaultProps="{ label: 'Username', placeholder: 'Komerce Admin' }" />
        <FrameworkPreview name="RadioButton" :defaultProps="{ label: 'Fast Delivery', checked: true }" />
        <FrameworkPreview name="ChartBar" :defaultProps="{ data: sampleChartData }" />
      </div>
    </div>

    <!-- SINGLE VIEW (COMPREHENSIVE CATALOG) -->
    <div v-else class="flex flex-col gap-10">
      <!-- 1. Actions & Overlays -->
      <section class="flex flex-col gap-4">
        <div class="flex items-center justify-between border-b border-border-default pb-2">
          <h3 class="text-lg font-bold text-foreground-default">Actions & Overlays</h3>
          <span class="text-xs text-foreground-muted">Button, AlertDialog, Tooltip, FAB</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FrameworkPreview name="Button" :defaultProps="{ variant: 'primary', label: 'Primary Action' }" />
          <FrameworkPreview name="Button" :defaultProps="{ variant: 'secondary', label: 'Secondary Action' }" />
          <FrameworkPreview name="Button" :defaultProps="{ variant: 'destructive', label: 'Delete Item' }" />
          <FrameworkPreview name="FAB" :defaultProps="{ label: 'New Order' }" />
        </div>
      </section>

      <!-- 2. Form Studio -->
      <section class="flex flex-col gap-4">
        <div class="flex items-center justify-between border-b border-border-default pb-2">
          <h3 class="text-lg font-bold text-foreground-default">Form Controls Studio</h3>
          <span class="text-xs text-foreground-muted">InputText, Dropdown, Radio, Checkbox, Slider, OTP</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FrameworkPreview name="InputText" :defaultProps="{ label: 'Email Address', placeholder: 'admin@komerce.id' }" />
          <FrameworkPreview name="InputDropdown" :defaultProps="{ label: 'Courier Service', placeholder: 'Select Courier' }" />
          <FrameworkPreview name="RadioButton" :defaultProps="{ label: 'Cash on Delivery (COD)', checked: true }" />
          <FrameworkPreview name="Checkbox" :defaultProps="{ label: 'Send WhatsApp notification', checked: true }" />
          <FrameworkPreview name="Slider" :defaultProps="{ value: 65, min: 0, max: 100 }" />
          <FrameworkPreview name="InputOTP" :defaultProps="{ length: 6 }" />
        </div>
      </section>

      <!-- 3. Metrics & Data Presentation -->
      <section class="flex flex-col gap-4">
        <div class="flex items-center justify-between border-b border-border-default pb-2">
          <h3 class="text-lg font-bold text-foreground-default">Data Presentation & Status</h3>
          <span class="text-xs text-foreground-muted">MetricCard, Badge, Progressbar, Avatar, Table</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FrameworkPreview name="MetricCard" :defaultProps="{ title: 'Shipped Packages', value: '1,420', change: '+8.4%' }" />
          <FrameworkPreview name="Progressbar" :defaultProps="{ value: 72, label: 'Monthly Goal' }" />
          <FrameworkPreview name="Badge" :defaultProps="{ label: 'Active Order', variant: 'success' }" />
          <FrameworkPreview name="Avatar" :defaultProps="{ label: 'Dwi Ilham' }" />
        </div>
        <div>
          <FrameworkPreview name="Table" :defaultProps="sampleTableProps" />
        </div>
      </section>

      <!-- 4. Visualizations & Charts -->
      <section class="flex flex-col gap-4">
        <div class="flex items-center justify-between border-b border-border-default pb-2">
          <h3 class="text-lg font-bold text-foreground-default">Analytics & Charts</h3>
          <span class="text-xs text-foreground-muted">ChartBar, ChartLine, ChartPie with Figma Theme Tokens</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FrameworkPreview name="ChartBar" :defaultProps="{ data: sampleChartData, ariaLabel: 'Weekly Performance' }" />
          <FrameworkPreview name="ChartLine" :defaultProps="{ data: sampleChartData, ariaLabel: 'Revenue Trend' }" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FrameworkPreview from './FrameworkPreview.vue';

type Framework = 'react' | 'vue3' | 'svelte';
type ViewMode = 'single' | 'split';

const frameworks = [
  { id: 'react' as const, label: 'React', icon: '⚛️' },
  { id: 'vue3' as const, label: 'Vue 3', icon: '🟢' },
  { id: 'svelte' as const, label: 'Svelte', icon: '🟠' },
];

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

const sampleTableProps = {
  columns: [
    { id: 'id', label: 'Order ID' },
    { id: 'customer', label: 'Customer' },
    { id: 'status', label: 'Status' },
    { id: 'amount', label: 'Amount', align: 'right' as const },
  ],
  rows: [
    { id: '1', cells: ['ORD-9021', 'Budi Santoso', 'Delivered', 'Rp 245.000'] },
    { id: '2', cells: ['ORD-9022', 'Siti Rahma', 'Shipped', 'Rp 510.000'] },
    { id: '3', cells: ['ORD-9023', 'Ahmad Dani', 'Pending', 'Rp 120.000'] },
  ],
  showCheckbox: true,
};
</script>
