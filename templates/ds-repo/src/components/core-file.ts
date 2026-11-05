export interface ExtractedFileResult {
  files: unknown[];
  firstFileName: string;
  previewUrl: string;
}

export function extractFilesFromEvent(event: unknown): ExtractedFileResult {
  const ev = event as {
    target?: { files?: ArrayLike<{ name?: string; type?: string }> };
    dataTransfer?: { files?: ArrayLike<{ name?: string; type?: string }> };
  };
  const rawList = ev?.target?.files ?? ev?.dataTransfer?.files;
  const files = rawList ? Array.from(rawList) : [];
  const first = files[0] as { name?: string; type?: string } | undefined;
  const firstFileName = first?.name ?? '';
  let previewUrl = '';
  if (
    first &&
    typeof URL !== 'undefined' &&
    typeof URL.createObjectURL === 'function' &&
    typeof Blob !== 'undefined' &&
    first instanceof Blob
  ) {
    previewUrl = URL.createObjectURL(first);
  }
  return { files, firstFileName, previewUrl };
}

export function handleFileSelectEvent(
  event: unknown,
  onFileNameChange?: (name: string) => void,
  onFilesChange?: (files: unknown[]) => void,
  onPreviewChange?: (url: string) => void
): ExtractedFileResult {
  const ev = event as { preventDefault?: () => void };
  ev?.preventDefault?.();
  const res = extractFilesFromEvent(event);
  if (res.firstFileName) {
    onFileNameChange?.(res.firstFileName);
  }
  if (res.files.length > 0) {
    onFilesChange?.(res.files);
  }
  if (res.previewUrl) {
    onPreviewChange?.(res.previewUrl);
  }
  return res;
}

export function clearFileInputEvent(
  event: unknown,
  onFileNameChange?: (name: string) => void,
  onFilesChange?: (files: unknown[]) => void,
  onClear?: () => void
): void {
  const ev = event as {
    preventDefault?: () => void;
    stopPropagation?: () => void;
    currentTarget?: {
      parentElement?: { querySelector?: (s: string) => { value?: string } | null };
    };
  };
  ev?.preventDefault?.();
  ev?.stopPropagation?.();
  const input = ev?.currentTarget?.parentElement?.querySelector?.('input[type="file"]');
  if (input) {
    input.value = '';
  }
  onFileNameChange?.('');
  onFilesChange?.([]);
  onClear?.();
}
