<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row items-center ' +
      (type === 'Image Text'
        ? 'text-[#0a0a0a]'
        : type === 'Image'
        ? 'text-[#0a0a0a]'
        : type === 'Stacked Text'
        ? 'text-[#0a0a0a]'
        : type === 'Avatar Text'
        ? 'text-[#0a0a0a]'
        : type === 'Status'
        ? 'text-[#0a0a0a]'
        : type === 'Number'
        ? 'text-[#0a0a0a]'
        : 'text-[#0a0a0a]') +
      (className ? ' ' + className : '')
    "
  >
    <p class="text-sm font-normal text-[#0a0a0a]">
      {{ value ?? "Cell Value" }}
    </p>
    <slot />
  </div>
</template>

<script>
export default {
  name: "table-cell-value",

  props: ["id", "ariaDescribedby", "type", "className", "value"],
};
</script>