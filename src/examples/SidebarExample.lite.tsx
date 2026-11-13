import { Show, useStore } from '@builder.io/mitosis';
import Sidebar from '../components/Sidebar.lite';
import SidebarBrand from '../components/SidebarBrand.lite';
import SidebarNav from '../components/SidebarNav.lite';
import SidebarSection from '../components/SidebarSection.lite';
import SidebarAccount from '../components/SidebarAccount.lite';
import MainMenu from '../components/MainMenu.lite';

export default function SidebarExample() {
  const state = useStore({ expanded: true, activeItem: 'dashboard' });

  return (
    <div class="flex flex-col items-start gap-3">
      <button
        type="button"
        class="rounded-md border border-border-default bg-background-default px-2.5 py-1 text-xs font-medium text-foreground-default hover:bg-background-muted"
        onClick={() => { state.expanded = !state.expanded; }}
      >
        {state.expanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
      </button>
      <Sidebar expanded={state.expanded}>
        <SidebarBrand expanded={state.expanded}>
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-default text-xs font-semibold text-primary-foreground" aria-hidden="true">K</span>
          <Show when={state.expanded}>
            <span class="truncate text-sm font-semibold text-foreground-default">Komerce</span>
          </Show>
        </SidebarBrand>
        <SidebarNav expanded={state.expanded}>
          <SidebarSection label="Management" expanded={state.expanded}>
            <MainMenu active={state.activeItem === 'dashboard'} showLabel={state.expanded} showTrailingIcon={state.expanded} onClick={() => { state.activeItem = 'dashboard'; }}>
              Dashboard
            </MainMenu>
            <MainMenu active={state.activeItem === 'orders'} showLabel={state.expanded} showTrailingIcon={false} showBadge={state.expanded} badgeLabel="12" onClick={() => { state.activeItem = 'orders'; }}>
              Orders
            </MainMenu>
            <MainMenu active={state.activeItem === 'products'} showLabel={state.expanded} showTrailingIcon={state.expanded} onClick={() => { state.activeItem = 'products'; }}>
              Products
            </MainMenu>
          </SidebarSection>
        </SidebarNav>
        <SidebarAccount expanded={state.expanded}>
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-subtle text-xs font-medium text-foreground-muted" aria-hidden="true">LM</span>
          <Show when={state.expanded}>
            <span class="flex min-w-0 flex-1 flex-col">
              <span class="truncate text-sm font-semibold text-foreground-default">Workspace</span>
              <span class="truncate text-xs font-normal text-foreground-muted">team@komerce.id</span>
            </span>
          </Show>
        </SidebarAccount>
      </Sidebar>
    </div>
  );
}
