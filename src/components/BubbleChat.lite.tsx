import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface BubbleChatProps {
  direction?: 'Incoming' | 'Outgoing';
  type?: 'Text' | 'File' | 'Image' | 'Video';
  messageState?: 'Default' | 'Error';
  showTime?: boolean;
  showStatus?: boolean;
  showCustomText?: boolean;
  customText?: string;
  textMessage?: string;
  fileName?: string;
  fileMetadata?: string;
  imageName?: string;
  imageMetadata?: string;
  videoName?: string;
  videoMetadata?: string;
  incomingStatusText?: string;
  outgoingStatusText?: string;
  errorStatusText?: string;
  incomingTimeText?: string;
  outgoingTimeText?: string;
  className?: string;
  children?: any;
}

export default function BubbleChat(props: BubbleChatProps) {
  useDefaultProps({
    direction: 'Incoming',
    type: 'Text',
    messageState: 'Default',
    showTime: true,
    showStatus: false,
    showCustomText: false,
    customText: 'Additional information',
    textMessage: 'Message',
    fileName: 'document.pdf',
    fileMetadata: '2.4 MB',
    imageName: 'image.jpg',
    imageMetadata: '3.4 MB',
    videoName: 'video.mp4',
    videoMetadata: '24.8 MB • 01:08',
    incomingStatusText: 'Received',
    outgoingStatusText: 'Delivered',
    errorStatusText: 'Failed to send',
    incomingTimeText: '10:24 AM',
    outgoingTimeText: '10:26 AM',
    className: '',
  });

  const state = useStore({
    get isOutgoing() {
      return props.direction === 'Outgoing';
    },
    get isError() {
      return props.messageState === 'Error';
    },
    get isMedia() {
      return props.type === 'Image' || props.type === 'Video';
    },
    get showStatusLine() {
      return state.isError || !!props.showStatus;
    },
    get showMetaRow() {
      return !!props.showTime || state.showStatusLine;
    },
    get bubbleClasses() {
      if (state.isError) {
        return 'border border-components-bubble-chat-error-color-container-border-default bg-components-bubble-chat-error-color-container-background-default';
      }
      if (state.isOutgoing) {
        return 'border border-components-bubble-chat-outgoing-color-color-border-default bg-components-bubble-chat-outgoing-color-container-background-default';
      }
      return 'bg-components-bubble-chat-incoming-color-container-background-default';
    },
    get widthClasses() {
      if (props.type === 'Text') {
        return 'max-w-xs';
      }
      return 'w-60';
    },
    get messageClasses() {
      if (state.isError) {
        return 'text-components-bubble-chat-error-color-message-foreground-default';
      }
      if (state.isOutgoing) {
        return 'text-components-bubble-chat-outgoing-color-message-foreground-default';
      }
      return 'text-components-bubble-chat-incoming-color-message-foreground-default';
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
    get statusClasses() {
      if (state.isError) {
        return 'text-components-bubble-chat-error-color-status-foreground-default';
      }
      return state.metaClasses;
    },
    get displayTime() {
      return state.isOutgoing ? props.outgoingTimeText : props.incomingTimeText;
    },
    get displayStatus() {
      if (state.isError) {
        return props.errorStatusText;
      }
      return state.isOutgoing ? props.outgoingStatusText : props.incomingStatusText;
    },
    get attachmentName() {
      if (props.type === 'File') {
        return props.fileName;
      }
      if (props.type === 'Image') {
        return props.imageName;
      }
      return props.videoName;
    },
    get attachmentMetadata() {
      if (props.type === 'File') {
        return props.fileMetadata;
      }
      if (props.type === 'Image') {
        return props.imageMetadata;
      }
      return props.videoMetadata;
    },
  });

  return (
    <div
      class={cn(
        'flex w-full flex-col gap-1',
        state.isOutgoing ? 'items-end' : 'items-start',
        props.className
      )}
    >
      <div
        class={cn(
          'flex flex-col gap-1 rounded-rounded-2xl',
          state.isOutgoing ? 'px-4 py-4' : 'px-4 py-3',
          state.widthClasses,
          state.bubbleClasses
        )}
      >
        <Show when={props.type === 'Text'}>
          <p class={cn('whitespace-pre-wrap text-sm', state.messageClasses)}>{props.textMessage}</p>
        </Show>

        <Show when={props.type === 'File'}>
          <div class="flex w-full items-center gap-2">
            <svg
              aria-hidden="true"
              class={cn('h-5 w-5 shrink-0', state.messageClasses)}
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
            <span class="flex min-w-0 flex-col gap-0-5">
              <span class={cn('truncate text-sm font-medium', state.messageClasses)}>
                {props.fileName}
              </span>
              <span class={cn('truncate text-xs', state.metaClasses)}>{props.fileMetadata}</span>
            </span>
          </div>
        </Show>

        <Show when={state.isMedia}>
          <div class="flex w-full flex-col gap-2">
            <div class="flex w-full items-center justify-center rounded-rounded-xl bg-opacity-black-5 px-4 py-12 text-foreground-muted">
              <Show when={props.type === 'Image'}>
                <svg
                  aria-hidden="true"
                  class="h-8 w-8 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke-linejoin="round" />
                  <path d="m21 15-5-5L5 21" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                </svg>
              </Show>
              <Show when={props.type === 'Video'}>
                <svg
                  aria-hidden="true"
                  class="h-8 w-8 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke-linejoin="round" />
                  <path d="m10 9 5 3-5 3V9Z" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </Show>
            </div>
            <span class="flex min-w-0 flex-col gap-0-5">
              <span class={cn('truncate text-sm font-medium', state.messageClasses)}>
                {state.attachmentName}
              </span>
              <span class={cn('truncate text-xs', state.metaClasses)}>
                {state.attachmentMetadata}
              </span>
            </span>
          </div>
        </Show>

        <Show when={props.showCustomText}>
          <p class={cn('whitespace-pre-wrap text-xs', state.metaClasses)}>{props.customText}</p>
        </Show>
      </div>

      <Show when={state.showMetaRow}>
        <div class="flex items-center gap-1">
          <Show when={props.showTime}>
            <span class={cn('text-xs', state.metaClasses)}>{state.displayTime}</span>
          </Show>
          <Show when={state.showStatusLine}>
            <span class={cn('flex items-center gap-1 text-xs', state.statusClasses)}>
              <Show when={state.isError}>
                <svg
                  aria-hidden="true"
                  class="h-3 w-3 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5" stroke-linecap="round" />
                  <path d="M12 16.5h.01" stroke-linecap="round" />
                </svg>
              </Show>
              {state.displayStatus}
            </span>
          </Show>
        </div>
      </Show>
    </div>
  );
}
