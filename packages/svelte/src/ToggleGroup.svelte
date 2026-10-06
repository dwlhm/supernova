<script context="module" lang="ts">
  export interface ToggleGroupProps {
    showToggle1?: boolean;
    showToggle2?: boolean;
    showToggle3?: boolean;
    showToggle4?: boolean;
    showToggle5?: boolean;
    size?: "Medium" | "Small" | "Large";
    showText?: boolean;
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
    label?: string;
    label2?: string;
    label3?: string;
    label4?: string;
    label5?: string;
  }
</script>

<script lang="ts">
  export let id: ToggleGroupProps["id"];
  export let ariaDescribedby: ToggleGroupProps["ariaDescribedby"];
  export let size: ToggleGroupProps["size"];
  export let className: ToggleGroupProps["className"];
  export let showToggle1: ToggleGroupProps["showToggle1"];
  export let showText: ToggleGroupProps["showText"];
  export let label: ToggleGroupProps["label"];
  export let showToggle2: ToggleGroupProps["showToggle2"];
  export let label2: ToggleGroupProps["label2"];
  export let showToggle3: ToggleGroupProps["showToggle3"];
  export let label3: ToggleGroupProps["label3"];
  export let showToggle4: ToggleGroupProps["showToggle4"];
  export let label4: ToggleGroupProps["label4"];
  export let showToggle5: ToggleGroupProps["showToggle5"];
  export let label5: ToggleGroupProps["label5"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-row rounded-lg border border-[#e5e5e5] shadow-sm " +
    (size === "Medium"
      ? "px-4 py-2 text-sm"
      : size === "Large"
      ? "px-6 py-3 text-lg"
      : "px-3 py-1.5 text-xs") +
    (className ? " " + className : "")}
>
  {#if showToggle1 !== false}
    <div
      class="flex flex-row gap-1 p-1 justify-center items-center border border-[#e5e5e5]"
    >
      <div>
        <div />
        <div class="border-1.5 border-[#0a0a0a]" />
        <div class="border-1.5 border-[#0a0a0a]" />
      </div>
      {#if showText !== false}
        <p class="text-xs font-normal text-center text-[#0a0a0a]">
          {label ?? "Bold"}
        </p>
      {/if}
    </div>
  {/if}
  {#if showToggle2 !== false}
    <div
      class="flex flex-row gap-1 p-1 justify-center items-center border border-[#e5e5e5]"
    >
      <div>
        <div />
        <div class="border-1.5 border-[#0a0a0a]" />
        <div class="border-1.5 border-[#0a0a0a]" />
      </div>
      {#if showText !== false}
        <p class="text-xs font-normal text-center text-[#0a0a0a]">
          {label2 ?? "Bold"}
        </p>
      {/if}
    </div>
  {/if}
  {#if showToggle3 !== false}
    <div
      class="flex flex-row gap-1 p-1 justify-center items-center border border-[#e5e5e5]"
    >
      <div>
        <div />
        <div class="border-1.5 border-[#0a0a0a]" />
        <div class="border-1.5 border-[#0a0a0a]" />
      </div>
      {#if showText !== false}
        <p class="text-xs font-normal text-center text-[#0a0a0a]">
          {label3 ?? "Bold"}
        </p>
      {/if}
    </div>
  {/if}
  {#if showToggle4 !== false}
    <div class="flex flex-row gap-1 p-1 justify-center items-center">
      <div>
        <div />
        <div class="border-1.5 border-[#0a0a0a]" />
        <div class="border-1.5 border-[#0a0a0a]" />
      </div>
      {#if showText !== false}
        <p class="text-xs font-normal text-center text-[#0a0a0a]">
          {label4 ?? "Bold"}
        </p>
      {/if}
    </div>
  {/if}
  {#if showToggle5 !== false}
    <div class="flex flex-row gap-1 p-1 justify-center items-center">
      <div>
        <div />
        <div class="border-1.5 border-[#0a0a0a]" />
        <div class="border-1.5 border-[#0a0a0a]" />
      </div>
      {#if showText !== false}
        <p class="text-xs font-normal text-center text-[#0a0a0a]">
          {label5 ?? "Bold"}
        </p>
      {/if}
    </div>
  {/if}<slot />
</div>