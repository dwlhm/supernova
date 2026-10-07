<template>
  <td :class="'' + (className ? ' ' + className : '')"><slot /></td>
</template>

<script>
export default {
  name: "table-cell",

  props: ["className"],
};
</script>