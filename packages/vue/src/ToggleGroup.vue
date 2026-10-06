<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row rounded-lg border border-[#e5e5e5] shadow-sm ' +
      (size === 'Medium'
        ? 'px-4 py-2 text-sm'
        : size === 'Large'
        ? 'px-6 py-3 text-lg'
        : 'px-3 py-1.5 text-xs') +
      (className ? ' ' + className : '')
    "
  >
    <template v-if="showToggle1 !== false">
      <div
        class="flex flex-row gap-1 p-1 justify-center items-center border border-[#e5e5e5]"
      >
        <div>
          <div></div>
          <div class="border-1.5 border-[#0a0a0a]"></div>
          <div class="border-1.5 border-[#0a0a0a]"></div>
        </div>
        <template v-if="showText !== false">
          <p class="text-xs font-normal text-center text-[#0a0a0a]">
            {{ label ?? "Bold" }}
          </p>
        </template>
      </div>
    </template>

    <template v-if="showToggle2 !== false">
      <div
        class="flex flex-row gap-1 p-1 justify-center items-center border border-[#e5e5e5]"
      >
        <div>
          <div></div>
          <div class="border-1.5 border-[#0a0a0a]"></div>
          <div class="border-1.5 border-[#0a0a0a]"></div>
        </div>
        <template v-if="showText !== false">
          <p class="text-xs font-normal text-center text-[#0a0a0a]">
            {{ label2 ?? "Bold" }}
          </p>
        </template>
      </div>
    </template>

    <template v-if="showToggle3 !== false">
      <div
        class="flex flex-row gap-1 p-1 justify-center items-center border border-[#e5e5e5]"
      >
        <div>
          <div></div>
          <div class="border-1.5 border-[#0a0a0a]"></div>
          <div class="border-1.5 border-[#0a0a0a]"></div>
        </div>
        <template v-if="showText !== false">
          <p class="text-xs font-normal text-center text-[#0a0a0a]">
            {{ label3 ?? "Bold" }}
          </p>
        </template>
      </div>
    </template>

    <template v-if="showToggle4 !== false">
      <div class="flex flex-row gap-1 p-1 justify-center items-center">
        <div>
          <div></div>
          <div class="border-1.5 border-[#0a0a0a]"></div>
          <div class="border-1.5 border-[#0a0a0a]"></div>
        </div>
        <template v-if="showText !== false">
          <p class="text-xs font-normal text-center text-[#0a0a0a]">
            {{ label4 ?? "Bold" }}
          </p>
        </template>
      </div>
    </template>

    <template v-if="showToggle5 !== false">
      <div class="flex flex-row gap-1 p-1 justify-center items-center">
        <div>
          <div></div>
          <div class="border-1.5 border-[#0a0a0a]"></div>
          <div class="border-1.5 border-[#0a0a0a]"></div>
        </div>
        <template v-if="showText !== false">
          <p class="text-xs font-normal text-center text-[#0a0a0a]">
            {{ label5 ?? "Bold" }}
          </p>
        </template>
      </div>
    </template>

    <slot />
  </div>
</template>

<script setup lang="ts">
export interface ToggleGroupProps {
  showToggle1?: boolean;
  showToggle2?: boolean;
  showToggle3?: boolean;
  showToggle4?: boolean;
  showToggle5?: boolean;
  size?: "Medium" | "Small" | "Large";
  showText?: boolean;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  label?: string;
  label2?: string;
  label3?: string;
  label4?: string;
  label5?: string;
}

const props = defineProps<ToggleGroupProps>();
</script>