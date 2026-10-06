<script context="module" lang="ts">
  export interface TabsProps {
    tab3?: boolean;
    tab4?: boolean;
    tab5?: boolean;
    tab6?: boolean;
    tab7?: boolean;
    tab8?: boolean;
    showIcon?: boolean;
    label?: string;
    showNum?: boolean;
    num?: string;
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
  }
</script>

<script lang="ts">
  export let id: TabsProps["id"];
  export let ariaDescribedby: TabsProps["ariaDescribedby"];
  export let className: TabsProps["className"];
  export let showIcon: TabsProps["showIcon"];
  export let label: TabsProps["label"];
  export let showNum: TabsProps["showNum"];
  export let num: TabsProps["num"];
  export let tab3: TabsProps["tab3"];
  export let tab4: TabsProps["tab4"];
  export let tab5: TabsProps["tab5"];
  export let tab6: TabsProps["tab6"];
  export let tab7: TabsProps["tab7"];
  export let tab8: TabsProps["tab8"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-row p-1 justify-center items-center rounded-xl bg-[#f5f5f5]" +
    (className ? " " + className : "")}
>
  <div
    class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg"
  >
    <div class="flex flex-row gap-1 justify-center items-center">
      {#if showIcon !== false}
        <div>
          <div class="border-2 border-[#0a0a0a]" />
          <div class="border-2 border-[#0a0a0a]" />
          <div class="border-2 border-[#0a0a0a]" />
          <div class="border-2 border-[#0a0a0a]" />
        </div>
      {/if}
      <p class="text-sm font-medium text-[#0f0e0f]">{label ?? "Label"}</p>
      {#if showNum !== false}
        <div
          class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
        >
          <span class="text-xs font-medium text-[#7a2e0c]">{num ?? "1"}</span>
        </div>
      {/if}
    </div>
  </div>
  <div
    class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm"
  >
    <div class="flex flex-row gap-1 justify-center items-center">
      {#if showIcon !== false}
        <div>
          <div class="border-2 border-[#0a0a0a]" />
          <div class="border-2 border-[#0a0a0a]" />
          <div class="border-2 border-[#0a0a0a]" />
          <div class="border-2 border-[#0a0a0a]" />
        </div>
      {/if}
      <p class="text-sm font-medium text-[#0a0a0a]">{label ?? "Label"}</p>
      {#if showNum !== false}
        <div
          class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
        >
          <span class="text-xs font-medium text-[#7a2e0c]">{num ?? "1"}</span>
        </div>
      {/if}
    </div>
  </div>
  {#if tab3 !== false}
    <div
      class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg"
    >
      <div class="flex flex-row gap-1 justify-center items-center">
        {#if showIcon !== false}
          <div>
            <div class="border-2 border-[#0a0a0a]" />
            <div class="border-2 border-[#0a0a0a]" />
            <div class="border-2 border-[#0a0a0a]" />
            <div class="border-2 border-[#0a0a0a]" />
          </div>
        {/if}
        <p class="text-sm font-medium text-[#0f0e0f]">{label ?? "Label"}</p>
        {#if showNum !== false}
          <div
            class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
          >
            <span class="text-xs font-medium text-[#7a2e0c]">{num ?? "1"}</span>
          </div>
        {/if}
      </div>
    </div>
  {/if}
  {#if tab4 !== false}
    <div
      class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg"
    >
      <div class="flex flex-row gap-1 justify-center items-center">
        {#if showIcon !== false}
          <div>
            <div class="border-2 border-[#0a0a0a]" />
            <div class="border-2 border-[#0a0a0a]" />
            <div class="border-2 border-[#0a0a0a]" />
            <div class="border-2 border-[#0a0a0a]" />
          </div>
        {/if}
        <p class="text-sm font-medium text-[#0f0e0f]">{label ?? "Label"}</p>
        {#if showNum !== false}
          <div
            class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
          >
            <span class="text-xs font-medium text-[#7a2e0c]">{num ?? "1"}</span>
          </div>
        {/if}
      </div>
    </div>
  {/if}
  {#if tab5 !== false}
    <div
      class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg"
    >
      <div class="flex flex-row gap-1 justify-center items-center">
        {#if showIcon !== false}
          <div>
            <div class="border-2 border-[#0a0a0a]" />
            <div class="border-2 border-[#0a0a0a]" />
            <div class="border-2 border-[#0a0a0a]" />
            <div class="border-2 border-[#0a0a0a]" />
          </div>
        {/if}
        <p class="text-sm font-medium text-[#0f0e0f]">{label ?? "Label"}</p>
        {#if showNum !== false}
          <div
            class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
          >
            <span class="text-xs font-medium text-[#7a2e0c]">{num ?? "1"}</span>
          </div>
        {/if}
      </div>
    </div>
  {/if}
  {#if tab6 !== false}
    <div
      class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg"
    >
      <div class="flex flex-row gap-1 justify-center items-center">
        {#if showIcon !== false}
          <div>
            <div class="border-2 border-[#0a0a0a]" />
            <div class="border-2 border-[#0a0a0a]" />
            <div class="border-2 border-[#0a0a0a]" />
            <div class="border-2 border-[#0a0a0a]" />
          </div>
        {/if}
        <p class="text-sm font-medium text-[#0f0e0f]">{label ?? "Label"}</p>
        {#if showNum !== false}
          <div
            class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
          >
            <span class="text-xs font-medium text-[#7a2e0c]">{num ?? "1"}</span>
          </div>
        {/if}
      </div>
    </div>
  {/if}
  {#if tab7}
    <div
      class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg"
    >
      <div class="flex flex-row gap-1 justify-center items-center">
        {#if showIcon !== false}
          <div><div class="border border-[#0a0a0a]" /></div>
        {/if}
        <p class="text-sm font-medium text-[#0f0e0f]">{label ?? "Tab 7"}</p>
        {#if showNum !== false}
          <div
            class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
          >
            <span class="text-xs font-medium text-[#7a2e0c]">{num ?? "6"}</span>
          </div>
        {/if}
      </div>
    </div>
  {/if}
  {#if tab8}
    <div
      class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg"
    >
      <div class="flex flex-row gap-1 justify-center items-center">
        {#if showIcon !== false}
          <div><div class="border border-[#0a0a0a]" /></div>
        {/if}
        <p class="text-sm font-medium text-[#0f0e0f]">{label ?? "Tab 8"}</p>
        {#if showNum !== false}
          <div
            class="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]"
          >
            <span class="text-xs font-medium text-[#7a2e0c]">{num ?? "6"}</span>
          </div>
        {/if}
      </div>
    </div>
  {/if}<slot />
</div>