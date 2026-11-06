import Tabs from '../components/Tabs.lite';
import TabItem from '../components/TabItem.lite';

export default function TabsExample() {
  return (
    <Tabs ariaLabel="Account sections">
      <TabItem active={true}>Overview</TabItem>
      <TabItem active={false}>Analytics</TabItem>
      <TabItem active={false}>Settings</TabItem>
    </Tabs>
  );
}
