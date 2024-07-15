<template>
  <div class="mt-[20vh]">
    <div class="text-center">
      <img src="/logo.png" alt="logo" class="inline-block h-64 w-64" />
    </div>
    <div
      class="mx-auto w-96 rounded border border-sky-200 bg-white px-8 pb-6 pt-4 shadow"
    >
      <h5 class="-mx-4 mb-4 border-b border-zinc-200 px-4 text-lg font-bold">
        Đăng nhập
      </h5>
      <form @submit.prevent="signIn">
        <form-input
          v-model="credentials.username"
          label="Tên đăng nhập:"
          type="text"
          placeholder="4 đến 20 ký tự"
          name="username"
          class="mb-4"
          :error="error?.username"
        />
        <form-input
          v-model="credentials.password"
          label="Mật khẩu:"
          type="password"
          placeholder="8 đến 20 ký tự"
          name="password"
          :error="error?.password"
        />
        <form-error :error="error?.submit" class="mt-2" />
        <div class="mt-4 text-right">
          <form-button mode="primary">
            <Icon name="fa6-solid:door-closed" class="mr-2" />
            Đăng nhập
          </form-button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';

import { messages } from '~/factory/constants';

definePageMeta({
  title: 'Đăng nhập',
  auth: false,
  layout: false,
});

const { $client } = useNuxtApp();
const router = useRouter();
const route = useRoute();

const credentials = reactive({ username: '', password: '' });
const { userInfo, accessToken } = useAuth();

const { executer: signIn, error } = useMutationErrorHandler(async () => {
  const authInfo = await $client.auth.login.mutate(credentials);
  if (authInfo) {
    userInfo.value = {
      ...authInfo.user,
      expiredAt: dayjs().add(60, 'minutes').toISOString(),
    };
    accessToken.value = authInfo.token;
    if (route.query.redirect) {
      router.push(decodeURIComponent(route.query.redirect as string));
    } else {
      router.push('/');
    }
  } else {
    throw { callbackErrors: { submit: [messages.userNotExist] } };
  }
});
</script>
