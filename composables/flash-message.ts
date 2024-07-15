import { createEventHook, createSharedComposable } from '@vueuse/core';
import uniqueId from 'lodash/uniqueId';

const DEFAULT_AUTO_CLOSE = 10000; // 10s

type Mode = 'danger' | 'warning' | 'info' | 'success';
type MessageData = { mode: Mode; message: string; autoclose?: number };

const showFlashMessageEvent = createEventHook<MessageData>();

export const useFlashMessage = createSharedComposable(() => {
  const messages = ref<(MessageData & { id: string })[]>([]);

  const close = (id?: string) => {
    if (id) {
      messages.value = messages.value.filter((m) => m.id !== id);
    } else {
      messages.value.pop();
    }
  };

  showFlashMessageEvent.on((opt: MessageData) => {
    const messageData = {
      id: uniqueId('flash_'),
      ...opt,
      autoclose: opt.autoclose || DEFAULT_AUTO_CLOSE,
    };
    messages.value.push(messageData);

    setTimeout(() => close(messageData.id), messageData.autoclose);
  });

  return { messages, close };
});

export const useDisplayFlashMessage = showFlashMessageEvent.trigger;
