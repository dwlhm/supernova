<template>
  <li
    :class="
      'flex flex-row gap-3 justify-center items-center' +
      (className ? ' ' + className : '')
    "
  >
    <slot />
  </li>
</template>

<script>
export default {
  name: "breadcrumb-item",

  props: ["className"],
};
</script>