<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="'' + (className ? ' ' + className : '')"
  >
    <div class="flex flex-col items-center">
      <div class="flex flex-col gap-2 px-3 py-2 rounded-lg bg-[#e55514]">
        <div class="flex flex-row gap-3 justify-center items-center w-full">
          <p class="text-sm font-normal text-white">
            {{ textContent ?? "Label" }}
          </p>
        </div>
      </div>
      <div class="rounded-lg bg-[#e55514]"></div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "tooltip",

  props: ["id", "ariaDescribedby", "className", "textContent"],
};
</script>