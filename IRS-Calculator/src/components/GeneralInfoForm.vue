<template>
  <StepHeader :title=stepTitle icon="pi-id-card" />
  <div class="fields-container p-[2rem]">
    <WField v-for="(field, index) in localFields" :key="index" :field="field" />
  </div>
  <div class="pl-[2rem] pb-[2rem] pr-[2rem]">
    <StepButton :disabled="!isFormValid" label="Avançar" @click="nextStep" />
  </div>
</template>

<script setup lan="ts">
import { ref, computed, onMounted } from 'vue'
import { useCalculatorStore } from '@/stores/useCalculatorStore'
import WField from '@/components/WField.vue'
import StepHeader from '@/components/StepHeader.vue'
import StepButton from '@/components/StepButton.vue'

const emit = defineEmits(['nextCallback'])

let localFields = ref([
  {
    options: [
      { label: 'Casal / União de facto', key: 'casado' },
      { label: 'Solteiro / Divorciado / Viúvo', key: 'solteiro' },
    ],
    varName: 'maritalStatus',
    value: null,
    fieldType: 'radioBox'
  },
  {
    label: 'Dependentes com 3 anos ou menos',
    varName: 'dependentsBelowThreeYears',
    value: null,
    fieldType: 'posInt',
    placeHolder: '0'
  },
  {
    label: 'Dependentes entre 4 e 6 anos',
    varName: 'dependentsBetweenFourSixYears',
    value: null,
    fieldType: 'posInt',
    placeHolder: '0'
  },
  {
    label: 'Dependentes com 6 anos ou menos',
    varName: 'dependentsAboveSixYears',
    value: null,
    fieldType: 'posInt',
    placeHolder: '0'
  },
  {
    label: 'Município Fiscal',
    varName: 'municipality',
    value: null,
    fieldType: 'select',
    options: [],
    toolTip: 'No IRS conjunto, conta o município de quem submete.',
    required: true,
    placeHolder: 'Selecione um município',
    filter: true
  },
])

const stepTitle = 'Informações pessoais'

const calculatorStore = useCalculatorStore()

onMounted( () => {
  fetchMunicipalities();
})

const isFormValid = computed(() => {
  return localFields.value.every(field => {
    if (field.required) {
      return field.value !== null && field.value !== '';
    }
    return true;
  });
});

const fetchMunicipalities = async () => {
  const response = await fetch('src/assets/municipios.json')
  const municipios = await response.json()
  const selectOptions = municipios.map((municipality) => ({
    label: municipality.name,
    code: municipality.municipality,
  }))

  const municipioField = localFields.value.find(field => field.varName === 'municipality')
  if (municipioField) {
    municipioField.options = selectOptions
  }
}

const nextStep = () => {
  if (!isFormValid.value) {
    return;
  }
  calculatorStore.setGeneralInfoFields(localFields.value)
  emit('nextCallback')
}

</script>

<style scoped>
.fields-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}
</style>
