import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, ICON_PATHS } from './utils';

export interface BubbleChatMediaProps {
  kind?: 'image' | 'video';
  children?: any;
  className?: string;
}

export default function BubbleChatMedia(props: BubbleChatMediaProps) {
  useDefaultProps({
    kind: 'image',
    className: '',
  });

  return (
    <div class={cn('flex w-full flex-col items-start gap-1', props.className)}>
      <div class="flex h-32 w-60 flex-col items-center justify-center rounded-xl bg-background-subtle px-4 py-12 text-foreground-muted">
        <Show when={props.kind === 'video'}>
          <div class="flex h-10 w-10 flex-row items-center justify-center rounded-full bg-background-default p-1.5 shadow-md">
            <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-foreground-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d={ICON_PATHS.video} stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </Show>
        <Show when={props.kind === 'image'}>
          <svg aria-hidden="true" class="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d={ICON_PATHS.image} stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </Show>
      </div>
      {props.children}
    </div>
  );
}
