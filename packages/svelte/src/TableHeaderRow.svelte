<script context="module" lang="ts">
  export interface TableHeaderRowProps {
    showColumn1?: boolean;
    showColumn2?: boolean;
    showColumn3?: boolean;
    showColumn4?: boolean;
    showColumn5?: boolean;
    showColumn6?: boolean;
    showColumn7?: boolean;
    showColumn8?: boolean;
    showColumn9?: boolean;
    showColumn10?: boolean;
    label?: string;
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
  }
</script>

<script lang="ts">
  export let id: TableHeaderRowProps["id"];
  export let ariaDescribedby: TableHeaderRowProps["ariaDescribedby"];
  export let className: TableHeaderRowProps["className"];
  export let showColumn1: TableHeaderRowProps["showColumn1"];
  export let label: TableHeaderRowProps["label"];
  export let showColumn2: TableHeaderRowProps["showColumn2"];
  export let showColumn3: TableHeaderRowProps["showColumn3"];
  export let showColumn4: TableHeaderRowProps["showColumn4"];
  export let showColumn5: TableHeaderRowProps["showColumn5"];
  export let showColumn6: TableHeaderRowProps["showColumn6"];
  export let showColumn7: TableHeaderRowProps["showColumn7"];
  export let showColumn8: TableHeaderRowProps["showColumn8"];
  export let showColumn9: TableHeaderRowProps["showColumn9"];
  export let showColumn10: TableHeaderRowProps["showColumn10"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-row bg-[#f5f5f5] border border-[#e5e5e5]" +
    (className ? " " + className : "")}
>
  {#if showColumn1 !== false}
    <div class="flex flex-row px-4 py-3 w-full flex-1">
      <p class="text-sm font-medium text-[#0a0a0a]">{label ?? "Column 1"}</p>
    </div>
  {/if}
  {#if showColumn2 !== false}
    <div class="flex flex-row px-4 py-3 w-full flex-1">
      <p class="text-sm font-medium text-[#0a0a0a]">{label ?? "Column 2"}</p>
    </div>
  {/if}
  {#if showColumn3 !== false}
    <div class="flex flex-row px-4 py-3 w-full flex-1">
      <p class="text-sm font-medium text-[#0a0a0a]">{label ?? "Column 3"}</p>
    </div>
  {/if}
  {#if showColumn4 !== false}
    <div class="flex flex-row px-4 py-3 w-full flex-1">
      <p class="text-sm font-medium text-[#0a0a0a]">{label ?? "Column 4"}</p>
    </div>
  {/if}
  {#if showColumn5 !== false}
    <div class="flex flex-row px-4 py-3 w-full flex-1">
      <p class="text-sm font-medium text-[#0a0a0a]">{label ?? "Column 5"}</p>
    </div>
  {/if}
  {#if showColumn6}
    <div class="flex flex-row px-4 py-3 flex-1">
      <p class="text-sm font-medium text-[#0a0a0a]">{label ?? "Column 6"}</p>
    </div>
  {/if}
  {#if showColumn7}
    <div class="flex flex-row px-4 py-3 flex-1">
      <p class="text-sm font-medium text-[#0a0a0a]">{label ?? "Column 7"}</p>
    </div>
  {/if}
  {#if showColumn8}
    <div class="flex flex-row px-4 py-3 flex-1">
      <p class="text-sm font-medium text-[#0a0a0a]">{label ?? "Column 8"}</p>
    </div>
  {/if}
  {#if showColumn9}
    <div class="flex flex-row px-4 py-3 flex-1">
      <p class="text-sm font-medium text-[#0a0a0a]">{label ?? "Column 9"}</p>
    </div>
  {/if}
  {#if showColumn10}
    <div class="flex flex-row px-4 py-3 flex-1">
      <p class="text-sm font-medium text-[#0a0a0a]">{label ?? "Column 10"}</p>
    </div>
  {/if}<slot />
</div>