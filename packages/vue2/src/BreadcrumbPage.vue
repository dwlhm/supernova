<template>
  <span
    aria-current="page"
    :class="
      'text-sm font-normal text-[#0a0a0a]' + (className ? ' ' + className : '')
    "
    ><slot
  /></span>
</template>

<script>
export default {
  name: "breadcrumb-page",

  props: ["className"],
};
</script>