<template>
  <span aria-hidden="true" :class="'' + (className ? ' ' + className : '')"
    ><slot>…</slot></span
  >
</template>

<script>
export default {
  name: "breadcrumb-ellipsis",

  props: ["className"],
};
</script>