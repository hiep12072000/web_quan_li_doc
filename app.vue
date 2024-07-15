<template>
  <flash-message />
  <NuxtLayout v-if="appLoaded">
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
  <loading-screen v-if="!appLoaded" />
</template>
<script setup lang="ts">
import { useAuthGuard } from './composables/auth';

useHead({
  htmlAttrs: { lang: 'vi', class: 'bg-zinc-100' },
  meta: [
    { charset: 'utf-8' },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, user-scalable=0',
    },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '76x76', href: '/favicon.ico' },
    { rel: 'apple-touch-startup-image', href: '/pwa-512x512.png' },
  ],
  title: 'Hệ thống quản lý văn bản',
});

const { appLoaded } = useAuthGuard();
</script>
<style>
.page-leave-active {
  transition: all 0.15s;
}

.page-enter-active {
  transition: all 0.15s 0.15s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.page-enter-from {
  transform: scale(0.9);
}

.page-leave-to {
  transform: translateY(-10%);
}
</style>
