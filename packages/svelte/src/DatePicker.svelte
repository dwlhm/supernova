<script context="module" lang="ts">
  export interface DatePickerProps {
    hintText?: boolean;
    state?: "Closed" | "Open";
    type?:
      | "Date of Birth Picker"
      | "Picker with Input"
      | "Date and Time Picker"
      | "Natural Language Picker"
      | "Range Picker"
      | "Year Picker";
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
    label?: string;
    placeholder?: string;
    note?: string;
  }
</script>

<script lang="ts">
  export let id: DatePickerProps["id"];
  export let ariaDescribedby: DatePickerProps["ariaDescribedby"];
  export let type: DatePickerProps["type"];
  export let className: DatePickerProps["className"];
  export let label: DatePickerProps["label"];
  export let placeholder: DatePickerProps["placeholder"];
  export let hintText: DatePickerProps["hintText"];
  export let note: DatePickerProps["note"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-col gap-3 " +
    (type === "Range Picker"
      ? "text-[#737373]"
      : type === "Year Picker"
      ? "text-[#737373]"
      : "text-[#737373]") +
    (className ? " " + className : "")}
>
  <div class="flex flex-row gap-3 items-center w-full">
    <p class="text-sm font-medium text-[#0a0a0a]">{label ?? "Date of Birth"}</p>
  </div>
  <div
    class="flex flex-row gap-16 px-3 py-1 items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm w-full"
  >
    <div class="flex flex-row gap-3 items-center w-full flex-1">
      <p class="text-base font-normal text-[#0a0a0a]">
        {placeholder ?? "Select a date"}
      </p>
      <div>
        <div />
        <div class="border-1.5 border-[#0a0a0a]" />
      </div>
    </div>
  </div>
  {#if hintText}
    <p class="text-xs font-normal text-[#737373]">
      {note ?? "Your post will be published on June 21, 2025."}
    </p>
  {/if}<slot />
</div>