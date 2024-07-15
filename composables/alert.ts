import { createEventHook, createSharedComposable } from '@vueuse/core';

type Type = 'confirm' | 'info' | 'success';
type MessageData = {
  type: Type;
  message: string;
  title: string;
  show: boolean;
};

const displayAlertEvent = createEventHook<Omit<MessageData, 'show'>>();
const okButtonEvent = createEventHook<boolean>();

export const useAlert = createSharedComposable(() => {
  const data = reactive<MessageData>({
    show: false,
    type: 'info',
    message: '',
    title: '',
  });

  const close = () => {
    data.show = false;
  };

  displayAlertEvent.on((opt: Omit<MessageData, 'show'>) => {
    data.message = opt.message;
    data.title = opt.title;
    data.type = opt.type;
    data.show = true;
  });

  return { data, close, onConfirmed: okButtonEvent.trigger };
});

export const useDisplayAlert = displayAlertEvent.trigger;

export const useDisplayConfirm = async (
  opt: Omit<MessageData, 'show' | 'type'>,
) => {
  displayAlertEvent.trigger({ ...opt, type: 'confirm' });
  return new Promise<boolean>((resolve) => okButtonEvent.on(resolve));
};
