<template>
  <div class="h-screen w-screen overflow-auto bg-zinc-100 p-12">
    <div
      class="mx-auto max-w-[80rem] rounded border border-sky-300 bg-white px-8 py-6 shadow"
    >
      <error-system-error v-if="error.statusCode === 500" />
      <error-not-found v-if="error.statusCode === 404" />
      <error-forbidden
        v-if="error.statusCode === 403"
        @goto-login="gotoLogin"
      />
      <div
        class="flex cursor-pointer items-center justify-center text-sky-600 hover:underline"
        @click="gotoTopPage"
      >
        <Icon name="fa6-solid:house" class="mr-2" />
        Trở về trang chủ
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  error: {
    type: Object as PropType<{
      url: string;
      statusCode: number;
      statusMessage: string;
      message: string;
      description: string;
      data: any;
    }>,
    required: true,
  },
});

console.error(props.error);

const gotoTopPage = () => clearError({ redirect: '/' });
const gotoLogin = () =>
  clearError({
    redirect: `/login?redirect=${encodeURIComponent(props.error.url)}`,
  });
</script>
