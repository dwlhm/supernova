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

export type Vue3FormController<T extends Record<string, any> = Record<string, any>> = ReturnType<
  typeof createFormController<T>
>;

export type Vue3TableController<T extends Record<string, any> = Record<string, any>> = ReturnType<
  typeof createTableController<T>
>;

export type Vue3TableSnapshot<T extends Record<string, any> = Record<string, any>> = ReturnType<
  Vue3TableController<T>['getState']
>;

export type Vue3OverlayController = ReturnType<typeof createOverlayController>;

export interface Vue3ShallowRef<T> {
  value: T;
}

export interface Vue3RuntimeBindings {
  shallowRef: <T>(value: T) => Vue3ShallowRef<T>;
  onScopeDispose: (fn: () => void) => void;
}

function isVue3FormController<T extends Record<string, any>>(
  value: FormControllerOptions<T> | Vue3FormController<T>
): value is Vue3FormController<T> {
  return typeof (value as Vue3FormController<T>)?.subscribe === 'function';
}

function isVue3TableController<T extends Record<string, any>>(
  value: TableControllerOptions<T> | Vue3TableController<T>
): value is Vue3TableController<T> {
  return typeof (value as Vue3TableController<T>)?.subscribe === 'function';
}

function isVue3OverlayController(
  value: OverlayControllerOptions | Vue3OverlayController | undefined
): value is Vue3OverlayController {
  return typeof (value as Vue3OverlayController)?.subscribeToast === 'function';
}

export function createVue3Runtime(bindings: Vue3RuntimeBindings) {
  const { shallowRef, onScopeDispose } = bindings;

  function useForm<T extends Record<string, any>>(
    optionsOrController: FormControllerOptions<T> | Vue3FormController<T>
  ) {
    const owned = !isVue3FormController(optionsOrController);
    const controller = owned
      ? createFormController(optionsOrController as FormControllerOptions<T>)
      : (optionsOrController as Vue3FormController<T>);

    const values = shallowRef<T>(controller.getValues());
    const unsubscribe = controller.subscribe(() => {
      values.value = controller.getValues();
    });

    onScopeDispose(() => {
      unsubscribe();
      if (owned) controller.dispose();
    });

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

  function useFormField<
    T extends Record<string, any>,
    K extends keyof T & string = keyof T & string
  >(form: Vue3FormController<T>, name: K) {
    const state = shallowRef<FormFieldState<T[K]>>(form.getFieldState(name));
    const unsubscribe = form.subscribeField(name, (nextState) => {
      state.value = nextState;
    });

    onScopeDispose(() => {
      unsubscribe();
    });

    return {
      name,
      state,
      bind: () => form.bindField(name),
      bindCheckbox: () => form.bindCheckboxField(name),
      bindRadio: (optionValue: T[K]) => form.bindRadioField(name, optionValue),
      setValue: (value: T[K], opts?: { shouldValidate?: boolean }) => form.setValue(name, value, opts),
      setError: (message: string) => form.setFieldError(name, message),
      onBlur: () => form.handleBlur(name),
      validate: (trigger?: 'change' | 'blur' | 'submit') => form.validateField(name, trigger),
    };
  }

  function useTable<T extends Record<string, any>>(
    optionsOrController: TableControllerOptions<T> | Vue3TableController<T>
  ) {
    const controller = isVue3TableController(optionsOrController)
      ? optionsOrController
      : createTableController(optionsOrController);

    const state = shallowRef<Vue3TableSnapshot<T>>(controller.getState());
    const unsubscribe = controller.subscribe(() => {
      state.value = controller.getState();
    });

    onScopeDispose(() => {
      unsubscribe();
    });

    return {
      controller,
      state,
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

  function useOverlay(
    optionsOrController: OverlayControllerOptions | Vue3OverlayController = {}
  ) {
    const owned = !isVue3OverlayController(optionsOrController);
    const controller = owned
      ? createOverlayController(optionsOrController as OverlayControllerOptions)
      : (optionsOrController as Vue3OverlayController);

    const toast = shallowRef<OverlayToastEntry>(controller.getToastSnapshot());
    const queue = shallowRef<readonly OverlayToastEntry[]>(controller.getToastQueueSnapshot());
    const dialog = shallowRef<OverlayDialogState>(controller.getDialogSnapshot());

    const unsubToast = controller.subscribeToast((next) => {
      toast.value = next;
    });
    const unsubQueue = controller.subscribeToastQueue((next) => {
      queue.value = next;
    });
    const unsubDialog = controller.subscribeDialog((next) => {
      dialog.value = next;
    });

    onScopeDispose(() => {
      unsubToast();
      unsubQueue();
      unsubDialog();
      if (owned) controller.dispose();
    });

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

  return {
    useForm,
    useFormField,
    useTable,
    useOverlay,
  };
}
