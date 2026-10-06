<script context="module" lang="ts">
  export interface SliderProps {
    onClick?: (event?: any) => void;
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
  }
</script>

<script lang="ts">
  export let id: SliderProps["id"];
  export let ariaDescribedby: SliderProps["ariaDescribedby"];
  export let className: SliderProps["className"];
  export let onClick: SliderProps["onClick"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"rounded-full bg-[#f5f5f5]" + (className ? " " + className : "")}
>
  <div class="bg-[#e55514]" />
  <button
    type="button"
    class="rounded-full bg-background-page border border-[#e55514] cursor-pointer transition-colors"
    on:click={(event) => {
      onClick?.();
    }}>Button</button
  ><slot />
</div>