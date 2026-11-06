<script context="module" lang="ts">
  export interface BreadcrumbProps {
    type?: "1" | "2" | "deep";
    showEllipsis?: boolean;
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, bindControllerProps } from "./utils";

  export let type: BreadcrumbProps["type"] = "2";
  export let showEllipsis: BreadcrumbProps["showEllipsis"] = true;
  export let className: BreadcrumbProps["className"] = "";
</script>

<nav
  aria-label="Breadcrumb"
  data-ctrl={typeof bindControllerProps}
  data-type={type}
  data-show-ellipsis={showEllipsis}
  class={cn("w-full", className)}
>
  <ol
    class="flex flex-row flex-wrap justify-start items-center gap-1.5 text-sm font-normal"
  >
    <slot />
  </ol>
</nav>