import * as React from "react";
import Tabs from "./Tabs";
import TabItem from "./TabItem";

function TabsExample(props: any) {
  return (
    <Tabs ariaLabel="Account sections">
      <TabItem active>Overview</TabItem>
      <TabItem active={false}>Analytics</TabItem>
      <TabItem active={false}>Settings</TabItem>
    </Tabs>
  );
}

Object.assign(TabsExample, { Tabs, TabItem });

export default TabsExample;
