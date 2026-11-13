import { useStore } from '@builder.io/mitosis';
import BubbleChat from '../components/BubbleChat.lite';
import BubbleChatFile from '../components/BubbleChatFile.lite';
import BubbleChatMedia from '../components/BubbleChatMedia.lite';
import BubbleChatFooter from '../components/BubbleChatFooter.lite';

export default function BubbleChatExample() {
  const state = useStore({
    resent: false,
  });

  return (
    <div class="flex w-full flex-col gap-3">
      <BubbleChat direction="incoming">
        <p class="whitespace-pre-wrap text-sm font-normal">Hello, can you share the latest invoice?</p>
        <BubbleChatFooter>
          <span>10:24 AM</span>
        </BubbleChatFooter>
      </BubbleChat>
      <BubbleChat direction="outgoing">
        <BubbleChatFile>
          <span class="truncate text-sm font-medium">invoice-q3.pdf</span>
          <span class="text-xs font-normal text-foreground-muted">2.4 MB</span>
        </BubbleChatFile>
        <BubbleChatFooter align="between">
          <span>Delivered</span>
          <span>10:26 AM</span>
        </BubbleChatFooter>
      </BubbleChat>
      <BubbleChat direction="incoming">
        <BubbleChatMedia kind="video">
          <span class="truncate text-sm font-medium">walkthrough.mp4</span>
          <span class="text-xs font-normal text-foreground-muted">24.8 MB • 01:08</span>
        </BubbleChatMedia>
        <BubbleChatFooter>
          <span>10:27 AM</span>
        </BubbleChatFooter>
      </BubbleChat>
      <BubbleChat direction="outgoing" state={state.resent ? 'default' : 'error'}>
        <p class="whitespace-pre-wrap text-sm font-normal">Let me know once you review it.</p>
        <BubbleChatFooter align="between" className={state.resent ? '' : 'text-destructive-default'}>
          <button type="button" class="cursor-pointer text-xs font-medium underline" onClick={() => { state.resent = !state.resent; }}>
            {state.resent ? 'Delivered (Undo)' : 'Failed to send • Tap to retry'}
          </button>
          <span>10:28 AM</span>
        </BubbleChatFooter>
      </BubbleChat>
    </div>
  );
}
