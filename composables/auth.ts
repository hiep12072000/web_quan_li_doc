import {
  createSharedComposable,
  StorageSerializers,
  useLocalStorage,
} from '@vueuse/core';
import dayjs from 'dayjs';

import { UserInfo } from '~/factory/types/auth';

export const useAuth = createSharedComposable(() => {
  const userInfo = useLocalStorage<(UserInfo & { expiredAt: string }) | null>(
    'auth',
    null,
    { serializer: StorageSerializers.object },
  );
  const accessToken = useLocalStorage<string>('auth.token', null, {
    serializer: StorageSerializers.string,
  });
  const resetUserInfo = () => {
    userInfo.value = null;
    accessToken.value = null;
  };

  return { userInfo, resetUserInfo, accessToken };
});

export const useAuthGuard = () => {
  const { userInfo } = useAuth();
  const route = useRoute();
  const router = useRouter();
  // for SSR only
  const appLoaded = ref(false);

  watch(
    () => route.name,
    () => {
      setTimeout(() => {
        appLoaded.value = true;
      }, 1000);

      if (
        userInfo.value === null ||
        dayjs(userInfo.value.expiredAt).isBefore(dayjs())
      ) {
        if (route.meta.auth === false) return;

        const redirect =
          route.query.redirect || encodeURIComponent(route.fullPath);
        router.push({ name: 'login', query: { redirect } });
        return;
      }

      if (userInfo.value) {
        // userInfo.value.expiredAt = dayjs().add(30, 'minutes').toISOString();

        if (route.meta.roles) {
          if (!(route.meta.roles as number[]).includes(userInfo.value!.role)) {
            console.error('forbidden');
            showError({
              statusCode: 403,
              statusMessage: 'forbidden',
              fatal: true,
            });
          }
        }
      }
    },
    { immediate: true, deep: true },
  );

  // const isProtectedPage = computed(() => {
  //   if (mode === 'exclude') return !routes.includes(String(route.name));
  //   if (mode === 'include') return routes.includes(String(route.name));
  // });

  return { appLoaded };
};
