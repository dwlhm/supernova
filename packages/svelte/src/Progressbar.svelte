<script context="module" lang="ts">
  export interface ProgressbarProps {
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
  }
</script>

<script lang="ts">
  export let id: ProgressbarProps["id"];
  export let ariaDescribedby: ProgressbarProps["ariaDescribedby"];
  export let className: ProgressbarProps["className"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"rounded-full" + (className ? " " + className : "")}
>
  <div class="bg-[#e55514]" />
  <div class="bg-[#e55514]" />
  <slot />
</div>