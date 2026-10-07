<template>
  <a
    :href="href"
    :class="
      'text-sm font-normal text-[#737373]' + (className ? ' ' + className : '')
    "
    ><slot
  /></a>
</template>

<script>
export default {
  name: "breadcrumb-link",

  props: ["href", "className"],
};
</script>