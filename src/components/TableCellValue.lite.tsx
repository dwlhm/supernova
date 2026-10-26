import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export type TableCellValueType =
  | 'Text'
  | 'Image Text'
  | 'Image'
  | 'Action'
  | 'Badge'
  | 'Stacked Text'
  | 'Link'
  | 'Checkbox'
  | 'Toggle'
  | 'Avatar Text'
  | 'Status'
  | 'Number'
  | 'Action (Icon)'
  | 'Product'
  | 'Slot';

export type TableCellValueStatus = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface TableCellValueProps {
  type?: TableCellValueType;
  value?: string;
  secondaryValue?: string;
  badgeLabel?: string;
  statusLabel?: string;
  status?: TableCellValueStatus;
  imageSrc?: string;
  imageAlt?: string;
  avatarInitials?: string;
  href?: string;
  align?: 'left' | 'center' | 'right';
  showAffiliate?: boolean;
  showKomlabs?: boolean;
  showRajaOngkir?: boolean;
  showKomads?: boolean;
  showKomcards?: boolean;
  showKomchat?: boolean;
  showKomclass?: boolean;
  showKompack?: boolean;
  showKomplace?: boolean;
  showKomship?: boolean;
  showKomtim?: boolean;
  showKomed?: boolean;
  showKomstore?: boolean;
  showKomerce?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showMore?: boolean;
  onAction?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMore?: () => void;
  className?: string;
  children?: any;
}

export default function TableCellValue(props: TableCellValueProps) {
  useDefaultProps({
    type: 'Text',
    value: 'Cell Value',
    secondaryValue: '',
    badgeLabel: '',
    statusLabel: '',
    status: 'success',
    imageSrc: '',
    imageAlt: '',
    avatarInitials: '',
    href: '',
    align: 'left',
    showAffiliate: true,
    showKomlabs: true,
    showRajaOngkir: true,
    showKomads: true,
    showKomcards: true,
    showKomchat: true,
    showKomclass: true,
    showKompack: true,
    showKomplace: true,
    showKomship: true,
    showKomtim: true,
    showKomed: true,
    showKomstore: true,
    showKomerce: true,
    showEdit: true,
    showDelete: true,
    showMore: true,
    className: '',
  });

  const state = useStore({
    checked: false,
    toggleOn: false,
    get layoutClasses() {
      if (props.type === 'Stacked Text') {
        return 'flex-col items-start gap-0-5';
      }
      return 'flex-row items-center gap-2';
    },
    get alignClasses() {
      switch (props.align) {
        case 'center':
          return 'justify-center text-center';
        case 'right':
          return 'justify-end text-right';
        case 'left':
        default:
          return 'justify-start text-left';
      }
    },
    get statusVisibility() {
      return props.type === 'Status' ? 'inline-flex' : 'hidden';
    },
    get isStatusType() {
      return props.type === 'Status';
    },
    get resolvedHref() {
      return props.href ? props.href : '#';
    },
    get statusText() {
      return props.statusLabel ? props.statusLabel : props.value;
    },
    get initials() {
      const explicit = props.avatarInitials ? props.avatarInitials.trim() : '';
      if (explicit.length > 0) {
        return explicit.slice(0, 2).toUpperCase();
      }
      const source = props.value ? props.value.trim() : '';
      if (source.length === 0) {
        return '';
      }
      const words = source.split(' ');
      if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
      }
      return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    },
    get editLabel() {
      return props.value ? 'Edit ' + props.value : 'Edit';
    },
    get deleteLabel() {
      return props.value ? 'Delete ' + props.value : 'Delete';
    },
    get moreLabel() {
      return props.value ? 'More actions for ' + props.value : 'More actions';
    },
    get visibleProductMarks() {
      const marks = [
        {
          id: 'affiliate',
          label: 'Affiliate',
          short: 'AF',
          visible: props.showAffiliate,
          chipClasses: 'bg-brand-komship-primary text-foreground-static-black',
        },
        {
          id: 'komlabs',
          label: 'Komlabs',
          short: 'KL',
          visible: props.showKomlabs,
          chipClasses: 'bg-brand-komlabs-primary text-foreground-static-black',
        },
        {
          id: 'rajaongkir',
          label: 'Raja Ongkir',
          short: 'RO',
          visible: props.showRajaOngkir,
          chipClasses: 'bg-brand-komship-secondary text-foreground-static-black',
        },
        {
          id: 'komads',
          label: 'Komads',
          short: 'AD',
          visible: props.showKomads,
          chipClasses: 'bg-brand-komads-primary text-foreground-static-white',
        },
        {
          id: 'komcards',
          label: 'Komcards',
          short: 'CD',
          visible: props.showKomcards,
          chipClasses: 'bg-brand-komcards-primary text-foreground-static-white',
        },
        {
          id: 'komchat',
          label: 'Komchat',
          short: 'CH',
          visible: props.showKomchat,
          chipClasses: 'bg-brand-komchat-primary text-foreground-static-white',
        },
        {
          id: 'komclass',
          label: 'Komclass',
          short: 'CS',
          visible: props.showKomclass,
          chipClasses: 'bg-brand-komclass-primary text-foreground-static-white',
        },
        {
          id: 'kompack',
          label: 'Kompack',
          short: 'PK',
          visible: props.showKompack,
          chipClasses: 'bg-brand-kompack-primary text-foreground-static-white',
        },
        {
          id: 'komplace',
          label: 'Komplace',
          short: 'PL',
          visible: props.showKomplace,
          chipClasses: 'bg-brand-komplace-primary text-foreground-static-white',
        },
        {
          id: 'komship',
          label: 'Komship',
          short: 'SH',
          visible: props.showKomship,
          chipClasses: 'bg-brand-komship-primary text-foreground-static-black',
        },
        {
          id: 'komtim',
          label: 'Komtim',
          short: 'TM',
          visible: props.showKomtim,
          chipClasses: 'bg-brand-komtim-primary text-foreground-static-white',
        },
        {
          id: 'komed',
          label: 'Komed',
          short: 'MD',
          visible: props.showKomed,
          chipClasses: 'bg-brand-komed-primary text-foreground-static-black',
        },
        {
          id: 'komstore',
          label: 'Komstore',
          short: 'ST',
          visible: props.showKomstore,
          chipClasses: 'bg-brand-komstore-primary text-foreground-static-white',
        },
        {
          id: 'komerce',
          label: 'Komerce',
          short: 'KM',
          visible: props.showKomerce,
          chipClasses: 'bg-brand-komerce-primary text-foreground-static-white',
        },
      ];
      return marks.filter((mark) => Boolean(mark.visible));
    },
    toggleChecked() {
      state.checked = !state.checked;
    },
    toggleSwitchOn() {
      state.toggleOn = !state.toggleOn;
    },
    handleAction() {
      if (props.onAction) {
        props.onAction();
      }
    },
    handleEdit() {
      if (props.onEdit) {
        props.onEdit();
      }
    },
    handleDelete() {
      if (props.onDelete) {
        props.onDelete();
      }
    },
    handleMore() {
      if (props.onMore) {
        props.onMore();
      }
    },
  });

  return (
    <div
      class={cn(
        'flex max-w-full min-w-0 rounded-rounded-sm',
        state.layoutClasses,
        state.alignClasses,
        props.className
      )}
    >
      <Show when={props.type === 'Text'}>
        <span class="min-w-0 truncate text-sm text-foreground-default">
          {props.value}
        </span>
      </Show>

      <Show when={props.type === 'Image Text'}>
        <Show when={props.imageSrc}>
          <img
            src={props.imageSrc}
            alt={props.imageAlt}
            class="h-8 w-8 shrink-0 rounded-rounded-sm bg-background-muted object-cover"
          />
        </Show>
        <Show when={!props.imageSrc}>
          <span
            aria-hidden="true"
            class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-sm bg-background-muted text-foreground-muted"
          >
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </span>
        </Show>
        <span class="min-w-0 truncate text-sm text-foreground-default">
          {props.value}
        </span>
      </Show>

      <Show when={props.type === 'Image'}>
        <Show when={props.imageSrc}>
          <img
            src={props.imageSrc}
            alt={props.imageAlt}
            class="h-10 w-10 shrink-0 rounded-radius-4 bg-background-muted object-cover"
          />
        </Show>
        <Show when={!props.imageSrc}>
          <span
            aria-hidden="true"
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-radius-4 bg-background-muted text-foreground-muted"
          >
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </span>
        </Show>
      </Show>

      <Show when={props.type === 'Action'}>
        <button
          type="button"
          class="inline-flex min-w-0 items-center gap-1 truncate rounded-rounded-sm text-sm font-medium text-primary-default transition-colors hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-border-emphasis"
          onClick={() => state.handleAction()}
        >
          {props.value}
        </button>
      </Show>

      <Show when={props.type === 'Badge'}>
        <span class="inline-flex items-center gap-1 rounded-rounded-full bg-primary-subtle px-2 py-0-5 text-xs font-medium text-primary-subtle-foreground">
          {props.badgeLabel ? props.badgeLabel : props.value}
        </span>
      </Show>

      <Show when={props.type === 'Stacked Text'}>
        <span class="min-w-0 truncate text-sm font-medium text-foreground-default">
          {props.value}
        </span>
        <Show when={props.secondaryValue}>
          <span class="min-w-0 truncate text-xs text-foreground-muted">
            {props.secondaryValue}
          </span>
        </Show>
      </Show>

      <Show when={props.type === 'Link'}>
        <a
          href={state.resolvedHref}
          class="inline-flex min-w-0 items-center gap-1 truncate rounded-rounded-sm text-sm font-medium text-primary-default underline underline-offset-2 transition-colors hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-border-emphasis"
        >
          {props.value}
        </a>
      </Show>

      <Show when={props.type === 'Checkbox'}>
        <label class="inline-flex min-w-0 items-center gap-2">
          <input
            type="checkbox"
            checked={state.checked}
            onChange={() => state.toggleChecked()}
            class="h-4 w-4 shrink-0 rounded-rounded-xs border border-border-default focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-border-emphasis"
          />
          <span class="min-w-0 truncate text-sm text-foreground-default">
            {props.value}
          </span>
        </label>
      </Show>

      <Show when={props.type === 'Toggle'}>
        <div class="inline-flex min-w-0 items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={state.toggleOn}
            aria-label={props.value}
            class={cn(
              'inline-flex h-5 w-9 shrink-0 items-center rounded-rounded-full border p-0-5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-border-emphasis',
              state.toggleOn
                ? 'justify-end border-primary-default bg-primary-default'
                : 'justify-start border-border-default bg-background-interactive'
            )}
            onClick={() => state.toggleSwitchOn()}
          >
            <span class="h-3 w-3 rounded-rounded-full bg-foreground-static-white shadow-xs" />
          </button>
          <span class="min-w-0 truncate text-sm text-foreground-default">
            {props.value}
          </span>
        </div>
      </Show>

      <Show when={props.type === 'Avatar Text'}>
        <span
          role="img"
          aria-label={props.value}
          class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-full bg-background-muted text-xs font-medium text-foreground-subtle"
        >
          {state.initials}
        </span>
        <span class="min-w-0 truncate text-sm text-foreground-default">
          {props.value}
        </span>
      </Show>

      <Show when={props.status === 'success'}>
        <span
          aria-hidden="true"
          class={cn('h-3 w-3 shrink-0 items-center justify-center text-success-default', state.statusVisibility)}
        >
          <svg
            class="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
      </Show>

      <Show when={props.status === 'warning'}>
        <span
          aria-hidden="true"
          class={cn('h-3 w-3 shrink-0 items-center justify-center text-warning-default', state.statusVisibility)}
        >
          <svg
            class="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </span>
      </Show>

      <Show when={props.status === 'error'}>
        <span
          aria-hidden="true"
          class={cn('h-3 w-3 shrink-0 items-center justify-center text-destructive-default', state.statusVisibility)}
        >
          <svg
            class="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </span>
      </Show>

      <Show when={props.status === 'info'}>
        <span
          aria-hidden="true"
          class={cn('h-3 w-3 shrink-0 items-center justify-center text-info-default', state.statusVisibility)}
        >
          <svg
            class="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" />
            <path d="M12 8h.01" />
          </svg>
        </span>
      </Show>

      <Show when={props.status === 'neutral'}>
        <span
          aria-hidden="true"
          class={cn('h-3 w-3 shrink-0 items-center justify-center text-foreground-muted', state.statusVisibility)}
        >
          <svg
            class="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12h8" />
          </svg>
        </span>
      </Show>

      <Show when={state.isStatusType}>
        <span class="min-w-0 truncate text-sm text-foreground-default">
          {state.statusText}
        </span>
      </Show>

      <Show when={props.type === 'Number'}>
        <span class="min-w-0 truncate text-sm tabular-nums text-foreground-default">
          {props.value}
        </span>
      </Show>

      <Show when={props.type === 'Action (Icon)'}>
        <div class="inline-flex items-center gap-1">
          <Show when={props.showEdit}>
            <button
              type="button"
              aria-label={state.editLabel}
              class="inline-flex h-8 w-8 items-center justify-center rounded-rounded-sm text-foreground-muted transition-colors hover:bg-background-subtle hover:text-foreground-default focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-border-emphasis"
              onClick={() => state.handleEdit()}
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </button>
          </Show>
          <Show when={props.showDelete}>
            <button
              type="button"
              aria-label={state.deleteLabel}
              class="inline-flex h-8 w-8 items-center justify-center rounded-rounded-sm text-foreground-muted transition-colors hover:bg-destructive-subtle hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-focus-ring-error"
              onClick={() => state.handleDelete()}
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                <path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            </button>
          </Show>
          <Show when={props.showMore}>
            <button
              type="button"
              aria-label={state.moreLabel}
              class="inline-flex h-8 w-8 items-center justify-center rounded-rounded-sm text-foreground-muted transition-colors hover:bg-background-subtle hover:text-foreground-default focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-border-emphasis"
              onClick={() => state.handleMore()}
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </Show>
        </div>
      </Show>

      <Show when={props.type === 'Product'}>
        <ul class="m-0 flex list-none flex-wrap items-center gap-1 p-0">
          <For each={state.visibleProductMarks}>
            {(mark) => (
              <li key={mark.id}>
                <span
                  role="img"
                  aria-label={mark.label}
                  title={mark.label}
                  class={cn(
                    'inline-flex h-6 w-6 items-center justify-center rounded-rounded-sm text-xs font-semibold',
                    mark.chipClasses
                  )}
                >
                  {mark.short}
                </span>
              </li>
            )}
          </For>
        </ul>
      </Show>

      <Show when={props.type === 'Slot'}>
        {props.children}
      </Show>
    </div>
  );
}
