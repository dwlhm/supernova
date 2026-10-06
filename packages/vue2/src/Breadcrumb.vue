<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row gap-2 items-center ' +
      (type === 'deep' ? 'text-[#737373]' : 'text-[#737373]') +
      (className ? ' ' + className : '')
    "
  >
    <div class="flex flex-row gap-3 justify-center items-center">
      <p class="text-sm font-normal text-[#737373]">{{ home ?? "Home" }}</p>
    </div>
    <span class="text-sm font-normal text-[#737373]">{{
      separator ?? "/"
    }}</span>
    <div class="flex flex-row gap-3 justify-center items-center">
      <p class="text-sm font-normal text-[#0a0a0a]">
        {{ breadcrumb ?? "Breadcrumb" }}
      </p>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "breadcrumb",

  props: [
    "id",
    "ariaDescribedby",
    "type",
    "className",
    "home",
    "separator",
    "breadcrumb",
  ],
};
</script>