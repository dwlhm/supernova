<template>
  <template v-if="!dismissed">
    <div role="alert" :class="containerClasses">
      <template v-if="showIcon">
        <div :class="iconWrapperClasses">
          <template v-if="color === 'positive'">
            <svg
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </template>

          <template v-else>
            <svg
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </template>
        </div>
      </template>

      <div class="flex-1 min-w-0">
        <div class="font-semibold text-sm leading-5">{{ title }}</div>
        <div class="text-sm mt-0.5 leading-relaxed opacity-90">{{ text }}</div>
        <template v-if="showAction">
          <div>
            <button
              type="button"
              :class="actionButtonClasses"
              @click="async (event) => handleAction()"
            >
              {{ actionLabel }}
            </button>
          </div>
        </template>
      </div>
      <template v-if="dismissible">
        <button
          type="button"
          class="flex-shrink-0 -mr-1 -mt-1 p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Dismiss alert"
          @click="async (event) => handleClose()"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </template>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

export interface AlertProps {
  color?: "primary" | "secondary" | "positive";
  title: string;
  text: string;
  showIcon?: boolean;
  showAction?: boolean;
  actionLabel?: string;
  dismissible?: boolean;
  onAction?: () => void;
  onClose?: () => void;
}

const props = withDefaults(defineProps<AlertProps>(), {
  color: "primary",
  onAction: undefined,
  onClose: undefined,
  showIcon: true,
  title: undefined,
  text: undefined,
  showAction: false,
  actionLabel: "Action",
  dismissible: false,
});
const dismissed = ref(false);

const containerClasses = computed(() => {
  const base =
    "w-full p-4 rounded-xl border flex items-start gap-3 transition-all";
  if (props.color === "positive")
    return base + " bg-green-50 border-green-200 text-green-900";
  if (props.color === "secondary")
    return base + " bg-purple-50 border-purple-200 text-purple-900";
  return base + " bg-blue-50 border-blue-200 text-blue-900";
});
const iconWrapperClasses = computed(() => {
  const color =
    props.color === "positive"
      ? "text-green-600"
      : props.color === "secondary"
      ? "text-purple-600"
      : "text-blue-600";
  return "flex-shrink-0 mt-0.5 " + color;
});
const actionButtonClasses = computed(() => {
  const base =
    "text-xs font-semibold px-2.5 py-1.5 rounded-md transition-colors mt-2.5 cursor-pointer inline-block";
  if (props.color === "positive")
    return base + " text-green-800 bg-green-100 hover:bg-green-200";
  if (props.color === "secondary")
    return base + " text-purple-800 bg-purple-100 hover:bg-purple-200";
  return base + " text-blue-800 bg-blue-100 hover:bg-blue-200";
});

function handleAction() {
  if (props.onAction) {
    props.onAction();
  }
}
function handleClose() {
  dismissed.value = true;
  if (props.onClose) {
    props.onClose();
  }
}
</script>