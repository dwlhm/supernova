<template>
  <ol
    :class="
      'flex flex-row gap-2 items-center' + (className ? ' ' + className : '')
    "
  >
    <slot />
  </ol>
</template>

<script>
export default {
  name: "breadcrumb-list",

  props: ["className"],
};
</script>