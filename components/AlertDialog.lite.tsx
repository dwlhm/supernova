import { useStore } from '@builder.io/mitosis';

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

export default function AlertDialog(props: AlertDialogProps) {
  const state = useStore({});

  return (
    <div className={"flex flex-col gap-4 p-6 rounded-xl bg-white border border-[var(--color-border-neutral)] shadow-lg" + (props.className ? " " + props.className : "")}>
      {props.showIcon !== false && (
        <div className="flex flex-row p-2 justify-center items-center rounded-full bg-[var(--color-background-primary-faded)]">
          <span className="text-xl font-normal">⚠️</span>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-black">{props.title || "Deactivate Account"}</h3>
        <p className="text-sm font-normal text-[var(--color-foreground-neutral-faded)]">{props.description || "Are you sure you want to deactivate your account? All of your data will be permanently removed."}</p>
      </div>
      <div className="flex flex-row gap-2 justify-end items-center">
        <button onClick={() => props.onCancel?.()} className="flex flex-row px-4 py-2 justify-center items-center rounded-md border border-[var(--color-border-neutral)] text-sm font-medium cursor-pointer transition-colors focus:outline-none">
          {props.cancelText || "Cancel"}
        </button>
        <button onClick={() => props.onConfirm?.()} className="flex flex-row px-4 py-2 justify-center items-center rounded-md bg-[var(--color-background-primary)] text-sm font-medium text-white cursor-pointer transition-colors focus:outline-none">
          {props.confirmText || "Deactivate"}
        </button>
      </div>
      {props.children}
    </div>
  );
}
