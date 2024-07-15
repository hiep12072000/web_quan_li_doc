<template>
  <div
    class="flex select-none"
    :class="{
      'flex-col': align === 'horizontal',
      'items-center gap-2': align === 'vertical',
    }"
  >
    <label v-if="label" class="mb-1 font-semibold">
      {{ label || '&nbsp;' }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div>
      <div
        class="relative inline-block overflow-hidden rounded-full border px-8 py-1.5"
        :class="{
          'bg-sky-600 text-sky-600': !(bgChange && side === 'left'),
          'bg-gray-300 text-gray-300': bgChange && side === 'left',
          'cursor-pointer': !disabled,
        }"
        @click="handleSwitchChange"
      >
        {{ skeletonText || '&nbsp;' }}
        <div
          class="absolute top-0 flex h-full items-center text-white transition-all"
          :class="side === 'right' ? 'left-0' : '-left-full translate-x-10'"
        >
          <span class="relative whitespace-nowrap px-3.5 text-sky-600">
            {{ skeletonText || '&nbsp;' }}
            <span class="absolute left-0 top-0 w-full text-center text-white">
              {{ options[0].label || '&nbsp;' }}
            </span>
          </span>
          <span
            class="inline-block h-8 w-8 shrink-0 rounded-full bg-white shadow"
          />
          <span class="relative whitespace-nowrap px-3.5 text-sky-600">
            {{ skeletonText || '&nbsp;' }}
            <span class="absolute left-0 top-0 w-full text-center text-white">
              {{ options[1].label || '&nbsp;' }}
            </span>
          </span>
        </div>
      </div>
    </div>
    <form-error :error="error" />
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  disabled: { type: Boolean, default: null },
  label: { type: String, default: undefined },
  required: { type: Boolean, default: false },
  options: {
    type: Array as PropType<{ value: string; label: string }[]>,
    required: true,
  },
  blankValue: { type: Boolean, default: false },
  valueIsString: { type: Boolean, default: false },
  modelValue: { default: '', type: [Number, String] },
  bgChange: { type: Boolean, default: false },
  align: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal',
  },
  error: { type: Array as PropType<string[]>, default: () => [] },
});

const emit = defineEmits({
  'update:modelValue': (data: string) => typeof data === 'string',
});

const skeletonText = computed(() =>
  props.options[0].label.length > props.options[1].label.length
    ? props.options[0].label
    : props.options[1].label,
);

const side = computed(() => {
  if (props.modelValue === props.options[1].value) {
    return 'left';
  }
  return 'right';
});

const handleSwitchChange = () => {
  if (props.disabled) return;
  emit('update:modelValue', props.options[side.value === 'left' ? 0 : 1].value);
};
</script>
