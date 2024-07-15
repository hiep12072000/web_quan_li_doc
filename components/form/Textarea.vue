<template>
  <div class="flex flex-col">
    <label v-if="label" class="mb-1 font-semibold">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
      <small class="text-gray-600">{{ tips }}</small>
    </label>
    <textarea
      :class="{ 'text-sm': true, 'border-red-600': haveError }"
      :disabled="disabled"
      :value="modelValue"
      rows="3"
      @input="handleInput"
    >
    </textarea>
    <form-error :error="error" />
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  placeholder: { type: String, default: '' },
  label: { type: String, default: null },
  error: { type: Array as PropType<string[]>, default: () => [] },
  loading: { type: Boolean, default: null },
  disabled: { type: Boolean, default: null },
  tips: { type: String, default: '' },
  required: { type: Boolean, default: false },
  name: { type: String, required: true },
});

const haveError = computed(() => {
  if (!props.error) return false;
  return props.error.length > 0;
});

const emit = defineEmits({
  'update:modelValue': (data: string) => typeof data === 'string',
});

const handleInput = (e: Event) =>
  emit('update:modelValue', (e.target as HTMLInputElement).value);
</script>
