import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface BreadcrumbItem {
  id?: string;
  label: string;
  href?: string;
}

export interface BreadcrumbDisplayItem {
  key: string;
  label: string;
  href: string;
  index: number;
  current: boolean;
  isEllipsis: boolean;
}

const createEllipsisItem = (): BreadcrumbDisplayItem => ({
  key: 'breadcrumb-ellipsis',
  label: '...',
  href: '',
  index: -1,
  current: false,
  isEllipsis: true,
});

const createDisplayItem = (entry: BreadcrumbItem, entryIndex: number, lastIndex: number): BreadcrumbDisplayItem => ({
  key: entry.id ? entry.id : 'breadcrumb-item-' + entryIndex,
  label: entry.label,
  href: entry.href ? entry.href : '',
  index: entryIndex,
  current: entryIndex === lastIndex,
  isEllipsis: false,
});

const buildDisplayItems = (
  source: BreadcrumbItem[],
  variant: string,
  ellipsisEnabled: boolean
): BreadcrumbDisplayItem[] => {
  const rendered: BreadcrumbDisplayItem[] = [];
  const total = source.length;
  if (total === 0) {
    return rendered;
  }

  const lastIndex = total - 1;

  if (variant === 'deep') {
    if (ellipsisEnabled && total > 4) {
      rendered.push(createDisplayItem(source[0], 0, lastIndex));
      rendered.push(createEllipsisItem());
      rendered.push(createDisplayItem(source[total - 2], total - 2, lastIndex));
      rendered.push(createDisplayItem(source[total - 1], lastIndex, lastIndex));
      return rendered;
    }
    for (let i = 0; i < total; i += 1) {
      rendered.push(createDisplayItem(source[i], i, lastIndex));
    }
    return rendered;
  }

  const depth = variant === '1' ? 1 : 2;
  const startIndex = Math.max(0, total - depth);

  if (ellipsisEnabled && startIndex > 0) {
    rendered.push(createEllipsisItem());
  }

  for (let i = startIndex; i < total; i += 1) {
    rendered.push(createDisplayItem(source[i], i, lastIndex));
  }

  return rendered;
};

export interface BreadcrumbProps {
  type?: '1' | '2' | 'deep';
  showEllipsis?: boolean;
  items?: BreadcrumbItem[];
  separatorIcon?: boolean;
  ariaLabel?: string;
  className?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

export default function Breadcrumb(props: BreadcrumbProps) {
  useDefaultProps({
    type: '2',
    showEllipsis: true,
    items: [],
    separatorIcon: true,
    ariaLabel: 'Breadcrumb',
    className: '',
  });

  const state = useStore({
    get displayItems() {
      const source: BreadcrumbItem[] = props.items ? props.items : [];
      return buildDisplayItems(source, props.type ? props.type : '2', props.showEllipsis !== false);
    },
    get linkClasses() {
      return 'inline-flex items-center rounded-sm text-foreground-muted transition-colors hover:text-foreground-default hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary focus-visible:ring-offset-2';
    },
    get currentClasses() {
      return 'inline-flex items-center font-semibold text-foreground-default';
    },
    get separatorClasses() {
      return 'h-4 w-4 shrink-0 text-foreground-muted';
    },
    handleItemClick(item) {
      if (item.isEllipsis || item.current) {
        return;
      }
      const source: BreadcrumbItem[] = props.items ? props.items : [];
      const original = source[item.index];
      if (original && props.onItemClick) {
        props.onItemClick(original, item.index);
      }
    },
  });

  return (
    <nav
      aria-label={props.ariaLabel}
      class={cn(
        'flex flex-col justify-start items-start gap-4 rounded-md px-5 py-5',
        props.className
      )}
    >
      <Show when={state.displayItems.length > 0}>
        <ol class="m-0 flex list-none flex-row flex-wrap items-center gap-1-5 p-0 text-sm font-medium">
          <For each={state.displayItems}>
            {(item, index) => (
              <li key={item.key} class="flex flex-row items-center gap-1-5">
                <Show when={index > 0}>
                  <Show when={props.separatorIcon}>
                    <svg
                      class={state.separatorClasses}
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 3.5L10.5 8L6 12.5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </Show>
                  <Show when={!props.separatorIcon}>
                    <span aria-hidden="true" class="select-none text-foreground-muted">
                      /
                    </span>
                  </Show>
                </Show>

                <Show when={item.isEllipsis}>
                  <span class="inline-flex select-none items-center text-foreground-muted" aria-hidden="true">
                    {item.label}
                  </span>
                  <span class="sr-only">Collapsed intermediate levels</span>
                </Show>

                <Show when={!item.isEllipsis && item.current}>
                  <span aria-current="page" class={state.currentClasses}>
                    {item.label}
                  </span>
                </Show>

                <Show when={!item.isEllipsis && !item.current && item.href !== ''}>
                  <a href={item.href} class={state.linkClasses} onClick={() => state.handleItemClick(item)}>
                    {item.label}
                  </a>
                </Show>

                <Show when={!item.isEllipsis && !item.current && item.href === ''}>
                  <button type="button" class={state.linkClasses} onClick={() => state.handleItemClick(item)}>
                    {item.label}
                  </button>
                </Show>
              </li>
            )}
          </For>
        </ol>
      </Show>
    </nav>
  );
}
