import { useEffect, useRef, useSyncExternalStore } from 'react';
import {
  createFormController,
  type FormControllerOptions,
  type FormFieldState,
} from './core-form.js';
import {
  createTableController,
  type TableControllerOptions,
} from './core-table.js';
import {
  createOverlayController,
  type OverlayControllerOptions,
  type OverlayDialogState,
  type OverlayToastEntry,
} from './core-overlay.js';

export type FormController<T extends Record<string, any> = Record<string, any>> = ReturnType<
  typeof createFormController<T>
>;

export type TableController<T extends Record<string, any> = Record<string, any>> = ReturnType<
  typeof createTableController<T>
>;

export type TableSnapshot<T extends Record<string, any> = Record<string, any>> = ReturnType<
  TableController<T>['getState']
>;

export type OverlayController = ReturnType<typeof createOverlayController>;

function isFormController<T extends Record<string, any>>(
  value: FormControllerOptions<T> | FormController<T>
): value is FormController<T> {
  return typeof (value as FormController<T>)?.subscribe === 'function';
}

function isTableController<T extends Record<string, any>>(
  value: TableControllerOptions<T> | TableController<T>
): value is TableController<T> {
  return typeof (value as TableController<T>)?.subscribe === 'function';
}

function isOverlayController(
  value: OverlayControllerOptions | OverlayController | undefined
): value is OverlayController {
  return typeof (value as OverlayController)?.subscribeToast === 'function';
}

export function useForm<T extends Record<string, any>>(
  optionsOrController: FormControllerOptions<T> | FormController<T>
) {
  const ownedRef = useRef<boolean>(false);
  const ctrlRef = useRef<FormController<T> | null>(null);
  if (isFormController(optionsOrController)) {
    ownedRef.current = false;
    ctrlRef.current = optionsOrController;
  } else if (!ctrlRef.current) {
    ownedRef.current = true;
    ctrlRef.current = createFormController(optionsOrController);
  }
  const controller = ctrlRef.current;

  useEffect(() => {
    const owned = ownedRef.current;
    return () => {
      if (owned) controller.dispose();
    };
  }, [controller]);

  const snapshotRef = useRef<{ controller: FormController<T>; values: T } | null>(null);
  if (!snapshotRef.current || snapshotRef.current.controller !== controller) {
    snapshotRef.current = { controller, values: controller.getValues() };
  }

  const values = useSyncExternalStore(
    (onStoreChange) =>
      controller.subscribe(() => {
        snapshotRef.current = { controller, values: controller.getValues() };
        onStoreChange();
      }),
    () => snapshotRef.current!.values,
    () => snapshotRef.current!.values
  );

  return {
    controller,
    values,
    getValues: controller.getValues,
    getFieldState: controller.getFieldState,
    setValue: controller.setValue,
    handleBlur: controller.handleBlur,
    validateField: controller.validateField,
    setFieldError: controller.setFieldError,
    clearFieldErrors: controller.clearFieldErrors,
    bindField: controller.bindField,
    bindCheckboxField: controller.bindCheckboxField,
    bindRadioField: controller.bindRadioField,
    handleSubmit: controller.handleSubmit,
    reset: controller.reset,
    dispose: controller.dispose,
  };
}

export function useFormField<
  T extends Record<string, any>,
  K extends keyof T & string = keyof T & string
>(form: FormController<T>, name: K) {
  const snapshotRef = useRef<{
    form: FormController<T>;
    name: K;
    state: FormFieldState<T[K]>;
  } | null>(null);

  if (!snapshotRef.current || snapshotRef.current.form !== form || snapshotRef.current.name !== name) {
    snapshotRef.current = { form, name, state: form.getFieldState(name) };
  }

  const state = useSyncExternalStore(
    (onStoreChange) =>
      form.subscribeField(name, (nextState) => {
        snapshotRef.current = { form, name, state: nextState };
        onStoreChange();
      }),
    () => snapshotRef.current!.state,
    () => snapshotRef.current!.state
  );

  return {
    ...state,
    state,
    name,
    bind: form.bindField(name),
    bindCheckbox: () => form.bindCheckboxField(name),
    bindRadio: (optionValue: T[K]) => form.bindRadioField(name, optionValue),
    setValue: (value: T[K], opts?: { shouldValidate?: boolean }) => form.setValue(name, value, opts),
    setError: (message: string) => form.setFieldError(name, message),
    onBlur: () => form.handleBlur(name),
    validate: (trigger?: 'change' | 'blur' | 'submit') => form.validateField(name, trigger),
  };
}

export function useTable<T extends Record<string, any>>(
  optionsOrController: TableControllerOptions<T> | TableController<T>
) {
  const ctrlRef = useRef<TableController<T> | null>(null);
  if (isTableController(optionsOrController)) {
    ctrlRef.current = optionsOrController;
  } else if (!ctrlRef.current) {
    ctrlRef.current = createTableController(optionsOrController);
  }
  const controller = ctrlRef.current;

  const snapshotRef = useRef<{ controller: TableController<T>; state: TableSnapshot<T> } | null>(null);
  if (!snapshotRef.current || snapshotRef.current.controller !== controller) {
    snapshotRef.current = { controller, state: controller.getState() };
  }

  const state = useSyncExternalStore(
    (onStoreChange) =>
      controller.subscribe(() => {
        snapshotRef.current = { controller, state: controller.getState() };
        onStoreChange();
      }),
    () => snapshotRef.current!.state,
    () => snapshotRef.current!.state
  );

  return {
    ...state,
    state,
    controller,
    bindSearch: controller.bindSearch,
    bindHeaderSort: controller.bindHeaderSort,
    bindHeaderCheckbox: controller.bindHeaderCheckbox,
    bindRow: controller.bindRow,
    bindRowCheckbox: controller.bindRowCheckbox,
    bindPagination: controller.bindPagination,
    setRows: controller.setRows,
    setQuery: controller.setQuery,
    setFilter: controller.setFilter,
    clearFilters: controller.clearFilters,
    toggleSort: controller.toggleSort,
    setSort: controller.setSort,
    setPage: controller.setPage,
    setPageSize: controller.setPageSize,
    toggleRow: controller.toggleRow,
    toggleAllVisible: controller.toggleAllVisible,
    clearSelection: controller.clearSelection,
    reset: controller.reset,
  };
}

export function useOverlay(
  optionsOrController: OverlayControllerOptions | OverlayController = {}
) {
  const ownedRef = useRef<boolean>(false);
  const ctrlRef = useRef<OverlayController | null>(null);
  if (isOverlayController(optionsOrController)) {
    ownedRef.current = false;
    ctrlRef.current = optionsOrController;
  } else if (!ctrlRef.current) {
    ownedRef.current = true;
    ctrlRef.current = createOverlayController(optionsOrController);
  }
  const controller = ctrlRef.current;

  useEffect(() => {
    const owned = ownedRef.current;
    return () => {
      if (owned) controller.dispose();
    };
  }, [controller]);

  const toast: OverlayToastEntry = useSyncExternalStore(
    (onStoreChange) => controller.toastStore.subscribeChanges(onStoreChange),
    controller.toastStore.getSnapshot,
    controller.toastStore.getServerSnapshot
  );

  const queue: readonly OverlayToastEntry[] = useSyncExternalStore(
    (onStoreChange) => controller.toastQueueStore.subscribeChanges(onStoreChange),
    controller.toastQueueStore.getSnapshot,
    controller.toastQueueStore.getServerSnapshot
  );

  const dialog: OverlayDialogState = useSyncExternalStore(
    (onStoreChange) => controller.dialogStore.subscribeChanges(onStoreChange),
    controller.dialogStore.getSnapshot,
    controller.dialogStore.getServerSnapshot
  );

  return {
    controller,
    toast,
    queue,
    dialog,
    notify: controller.notify,
    info: controller.info,
    success: controller.success,
    warning: controller.warning,
    error: controller.error,
    promise: controller.promise,
    dismissToast: controller.dismissToast,
    dismissAllToasts: controller.dismissAllToasts,
    pauseToast: controller.pauseToast,
    resumeToast: controller.resumeToast,
    triggerToastAction: controller.triggerToastAction,
    openDialog: controller.openDialog,
    closeDialog: controller.closeDialog,
    confirmDialog: controller.confirmDialog,
    confirm: controller.confirm,
    bindToast: controller.bindToast,
    bindDialog: controller.bindDialog,
    setToastPlacement: controller.setToastPlacement,
    getToastPlacement: controller.getToastPlacement,
  };
}
