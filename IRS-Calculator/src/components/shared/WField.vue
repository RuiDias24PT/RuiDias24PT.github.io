<template>
  <div class="mb-[1rem]">
    <label v-if="field.label" class="flex justify-between items-center mb-2 text-sm text-gray-700">
      <span class="flex items-center gap-1">
        <i
          v-if="field.icon"
          :class="field.icon"
          class="text-[var(--primary-color)] text-[1.5rem]"
        ></i>
        <span>
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </span>
      </span>
      <WToolTip v-if="field.toolTip" :tool-tip="field.toolTip" />
    </label>

    <InputText
      v-if="field.fieldType === 'text'"
      v-model="field.value"
      :placeholder="field.placeHolder"
      class="w-full"
    />

    <InputNumber
      v-else-if="field.fieldType === 'int' || field.fieldType === 'posInt'"
      v-model="field.value"
      :min="field.fieldType === 'posInt' ? 0 : undefined"
      class="w-full"
      :placeholder="field.placeHolder"
      :disabled="disabled"
      @input="onInput($event)"
    />

    <InputNumber
      v-else-if="field.fieldType === 'currency'"
      v-model="field.value"
      class="w-full"
      :placeholder="field.placeHolder"
      mode="currency"
      currency="EUR"
      :disabled="disabled"
      fluid
      @input="onInput($event)"
    />

    <Dropdown
      v-else-if="field.fieldType === 'select'"
      v-model="field.value"
      :filter="field.filter"
      :options="field.options"
      option-label="label"
      option-value="code"
      :placeholder="field.placeHolder"
      :disabled="disabled"
      class="w-full"
    />

    <div v-else-if="field.fieldType === 'radioBox'" class="flex gap-4 pt-[2rem]">
      <div v-for="option in field.options" :key="option.code" class="flex items-center gap-2">
        <RadioButton v-model="field.value" :input-id="option.code" :value="option.code" />
        <label class="text-sm" :for="option.code">{{ option.label }}</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import RadioButton from 'primevue/radiobutton';
import WToolTip from '@/components/shared/WToolTip.vue';
import { defineProps } from 'vue';
import type { Field } from '@/types/IRS';

const props = defineProps<{
  field: Field;
  disabled?: boolean;
}>();

//Prime vue limitation
const onInput = (event: any) => {
  if (props.field.fieldType !== 'radioBox') {
    props.field.value = event.value;
  }
};
</script>

<style scoped></style>
