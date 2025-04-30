<template>
    <div class="flex items-center text-[1.2rem] pt-[2.5rem] pl-[2.5rem] gap-[2rem]">
        <span class="pi pi-id-card text-[var(--primary-color)] !text-2xl"></span>
        <p class="font-bold">{{ stepTitle }}</p>
    </div>
    <div class="fields-container p-[2rem]">
        <WField v-for="(field, index) in localFields" :key="index" :field="field" />
    </div>
    <div class="p-[2rem]">
        <button
            class="w-full px-6 py-2 text-[var(--primary-color)] font-semibold border-2 border-[var(--primary-color)] rounded-md cursor-pointer"
            @click="$emit('nextCallback')">
            Avançar
        </button>
    </div>
</template>

<script setup lan="ts">
import { ref, watch, onMounted } from 'vue'
import { useCalculatorStore } from '@/stores/useCalculatorStore'
import WField from '@/components/WField.vue'

const localFields = ref([
  {
    options: [
      { label: 'Casal / União de facto', key: 'casado' },
      { label: 'Solteiro / Divorciado / Viúvo', key: 'feliz' },
    ],
    value: null,
    fieldType: 'radioBox'
  },
  {
    label: 'Dependentes com 3 anos ou menos',
    varName: 'dependentesComTresMais',
    value: null,
    fieldType: 'posInt',
  },
  {
    label: 'Dependentes entre 4 e 6 anos',
    varName: 'dependentesEntreQuatroSeis',
    value: null,
    fieldType: 'posInt',
  },
  {
    label: 'Dependentes com 6 anos ou menos',
    varName: 'dependentesComSeisMais',
    value: null,
    fieldType: 'posInt',
  },
  
  {
    label: 'Município Fiscal',
    varName: 'municipio',
    value: null,
    fieldType: 'select',
    options: [],
    toolTip: 'No IRS conjunto, conta o município de quem submete.',
  },
])

const stepTitle = 'Informações pessoais'

const calculatorStore = useCalculatorStore()

onMounted( () => {
  fetchMunicipalities();
})

const fetchMunicipalities = async () => {
  const response = await fetch('src/assets/municipios.json')
  const municipios = await response.json()
  const selectOptions = municipios.map((municipality) => ({
    label: municipality.name,
    code: municipality.municipality,
  }))

  const municipioField = localFields.value.find(f => f.varName === 'municipio')
  if (municipioField) {
    municipioField.options = selectOptions
  }
}

watch(
  localFields,
  (newValues) => {
    calculatorStore.setGeneralInfoFields(newValues)
  },
  { deep: true },
)
</script>

<style scoped>
.fields-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}
</style>
