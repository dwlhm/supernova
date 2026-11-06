<template>
  <Breadcrumb type="deep" :showEllipsis="true"
    ><BreadcrumbItem href="/">Home</BreadcrumbItem
    ><BreadcrumbItem :isEllipsis="true"></BreadcrumbItem
    ><BreadcrumbItem href="/components">Components</BreadcrumbItem
    ><BreadcrumbItem :isCurrent="true">Breadcrumb</BreadcrumbItem></Breadcrumb
  >
</template>

<script setup lang="ts">
import Breadcrumb from "./Breadcrumb.vue";
import BreadcrumbItem from "./BreadcrumbItem.vue";
</script>