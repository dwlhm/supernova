<template>
  <nav aria-label="Breadcrumb" :class="'' + (className ? ' ' + className : '')">
    <slot />
  </nav>
</template>

<script>
export default {
  name: "breadcrumb",

  props: ["className"],
};
</script>