<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="'rounded-full' + (className ? ' ' + className : '')"
  >
    <div class="bg-[#e55514]"></div>
    <div class="bg-[#e55514]"></div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "progressbar",

  props: ["id", "ariaDescribedby", "className"],
};
</script>