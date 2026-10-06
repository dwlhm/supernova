<script context="module" lang="ts">
  export interface BreadcrumbProps {
    type?: "1" | "2" | "deep";
    showEllipsis?: boolean;
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
    home?: string;
    separator?: string;
    current?: string;
    ellipsis?: string;
  }
</script>

<script lang="ts">
  export let id: BreadcrumbProps["id"];
  export let ariaDescribedby: BreadcrumbProps["ariaDescribedby"];
  export let className: BreadcrumbProps["className"];
  export let home: BreadcrumbProps["home"];
  export let separator: BreadcrumbProps["separator"];
  export let current: BreadcrumbProps["current"];
  export let ellipsis: BreadcrumbProps["ellipsis"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-row gap-2" + (className ? " " + className : "")}
>
  <div class="flex flex-row gap-2">
    <div class="flex flex-row gap-2">
      <p class="text-sm font-normal text-[#737373]">{home ?? "Home"}</p>
    </div>
    <span class="text-sm font-normal text-[#737373]">{separator ?? "/"}</span>
    <p class="text-sm font-normal text-[#737373]">
      {current ?? "Example path"}
    </p>
    <p class="text-sm font-normal text-[#737373]">{ellipsis ?? "..."}</p>
  </div>
  <slot />
</div>