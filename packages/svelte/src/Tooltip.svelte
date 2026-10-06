<script context="module" lang="ts">
  export interface TooltipProps {
    textContent?: string;
    position?: "Top" | "Bottom" | "Left" | "Right";
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
  }
</script>

<script lang="ts">
  export let id: TooltipProps["id"];
  export let ariaDescribedby: TooltipProps["ariaDescribedby"];
  export let className: TooltipProps["className"];
  export let textContent: TooltipProps["textContent"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"" + (className ? " " + className : "")}
>
  <div class="flex flex-col items-center">
    <div class="flex flex-col gap-2 px-3 py-2 rounded-lg bg-[#e55514]">
      <div class="flex flex-row gap-3 justify-center items-center w-full">
        <p class="text-sm font-normal text-white">{textContent ?? "Label"}</p>
      </div>
    </div>
    <div class="rounded-lg bg-[#e55514]" />
  </div>
  <slot />
</div>