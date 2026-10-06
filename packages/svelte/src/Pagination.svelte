<script context="module" lang="ts">
  export interface PaginationProps {
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
    previous?: string;
    text?: string;
    text2?: string;
    text3?: string;
    next?: string;
  }
</script>

<script lang="ts">
  export let id: PaginationProps["id"];
  export let ariaDescribedby: PaginationProps["ariaDescribedby"];
  export let className: PaginationProps["className"];
  export let previous: PaginationProps["previous"];
  export let text: PaginationProps["text"];
  export let text2: PaginationProps["text2"];
  export let text3: PaginationProps["text3"];
  export let next: PaginationProps["next"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-row gap-1 items-center" +
    (className ? " " + className : "")}
>
  <div
    class="flex flex-row gap-1 px-3 py-2 justify-center items-center rounded-lg"
  >
    <div><div class="border border-[#0a0a0a]" /></div>
    <div class="flex flex-row gap-3 justify-center items-center">
      <p class="text-sm font-medium text-[#0a0a0a]">{previous ?? "Previous"}</p>
    </div>
  </div>
  <div class="flex flex-row gap-3 p-3 justify-center items-center rounded-lg">
    <div class="flex flex-col gap-3 justify-center items-center">
      <span class="text-sm font-medium text-[#0a0a0a]">{text ?? "1"}</span>
    </div>
  </div>
  <div
    class="flex flex-row gap-3 p-3 justify-center items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm"
  >
    <div class="flex flex-col gap-3 justify-center items-center">
      <span class="text-sm font-medium text-[#0a0a0a]">{text2 ?? "2"}</span>
    </div>
  </div>
  <div class="flex flex-row gap-3 p-3 justify-center items-center rounded-lg">
    <div class="flex flex-col gap-3 justify-center items-center">
      <span class="text-sm font-medium text-[#0a0a0a]">{text3 ?? "3"}</span>
    </div>
  </div>
  <div class="flex flex-row gap-3 p-3 justify-center items-center rounded-lg">
    <div><div class="border border-[#0a0a0a]" /></div>
  </div>
  <div
    class="flex flex-row gap-1 px-3 py-2 justify-center items-center rounded-lg"
  >
    <div class="flex flex-row gap-3 justify-center items-center">
      <p class="text-sm font-medium text-[#0a0a0a]">{next ?? "Next"}</p>
    </div>
    <div><div class="border border-[#0a0a0a]" /></div>
  </div>
  <slot />
</div>