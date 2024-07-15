<template>
  <div class="flex flex-col">
    <label v-if="label" class="mb-1 font-semibold">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div>
      <select
        class="text-sm focus:border-primary"
        :class="{
          'border-red-600': haveError,
          'read-only pointer-events-none text-sm': disabled,
        }"
        :value="inputValue"
        @input="onSelectChange"
      >
        <option
          v-for="(option, key) of valueList"
          :key="key"
          :value="option.code"
          class="text-sm"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
    <form-error :error="error" />
  </div>
</template>
<script lang="ts" setup>
import isNil from 'lodash/isNil';

const props = defineProps({
  disabled: { type: Boolean, default: null },
  label: { type: String, default: undefined },
  required: { type: Boolean, default: false },
  options: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
  blankValue: { type: Boolean, default: false },
  valueIsString: { type: Boolean, default: false },
  modelValue: { default: '', type: [Number, String] },
  error: { type: Array as PropType<string[]>, default: () => [] },
});

const emit = defineEmits(['update:modelValue']);

const valueList = computed(() =>
  enum2OptionsSelect(props.options, {
    blankValue: props.blankValue,
    valueIsString: props.valueIsString,
  }),
);
const onSelectChange = (e: Event) => {
  const target = <HTMLSelectElement>e.target;
  if (isNil(e)) {
    emit('update:modelValue', props.modelValue);
  } else {
    emit('update:modelValue', target.value);
  }
};
const inputValue = computed(() => <string>props.modelValue);

const haveError = computed(() => {
  if (!props.error) return false;
  return props.error.length > 0;
});
</script>
