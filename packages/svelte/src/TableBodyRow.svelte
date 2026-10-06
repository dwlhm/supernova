<script context="module" lang="ts">
  export interface TableBodyRowProps {
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
    value?: string;
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
  }
</script>

<script lang="ts">
  export let id: TableBodyRowProps["id"];
  export let ariaDescribedby: TableBodyRowProps["ariaDescribedby"];
  export let className: TableBodyRowProps["className"];
  export let showColumn1: TableBodyRowProps["showColumn1"];
  export let value: TableBodyRowProps["value"];
  export let showColumn2: TableBodyRowProps["showColumn2"];
  export let showColumn3: TableBodyRowProps["showColumn3"];
  export let showColumn4: TableBodyRowProps["showColumn4"];
  export let showColumn5: TableBodyRowProps["showColumn5"];
  export let showColumn6: TableBodyRowProps["showColumn6"];
  export let showColumn7: TableBodyRowProps["showColumn7"];
  export let showColumn8: TableBodyRowProps["showColumn8"];
  export let showColumn9: TableBodyRowProps["showColumn9"];
  export let showColumn10: TableBodyRowProps["showColumn10"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-row bg-background-page border border-[#e5e5e5]" +
    (className ? " " + className : "")}
>
  {#if showColumn1 !== false}
    <div class="flex flex-row px-4 py-3 w-full flex-1">
      <div class="flex flex-row items-center w-full flex-1">
        <p class="text-sm font-normal text-[#0a0a0a]">
          {value ?? "Cell Value"}
        </p>
      </div>
    </div>
  {/if}
  {#if showColumn2 !== false}
    <div class="flex flex-row px-4 py-3 w-full flex-1">
      <div class="flex flex-row items-center w-full flex-1">
        <p class="text-sm font-normal text-[#0a0a0a]">
          {value ?? "Cell Value"}
        </p>
      </div>
    </div>
  {/if}
  {#if showColumn3 !== false}
    <div class="flex flex-row px-4 py-3 w-full flex-1">
      <div class="flex flex-row items-center w-full flex-1">
        <p class="text-sm font-normal text-[#0a0a0a]">
          {value ?? "Cell Value"}
        </p>
      </div>
    </div>
  {/if}
  {#if showColumn4 !== false}
    <div class="flex flex-row px-4 py-3 w-full flex-1">
      <div class="flex flex-row items-center w-full flex-1">
        <p class="text-sm font-normal text-[#0a0a0a]">
          {value ?? "Cell Value"}
        </p>
      </div>
    </div>
  {/if}
  {#if showColumn5 !== false}
    <div class="flex flex-row px-4 py-3 w-full flex-1">
      <div class="flex flex-row items-center w-full flex-1">
        <p class="text-sm font-normal text-[#0a0a0a]">
          {value ?? "Cell Value"}
        </p>
      </div>
    </div>
  {/if}
  {#if showColumn6}
    <div class="flex flex-row px-4 py-3 flex-1">
      <div class="flex flex-row items-center w-full flex-1">
        <p class="text-sm font-normal text-[#0a0a0a]">
          {value ?? "Cell Value"}
        </p>
      </div>
    </div>
  {/if}
  {#if showColumn7}
    <div class="flex flex-row px-4 py-3 flex-1">
      <div class="flex flex-row items-center w-full flex-1">
        <p class="text-sm font-normal text-[#0a0a0a]">
          {value ?? "Cell Value"}
        </p>
      </div>
    </div>
  {/if}
  {#if showColumn8}
    <div class="flex flex-row px-4 py-3 flex-1">
      <div class="flex flex-row items-center w-full flex-1">
        <p class="text-sm font-normal text-[#0a0a0a]">
          {value ?? "Cell Value"}
        </p>
      </div>
    </div>
  {/if}
  {#if showColumn9}
    <div class="flex flex-row px-4 py-3 flex-1">
      <div class="flex flex-row items-center w-full flex-1">
        <p class="text-sm font-normal text-[#0a0a0a]">
          {value ?? "Cell Value"}
        </p>
      </div>
    </div>
  {/if}
  {#if showColumn10}
    <div class="flex flex-row px-4 py-3 flex-1">
      <div class="flex flex-row items-center w-full flex-1">
        <p class="text-sm font-normal text-[#0a0a0a]">
          {value ?? "Cell Value"}
        </p>
      </div>
    </div>
  {/if}<slot />
</div>