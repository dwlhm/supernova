import { useStore } from '@builder.io/mitosis';
import Tabs from '../components/Tabs.lite';
import TabItem from '../components/TabItem.lite';

export default function TabsExample() {
  const state = useStore({
    activeTab: 'overview',
  });

  return (
    <Tabs ariaLabel="Account sections">
      <TabItem
        active={state.activeTab === 'overview'}
        onClick={() => {
          state.activeTab = 'overview';
        }}
      >
        Overview
      </TabItem>
      <TabItem
        active={state.activeTab === 'activity'}
        onClick={() => {
          state.activeTab = 'activity';
        }}
      >
        Activity
      </TabItem>
      <TabItem
        active={state.activeTab === 'settings'}
        onClick={() => {
          state.activeTab = 'settings';
        }}
      >
        Settings
      </TabItem>
    </Tabs>
  );
}
