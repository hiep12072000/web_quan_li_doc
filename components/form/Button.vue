<template>
  <button :class="`${colors} rounded px-4 py-2 font-semibold`">
    <div class="flex items-center">
      <slot />
    </div>
  </button>
</template>
<script setup lang="ts">
const props = defineProps({
  mode: {
    type: String as PropType<
      'default' | 'primary' | 'warning' | 'success' | 'danger'
    >,
    default: 'default',
  },
});

const colors = computed(() => {
  switch (props.mode) {
    case 'danger':
      return 'bg-red-200 hover:bg-red-300 text-red-600';
    case 'warning':
      return 'bg-yellow-200 hover:bg-yellow-300 text-yellow-600';
    case 'success':
      return 'bg-emerald-100 hover:bg-emerald-200 text-emerald-600';
    case 'primary':
      return 'bg-sky-200 hover:bg-sky-300 text-sky-600';
    default:
      return 'bg-gray-200 hover:bg-gray-300';
  }
});
</script>
