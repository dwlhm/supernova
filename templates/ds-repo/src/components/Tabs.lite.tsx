import { useStore, useDefaultProps, For } from '@builder.io/mitosis';
import { cn } from './utils';
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
  onTabChange?: (id: string) => void;
}

export default function Tabs(props: TabsProps) {
  useDefaultProps({
    tabs: [],
    activeTab: '',
    ariaLabel: 'Tabs',
    className: '',
  });

  const state = useStore({
    handleTabChange(id: string) {
      if (props.onTabChange) {
        props.onTabChange(id);
      }
    },
  });

  return (
    <div
      role="tablist"
      aria-label={props.ariaLabel}
      class={cn(
        'inline-flex h-9 items-center rounded-rounded-xl bg-components-tabs-all-color-container-background-default p-1',
        props.className
      )}
    >
      <For each={props.tabs}>
        {(tab) => (
          <TabItem
            key={tab.id}
            label={tab.label}
            num={tab.num}
            active={props.activeTab === tab.id}
            showNum={tab.num !== undefined && tab.num !== ''}
            onClick={() => state.handleTabChange(tab.id)}
          />
        )}
      </For>
    </div>
  );
}
