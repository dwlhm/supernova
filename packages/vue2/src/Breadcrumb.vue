<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="'flex flex-row gap-2' + (className ? ' ' + className : '')"
  >
    <div class="flex flex-row gap-2">
      <div class="flex flex-row gap-2">
        <p class="text-sm font-normal text-[#737373]">{{ home ?? "Home" }}</p>
      </div>
      <span class="text-sm font-normal text-[#737373]">{{
        separator ?? "/"
      }}</span>
      <p class="text-sm font-normal text-[#737373]">
        {{ current ?? "Example path" }}
      </p>
      <p class="text-sm font-normal text-[#737373]">{{ ellipsis ?? "..." }}</p>
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
    "className",
    "home",
    "separator",
    "current",
    "ellipsis",
  ],
};
</script>