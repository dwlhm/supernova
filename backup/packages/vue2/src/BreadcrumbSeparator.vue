<template>
  <span
    aria-hidden="true"
    :class="
      'text-sm font-normal text-[#737373]' + (className ? ' ' + className : '')
    "
    ><slot>/</slot></span
  >
</template>

<script>
export default {
  name: "breadcrumb-separator",

  props: ["className"],
};
</script>