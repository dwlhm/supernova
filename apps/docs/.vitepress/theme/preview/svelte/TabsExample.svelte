<script lang="ts">
  import Tabs from "./Tabs.svelte";
  import TabItem from "./TabItem.svelte";
</script>

<Tabs ariaLabel="Account sections"
  ><TabItem active={true}>Overview</TabItem><TabItem active={false}
    >Analytics</TabItem
  ><TabItem active={false}>Settings</TabItem></Tabs
>