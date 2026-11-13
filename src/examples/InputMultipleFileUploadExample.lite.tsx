import { Show, useStore } from '@builder.io/mitosis';
import InputMultipleFileUpload from '../components/InputMultipleFileUpload.lite';
import InputMultipleFileUploadItem from '../components/InputMultipleFileUploadItem.lite';

export default function InputMultipleFileUploadExample() {
  const state = useStore({
    hasError: false,
    showInvoice: true,
    showCatalog: true,
    showArchive: true,
  });

  return (
    <div class="flex w-full flex-col gap-3">
      <div class="flex items-center justify-end gap-1.5">
        <Show when={!state.showInvoice || !state.showCatalog || !state.showArchive}>
          <button
            type="button"
            class="rounded-md border border-border-default bg-background-default px-2.5 py-1 text-xs font-medium text-foreground-default hover:bg-background-muted"
            onClick={() => { state.showInvoice = true; state.showCatalog = true; state.showArchive = true; }}
          >
            Restore All Files
          </button>
        </Show>
        <button
          type="button"
          class="rounded-md border border-border-default bg-background-default px-2.5 py-1 text-xs font-medium text-foreground-default hover:bg-background-muted"
          onClick={() => { state.hasError = !state.hasError; }}
        >
          {state.hasError ? 'Clear Error State' : 'Simulate Error State'}
        </button>
      </div>
      <InputMultipleFileUpload
        label="Attachments"
        fileCount={(Number(state.showInvoice) + Number(state.showCatalog) + Number(state.showArchive)) + ' of 5'}
        hint="Up to 5 files, 10 MB each."
        state={state.hasError ? 'error' : 'filled'}
        error={state.hasError}
        errorMessage={state.hasError ? 'One or more files failed verification.' : ''}
      >
        <Show when={state.showInvoice}>
          <InputMultipleFileUploadItem
            status="completed"
            statusText="Uploaded • 2.4 MB"
            onRemove={() => { state.showInvoice = false; }}
          >
            invoice-q3.pdf
          </InputMultipleFileUploadItem>
        </Show>
        <Show when={state.showCatalog}>
          <InputMultipleFileUploadItem
            status="uploading"
            statusText="Uploading 64%..."
            onRemove={() => { state.showCatalog = false; }}
          >
            product-catalog.zip
          </InputMultipleFileUploadItem>
        </Show>
        <Show when={state.showArchive}>
          <InputMultipleFileUploadItem
            status="error"
            statusText="File exceeds 10 MB limit"
            onRemove={() => { state.showArchive = false; }}
          >
            raw-footage-4k.mov
          </InputMultipleFileUploadItem>
        </Show>
      </InputMultipleFileUpload>
    </div>
  );
}
