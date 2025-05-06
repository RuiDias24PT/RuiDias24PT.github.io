<template>
    <div class="mb-[1rem]">
        <label v-if="field.label" class="flex justify-between items-center mb-2 text-sm text-gray-700">
            <span>{{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
            </span>
            <WToolTip v-if="field.toolTip" :toolTip="field.toolTip"></WToolTip>
        </label>

        <InputText v-if="field.fieldType === 'text'" v-model="field.value" :placeholder="field.placeHolder"
            class="w-full" />

        <InputNumber v-else-if="field.fieldType === 'int' || field.fieldType === 'posInt'" v-model="field.value"
            :min="field.fieldType === 'posInt' ? 0 : undefined" class="w-full" :placeholder="field.placeHolder"
            @input="onInput($event)" />

        <InputNumber v-else-if="field.fieldType === 'currency'" v-model="field.value" class="w-full"
            :placeholder="field.placeHolder" mode="currency" currency="EUR" @input="onInput($event)" :disabled="disabled" fluid />

        <Dropdown v-else-if="field.fieldType === 'select'" :filter="field.filter" v-model="field.value" :options="field.options"
            optionLabel="label" optionValue="code" :placeholder="field.placeHolder" :disabled="disabled" class="w-full" />

        <div v-else-if="field.fieldType === 'radioBox'" class="flex gap-4 pt-[2rem]">
            <div v-for="option in field.options" :key="option.key" class="flex items-center gap-2">
                <RadioButton :inputId="option.key" :value="option.key" v-model="field.value" />
                <label class="text-sm" :for="option.key">{{ option.label }}</label>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import RadioButton from 'primevue/radiobutton'
import WToolTip from '@/components/WToolTip.vue'
import { defineProps } from 'vue'

const props = defineProps<{
  field: {
    label: string
    varName: string
    value: any
    fieldType?: 'text' | 'posInt' | 'select' |'int' | 'radioBox' |'currency'
    options?: { label: string; key: string }[]
    toolTip?: string,
    required?: boolean,
    placeHolder?: string,
    filter?: boolean
  },
    disabled?: boolean
}>()

//Prime vue limitation
const onInput = (event: any) => {
    if(props.field.fieldType !== "radioBox"){
        props.field.value = event.value;
    }
};

</script>

<style scoped></style>
