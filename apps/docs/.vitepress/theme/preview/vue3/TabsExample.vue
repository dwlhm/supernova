<template>
  <Tabs ariaLabel="Account sections"
    ><TabItem :active="true">Overview</TabItem
    ><TabItem :active="false">Analytics</TabItem
    ><TabItem :active="false">Settings</TabItem></Tabs
  >
</template>

<script setup lang="ts">
import Tabs from "./Tabs.vue";
import TabItem from "./TabItem.vue";
</script>