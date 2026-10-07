<template>
  <tr :class="'' + (className ? ' ' + className : '')">
    <slot />
  </tr>
</template>

<script>
export default {
  name: "table-header-row",

  props: ["className"],
};
</script>