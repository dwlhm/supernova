<template>
  <ToggleGroup size="medium" ariaLabel="Text formatting"
    ><ToggleGroupItem size="medium" ariaLabel="Bold" :pressed="true"
      ><span class="font-paragraph-weight-bold">B</span></ToggleGroupItem
    ><ToggleGroupItem size="medium" ariaLabel="Italic" :pressed="false"
      ><span class="italic">I</span></ToggleGroupItem
    ><ToggleGroupItem size="medium" ariaLabel="Underline" :pressed="false"
      ><span class="underline">U</span></ToggleGroupItem
    ></ToggleGroup
  >
</template>

<script setup lang="ts">
import ToggleGroup from "./ToggleGroup.vue";
import ToggleGroupItem from "./ToggleGroupItem.vue";
</script>