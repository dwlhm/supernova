<template>
  <span
    role="img"
    :data-ctrl="typeof bindControllerProps"
    :aria-label="getAvatarState(props).accessibleName"
    :class="
      cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full bg-background-muted',
        cva(
          size,
          {
            mini: 'h-6 w-6 text-xs',
            small: 'h-8 w-8 text-xs',
            regular: 'h-9 w-9 text-sm',
            large: 'h-10 w-10 text-base',
            'x-large': 'h-14 w-14 text-lg',
          },
          'mini'
        ),
        className
      )
    "
  >
    <template v-if="type === 'image' && Boolean(src)">
      <img alt="" class="h-full w-full rounded-full object-cover" :src="src" />
    </template>

    <template v-if="type === 'icon' || (type === 'image' && !src)">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        :class="
          cn(
            'shrink-0 text-foreground-subtle',
            cva(
              size,
              {
                mini: 'h-3 w-3',
                small: 'h-4 w-4',
                regular: 'h-4 w-4',
                large: 'h-5 w-5',
                'x-large': 'h-7 w-7',
              },
              'mini'
            )
          )
        "
      >
        <circle cx="12" cy="8" r="3.5"></circle>
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke-linecap="round"></path>
      </svg>
    </template>

    <template v-if="type === 'initials'">
      <span
        aria-hidden="true"
        class="font-medium uppercase leading-none text-foreground-subtle"
        >{{ initialsText }}</span
      >
    </template>

    <template v-if="showStatus">
      <span
        aria-hidden="true"
        :class="
          cn(
            'absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background-default',
            cva(
              status,
              {
                offline: 'bg-background-interactive',
                busy: 'bg-destructive-default',
                away: 'bg-warning-default',
                online: 'bg-success-default',
              },
              'online'
            )
          )
        "
      ></span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { cn, cva, getAvatarState, bindControllerProps } from "./utils";

export interface AvatarProps {
  size?: "mini" | "small" | "regular" | "large" | "x-large";
  type?: "image" | "initials" | "icon";
  showStatus?: boolean;
  initialsText?: string;
  src?: string;
  alt?: string;
  status?: "online" | "offline" | "busy" | "away";
  className?: string;
}

const props = withDefaults(defineProps<AvatarProps>(), {
  size: "mini",
  className: "",
  type: "image",
  src: "",
  initialsText: "AB",
  showStatus: true,
  status: "online",
  alt: '',
});
</script>