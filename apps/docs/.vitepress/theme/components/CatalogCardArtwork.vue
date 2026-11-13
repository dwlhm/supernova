<template>
  <div class="relative w-full h-28 rounded-xl border border-border-default/70 bg-background-default/90 flex items-center justify-center overflow-hidden select-none pointer-events-none px-4" style="background-image: radial-gradient(rgba(156, 163, 175, 0.16) 1px, transparent 1px); background-size: 14px 14px;">
    <!-- Button -->
    <div v-if="slug === 'button'" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary-default text-white text-xs font-semibold shadow-sm">
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
      <span>Primary Action</span>
    </div>

    <!-- FAB -->
    <div v-else-if="slug === 'fab'" class="w-11 h-11 rounded-full bg-primary-default text-white flex items-center justify-center shadow-md ring-4 ring-primary-default/15">
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
    </div>

    <!-- IconPlaceholder -->
    <div v-else-if="slug === 'icon-placeholder'" class="w-12 h-12 rounded-xl border border-dashed border-border-default bg-background-subtle flex items-center justify-center text-foreground-default">
      <svg class="w-6 h-6 text-primary-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 17 17 7" stroke-linecap="round" />
      </svg>
    </div>

    <!-- IconTruckDelivery -->
    <div v-else-if="slug === 'icon-truck-delivery'" class="w-12 h-12 rounded-xl border border-border-default bg-background-subtle flex items-center justify-center text-foreground-default">
      <svg class="w-7 h-7 text-primary-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M15 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M5 18h-2v-11a1 1 0 0 1 1 -1h9v12h-4" />
        <path d="M15 9h5l2 3v6h-3" />
        <path d="M13 6h2l2 3" />
      </svg>
    </div>

    <!-- Checkbox -->
    <div v-else-if="slug === 'checkbox'" class="flex flex-col gap-2">
      <div class="flex items-center gap-2 text-xs text-foreground-default font-medium">
        <span class="w-4 h-4 rounded bg-primary-default text-white flex items-center justify-center">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <span>Express Shipping</span>
      </div>
      <div class="flex items-center gap-2 text-xs text-foreground-muted">
        <span class="w-4 h-4 rounded border border-border-default bg-background-subtle"></span>
        <span>Insurance Protection</span>
      </div>
    </div>

    <!-- RadioButton -->
    <div v-else-if="slug === 'radio-button'" class="flex flex-col gap-2">
      <div class="flex items-center gap-2 text-xs text-foreground-default font-medium">
        <span class="w-4 h-4 rounded-full border-2 border-primary-default flex items-center justify-center">
          <span class="w-2 h-2 rounded-full bg-primary-default"></span>
        </span>
        <span>Instant Courier</span>
      </div>
      <div class="flex items-center gap-2 text-xs text-foreground-muted">
        <span class="w-4 h-4 rounded-full border border-border-default bg-background-subtle"></span>
        <span>Regular Cargo</span>
      </div>
    </div>

    <!-- SwitchButton / Toggle -->
    <div v-else-if="slug === 'switch-button' || slug === 'toggle'" class="flex items-center gap-3">
      <div class="w-10 h-5.5 rounded-full bg-primary-default p-0.5 flex justify-end items-center">
        <span class="w-4.5 h-4.5 rounded-full bg-white shadow-xs"></span>
      </div>
      <span class="text-xs font-medium text-foreground-default">Auto-sync enabled</span>
    </div>

    <!-- ToggleGroup -->
    <div v-else-if="slug === 'toggle-group'" class="inline-flex rounded-lg border border-border-default bg-background-subtle p-0.5 text-[11px] font-medium">
      <span class="px-2.5 py-1 rounded-md bg-background-default text-foreground-default shadow-2xs font-semibold">Day</span>
      <span class="px-2.5 py-1 text-foreground-muted">Week</span>
      <span class="px-2.5 py-1 text-foreground-muted">Month</span>
    </div>

    <!-- Slider -->
    <div v-else-if="slug === 'slider'" class="w-40 flex items-center">
      <div class="relative w-full h-1.5 rounded-full bg-background-interactive">
        <div class="absolute left-0 top-0 h-1.5 w-2/3 rounded-full bg-primary-default"></div>
        <div class="absolute left-2/3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-primary-default shadow-xs"></div>
      </div>
    </div>

    <!-- InputOTP -->
    <div v-else-if="slug === 'input-otp'" class="flex items-center gap-1.5">
      <span v-for="(d, i) in ['4', '8', '2', '•']" :key="i" :class="['w-8 h-9 rounded-lg border flex items-center justify-center text-xs font-bold', i === 3 ? 'border-primary-default bg-background-default text-primary-default' : 'border-border-default bg-background-subtle text-foreground-default']">{{ d }}</span>
    </div>

    <!-- Uploaders -->
    <div v-else-if="slug.includes('file') || slug.includes('image')" class="w-44 py-2.5 px-3 rounded-lg border border-dashed border-border-default bg-background-subtle/70 flex flex-col items-center gap-1 text-foreground-muted">
      <svg class="w-5 h-5 text-primary-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span class="text-[10px] font-medium">Drop file or browse</span>
    </div>

    <!-- Inputs / DatePicker -->
    <div v-else-if="category === 'inputs'" class="w-48 px-3 py-1.5 rounded-lg border border-border-default bg-background-subtle flex items-center justify-between text-xs text-foreground-muted">
      <span class="truncate">{{ slug === 'date-picker' ? '2026-10-26' : slug === 'input-dropdown' ? 'Select option...' : 'name@komerce.id' }}</span>
      <svg class="w-3.5 h-3.5 shrink-0 text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>

    <!-- Card -->
    <div v-else-if="slug === 'card'" class="w-44 p-2.5 rounded-lg border border-border-default bg-background-subtle flex flex-col gap-1">
      <div class="flex items-center justify-between text-[10px] text-foreground-muted">
        <span>Revenue</span>
        <span class="text-emerald-500 font-semibold">+18.4%</span>
      </div>
      <div class="text-sm font-bold text-foreground-default">Rp 148.5M</div>
    </div>

    <!-- Stat -->
    <div v-else-if="slug === 'stat'" class="flex items-center gap-3">
      <div class="flex flex-col">
        <span class="text-[10px] text-foreground-muted">User A</span>
        <span class="text-sm font-bold text-foreground-default">2.45M</span>
      </div>
      <div class="h-6 w-px bg-border-default"></div>
      <div class="flex flex-col">
        <span class="text-[10px] text-foreground-muted">User B</span>
        <span class="text-sm font-bold text-foreground-muted">1.80M</span>
      </div>
    </div>

    <!-- Divider -->
    <div v-else-if="slug === 'divider'" class="w-36 flex flex-col gap-2">
      <div class="h-2 w-24 rounded bg-foreground-muted/20"></div>
      <div class="h-px w-full bg-border-default"></div>
      <div class="h-2 w-20 rounded bg-foreground-muted/20"></div>
    </div>

    <!-- ListItem -->
    <div v-else-if="slug === 'list-item'" class="w-44 flex flex-col gap-1.5">
      <div class="flex items-center justify-between text-[10px]">
        <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-primary-default"></span>Organic</span>
        <span class="font-semibold">5,420</span>
      </div>
      <div class="flex items-center justify-between text-[10px]">
        <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>Direct</span>
        <span class="font-semibold">4,110</span>
      </div>
    </div>

    <!-- Chart -->
    <div v-else-if="slug === 'chart'" class="flex items-end gap-2 h-14 pt-2">
      <span class="w-3.5 h-7 rounded-t bg-blue-500"></span>
      <span class="w-3.5 h-11 rounded-t bg-cyan-500"></span>
      <span class="w-3.5 h-8 rounded-t bg-violet-500"></span>
      <span class="w-3.5 h-12 rounded-t bg-primary-default"></span>
      <span class="w-3.5 h-9 rounded-t bg-amber-500"></span>
    </div>

    <!-- Badge -->
    <div v-else-if="slug === 'badge'" class="flex items-center gap-1.5">
      <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-default/15 text-primary-default">Primary</span>
      <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-500">Active</span>
    </div>

    <!-- Avatar -->
    <div v-else-if="slug === 'avatar'" class="flex items-center -space-x-2">
      <div class="relative w-9 h-9 rounded-full bg-primary-default/20 border-2 border-background-default flex items-center justify-center text-xs font-bold text-primary-default">
        KM
        <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background-default"></span>
      </div>
      <div class="w-9 h-9 rounded-full bg-background-interactive border-2 border-background-default flex items-center justify-center text-xs font-bold text-foreground-default">DI</div>
    </div>

    <!-- Progressbar -->
    <div v-else-if="slug === 'progressbar'" class="w-40 flex flex-col gap-1.5">
      <div class="flex justify-between text-[10px] font-medium text-foreground-muted"><span>Syncing</span><span>72%</span></div>
      <div class="w-full h-2 rounded-full bg-background-interactive overflow-hidden">
        <div class="h-full w-[72%] rounded-full bg-primary-default"></div>
      </div>
    </div>

    <!-- Table -->
    <div v-else-if="slug === 'table'" class="w-44 rounded-lg border border-border-default bg-background-subtle overflow-hidden text-[10px]">
      <div class="grid grid-cols-3 px-2 py-1 bg-background-interactive font-semibold text-foreground-muted"><span>ID</span><span>Status</span><span class="text-right">Total</span></div>
      <div class="grid grid-cols-3 px-2 py-1 border-t border-border-default text-foreground-default"><span>#901</span><span class="text-emerald-500">Paid</span><span class="text-right">245k</span></div>
      <div class="grid grid-cols-3 px-2 py-1 border-t border-border-default text-foreground-default"><span>#902</span><span class="text-amber-500">Ship</span><span class="text-right">510k</span></div>
    </div>

    <!-- Navigation -->
    <div v-else-if="category === 'navigation'" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-default bg-background-subtle text-xs">
      <span class="px-2 py-0.5 rounded bg-primary-default text-white font-semibold text-[11px]">Overview</span>
      <span class="px-2 py-0.5 text-foreground-muted text-[11px]">Tokens</span>
      <span class="px-2 py-0.5 text-foreground-muted text-[11px]">Specs</span>
    </div>

    <!-- Feedback -->
    <div v-else class="flex items-center gap-2 px-3 py-2 rounded-lg border border-border-default bg-background-subtle text-xs shadow-xs">
      <span class="w-2 h-2 rounded-full bg-primary-default shrink-0"></span>
      <span class="font-medium text-foreground-default truncate">{{ name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  slug: string;
  category: string;
}>();
</script>
