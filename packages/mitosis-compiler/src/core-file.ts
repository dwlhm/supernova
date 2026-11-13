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
  onClear?: () => void,
  onPreviewChange?: (url: string) => void,
  onValueChange?: (val: string) => void
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
  onPreviewChange?.('');
  onValueChange?.('');
  onClear?.();
}

export function handleFileDragEnter(
  event: unknown,
  onDragStateChange?: (dragging: boolean) => void
): void {
  const ev = event as {
    preventDefault?: () => void;
    currentTarget?: {
      _dragDepth?: number;
      setAttribute?: (name: string, value: string) => void;
    };
  };
  ev?.preventDefault?.();
  const el = ev?.currentTarget;
  if (!el) return;
  el._dragDepth = (el._dragDepth || 0) + 1;
  if (el._dragDepth === 1) {
    el.setAttribute?.('data-dragging', 'true');
    onDragStateChange?.(true);
  }
}

export function handleFileDragOver(event: unknown): void {
  const ev = event as { preventDefault?: () => void };
  ev?.preventDefault?.();
}

export function handleFileDragLeave(
  event: unknown,
  onDragStateChange?: (dragging: boolean) => void
): void {
  const ev = event as {
    preventDefault?: () => void;
    currentTarget?: {
      _dragDepth?: number;
      removeAttribute?: (name: string) => void;
    };
  };
  ev?.preventDefault?.();
  const el = ev?.currentTarget;
  if (!el) return;
  el._dragDepth = Math.max(0, (el._dragDepth || 0) - 1);
  if (el._dragDepth === 0) {
    el.removeAttribute?.('data-dragging');
    onDragStateChange?.(false);
  }
}

export function handleFileDropEvent(
  event: unknown,
  onFileNameChange?: (name: string) => void,
  onFilesChange?: (files: unknown[]) => void,
  onDragStateChange?: (dragging: boolean) => void
): ExtractedFileResult {
  const ev = event as {
    preventDefault?: () => void;
    currentTarget?: {
      _dragDepth?: number;
      removeAttribute?: (name: string) => void;
    };
  };
  ev?.preventDefault?.();
  const el = ev?.currentTarget;
  if (el) {
    el._dragDepth = 0;
    el.removeAttribute?.('data-dragging');
    onDragStateChange?.(false);
  }
  return handleFileSelectEvent(event, onFileNameChange, onFilesChange);
}

