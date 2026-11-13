import { useDefaultProps } from '@builder.io/mitosis';
import { cn, ICON_PATHS } from './utils';

export interface BubbleChatFileProps {
  children?: any;
  className?: string;
}

export default function BubbleChatFile(props: BubbleChatFileProps) {
  useDefaultProps({
    className: '',
  });

  return (
    <div class={cn('flex items-center gap-2', props.className)}>
      <svg aria-hidden="true" class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d={ICON_PATHS.file} stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <div class="flex flex-col items-start gap-0.5">
        {props.children}
      </div>
    </div>
  );
}
