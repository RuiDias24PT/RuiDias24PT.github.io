<template>
    <div class="mb-[1rem]">
        <label v-if="field.label" class="flex justify-between items-center mb-2 text-sm text-gray-700">
            <span>{{ field.label }}</span>
            <i v-if="field.toolTip" class="text-[var(--primary-color)] pi pi-info-circle" v-tooltip.right="{
                value: field.toolTip,
                pt: {
                    text: 'text-xs'
                }
            }" />
        </label>

        <InputText v-if="field.fieldType === 'text'" v-model="field.value" class="w-full" />

        <InputNumber v-else-if="field.fieldType === 'posInt'" v-model="field.value" :min="0" class="w-full" />

        <Dropdown v-else-if="field.fieldType === 'select'" filter v-model="field.value" :options="field.options"
            optionLabel="label" optionValue="key" placeholder="Selecione" class="w-full" />

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
import { defineProps } from 'vue'

defineProps<{
  field: {
    label: string
    varName: string
    value: any
    fieldType?: 'text' | 'posInt' | 'select'
    options?: { label: string; key: string }[]
    toolTip?: string
  }
}>()
</script>

<style scoped></style>
