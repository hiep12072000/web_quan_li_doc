<template>
  <div class="flex flex-col">
    <label v-if="label" class="mb-1 font-semibold">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
      <small class="text-gray-600">{{ tips }}</small>
    </label>
    <input
      :type="type"
      :class="{ 'text-sm': true, 'border-red-600': haveError }"
      :placeholder="placeholder"
      :value="inputValue"
      :disabled="disabled"
      :autocomplete="type === 'password' ? 'new-password' : ''"
      @input="handleInput"
    />
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
  type: {
    type: String as PropType<
      'text' | 'number' | 'password' | 'time' | 'date' | 'datetime'
    >,
    default: 'text',
  },
});

const haveError = computed(() => {
  if (!props.error) return false;
  return props.error.length > 0;
});

const emit = defineEmits({
  'update:modelValue': (data: string) => typeof data === 'string',
});

const inputValue = computed(() => {
  let result: string = String(props.modelValue);

  if (props.disabled) {
    if (props.type === 'number') {
      result = number(props.modelValue) as string;
    }

    if (props.modelValue) {
      switch (props.type) {
        case 'date':
          result = String(props.modelValue);
          break;
        case 'datetime':
          result = date(`${props.modelValue}`, 'YYYY/MM/DD HH:mm:ss');
          break;
      }
    }
  }

  return result;
});

const handleInput = (e: Event) =>
  emit('update:modelValue', (e.target as HTMLInputElement).value);
</script>
