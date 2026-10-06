<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row px-4 py-3 w-full' + (className ? ' ' + className : '')
    "
  >
    <div class="flex flex-row items-center w-full flex-1">
      <p class="text-sm font-normal text-[#0a0a0a]">
        {{ value ?? "Cell Value" }}
      </p>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "table-body-cell",

  props: ["id", "ariaDescribedby", "className", "value"],
};
</script>