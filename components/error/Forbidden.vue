<template>
  <div class="mb-12 text-center">
    <img
      src="/error/hand.png"
      alt="forbidden"
      class="mb-4 inline-block max-h-[20rem] max-w-[20rem]"
    />
    <div class="font-semibold">Bạn không có quyền truy cập trang này</div>
  </div>
  <div
    class="flex cursor-pointer items-center justify-center text-sky-600 hover:underline"
    @click="$emit('gotoLogin')"
  >
    <Icon name="fa6-solid:user" class="mr-2" />
    Đăng nhập bằng tài khoản khác
  </div>
  <div class="text-center text-sm text-zinc-600">hoặc</div>
</template>
<script setup lang="ts">
defineEmits(['gotoLogin']);
</script>
