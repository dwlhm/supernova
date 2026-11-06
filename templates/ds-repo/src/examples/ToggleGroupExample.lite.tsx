import ToggleGroup from '../components/ToggleGroup.lite';
import ToggleGroupItem from '../components/ToggleGroupItem.lite';

export default function ToggleGroupExample() {
  return (
    <ToggleGroup size="medium" ariaLabel="Text formatting">
      <ToggleGroupItem size="medium" pressed={true} ariaLabel="Bold">
        <span class="font-paragraph-weight-bold">B</span>
      </ToggleGroupItem>
      <ToggleGroupItem size="medium" pressed={false} ariaLabel="Italic">
        <span class="italic">I</span>
      </ToggleGroupItem>
      <ToggleGroupItem size="medium" pressed={false} ariaLabel="Underline">
        <span class="underline">U</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
