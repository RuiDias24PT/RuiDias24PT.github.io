<template>
  <StepHeader :title="stepTitle" icon="pi-id-card" />
  <div class="fields-container p-[2rem]">
    <WField v-for="(field, index) in localFields" :key="index" :field="field" />
  </div>
  <div class="pl-[2rem] pb-[2rem] pr-[2rem]">
    <StepButton :disabled="!isFormValid" label="Avançar" @click="nextStep" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useCalculatorStore } from '@/stores/useCalculatorStore';
import WField from '@/components/shared/WField.vue';
import StepHeader from '@/components/layout/StepHeader.vue';
import StepButton from '@/components/layout/StepButton.vue';
import type { Field, FormData, Municipality } from '@/types/IRS';
const emit = defineEmits(['nextCallback']);

const localFields = ref<Field[]>([
  {
    varName: 'maritalStatus',
    options: [
      { label: 'Casal / União de facto', code: 'casado' },
      { label: 'Solteiro / Divorciado / Viúvo', code: 'solteiro' },
    ],
    label: '',
    value: 'solteiro',
    fieldType: 'radioBox',
  },
  {
    label: 'Dependentes com 3 anos ou menos',
    varName: 'dependentsBelowThreeYears',
    value: null,
    fieldType: 'posInt',
    placeHolder: '0',
    icon: 'mdi mdi-baby',
  },
  {
    label: 'Dependentes entre 4 e 6 anos',
    varName: 'dependentsBetweenFourSixYears',
    value: null,
    fieldType: 'posInt',
    placeHolder: '0',
    icon: 'mdi mdi-human-child',
  },
  {
    label: 'Dependentes com 6 anos ou menos',
    varName: 'dependentsAboveSixYears',
    value: null,
    fieldType: 'posInt',
    placeHolder: '0',
    icon: 'mdi mdi-human-child',
  },
  {
    label: 'Número de ascendentes',
    varName: 'dependentsAncestors',
    value: null,
    fieldType: 'posInt',
    placeHolder: '0',
    toolTip:
      'Ascendentes são pais ou avós que vivem consigo e têm baixos rendimentos(Até 295€/mês)',
    icon: 'mdi mdi-human-cane',
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
    filter: true,
    icon: 'mdi mdi-map-marker',
  },
]);

const stepTitle = 'Informações pessoais';

const calculatorStore = useCalculatorStore();

onMounted(() => {
  fetchMunicipalities();
});

watch(
  () => localFields.value.find((field) => field.varName === 'maritalStatus')?.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      calculatorStore.clearIncomeTaxDeductionsB();
    }
  },
);

const isFormValid = computed(() => {
  return localFields.value.every((field) => {
    if (field.required) {
      return field.value !== null && field.value !== '';
    }
    return true;
  });
});
//To do: Integrate with API
const fetchMunicipalities = async () => {
  const response = await fetch('/municipios.json');
  const municipios = await response.json();
  const selectOptions = municipios.map((municipality: Municipality) => ({
    label: municipality.name,
    code: municipality.municipality,
  }));

  const municipioField = localFields.value.find((field) => field.varName === 'municipality');
  if (municipioField) {
    municipioField.options = selectOptions;
  }
};

const nextStep = () => {
  if (!isFormValid.value) {
    return;
  }

  const formData = localFields.value.reduce((formDataAcc: FormData, field) => {
    formDataAcc[field.varName] = field.value;
    return formDataAcc;
  }, {});

  calculatorStore.setGeneralInfoFields(formData);
  emit('nextCallback');
};
</script>

<style scoped>
.fields-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
</style>
