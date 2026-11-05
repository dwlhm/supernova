import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, handleRovingFocus, bindControllerProps } from './utils';
import TabItem from './TabItem.lite';

export interface TabData {
  id: string;
  label: string;
  num?: string;
}

export interface TabsProps {
  tabs?: TabData[];
  activeTab?: string;
  ariaLabel?: string;
  className?: string;
  children?: any;
  onTabChange?: (id: string) => void;
}

export default function Tabs(props: TabsProps) {
  useDefaultProps({
    tabs: [], activeTab: 'overview', ariaLabel: 'Tabs', className: '',
  });

  return (
    <div
      data-ctrl={typeof bindControllerProps}
      role="tablist"
      aria-label={props.ariaLabel}
      onKeyDown={(event) =>
        handleRovingFocus(
          event,
          Math.max(0, (props.tabs || []).findIndex((t) => t.id === props.activeTab)),
          (props.tabs || []).length,
          (idx) => props.onTabChange && (props.tabs || [])[idx] && props.onTabChange((props.tabs || [])[idx].id)
        )
      }
      class={cn(
        'inline-flex h-9 items-center rounded-lg bg-background-muted p-0.5',
        props.className
      )}
    >
      <Show when={props.children}>{props.children}</Show>
      <Show when={!props.children}>
        <For each={props.tabs}>
          {(tab) => (
            <TabItem
              key={tab.id}
              label={tab.label}
              num={tab.num}
              active={props.activeTab === tab.id}
              showNum={tab.num !== undefined && tab.num !== ''}
              onClick={() => props.onTabChange && props.onTabChange(tab.id)}
            />
          )}
        </For>
      </Show>
    </div>
  );
}
