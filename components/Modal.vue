<template>
  <transition
    enter-from-class="opacity-0 -translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-4"
  >
    <div
      v-if="show"
      class="absolute left-0 top-0 z-30 h-screen w-screen text-center transition-all"
    >
      <div
        class="absolute h-full w-full bg-white/40 backdrop-blur-sm"
        @click="$emit('update:show', false)"
      ></div>
      <div
        class="relative z-40 mt-16 inline-block w-[32rem] rounded border border-sky-300 bg-white px-8 py-6 text-left shadow-md"
      >
        <h5
          class="-mx-4 -mt-2 mb-4 border-b border-zinc-200 px-4 text-lg font-semibold"
        >
          {{ title }}
        </h5>
        <slot />
        <div class="mt-4 space-x-2 text-right">
          <slot name="button" />
          <form-button type="button" @click="$emit('update:show', false)">
            <Icon name="humbleicons:arrow-go-back" class="mr-2" />Hủy
          </form-button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: '' },
});
defineEmits(['update:show']);
</script>
