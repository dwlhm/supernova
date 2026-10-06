<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row bg-background-page border border-[#e5e5e5]' +
      (className ? ' ' + className : '')
    "
  >
    <template v-if="showColumn1 !== false">
      <div class="flex flex-row px-4 py-3 w-full flex-1">
        <div class="flex flex-row items-center w-full flex-1">
          <p class="text-sm font-normal text-[#0a0a0a]">
            {{ value ?? "Cell Value" }}
          </p>
        </div>
      </div>
    </template>

    <template v-if="showColumn2 !== false">
      <div class="flex flex-row px-4 py-3 w-full flex-1">
        <div class="flex flex-row items-center w-full flex-1">
          <p class="text-sm font-normal text-[#0a0a0a]">
            {{ value ?? "Cell Value" }}
          </p>
        </div>
      </div>
    </template>

    <template v-if="showColumn3 !== false">
      <div class="flex flex-row px-4 py-3 w-full flex-1">
        <div class="flex flex-row items-center w-full flex-1">
          <p class="text-sm font-normal text-[#0a0a0a]">
            {{ value ?? "Cell Value" }}
          </p>
        </div>
      </div>
    </template>

    <template v-if="showColumn4 !== false">
      <div class="flex flex-row px-4 py-3 w-full flex-1">
        <div class="flex flex-row items-center w-full flex-1">
          <p class="text-sm font-normal text-[#0a0a0a]">
            {{ value ?? "Cell Value" }}
          </p>
        </div>
      </div>
    </template>

    <template v-if="showColumn5 !== false">
      <div class="flex flex-row px-4 py-3 w-full flex-1">
        <div class="flex flex-row items-center w-full flex-1">
          <p class="text-sm font-normal text-[#0a0a0a]">
            {{ value ?? "Cell Value" }}
          </p>
        </div>
      </div>
    </template>

    <template v-if="showColumn6">
      <div class="flex flex-row px-4 py-3 flex-1">
        <div class="flex flex-row items-center w-full flex-1">
          <p class="text-sm font-normal text-[#0a0a0a]">
            {{ value ?? "Cell Value" }}
          </p>
        </div>
      </div>
    </template>

    <template v-if="showColumn7">
      <div class="flex flex-row px-4 py-3 flex-1">
        <div class="flex flex-row items-center w-full flex-1">
          <p class="text-sm font-normal text-[#0a0a0a]">
            {{ value ?? "Cell Value" }}
          </p>
        </div>
      </div>
    </template>

    <template v-if="showColumn8">
      <div class="flex flex-row px-4 py-3 flex-1">
        <div class="flex flex-row items-center w-full flex-1">
          <p class="text-sm font-normal text-[#0a0a0a]">
            {{ value ?? "Cell Value" }}
          </p>
        </div>
      </div>
    </template>

    <template v-if="showColumn9">
      <div class="flex flex-row px-4 py-3 flex-1">
        <div class="flex flex-row items-center w-full flex-1">
          <p class="text-sm font-normal text-[#0a0a0a]">
            {{ value ?? "Cell Value" }}
          </p>
        </div>
      </div>
    </template>

    <template v-if="showColumn10">
      <div class="flex flex-row px-4 py-3 flex-1">
        <div class="flex flex-row items-center w-full flex-1">
          <p class="text-sm font-normal text-[#0a0a0a]">
            {{ value ?? "Cell Value" }}
          </p>
        </div>
      </div>
    </template>

    <slot />
  </div>
</template>

<script setup lang="ts">
export interface TableBodyRowProps {
  showColumn1?: boolean;
  showColumn2?: boolean;
  showColumn3?: boolean;
  showColumn4?: boolean;
  showColumn5?: boolean;
  showColumn6?: boolean;
  showColumn7?: boolean;
  showColumn8?: boolean;
  showColumn9?: boolean;
  showColumn10?: boolean;
  value?: string;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

const props = defineProps<TableBodyRowProps>();
</script>