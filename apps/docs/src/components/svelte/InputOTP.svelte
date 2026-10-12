<script context="module" lang="ts">
  export interface OtpDigit {
    index: number;
    char: string;
  }

  export interface InputOTPProps {
    value?: string;
    length?: number;
    id?: string;
    label?: string;
    hint?: string;
    errorMessage?: string;
    disabled?: boolean;
    required?: boolean;
    showLabel?: boolean;
    showHint?: boolean;
    className?: string;
    onChange?: (value: string) => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let errorMessage: InputOTPProps["errorMessage"] = "";
  export let length: InputOTPProps["length"] = 6;
  export let value: InputOTPProps["value"] = "";
  export let hint: InputOTPProps["hint"] =
    "Please enter the one-time password sent to your phone.";
  export let disabled: InputOTPProps["disabled"] = false;
  export let onChange: InputOTPProps["onChange"];
  export let className: InputOTPProps["className"] = "";
  export let showLabel: InputOTPProps["showLabel"] = true;
  export let label: InputOTPProps["label"] = "Label";
  export let required: InputOTPProps["required"] = false;
  export let showHint: InputOTPProps["showHint"] = true;

  function handleDigit(index: number, rawValue: string) {
    if (disabled) {
      return;
    }
    const total = length;
    const current = value || "";
    const chars: string[] = [];
    for (let i = 0; i < total; i++) {
      chars.push(i < current.length ? current[i] : "");
    }
    const nextChar = rawValue !== "" ? rawValue.slice(rawValue.length - 1) : "";
    chars[index] = nextChar;
    if (onChange) {
      onChange(chars.join(""));
    }
  }
  $: hasError = () => {
    return errorMessage !== "";
  };
  $: digits = () => {
    const total = length;
    const chars = value ? value.split("") : [];
    const rows: OtpDigit[] = [];
    for (let i = 0; i < total; i++) {
      rows.push({
        index: i,
        char: i < chars.length ? chars[i] : "",
      });
    }
    return rows;
  };
  $: boxClasses = () => {
    if (hasError()) {
      return "border-components-input-otp-color-box-border-error";
    }
    return "border-components-input-otp-color-box-border-default focus:border-components-input-otp-color-box-border-focus";
  };
  $: supportingText = () => {
    return hasError() ? errorMessage : hint;
  };
  $: supportingClasses = () => {
    return hasError()
      ? "text-components-input-otp-color-supporting-text-foreground-error"
      : "text-components-input-otp-color-supporting-text-foreground-default";
  };
</script>

<div class={cn("flex w-full flex-col gap-3", className)}>
  {#if showLabel && label !== ""}
    <span
      class="flex items-center gap-1 text-sm font-medium text-components-input-otp-color-label-foreground-default"
      >{label}
      {#if required}
        <span
          aria-hidden="true"
          class="text-components-input-otp-color-required-indicator-foreground-default"
        >
          *
        </span>
      {/if}</span
    >
  {/if}
  <div class="flex items-center gap-2.5" role="group" aria-label={label}>
    {#each digits() as digit (digit.index)}
      <input
        type="text"
        maxlength="1"
        value={digit.char}
        {disabled}
        aria-label={label + " digit " + (digit.index + 1)}
        aria-invalid={hasError()}
        class={cn(
          "h-12 w-10 rounded-rounded-md border bg-components-input-otp-color-box-background-default text-center text-base font-medium text-components-input-otp-color-otp-value-foreground-filled outline-none transition-colors focus:ring-2 focus:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50",
          boxClasses()
        )}
        on:input={(event) => {
          handleDigit(digit.index, event.target.value);
        }}
      />
    {/each}
  </div>
  {#if showHint}
    <span class={cn("text-xs", supportingClasses())}>{supportingText()}</span>
  {/if}
</div>