import { useStore } from '@builder.io/mitosis';
import ToggleGroup from '../components/ToggleGroup.lite';
import Toggle from '../components/Toggle.lite';

export default function ToggleGroupExample() {
  const state = useStore({
    bold: true,
    italic: false,
    underline: false,
  });

  return (
    <ToggleGroup size="medium" ariaLabel="Text formatting">
      <Toggle
        size="medium"
        pressed={state.bold}
        ariaLabel="Bold"
        onPressedChange={() => {
          state.bold = !state.bold;
        }}
      >
        B
      </Toggle>
      <Toggle
        size="medium"
        pressed={state.italic}
        ariaLabel="Italic"
        onPressedChange={() => {
          state.italic = !state.italic;
        }}
      >
        I
      </Toggle>
      <Toggle
        size="medium"
        pressed={state.underline}
        ariaLabel="Underline"
        onPressedChange={() => {
          state.underline = !state.underline;
        }}
      >
        U
      </Toggle>
    </ToggleGroup>
  );
}
