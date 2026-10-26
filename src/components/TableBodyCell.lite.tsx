import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export type TableBodyCellVariant = 'text' | 'product' | 'badge' | 'status' | 'link';

export interface TableBodyCellProps {
  /** Content type hosted by the cell — maps to the nested Table Cell Value variant. */
  variant?: TableBodyCellVariant;
  /** Primary value displayed by the cell. */
  value?: string;
  /** Secondary, muted line displayed under the primary value (text and product variants). */
  secondaryValue?: string;
  /** Badge label used by the `badge` variant. */
  badgeLabel?: string;
  /** Status label used by the `status` variant. */
  statusLabel?: string;
  /** Image source used by the `product` variant. */
  imageSrc?: string;
  /** Fallback initials used by the `product` variant when no image is available. */
  avatarInitials?: string;
  /** Link target used by the `link` variant. */
  href?: string;
  /** Horizontal alignment of the cell content — keep it consistent per column. */
  align?: 'left' | 'center' | 'right';
  /** Custom CSS classes applied to the `<td>` element. */
  className?: string;
  /** Custom cell content, rendered instead of the cell value composition. */
  children?: any;
}

export default function TableBodyCell(props: TableBodyCellProps) {
  useDefaultProps({
    variant: 'text',
    value: '',
    secondaryValue: '',
    badgeLabel: '',
    statusLabel: '',
    imageSrc: '',
    avatarInitials: '',
    href: '',
    align: 'left',
    className: '',
  });

  const state = useStore({
    get alignClasses() {
      switch (props.align) {
        case 'center':
          return 'text-center';
        case 'right':
          return 'text-right';
        case 'left':
        default:
          return 'text-left';
      }
    },
    get contentAlignClasses() {
      switch (props.align) {
        case 'center':
          return 'justify-center';
        case 'right':
          return 'flex-row-reverse justify-start';
        case 'left':
        default:
          return 'justify-start';
      }
    },
    get textAlignClasses() {
      switch (props.align) {
        case 'center':
          return 'items-center text-center';
        case 'right':
          return 'items-end text-right';
        case 'left':
        default:
          return 'items-start text-left';
      }
    },
    get variantClasses() {
      switch (props.variant) {
        case 'product':
          return 'items-center gap-2';
        case 'badge':
          return 'items-center gap-1';
        case 'status':
          return 'items-center gap-1.5';
        case 'link':
          return 'items-center gap-1';
        case 'text':
        default:
          return 'items-start gap-2';
      }
    },
    get hasCustomContent() {
      return !!props.children;
    },
    get showImage() {
      return !!props.imageSrc;
    },
    get showInitials() {
      return !!props.avatarInitials;
    },
  });

  return (
    <td
      class={cn(
        'px-4 py-3 align-top text-sm text-components-table-default-color-cell-foreground-default',
        state.alignClasses,
        props.className
      )}
    >
      <Show when={state.hasCustomContent}>
        <span class={cn('flex min-w-0', state.contentAlignClasses, state.variantClasses)}>
          {props.children}
        </span>
      </Show>

      <Show when={!state.hasCustomContent}>
        <span class={cn('flex min-w-0', state.contentAlignClasses, state.variantClasses)}>
          <Show when={props.variant === 'product' && state.showImage}>
            <img
              src={props.imageSrc}
              alt=""
              class="h-8 w-8 shrink-0 rounded-rounded-sm object-cover"
              aria-hidden="true"
            />
          </Show>

          <Show when={props.variant === 'product' && !state.showImage && state.showInitials}>
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-full bg-components-avatar-all-color-container-background-default text-xs font-medium uppercase text-components-avatar-all-color-initials-foreground-default"
              aria-hidden="true"
            >
              {props.avatarInitials}
            </span>
          </Show>

          <Show when={props.variant === 'text' || props.variant === 'product'}>
            <span class={cn('flex min-w-0 flex-col gap-0.5', state.textAlignClasses)}>
              <span class="truncate text-sm text-components-table-default-color-cell-foreground-default">
                {props.value}
              </span>
              <Show when={props.secondaryValue !== ''}>
                <span class="truncate text-xs text-components-table-default-color-cell-foreground-muted">
                  {props.secondaryValue}
                </span>
              </Show>
            </span>
          </Show>

          <Show when={props.variant === 'link'}>
            <a
              href={props.href}
              class="truncate text-sm font-medium text-primary-default underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
            >
              {props.value}
            </a>
          </Show>

          <Show when={props.variant === 'badge'}>
            <span class="inline-flex w-fit items-center gap-1 rounded-rounded-full bg-components-badge-secondary-color-container-background-default px-2 py-0.5 text-xs font-medium leading-none text-components-badge-secondary-color-label-foreground-default">
              {props.badgeLabel}
            </span>
          </Show>

          <Show when={props.variant === 'status'}>
            <span class="inline-flex w-fit items-center gap-1 text-xs text-components-table-default-color-cell-foreground-muted">
              <span
                class="h-1.5 w-1.5 shrink-0 rounded-rounded-full bg-success-default"
                aria-hidden="true"
              />
              {props.statusLabel}
            </span>
          </Show>
        </span>
      </Show>
    </td>
  );
}
