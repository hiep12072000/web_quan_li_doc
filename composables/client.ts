import { createGlobalState, watchThrottled } from '@vueuse/core';

type QueryError = Ref<{ data?: { httpStatus: number } | null } | null>;

const useGlobalErrorArray = createGlobalState(() => {
  const errors = ref<QueryError[]>([]);
  const addError = (error: QueryError) => {
    if (errors.value.indexOf(error) === -1) {
      errors.value.push(error);
    }
  };
  const removeError = (error: QueryError) => {
    errors.value = errors.value.filter((err) => err !== error);
  };

  const router = useRouter();
  const route = useRoute();
  const { resetUserInfo } = useAuth();
  watchThrottled(
    errors,
    () => {
      for (const error of errors.value) {
        if (error.value && error.value.data) {
          if (error.value.data.httpStatus === 401) {
            useDisplayFlashMessage({
              mode: 'danger',
              message:
                'Thời hạn đăng nhập đã kết thúc, vui lòng đăng nhập lại để tiếp tục sử dụng!',
            });
            const redirect =
              route.query.redirect || encodeURIComponent(route.fullPath);
            router.push({ name: 'login', query: { redirect } });
            resetUserInfo();
            return;
          } else if ([403, 404, 500].includes(error.value.data.httpStatus)) {
            showError({
              statusCode: error.value.data.httpStatus,
              statusMessage: String(error.value.data.httpStatus),
              fatal: true,
            });
          }
        }
      }
    },
    { immediate: true, deep: true, throttle: 300 },
  );

  return { addError, removeError, errors };
});

export const useErrorHandler = (
  error: Ref<{ data?: { httpStatus: number } | null } | null>,
) => {
  const { addError, removeError } = useGlobalErrorArray();
  addError(error);
  onUnmounted(() => removeError(error));
};

export const useMutationErrorHandler = <X>(
  callback: (args: X) => void | Promise<void>,
) => {
  const isSubmitting = ref(false);
  const error = ref<null | Record<string, string[]>>(null);
  const executer = async (args: X) => {
    if (isSubmitting.value) return;
    try {
      isSubmitting.value = true;
      await callback(args);
      error.value = null;
    } catch (err: any) {
      if (err?.data?.zodError?.fieldErrors) {
        error.value = err?.data?.zodError?.fieldErrors;
      } else if (err?.callbackErrors) {
        error.value = err?.callbackErrors;
      } else if ([401, 403, 404, 500].includes(err?.data?.httpStatus)) {
        showError({
          statusCode: err.data.httpStatus,
          statusMessage: String(err.data.httpStatus),
          fatal: true,
        });
      } else if (err?.shape?.message) {
        useDisplayFlashMessage({
          mode: 'danger',
          message: err?.shape?.message,
        });
        error.value = null;
      } else {
        useDisplayFlashMessage({
          mode: 'danger',
          message: 'Lỗi hệ thống',
        });
        error.value = null;
      }
    }
    isSubmitting.value = false;
  };

  return { error, executer };
};
