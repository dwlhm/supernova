import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

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
    direction: 'incoming',
    type: 'text',
    messageState: 'default',
    text: 'Message',
    customText: 'Additional information',
    showCustomText: false,
    showTime: true,
    showStatus: false,
    timeText: '10:24 AM',
    statusText: 'Received',
    errorStatusText: 'Failed to send',
    fileName: 'document.pdf',
    fileMeta: '2.4 MB',
    imageName: 'image.jpg',
    imageMeta: '3.4 MB',
    videoName: 'video.mp4',
    videoMeta: '24.8 MB',
    className: '',
  });

  const state = useStore({
    get isOutgoing() {
      return props.direction === 'outgoing';
    },
    get isError() {
      return props.messageState === 'error';
    },
    get bubbleClasses() {
      if (state.isError) {
        return 'bg-components-bubble-chat-error-color-container-background-default border border-components-bubble-chat-error-color-container-border-default text-components-bubble-chat-error-color-message-foreground-default';
      }
      if (state.isOutgoing) {
        return 'bg-components-bubble-chat-outgoing-color-container-background-default text-components-bubble-chat-outgoing-color-message-foreground-default';
      }
      return 'bg-components-bubble-chat-incoming-color-container-background-default text-components-bubble-chat-incoming-color-message-foreground-default';
    },
    get metaClasses() {
      if (state.isError) {
        return 'text-components-bubble-chat-error-color-metadata-foreground-default';
      }
      if (state.isOutgoing) {
        return 'text-components-bubble-chat-outgoing-color-timestamp-foreground-default';
      }
      return 'text-components-bubble-chat-incoming-color-timestamp-foreground-default';
    },
    get previewMetaClasses() {
      if (state.isError) {
        return 'text-components-bubble-chat-error-color-metadata-foreground-default';
      }
      return 'text-foreground-muted';
    },
    get displayStatus() {
      return state.isError ? props.errorStatusText : props.statusText;
    },
  });

  return (
    <div
      class={cn('flex w-full', state.isOutgoing ? 'justify-end' : 'justify-start', props.className)}
    >
      <div class={cn('flex max-w-xs flex-col gap-1', state.isOutgoing && 'items-end')}>
        <div class={cn('rounded-rounded-2xl px-4 py-3', state.bubbleClasses)}>
          <Show when={props.type === 'text'}>
            <p class="whitespace-pre-wrap text-sm leading-relaxed">{props.text}</p>
          </Show>
          <Show when={props.type === 'file'}>
            <div class="flex items-center gap-2">
              <svg
                aria-hidden="true"
                class="h-5 w-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="M14 3v5h5" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2Z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="flex flex-col">
                <span class="truncate text-sm font-medium">{props.fileName}</span>
                <span class={cn('text-xs', state.previewMetaClasses)}>{props.fileMeta}</span>
              </span>
            </div>
          </Show>
          <Show when={props.type === 'image' || props.type === 'video'}>
            <div class="flex flex-col gap-2">
              <div
                class={cn(
                  'flex h-32 w-60 items-center justify-center rounded-rounded-xl bg-background-muted',
                  state.previewMetaClasses
                )}
              >
                <svg
                  aria-hidden="true"
                  class="h-8 w-8 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <Show when={props.type === 'image'}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                  </Show>
                  <path d="m21 15-5-5L5 21" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                </svg>
              </div>
              <span class="flex flex-col">
                <span class="truncate text-sm font-medium">
                  {props.type === 'image' ? props.imageName : props.videoName}
                </span>
                <span class={cn('text-xs', state.previewMetaClasses)}>
                  {props.type === 'image' ? props.imageMeta : props.videoMeta}
                </span>
              </span>
            </div>
          </Show>
          <Show when={props.showCustomText}>
            <p class={cn('mt-2 text-xs', state.previewMetaClasses)}>{props.customText}</p>
          </Show>
        </div>
        <div class="flex items-center gap-1">
          <Show when={props.showTime}>
            <span class={cn('text-xs', state.metaClasses)}>{props.timeText}</span>
          </Show>
          <Show when={props.showStatus || state.isError}>
            <span
              class={cn(
                'text-xs',
                state.isError
                  ? 'text-components-bubble-chat-error-color-status-foreground-default'
                  : state.metaClasses
              )}
            >
              {state.displayStatus}
            </span>
          </Show>
        </div>
      </div>
    </div>
  );
}
