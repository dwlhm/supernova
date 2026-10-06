<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="'flex flex-col' + (className ? ' ' + className : '')"
  >
    <div class="flex flex-col gap-3 w-full">
      <template v-if="showLabel !== false">
        <div class="flex flex-row gap-2 items-center w-full">
          <p class="text-sm font-medium text-[#0a0a0a]">
            {{ labelText ?? "Label" }}
          </p>
          <template v-if="showRequired">
            <span class="text-sm font-medium text-[#be123c]">{{
              requiredIndicator ?? "*"
            }}</span>
          </template>
        </div>
      </template>

      <div class="flex flex-row">
        <div
          class="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm"
        ></div>
        <div
          class="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm"
        ></div>
        <div
          class="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm"
        ></div>
        <div
          class="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm"
        ></div>
        <div
          class="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm"
        ></div>
        <div
          class="flex flex-col gap-3 justify-center items-center bg-background-page border border-[#e5e5e5] shadow-sm"
        ></div>
      </div>
      <template v-if="showHint !== false">
        <div class="flex flex-row gap-3 items-center w-full">
          <p class="text-sm font-normal text-[#737373]">
            {{
              hintErrorText ??
              "Please enter the one-time password sent to your phone."
            }}
          </p>
        </div>
      </template>
    </div>
    <button
      type="button"
      class="flex flex-row gap-2 px-4 py-2 justify-center items-center rounded-xl bg-[#e55514] cursor-pointer transition-colors"
      @click="async (event) => onClick?.()"
    >
      <template v-if="showLeftIcon !== false">
        <div class="flex flex-row justify-center items-center">
          <div><div class="border-white"></div></div>
        </div>
      </template>

      <template v-if="showLabel !== false">
        <p class="text-sm font-medium text-center text-white">
          {{ label ?? "Label" }}
        </p>
      </template>

      <template v-if="showRightIcon !== false">
        <div class="flex flex-row justify-center items-center">
          <div><div class="border-white"></div></div>
        </div>
      </template></button
    ><slot />
  </div>
</template>

<script setup lang="ts">
export interface InputOTPProps {
  labelText?: string;
  hintErrorText?: string;
  showRequired?: boolean;
  showHint?: boolean;
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

const props = defineProps<InputOTPProps>();
</script>