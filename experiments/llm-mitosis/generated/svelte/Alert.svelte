<script context="module" lang="ts">
  export interface AlertProps {
    color?: "primary" | "secondary" | "positive";
    title: string;
    text: string;
    showIcon?: boolean;
    showAction?: boolean;
    actionLabel?: string;
    dismissible?: boolean;
    onAction?: () => void;
    onClose?: () => void;
  }
</script>

<script lang="ts">
  export let color: AlertProps["color"] = "primary";
  export let onAction: AlertProps["onAction"];
  export let onClose: AlertProps["onClose"];
  export let showIcon: AlertProps["showIcon"] = true;
  export let title: AlertProps["title"];
  export let text: AlertProps["text"];
  export let showAction: AlertProps["showAction"] = false;
  export let actionLabel: AlertProps["actionLabel"] = "Action";
  export let dismissible: AlertProps["dismissible"] = false;

  function handleAction() {
    if (onAction) {
      onAction();
    }
  }
  function handleClose() {
    dismissed = true;
    if (onClose) {
      onClose();
    }
  }
  $: containerClasses = () => {
    const base =
      "w-full p-4 rounded-xl border flex items-start gap-3 transition-all";
    if (color === "positive")
      return base + " bg-green-50 border-green-200 text-green-900";
    if (color === "secondary")
      return base + " bg-purple-50 border-purple-200 text-purple-900";
    return base + " bg-blue-50 border-blue-200 text-blue-900";
  };
  $: iconWrapperClasses = () => {
    const color =
      color === "positive"
        ? "text-green-600"
        : color === "secondary"
        ? "text-purple-600"
        : "text-blue-600";
    return "flex-shrink-0 mt-0.5 " + color;
  };
  $: actionButtonClasses = () => {
    const base =
      "text-xs font-semibold px-2.5 py-1.5 rounded-md transition-colors mt-2.5 cursor-pointer inline-block";
    if (color === "positive")
      return base + " text-green-800 bg-green-100 hover:bg-green-200";
    if (color === "secondary")
      return base + " text-purple-800 bg-purple-100 hover:bg-purple-200";
    return base + " text-blue-800 bg-blue-100 hover:bg-blue-200";
  };

  let dismissed = false;
</script>

{#if !dismissed}
  <div role="alert" class={containerClasses()}>
    {#if showIcon}
      <div class={iconWrapperClasses()}>
        {#if color === "positive"}
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            ><path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            /></svg
          >
        {:else}
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            ><path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            /></svg
          >
        {/if}
      </div>
    {/if}
    <div class="flex-1 min-w-0">
      <div class="font-semibold text-sm leading-5">{title}</div>
      <div class="text-sm mt-0.5 leading-relaxed opacity-90">{text}</div>
      {#if showAction}
        <div>
          <button
            type="button"
            class={actionButtonClasses()}
            on:click={(event) => {
              handleAction();
            }}>{actionLabel}</button
          >
        </div>
      {/if}
    </div>
    {#if dismissible}
      <button
        type="button"
        class="flex-shrink-0 -mr-1 -mt-1 p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-colors cursor-pointer"
        aria-label="Dismiss alert"
        on:click={(event) => {
          handleClose();
        }}
        ><svg
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          ><path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          /></svg
        ></button
      >
    {/if}
  </div>
{/if}