<template>
  <th scope="col" :class="'' + (className ? ' ' + className : '')"><slot /></th>
</template>

<script>
export default {
  name: "table-header-cell",

  props: ["className"],
};
</script>