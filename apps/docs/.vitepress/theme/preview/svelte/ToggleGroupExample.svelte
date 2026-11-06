<script lang="ts">
  import ToggleGroup from "./ToggleGroup.svelte";
  import ToggleGroupItem from "./ToggleGroupItem.svelte";
</script>

<ToggleGroup size="medium" ariaLabel="Text formatting"
  ><ToggleGroupItem size="medium" ariaLabel="Bold" pressed={true}
    ><span class="font-paragraph-weight-bold">B</span></ToggleGroupItem
  ><ToggleGroupItem size="medium" ariaLabel="Italic" pressed={false}
    ><span class="italic">I</span></ToggleGroupItem
  ><ToggleGroupItem size="medium" ariaLabel="Underline" pressed={false}
    ><span class="underline">U</span></ToggleGroupItem
  ></ToggleGroup
>