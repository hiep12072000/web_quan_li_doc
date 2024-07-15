<template>
  <div class="mx-auto max-w-[36rem] px-12">
    <form class="space-y-2" @submit.prevent="changePassword">
      <form-input
        v-model="form.oldPassword"
        name="password"
        type="password"
        label="Mật khẩu hiện tại:"
        placeholder="8 đến 20 ký tự"
        required
        :error="error?.password"
      />
      <form-input
        v-model="form.password"
        name="password"
        type="password"
        label="Mật khẩu:"
        placeholder="8 đến 20 ký tự"
        required
        :error="error?.password"
      />
      <form-input
        v-model="form.repeatPassword"
        name="repeatPassword"
        type="password"
        label="Nhập lại mật khẩu:"
        placeholder="8 đến 20 ký tự"
        required
        :error="error?.repeatPassword"
      />
      <form-button mode="primary" class="float-right !mt-8">
        <Icon name="fa6-solid:floppy-disk" class="mr-2" />Thay đổi
      </form-button>
    </form>
  </div>
</template>
<script setup lang="ts">
import { messages } from '~/factory/constants';

useSetHeader('Đổi mật khẩu');

const { $client } = useNuxtApp();

const form = reactive({
  oldPassword: '',
  password: '',
  repeatPassword: '',
});

const { executer: changePassword, error } = useMutationErrorHandler(
  async () => {
    if (form.password !== form.repeatPassword) {
      throw { callbackErrors: { repeatPassword: [messages.passwordNotMatch] } };
    }

    const success = await $client.user.changePassword.mutate({
      password: form.password,
      oldPassword: form.oldPassword,
    });
    if (success) {
      form.oldPassword = form.password = form.repeatPassword = '';
      useDisplayFlashMessage({
        mode: 'success',
        message: messages.changePasswordSuccess,
      });
    }
  },
);
</script>
