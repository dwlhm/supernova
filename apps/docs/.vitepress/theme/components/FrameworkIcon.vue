<template>
  <!-- React Official Logo SVG -->
  <svg
    v-if="name === 'react'"
    class="inline-block shrink-0"
    :style="{ width: `${size}px`, height: `${size}px` }"
    viewBox="-11.5 -10.23174 23 20.46348"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
    <g stroke="#61DAFB" stroke-width="1.2" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>

  <!-- Vue 3 Official Logo SVG -->
  <svg
    v-else-if="name === 'vue3' || name === 'vue'"
    class="inline-block shrink-0"
    :style="{ width: `${size}px`, height: `${size}px` }"
    viewBox="0 0 256 221"
    fill="none"
    aria-hidden="true"
  >
    <path d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z" fill="#41B883" />
    <path d="m0 0l128 220.8L256 0h-51.2L128 132.48L50.56 0H0Z" fill="#41B883" />
    <path d="M50.56 0L128 133.12L204.8 0h-47.36L128 51.2L97.92 0H50.56Z" fill="#35495E" />
  </svg>

  <!-- Svelte Official Logo SVG -->
  <svg
    v-else-if="name === 'svelte'"
    class="inline-block shrink-0"
    :style="{ width: `${size}px`, height: `${size}px` }"
    viewBox="0 0 98.1 118"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M91.8 15.6C80.9-.1 59.2-4.7 43.6 5.2L16.1 22.8C8.6 27.5 3.4 35.2 1.9 43.9c-1.3 7.3-.2 14.8 3.3 21.3-2.4 3.6-4 7.6-4.7 11.8-1.6 8.9.5 18.1 5.7 25.4 11 15.7 32.6 20.3 48.2 10.4l27.5-17.5c7.5-4.7 12.7-12.4 14.2-21.1 1.3-7.3.2-14.8-3.3-21.3 2.4-3.6 4-7.6 4.7-11.8 1.7-9-.4-18.2-5.7-25.5"
      fill="#FF3E00"
    />
    <path
      d="M40.9 103.9c-8.9 2.3-18.2-1.2-23.4-8.7-3.2-4.4-4.4-9.9-3.5-15.3.2-.9.4-1.7.7-2.6l.5-1.6 1.4 1c3.3 2.4 6.9 4.2 10.8 5.4l1 .3-.1 1c-.1 1.4.3 2.9 1.1 4.1 1.6 2.3 4.4 3.4 7.1 2.7.6-.2 1.2-.4 1.7-.7L65.5 72c1.4-.9 2.3-2.2 2.6-3.8.3-1.6-.1-3.3-1-4.6-1.6-2.3-4.4-3.3-7.1-2.6-.6.2-1.2.4-1.7.7l-10.5 6.7c-1.7 1.1-3.6 1.9-5.6 2.4-8.9 2.3-18.2-1.2-23.4-8.7-3.1-4.4-4.4-9.9-3.4-15.3.9-5.2 4.1-9.9 8.6-12.7l27.5-17.5c1.7-1.1 3.6-1.9 5.6-2.5 8.9-2.3 18.2 1.2 23.4 8.7 3.2 4.4 4.4 9.9 3.5 15.3-.2.9-.4 1.7-.7 2.6l-.5 1.6-1.4-1c-3.3-2.4-6.9-4.2-10.8-5.4l-1-.3.1-1c.1-1.4-.3-2.9-1.1-4.1-1.6-2.3-4.4-3.3-7.1-2.6-.6.2-1.2.4-1.7.7L32.6 46c-1.4.9-2.3 2.2-2.6 3.8-.3 1.6.1 3.3 1 4.6 1.6 2.3 4.4 3.3 7.1 2.6.6-.2 1.2-.4 1.7-.7l10.5-6.7c1.7-1.1 3.6-1.9 5.6-2.5 8.9-2.3 18.2 1.2 23.4 8.7 3.2 4.4 4.4 9.9 3.5 15.3-.9 5.2-4.1 9.9-8.6 12.7l-27.5 17.5c-1.7 1.1-3.6 1.9-5.8 2.6"
      fill="#FFF"
    />
  </svg>

  <!-- Vue 2 Official Logo SVG -->
  <svg
    v-else-if="name === 'vue2'"
    class="inline-block shrink-0"
    :style="{ width: `${size}px`, height: `${size}px` }"
    viewBox="0 0 256 221"
    fill="none"
    aria-hidden="true"
  >
    <path d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z" fill="#41B883" />
    <path d="m0 0l128 220.8L256 0h-51.2L128 132.48L50.56 0H0Z" fill="#41B883" />
    <path d="M50.56 0L128 133.12L204.8 0h-47.36L128 51.2L97.92 0H50.56Z" fill="#35495E" />
  </svg>

  <!-- Angular Official Logo SVG -->
  <svg
    v-else-if="name === 'angular'"
    class="inline-block shrink-0"
    :style="{ width: `${size}px`, height: `${size}px` }"
    viewBox="0 0 250 250"
    fill="none"
    aria-hidden="true"
  >
    <polygon points="125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2" fill="#DD0031" />
    <polygon points="125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 125,230 203.9,186.3 218.1,63.2" fill="#C3002F" />
    <path d="M125,52.1L66.8,182.6h21.7l11.7-29.2h49.4l11.7,29.2h21.7L125,52.1z M142,135.4H108l17-42.4L142,135.4z" fill="#FFFFFF" />
  </svg>

  <!-- Category / Component Icons -->
  <svg
    v-else
    class="inline-block shrink-0"
    :style="{ width: `${size}px`, height: `${size}px` }"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'general'">
      <rect x="3" y="7" width="18" height="10" rx="3" />
      <path d="M8 12h8" />
    </template>
    <template v-else-if="name === 'inputs'">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 10v4" />
    </template>
    <template v-else-if="name === 'data-display'">
      <path d="M3 3v18h18" />
      <rect x="7" y="10" width="3" height="7" rx="1" />
      <rect x="12" y="6" width="3" height="11" rx="1" />
      <rect x="17" y="13" width="3" height="4" rx="1" />
    </template>
    <template v-else-if="name === 'navigation'">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </template>
    <template v-else-if="name === 'feedback'">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </template>
    <template v-else>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </template>
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
    size?: number;
  }>(),
  {
    size: 14,
  }
);
</script>
