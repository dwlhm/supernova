<script context="module" lang="ts">
  // This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.

  export interface InputProps {
    name?: string;
    disabled?: boolean;
    required?: boolean;
    label?: string;
    error?: string;
    helperText?: string;
    onChange?: (event: any) => void;
    onFocus?: (event: any) => void;
    onBlur?: (event: any) => void;
    value?: string;
    placeholder?: string;
    type?: string;
  }
</script>

<script lang="ts">
  import { dispatchEvent } from "./runtime/component-runtime";

  export let label: InputProps["label"];
  export let required: InputProps["required"];
  export let name: InputProps["name"];
  export let value: InputProps["value"];
  export let disabled: InputProps["disabled"];
  export let type: InputProps["type"];
  export let placeholder: InputProps["placeholder"];
  export let onChange: InputProps["onChange"];
  export let onFocus: InputProps["onFocus"];
  export let onBlur: InputProps["onBlur"];
  export let error: InputProps["error"];
  export let helperText: InputProps["helperText"];
</script>

<div class="flex flex-col gap-1 w-full">
  {#if label}
    <label class="text-xs font-medium text-slate-700"
      >{label}
      {#if required}
        <span class="text-red-500 ml-0.5">*</span>
      {/if}</label
    >
  {/if}<input
    {name}
    {value}
    {disabled}
    {required}
    type={type ?? "text"}
    {placeholder}
    on:change={(event) => {
      dispatchEvent(onChange, event, false);
    }}
    on:focus={(event) => {
      dispatchEvent(onFocus, event, false);
    }}
    on:blur={(event) => {
      dispatchEvent(onBlur, event, false);
    }}
    class={"w-full px-3 py-2 text-sm rounded-md border outline-none transition-colors duration-150 box-border disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed" +
      " " +
      (error
        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
        : "border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600")}
  />
  {#if error}
    <span class="text-xs text-red-600">{error}</span>
  {/if}
  {#if !error && helperText}
    <span class="text-xs text-slate-500">{helperText}</span>
  {/if}
</div>