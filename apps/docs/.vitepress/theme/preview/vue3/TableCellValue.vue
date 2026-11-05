<template>
  <span
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'flex min-w-0 items-center gap-2',
        cva(
          align,
          {
            left: 'justify-start',
            center: 'justify-center',
            right: 'flex-row-reverse justify-start',
          },
          'left'
        ),
        className
      )
    "
  >
    <template v-if="imageSrc === 'placeholder'">
      <span
        class="h-7 w-7 shrink-0 rounded bg-background-muted"
        aria-hidden="true"
      ></span>
    </template>

    <template v-if="imageSrc !== '' && imageSrc !== 'placeholder'">
      <img
        alt=""
        class="h-7 w-7 shrink-0 rounded object-cover"
        aria-hidden="true"
        :src="imageSrc"
      />
    </template>

    <template v-if="avatarInitials !== ''">
      <span
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-muted text-xs font-medium uppercase text-foreground-subtle"
        aria-hidden="true"
        >{{ avatarInitials }}</span
      >
    </template>

    <template v-if="badgeLabel !== ''">
      <Badge variant="primary" :label="badgeLabel"></Badge>
    </template>

    <template v-if="buttonLabel !== ''">
      <Button variant="primary" size="small" :label="buttonLabel"></Button>
    </template>

    <template v-if="badgeLabel === '' && buttonLabel === ''">
      <span
        :class="
          cn(
            'flex min-w-0 flex-col gap-0.5',
            cva(
              align,
              {
                left: 'items-start text-left',
                center: 'items-center text-center',
                right: 'items-end text-right',
              },
              'left'
            )
          )
        "
      >
        <template v-if="href !== ''">
          <a
            class="truncate text-sm font-medium text-primary-default underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
            :href="href"
            >{{ value }}</a
          >
        </template>

        <template v-if="href === '' && value !== ''">
          <span class="truncate text-sm text-foreground-default">{{
            value
          }}</span>
        </template>

        <template v-if="secondaryValue !== ''">
          <span class="truncate text-xs text-foreground-muted">{{
            secondaryValue
          }}</span>
        </template>

        <template v-if="statusLabel !== ''">
          <span
            class="inline-flex w-fit items-center gap-1 text-xs text-foreground-muted"
            ><span
              class="h-1.5 w-1.5 shrink-0 rounded-full bg-success-default"
              aria-hidden="true"
            ></span
            >{{ statusLabel }}</span
          >
        </template>
      </span>
    </template>

    <template v-if="$slots.default">
      <slot />
    </template>
  </span>
</template>

<script setup lang="ts">
import { cn, cva, bindControllerProps } from "./utils";
import Badge from "./Badge.vue";
import Button from "./Button.vue";

export interface TableCellValueProps {
  value?: string;
  secondaryValue?: string;
  badgeLabel?: string;
  buttonLabel?: string;
  statusLabel?: string;
  imageSrc?: string;
  avatarInitials?: string;
  href?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

const props = withDefaults(defineProps<TableCellValueProps>(), {
  align: "left",
  className: "",
  imageSrc: "",
  avatarInitials: "",
  badgeLabel: "",
  buttonLabel: "",
  href: "",
  value: "Cell Value",
  secondaryValue: "",
  statusLabel: "",
});
defineSlots<{ default?: () => any }>();
</script>