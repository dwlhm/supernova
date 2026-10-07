<script context="module" lang="ts">
  export interface AlertDialogProps {
    title?: string;
    description?: string;
    showIcon?: boolean;
    variant?: "default" | "danger" | "warning";
    confirmText?: string;
    cancelText?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
    children?: any;
    className?: string;
  }
</script>

<script lang="ts">
  export let className: AlertDialogProps["className"];
  export let showIcon: AlertDialogProps["showIcon"];
  export let title: AlertDialogProps["title"];
  export let description: AlertDialogProps["description"];
  export let onCancel: AlertDialogProps["onCancel"];
  export let cancelText: AlertDialogProps["cancelText"];
  export let onConfirm: AlertDialogProps["onConfirm"];
  export let confirmText: AlertDialogProps["confirmText"];
</script>

<div
  class={"flex flex-col gap-4 p-6 rounded-xl bg-white border border-[var(--color-border-neutral)] shadow-lg" +
    (className ? " " + className : "")}
>
  {#if showIcon !== false}
    <div
      class="flex flex-row p-2 justify-center items-center rounded-full bg-[var(--color-background-primary-faded)]"
    >
      <span class="text-xl font-normal">⚠️</span>
    </div>
  {/if}
  <div class="flex flex-col gap-2">
    <h3 class="text-lg font-semibold text-black">
      {title || "Deactivate Account"}
    </h3>
    <p class="text-sm font-normal text-[var(--color-foreground-neutral-faded)]">
      {description ||
        "Are you sure you want to deactivate your account? All of your data will be permanently removed."}
    </p>
  </div>
  <div class="flex flex-row gap-2 justify-end items-center">
    <button
      class="flex flex-row px-4 py-2 justify-center items-center rounded-md border border-[var(--color-border-neutral)] text-sm font-medium cursor-pointer transition-colors focus:outline-none"
      on:click={(event) => {
        onCancel?.();
      }}>{cancelText || "Cancel"}</button
    ><button
      class="flex flex-row px-4 py-2 justify-center items-center rounded-md bg-[var(--color-background-primary)] text-sm font-medium text-white cursor-pointer transition-colors focus:outline-none"
      on:click={(event) => {
        onConfirm?.();
      }}>{confirmText || "Deactivate"}</button
    >
  </div>
  <slot />
</div>