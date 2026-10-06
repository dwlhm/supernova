<script context="module" lang="ts">
  export interface SpinnerProps {
    size?: "12" | "16" | "24" | "32";
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
  }
</script>

<script lang="ts">
  export let id: SpinnerProps["id"];
  export let ariaDescribedby: SpinnerProps["ariaDescribedby"];
  export let className: SpinnerProps["className"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-row gap-3 items-center" +
    (className ? " " + className : "")}
>
  <div><div class="border border-[#e55514]" /></div>
  <slot />
</div>