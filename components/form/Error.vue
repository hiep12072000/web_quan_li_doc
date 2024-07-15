<template>
  <div v-if="(error instanceof Array && error.length > 0) || error !== ''">
    <div
      v-for="(msg, i) of error instanceof Array ? error : [error]"
      :key="i"
      class="text-sm text-red-500"
    >
      {{ msg }}
    </div>
  </div>
</template>
<script lang="ts" setup>
withDefaults(defineProps<{ error: string | string[] }>(), { error: '' });
</script>
