<script lang="ts">
  import Breadcrumb from "./Breadcrumb.svelte";
  import BreadcrumbItem from "./BreadcrumbItem.svelte";
</script>

<Breadcrumb type="deep" showEllipsis={true}
  ><BreadcrumbItem href="/">Home</BreadcrumbItem><BreadcrumbItem
    isEllipsis={true}
  /><BreadcrumbItem href="/components">Components</BreadcrumbItem
  ><BreadcrumbItem isCurrent={true}>Breadcrumb</BreadcrumbItem></Breadcrumb
>