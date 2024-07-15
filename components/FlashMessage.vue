<template>
  <div class="absolute top-4 z-50 w-screen">
    <transition-group
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-for="m of messages"
        :key="m.id"
        class="relative mx-auto mb-2 flex w-fit min-w-[32rem] max-w-4xl items-center justify-center rounded border py-2 pl-4 pr-8 transition-all"
        :class="getClass(m.mode)"
      >
        {{ m.message }}
        <Icon
          name="ci:close-sm"
          class="absolute right-2 cursor-pointer"
          @click="close(m.id)"
        />
      </div>
    </transition-group>
  </div>
</template>
<script setup lang="ts">
const { messages, close } = useFlashMessage();
const getClass = (mode: 'danger' | 'warning' | 'info' | 'success') => {
  switch (mode) {
    case 'danger':
      return 'bg-red-200 border-red-400 text-red-600';
    case 'warning':
      return 'bg-yellow-200 border-yellow-400 text-yellow-600';
    case 'info':
      return 'bg-sky-200 border-sky-400 text-sky-600';
    case 'success':
      return 'bg-emerald-100 border-emerald-300 text-emerald-600';
    default:
      return 'bg-zinc-200 border-zinc-400';
  }
};
</script>
