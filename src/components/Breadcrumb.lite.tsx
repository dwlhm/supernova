import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, getBreadcrumbState, bindControllerProps } from './utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbEntry {
  key: string;
  label: string;
  href: string;
  isEllipsis: boolean;
  isCurrent: boolean;
  originalIndex: number;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  type?: '1' | '2' | 'deep';
  showEllipsis?: boolean;
  maxItems?: number;
  className?: string;
  children?: any;
  onNavigate?: (href: string, index: number) => void;
}

export default function Breadcrumb(props: BreadcrumbProps) {
  useDefaultProps({
    items: [], type: '2', showEllipsis: true, maxItems: 4, className: '',
  });

  return (
    <nav data-ctrl={typeof bindControllerProps} aria-label="Breadcrumb" class={cn('w-full', props.className)}>
      <ol class="flex flex-wrap items-center gap-1.5 text-sm">
        <Show when={props.children}>{props.children}</Show>
        <Show when={!props.children}>
          <For each={getBreadcrumbState(props)}>
            {(item) => (
              <li key={item.key} class="flex items-center gap-1.5">
                <Show when={item.isEllipsis}>
                  <span class="px-1 text-foreground-muted" aria-hidden="true">{item.label}</span>
                </Show>
                <Show when={!item.isEllipsis && item.isCurrent}>
                  <span aria-current="page" class="font-normal text-foreground-default">{item.label}</span>
                </Show>
                <Show when={!item.isEllipsis && !item.isCurrent}>
                  <a
                    href={item.href}
                    onClick={() => props.onNavigate && props.onNavigate(item.href, item.originalIndex)}
                    class="rounded-sm text-foreground-muted transition-colors hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                  >
                    {item.label}
                  </a>
                </Show>
                <Show when={!item.isCurrent}>
                  <span class="text-foreground-muted" aria-hidden="true">/</span>
                </Show>
              </li>
            )}
          </For>
        </Show>
      </ol>
    </nav>
  );
}
