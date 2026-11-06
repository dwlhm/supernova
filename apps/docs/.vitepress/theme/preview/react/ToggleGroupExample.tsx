import * as React from "react";
import ToggleGroup from "./ToggleGroup";
import ToggleGroupItem from "./ToggleGroupItem";

function ToggleGroupExample(props: any) {
  return (
    <ToggleGroup size="medium" ariaLabel="Text formatting">
      <ToggleGroupItem size="medium" ariaLabel="Bold" pressed>
        <span className="font-paragraph-weight-bold">B</span>
      </ToggleGroupItem>
      <ToggleGroupItem size="medium" ariaLabel="Italic" pressed={false}>
        <span className="italic">I</span>
      </ToggleGroupItem>
      <ToggleGroupItem size="medium" ariaLabel="Underline" pressed={false}>
        <span className="underline">U</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

Object.assign(ToggleGroupExample, { ToggleGroup, ToggleGroupItem });

export default ToggleGroupExample;
