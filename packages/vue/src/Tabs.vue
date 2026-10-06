<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row p-1 justify-center items-center rounded-xl bg-[#f5f5f5]' +
      (className ? ' ' + className : '')
    "
  >
    <div
      class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg"
    >
      <div class="flex flex-row gap-1 justify-center items-center">
        <template v-if="showIcon !== false">
          <div>
            <div class="border-2 border-[#0a0a0a]"></div>
            <div class="border-2 border-[#0a0a0a]"></div>
            <div class="border-2 border-[#0a0a0a]"></div>
            <div class="border-2 border-[#0a0a0a]"></div>
          </div>
        </template>

        <p class="text-sm font-medium text-[#0f0e0f]">{{ label ?? "Label" }}</p>
        <template v-if="showNum !== false">
          <div
            class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
          >
            <span class="text-xs font-medium text-[#7a2e0c]">{{
              num ?? "1"
            }}</span>
          </div>
        </template>
      </div>
    </div>
    <div
      class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm"
    >
      <div class="flex flex-row gap-1 justify-center items-center">
        <template v-if="showIcon !== false">
          <div>
            <div class="border-2 border-[#0a0a0a]"></div>
            <div class="border-2 border-[#0a0a0a]"></div>
            <div class="border-2 border-[#0a0a0a]"></div>
            <div class="border-2 border-[#0a0a0a]"></div>
          </div>
        </template>

        <p class="text-sm font-medium text-[#0a0a0a]">{{ label ?? "Label" }}</p>
        <template v-if="showNum !== false">
          <div
            class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
          >
            <span class="text-xs font-medium text-[#7a2e0c]">{{
              num ?? "1"
            }}</span>
          </div>
        </template>
      </div>
    </div>
    <template v-if="tab3 !== false">
      <div
        class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg"
      >
        <div class="flex flex-row gap-1 justify-center items-center">
          <template v-if="showIcon !== false">
            <div>
              <div class="border-2 border-[#0a0a0a]"></div>
              <div class="border-2 border-[#0a0a0a]"></div>
              <div class="border-2 border-[#0a0a0a]"></div>
              <div class="border-2 border-[#0a0a0a]"></div>
            </div>
          </template>

          <p class="text-sm font-medium text-[#0f0e0f]">
            {{ label ?? "Label" }}
          </p>
          <template v-if="showNum !== false">
            <div
              class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
            >
              <span class="text-xs font-medium text-[#7a2e0c]">{{
                num ?? "1"
              }}</span>
            </div>
          </template>
        </div>
      </div>
    </template>

    <template v-if="tab4 !== false">
      <div
        class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg"
      >
        <div class="flex flex-row gap-1 justify-center items-center">
          <template v-if="showIcon !== false">
            <div>
              <div class="border-2 border-[#0a0a0a]"></div>
              <div class="border-2 border-[#0a0a0a]"></div>
              <div class="border-2 border-[#0a0a0a]"></div>
              <div class="border-2 border-[#0a0a0a]"></div>
            </div>
          </template>

          <p class="text-sm font-medium text-[#0f0e0f]">
            {{ label ?? "Label" }}
          </p>
          <template v-if="showNum !== false">
            <div
              class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
            >
              <span class="text-xs font-medium text-[#7a2e0c]">{{
                num ?? "1"
              }}</span>
            </div>
          </template>
        </div>
      </div>
    </template>

    <template v-if="tab5 !== false">
      <div
        class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg"
      >
        <div class="flex flex-row gap-1 justify-center items-center">
          <template v-if="showIcon !== false">
            <div>
              <div class="border-2 border-[#0a0a0a]"></div>
              <div class="border-2 border-[#0a0a0a]"></div>
              <div class="border-2 border-[#0a0a0a]"></div>
              <div class="border-2 border-[#0a0a0a]"></div>
            </div>
          </template>

          <p class="text-sm font-medium text-[#0f0e0f]">
            {{ label ?? "Label" }}
          </p>
          <template v-if="showNum !== false">
            <div
              class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
            >
              <span class="text-xs font-medium text-[#7a2e0c]">{{
                num ?? "1"
              }}</span>
            </div>
          </template>
        </div>
      </div>
    </template>

    <template v-if="tab6 !== false">
      <div
        class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg"
      >
        <div class="flex flex-row gap-1 justify-center items-center">
          <template v-if="showIcon !== false">
            <div>
              <div class="border-2 border-[#0a0a0a]"></div>
              <div class="border-2 border-[#0a0a0a]"></div>
              <div class="border-2 border-[#0a0a0a]"></div>
              <div class="border-2 border-[#0a0a0a]"></div>
            </div>
          </template>

          <p class="text-sm font-medium text-[#0f0e0f]">
            {{ label ?? "Label" }}
          </p>
          <template v-if="showNum !== false">
            <div
              class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
            >
              <span class="text-xs font-medium text-[#7a2e0c]">{{
                num ?? "1"
              }}</span>
            </div>
          </template>
        </div>
      </div>
    </template>

    <template v-if="tab7">
      <div
        class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg"
      >
        <div class="flex flex-row gap-1 justify-center items-center">
          <template v-if="showIcon !== false">
            <div><div class="border border-[#0a0a0a]"></div></div>
          </template>

          <p class="text-sm font-medium text-[#0f0e0f]">
            {{ label ?? "Tab 7" }}
          </p>
          <template v-if="showNum !== false">
            <div
              class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
            >
              <span class="text-xs font-medium text-[#7a2e0c]">{{
                num ?? "6"
              }}</span>
            </div>
          </template>
        </div>
      </div>
    </template>

    <template v-if="tab8">
      <div
        class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg"
      >
        <div class="flex flex-row gap-1 justify-center items-center">
          <template v-if="showIcon !== false">
            <div><div class="border border-[#0a0a0a]"></div></div>
          </template>

          <p class="text-sm font-medium text-[#0f0e0f]">
            {{ label ?? "Tab 8" }}
          </p>
          <template v-if="showNum !== false">
            <div
              class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
            >
              <span class="text-xs font-medium text-[#7a2e0c]">{{
                num ?? "6"
              }}</span>
            </div>
          </template>
        </div>
      </div>
    </template>

    <slot />
  </div>
</template>

<script setup lang="ts">
export interface TabsProps {
  tab3?: boolean;
  tab4?: boolean;
  tab5?: boolean;
  tab6?: boolean;
  tab7?: boolean;
  tab8?: boolean;
  showIcon?: boolean;
  label?: string;
  showNum?: boolean;
  num?: string;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

const props = defineProps<TabsProps>();
</script>