<script context="module" lang="ts">
  export interface TopbarProps {
    topbarContent?: any;
    onClick?: (event?: any) => void;
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
    home?: string;
    separator?: string;
    breadcrumb?: string;
    typeToSearch?: string;
  }
</script>

<script lang="ts">
  export let id: TopbarProps["id"];
  export let ariaDescribedby: TopbarProps["ariaDescribedby"];
  export let className: TopbarProps["className"];
  export let onClick: TopbarProps["onClick"];
  export let home: TopbarProps["home"];
  export let separator: TopbarProps["separator"];
  export let breadcrumb: TopbarProps["breadcrumb"];
  export let typeToSearch: TopbarProps["typeToSearch"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-row gap-3 px-4 py-3 items-center bg-background-page border border-[#e5e5e5]" +
    (className ? " " + className : "")}
>
  <button
    type="button"
    class="flex flex-row gap-3 px-2 justify-center items-center cursor-pointer transition-colors"
    on:click={(event) => {
      onClick?.();
    }}
    ><div>
      <div />
      <div class="border-1.5 border-[#0a0a0a]" />
      <div class="border-1.5 border-[#0a0a0a]" />
    </div></button
  >
  <div class="flex flex-row gap-2 items-center">
    <div class="flex flex-row gap-3 justify-center items-center">
      <p class="text-sm font-normal text-[#737373]">{home ?? "Home"}</p>
    </div>
    <span class="text-sm font-normal text-[#737373]">{separator ?? "/"}</span>
    <div class="flex flex-row gap-3 justify-center items-center">
      <p class="text-sm font-normal text-[#0a0a0a]">
        {breadcrumb ?? "Breadcrumb"}
      </p>
    </div>
  </div>
  <div class="flex flex-col gap-3 justify-center items-end">
    <div
      class="flex flex-row gap-16 px-8 py-1 items-center rounded-lg bg-background-page border border-[#e5e5e5]"
    >
      <div><div class="border border-[#0a0a0a]" /></div>
      <div class="flex flex-row gap-3 items-center w-full flex-1">
        <p class="text-sm font-normal text-[#737373]">
          {typeToSearch ?? "Type to search..."}
        </p>
      </div>
    </div>
  </div>
  <slot />
</div>