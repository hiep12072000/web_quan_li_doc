import { createEventHook, createSharedComposable } from '@vueuse/core';

const headerEvent = createEventHook<string>();

export const useHeader = createSharedComposable(() => {
  const header = ref('header');
  headerEvent.on((text: string) => {
    header.value = text;
  });
  return { header };
});

export const useSetHeader = headerEvent.trigger;
