<template>
  <table :class="'' + (className ? ' ' + className : '')">
    <slot />
  </table>
</template>

<script>
export default {
  name: "table",

  props: ["className"],
};
</script>