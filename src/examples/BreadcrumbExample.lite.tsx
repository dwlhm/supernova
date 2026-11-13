import { Show, useStore } from '@builder.io/mitosis';
import Breadcrumb from '../components/Breadcrumb.lite';
import BreadcrumbItem from '../components/BreadcrumbItem.lite';
import BreadcrumbEllipsis from '../components/BreadcrumbEllipsis.lite';

export default function BreadcrumbExample() {
  const state = useStore({
    expanded: false,
  });

  return (
    <div class="flex flex-col items-start gap-2">
      <Breadcrumb>
        <BreadcrumbItem href="#home">Home</BreadcrumbItem>
        <Show when={!state.expanded}>
          <BreadcrumbEllipsis />
        </Show>
        <Show when={state.expanded}>
          <BreadcrumbItem href="#workspace">Workspace</BreadcrumbItem>
        </Show>
        <BreadcrumbItem href="#components">Components</BreadcrumbItem>
        <BreadcrumbItem current={true} isLast={true}>
          Breadcrumb
        </BreadcrumbItem>
      </Breadcrumb>
      <button
        type="button"
        class="text-xs font-medium text-primary-default hover:underline"
        onClick={() => {
          state.expanded = !state.expanded;
        }}
      >
        {state.expanded ? 'Collapse middle items' : 'Expand full path'}
      </button>
    </div>
  );
}
