import { StorageSerializers, useLocalStorage } from '@vueuse/core';
import superjson from 'superjson';
import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client';

import type { AppRouter } from '~/server/trpc/routers';

export default defineNuxtPlugin(() => {
  const accessToken = useLocalStorage<string>('auth.token', null, {
    serializer: StorageSerializers.string,
  });
  const headers = computed(() => {
    if (accessToken.value === null) return {};
    return {
      Authorization: `Bearer ${accessToken.value}`,
    };
  });

  /**
   * createTRPCNuxtClient adds a `useQuery` composable
   * built on top of `useAsyncData`.
   */
  const client = createTRPCNuxtClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: '/api/trpc',
        headers() {
          return headers.value;
        },
      }),
    ],
  });

  return {
    provide: {
      client,
    },
  };
});
