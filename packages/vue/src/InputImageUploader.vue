<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="'flex flex-col gap-3' + (className ? ' ' + className : '')"
  >
    <template v-if="showLabel !== false">
      <div class="flex flex-row gap-2">
        <p class="text-sm font-medium text-[#0a0a0a]">
          {{ labelText ?? "Profile image" }}
        </p>
        <template v-if="showRequired !== false">
          <span class="text-sm font-medium text-[#be123c]">{{
            requiredIndicator ?? "*"
          }}</span>
        </template>
      </div>
    </template>

    <div
      class="flex flex-row gap-4 p-3 items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm w-full"
    >
      <div
        class="flex flex-col justify-center items-center rounded-lg bg-[#f5f5f5]"
      >
        <div>
          <div>
            <div>
              <div class="border border-[#0a0a0a]"></div>
              <div class="border border-[#0a0a0a]"></div>
              <div class="border border-[#0a0a0a]"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-3 w-full flex-1">
        <p class="text-base font-normal text-[#0f0e0f]">
          {{ primaryText ?? "Upload an image" }}
        </p>
        <p class="text-sm font-normal text-[#737373]">
          {{ supportingText ?? "Square JPG or PNG, up to 5 MB" }}
        </p>
        <div class="flex flex-row gap-2">
          <button
            type="button"
            class="flex flex-row gap-2 px-2 py-1 justify-center items-center rounded-lg bg-[#f5f5f5] cursor-pointer transition-colors"
            @click="async (event) => onClick?.()"
          >
            <template v-if="showLeftIcon !== false">
              <div class="flex flex-row justify-center items-center">
                <div><div class="border-[#171717]"></div></div>
              </div>
            </template>

            <template v-if="showLabel !== false">
              <p class="text-sm font-medium text-center text-[#171717]">
                {{ label ?? "Choose image" }}
              </p>
            </template>

            <template v-if="showRightIcon !== false">
              <div class="flex flex-row justify-center items-center">
                <div><div class="border-[#171717]"></div></div>
              </div>
            </template>
          </button>
        </div>
      </div>
    </div>
    <template v-if="showHint !== false">
      <div class="flex flex-col w-full">
        <p class="text-sm font-normal text-[#737373]">
          {{ hintErrorText ?? "For best results, use a 1:1 image." }}
        </p>
      </div>
    </template>

    <slot />
  </div>
</template>

<script setup lang="ts">
export interface InputImageUploaderProps {
  labelText?: string;
  hintErrorText?: string;
  showRequired?: boolean;
  showHint?: boolean;
  primaryText?: string;
  supportingText?: string;
  fileName?: string;
  fileMetadata?: string;
  showLabel?: boolean;
  state?: "Default" | "Focus" | "Filled" | "Error" | "Disabled";
  onClick?: (event?: any) => void;
  showLeftIcon?: boolean;
  label?: string;
  showRightIcon?: boolean;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  requiredIndicator?: string;
}

const props = defineProps<InputImageUploaderProps>();
</script>