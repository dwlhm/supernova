import { useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface ChartLegendProps {
  className?: string;
  children?: any;
}

export default function ChartLegend(props: ChartLegendProps) {
  useDefaultProps({
    className: '',
  });

  return (
    <div
      data-ctrl={typeof bindControllerProps}
      class={cn('flex flex-row flex-wrap items-center justify-start gap-4', props.className)}
    >
      {props.children}
    </div>
  );
}
