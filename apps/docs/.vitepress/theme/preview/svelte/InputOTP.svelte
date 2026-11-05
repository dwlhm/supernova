<script context="module" lang="ts">
  export interface InputOTPProps {
    value?: string;
    length?: number;
    id?: string;
    name?: string;
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
  import {
    cn,
    getOtpState,
    handleOtpInputEvent,
    handleOtpKeyDownEvent,
    handleOtpPasteEvent,
    bindControllerProps,
  } from "./utils";

  export let id: InputOTPProps["id"] = "input-otp";
  export let className: InputOTPProps["className"] = "";
  export let showLabel: InputOTPProps["showLabel"] = true;
  export let label: InputOTPProps["label"] = "Label";
  export let required: InputOTPProps["required"] = false;
  export let disabled: InputOTPProps["disabled"] = false;
  export let length: InputOTPProps["length"] = 6;
  export let onChange: InputOTPProps["onChange"];
  export let showHint: InputOTPProps["showHint"] = true;
  export let value: InputOTPProps["value"] = "";
  export let name: InputOTPProps["name"] = 'otp';
  export let hint: InputOTPProps["hint"] = 'Please enter the one-time password sent to your phone.';
  export let errorMessage: InputOTPProps["errorMessage"] = '';
  $: props = { id, className, showLabel, label, required, disabled, length, onChange, showHint, value, name, hint, errorMessage };
</script>

<div
  {id}
  data-ctrl={typeof bindControllerProps}
  class={cn("flex w-full flex-col gap-3", className)}
>
  {#if showLabel && label !== ""}
    <span
      class="flex items-center gap-1 text-sm font-medium text-foreground-default"
      >{label}
      {#if required}
        <span aria-hidden="true" class="text-destructive-default">*</span>
      {/if}</span
    >
  {/if}
  <div
    class="flex items-center gap-2.5"
    role="group"
    aria-label={label}
    on:paste={(event) => {
      !disabled && handleOtpPasteEvent(event, length || 6, onChange);
    }}
  >
    {#each getOtpState(props).digits as digit (digit.index)}
      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxlength="1"
        value={digit.char}
        {disabled}
        aria-label={label + " digit " + (digit.index + 1)}
        aria-invalid={getOtpState(props).hasError}
        aria-describedby={showHint ? id + "-hint" : undefined}
        class={cn(
          "h-9 w-9 rounded-md border bg-background-default text-center text-base font-medium text-foreground-default shadow-xs outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          getOtpState(props).hasError
            ? "border-destructive-border focus:ring-2 focus:ring-focus-ring-error"
            : "border-border-default focus:border-primary-border-emphasis focus:ring-2 focus:ring-focus-ring-primary"
        )}
        on:keydown={(event) => {
          !disabled &&
            handleOtpKeyDownEvent(
              event,
              digit.index,
              value,
              length || 6,
              onChange
            );
        }}
        on:input={(event) => {
          !disabled &&
            handleOtpInputEvent(
              event,
              digit.index,
              value,
              length || 6,
              onChange
            );
        }}
      />
    {/each}
  </div>
  {#if showHint}
    <span
      id={id + "-hint"}
      class={cn(
        "text-sm",
        getOtpState(props).hasError
          ? "text-destructive-foreground"
          : "text-foreground-muted"
      )}>{getOtpState(props).helpText}</span
    >
  {/if}
</div>