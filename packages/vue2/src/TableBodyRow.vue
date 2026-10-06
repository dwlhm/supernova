<template>
  <tr :class="'' + (className ? ' ' + className : '')">
    <slot />
  </tr>
</template>

<script>
export default {
  name: "table-body-row",

  props: ["className"],
};
</script>