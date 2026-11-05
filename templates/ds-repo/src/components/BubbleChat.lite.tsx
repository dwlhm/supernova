import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, ICON_PATHS, bindControllerProps } from './utils';

export interface BubbleChatProps {
  direction?: 'incoming' | 'outgoing';
  type?: 'text' | 'file' | 'image' | 'video';
  messageState?: 'default' | 'error';
  text?: string;
  customText?: string;
  showCustomText?: boolean;
  showTime?: boolean;
  showStatus?: boolean;
  timeText?: string;
  statusText?: string;
  errorStatusText?: string;
  fileName?: string;
  fileMeta?: string;
  imageName?: string;
  imageMeta?: string;
  videoName?: string;
  videoMeta?: string;
  className?: string;
}

export default function BubbleChat(props: BubbleChatProps) {
  useDefaultProps({
    direction: 'incoming', type: 'text', messageState: 'default', text: 'Message',
    customText: 'Additional information', showCustomText: false, showTime: true, showStatus: false,
    timeText: '10:24 AM', statusText: 'Received', errorStatusText: 'Failed to send',
    fileName: 'document.pdf', fileMeta: '2.4 MB', imageName: 'image.jpg', imageMeta: '3.4 MB',
    videoName: 'video.mp4', videoMeta: '24.8 MB • 01:08', className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full', props.direction === 'outgoing' ? 'justify-end' : 'justify-start', props.className)}>
      <div class={cn('flex max-w-xs flex-col gap-1', props.direction === 'outgoing' && 'items-end')}>
        <div
          class={cn(
            'rounded-2xl p-4',
            props.messageState === 'error'
              ? 'border border-destructive-border bg-destructive-subtle text-destructive-foreground'
              : props.direction === 'outgoing'
                ? 'border border-border-default bg-background-default text-foreground-default'
                : 'bg-background-muted text-foreground-default'
          )}
        >
          <Show when={props.type === 'text'}><p class="whitespace-pre-wrap text-sm leading-relaxed">{props.text}</p></Show>
          <Show when={props.type === 'file'}>
            <div class="flex items-center gap-2">
              <svg aria-hidden="true" class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={ICON_PATHS.file} stroke-linecap="round" stroke-linejoin="round" /></svg>
              <span class="flex flex-col"><span class="truncate text-sm font-medium">{props.fileName}</span><span class={cn('text-xs', props.messageState === 'error' ? 'text-destructive-foreground' : 'text-foreground-muted')}>{props.fileMeta}</span></span>
            </div>
          </Show>
          <Show when={props.type === 'image' || props.type === 'video'}>
            <div class="flex flex-col gap-2">
              <div class={cn('flex h-32 w-60 items-center justify-center rounded-xl bg-background-subtle', props.messageState === 'error' ? 'text-destructive-foreground' : 'text-foreground-muted')}>
                <svg aria-hidden="true" class="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d={props.type === 'image' ? ICON_PATHS.image : ICON_PATHS.video} stroke-linecap="round" stroke-linejoin="round" /></svg>
              </div>
              <span class="flex flex-col"><span class="truncate text-sm font-medium">{props.type === 'image' ? props.imageName : props.videoName}</span><span class={cn('text-xs', props.messageState === 'error' ? 'text-destructive-foreground' : 'text-foreground-muted')}>{props.type === 'image' ? props.imageMeta : props.videoMeta}</span></span>
            </div>
          </Show>
          <Show when={props.showCustomText}><p class={cn('mt-2 text-xs', props.messageState === 'error' ? 'text-destructive-foreground' : 'text-foreground-muted')}>{props.customText}</p></Show>
        </div>
        <div class="flex w-full items-center justify-between gap-2">
          <Show when={props.showTime}><span class={cn('text-xs', props.messageState === 'error' ? 'text-destructive-foreground' : 'text-foreground-muted')}>{props.timeText}</span></Show>
          <Show when={props.showStatus || props.messageState === 'error'}>
            <span class={cn('text-xs', props.messageState === 'error' ? 'text-destructive-foreground' : 'text-foreground-muted')}>
              {props.messageState === 'error' ? props.errorStatusText : props.statusText}
            </span>
          </Show>
        </div>
      </div>
    </div>
  );
}
