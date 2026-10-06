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

<script>
export default {
  name: "table-body-row",

  props: [
    "id",
    "ariaDescribedby",
    "className",
    "showColumn1",
    "value",
    "showColumn2",
    "showColumn3",
    "showColumn4",
    "showColumn5",
    "showColumn6",
    "showColumn7",
    "showColumn8",
    "showColumn9",
    "showColumn10",
  ],
};
</script>