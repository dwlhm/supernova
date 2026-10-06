<script context="module" lang="ts">
  export interface BreadcrumbProps {
    showEllipsis?: boolean;
    type?: "2" | "deep" | "1";
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
    home?: string;
    separator?: string;
    breadcrumb?: string;
  }
</script>

<script lang="ts">
  export let id: BreadcrumbProps["id"];
  export let ariaDescribedby: BreadcrumbProps["ariaDescribedby"];
  export let type: BreadcrumbProps["type"];
  export let className: BreadcrumbProps["className"];
  export let home: BreadcrumbProps["home"];
  export let separator: BreadcrumbProps["separator"];
  export let breadcrumb: BreadcrumbProps["breadcrumb"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-row gap-2 items-center " +
    (type === "deep" ? "text-[#737373]" : "text-[#737373]") +
    (className ? " " + className : "")}
>
  <div class="flex flex-row gap-3 justify-center items-center">
    <p class="text-sm font-normal text-[#737373]">{home ?? "Home"}</p>
  </div>
  <span class="text-sm font-normal text-[#737373]">{separator ?? "/"}</span>
  <div class="flex flex-row gap-3 justify-center items-center">
    <p class="text-sm font-normal text-[#0a0a0a]">
      {breadcrumb ?? "Breadcrumb"}
    </p>
  </div>
  <slot />
</div>