<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row gap-3 items-center' + (className ? ' ' + className : '')
    "
  >
    <div><div class="border border-[#e55514]"></div></div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "spinner",

  props: ["id", "ariaDescribedby", "className"],
};
</script>