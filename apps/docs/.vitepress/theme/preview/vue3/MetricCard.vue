<template>
  <article
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'flex w-full flex-col gap-2 rounded-lg border border-border-default bg-background-default p-4 shadow-sm',
        className
      )
    "
  >
    <div class="flex items-center justify-between gap-2">
      <span class="flex-1 truncate text-xs font-medium text-foreground-muted">{{
        label
      }}</span>
      <template v-if="showStatus">
        <span
          :class="
            cn(
              'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium leading-4',
              cva(
                statusVariant,
                {
                  success: 'bg-success-subtle text-success-foreground',
                  warning: 'bg-warning-subtle text-warning-foreground',
                  error: 'bg-destructive-subtle text-destructive-foreground',
                  info: 'bg-info-subtle text-info-foreground',
                  default: 'bg-background-muted text-foreground-muted',
                },
                'default'
              )
            )
          "
          >{{ statusLabel }}</span
        >
      </template>

      <template v-if="showIcon">
        <span
          class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-background-muted p-1 text-foreground-default"
          aria-hidden="true"
          ><svg
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              d="M4 20V10M10 20V4M16 20v-7M22 20H2"
              stroke-linecap="round"
            ></path></svg
        ></span>
      </template>
    </div>
    <template v-if="showValue">
      <p
        class="truncate text-xl leading-6 font-semibold text-foreground-default"
      >
        {{ value }}
      </p>
    </template>

    <template v-if="showTrend || showDescription">
      <div class="flex flex-wrap items-center gap-1">
        <template v-if="showTrend">
          <span
            :class="
              cn(
                'inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold leading-4',
                cva(
                  trendDirection,
                  {
                    down: 'bg-destructive-subtle text-destructive-foreground',
                    neutral: 'bg-background-muted text-foreground-muted',
                    up: 'bg-success-subtle text-success-foreground',
                  },
                  'up'
                )
              )
            "
            >{{ trendText }}</span
          >
        </template>

        <template v-if="showDescription">
          <span class="truncate text-xs text-foreground-muted">{{
            descriptionText
          }}</span>
        </template>
      </div>
    </template>

    <template v-if="showProgress">
      <div
        class="h-2 w-full overflow-hidden rounded-full bg-background-muted"
        role="progressbar"
        :aria-valuenow="getProgressState(progress).percentage"
        :aria-valuemin="0"
        :aria-valuemax="100"
        :aria-label="label"
      >
        <div
          class="h-2 rounded-full bg-chart-series-1"
          :style="getProgressState(progress).barStyle"
        ></div>
      </div>
    </template>

    <template v-if="$slots.default">
      <div class="w-full"><slot /></div>
    </template>
  </article>
</template>

<script setup lang="ts">
import { cn, cva, getProgressState, bindControllerProps } from "./utils";

export interface MetricCardProps {
  label?: string;
  value?: string;
  showValue?: boolean;
  trendText?: string;
  showTrend?: boolean;
  trendDirection?: "up" | "down" | "neutral";
  descriptionText?: string;
  showDescription?: boolean;
  showIcon?: boolean;
  showStatus?: boolean;
  statusLabel?: string;
  statusVariant?: "default" | "success" | "warning" | "error" | "info";
  showProgress?: boolean;
  progress?: number;
  className?: string;
}

const props = withDefaults(defineProps<MetricCardProps>(), {
  className: "",
  label: "Total Revenue",
  showStatus: true,
  statusVariant: "default",
  statusLabel: "On track",
  showIcon: true,
  showValue: true,
  value: "$45,231.89",
  showTrend: true,
  showDescription: true,
  trendDirection: "up",
  trendText: "+20.1%",
  descriptionText: "from last month",
  showProgress: false,
  progress: 0,
});
defineSlots<{ default?: () => any }>();
</script>