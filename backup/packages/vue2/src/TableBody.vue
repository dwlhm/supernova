<template>
  <tbody :class="'' + (className ? ' ' + className : '')">
    <slot />
  </tbody>
</template>

<script>
export default {
  name: "table-body",

  props: ["className"],
};
</script>