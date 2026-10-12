<script context="module" lang="ts">
  export interface AlertDialogProps {
    open?: boolean;
    heading?: string;
    description?: string;
    showDescription?: boolean;
    cancelLabel?: string;
    confirmLabel?: string;
    destructive?: boolean;
    className?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let destructive: AlertDialogProps["destructive"] = false;
  export let onCancel: AlertDialogProps["onCancel"];
  export let onConfirm: AlertDialogProps["onConfirm"];
  export let open: AlertDialogProps["open"] = false;
  export let className: AlertDialogProps["className"] = "";
  export let heading: AlertDialogProps["heading"] = "Are you absolutely sure?";
  export let showDescription: AlertDialogProps["showDescription"] = true;
  export let description: AlertDialogProps["description"] =
    "This action cannot be undone. Please confirm that you want to continue.";
  export let cancelLabel: AlertDialogProps["cancelLabel"] = "Cancel";
  export let confirmLabel: AlertDialogProps["confirmLabel"] = "Continue";

  function handleCancel() {
    if (onCancel) {
      onCancel();
    }
  }
  function handleConfirm() {
    if (onConfirm) {
      onConfirm();
    }
  }
  $: headingId = () => {
    return "alert-dialog-heading";
  };
  $: descriptionId = () => {
    return "alert-dialog-description";
  };
  $: confirmClasses = () => {
    return destructive
      ? "bg-destructive-default text-destructive-on-destructive hover:bg-destructive-hover active:bg-destructive-pressed"
      : "bg-primary-default text-primary-on-primary hover:bg-primary-hover active:bg-primary-pressed";
  };
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      class="absolute inset-0 bg-overlay-backdrop"
      aria-hidden="true"
      on:click={(event) => {
        handleCancel();
      }}
    />
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={headingId()}
      aria-describedby={descriptionId()}
      class={cn(
        "relative z-10 w-full max-w-md rounded-rounded-xl border border-components-alert-dialog-default-color-dialog-border-default bg-components-alert-dialog-default-color-dialog-background-default p-6 shadow-xl",
        className
      )}
    >
      <h2
        class="text-lg font-semibold text-components-alert-dialog-default-color-heading-text-default"
        id={headingId()}
      >
        {heading}
      </h2>
      {#if showDescription}
        <p
          class="mt-2 text-sm text-components-alert-dialog-default-color-description-text-default"
          id={descriptionId()}
        >
          {description}
        </p>
      {/if}
      <div class="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center rounded-rounded-lg bg-components-button-secondary-color-container-background-default px-4 text-sm font-medium text-components-button-secondary-color-label-foreground-default transition-colors hover:bg-components-button-secondary-color-container-background-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          on:click={(event) => {
            handleCancel();
          }}>{cancelLabel}</button
        ><button
          type="button"
          class={cn(
            "inline-flex h-9 items-center justify-center rounded-rounded-lg px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
            confirmClasses()
          )}
          on:click={(event) => {
            handleConfirm();
          }}>{confirmLabel}</button
        >
      </div>
    </div>
  </div>
{/if}