<template>
  <thead :class="'' + (className ? ' ' + className : '')">
    <slot />
  </thead>
</template>

<script>
export default {
  name: "table-header",

  props: ["className"],
};
</script>