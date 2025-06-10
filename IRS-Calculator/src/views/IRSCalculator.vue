<template>
  <div class="mx-auto w-[75rem]">
    <Stepper v-model:active-step="active">
      <template v-for="(step, index) in steps" :key="index">
        <StepperPanel>
          <template #header="{ clickCallback }">
            <StepperHeader
              :is-active="index === active"
              :is-clickable="index <= active"
              :is-last="index === steps.length - 1"
              :step-number="index + 1"
              :header="step.header"
              :click-callback="clickCallback"
            />
          </template>
          <template #content="{ nextCallback, prevCallback }">
            <div class="relative mt-[3rem] w-[70rem] mx-auto text-[2rem] text-[#0e125e]">
              <i
                v-if="index !== 0"
                class="pi pi-arrow-left text-[#0e125e] absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                @click="prevCallback"
              ></i>
              <div class="flex justify-center">
                <span class="font-Roboto font-semibold text-[1.6rem]">{{ calculatorTitle }}</span>
              </div>
            </div>
            <div class="custom-card my-[2rem] w-[70rem] mx-auto">
              <component
                :is="step.component"
                :prev-callback="prevCallback"
                :irs-result="irsResult"
                @next-callback="nextCallback"
                @calculate-result="calculateResult(nextCallback)"
                @go-to-first-step="navigateToFirstStep"
              />
            </div>
          </template>
        </StepperPanel>
      </template>
    </Stepper>
  </div>
</template>

<script setup lang="ts">
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import GeneralInfoForm from '@/components/GeneralInfoForm.vue';
import IncomeTaxDeductionsA from '@/components/IncomeTaxDeductionsA.vue';
import IncomeTaxDeductionsB from '@/components/IncomeTaxDeductionsB.vue';
import IRSResultComponent from '@/components/IRSResult.vue';
import StepperHeader from '@/components/StepperHeader.vue';
import { getIRSResultCouple, getIRSResultSingle } from '@/utils/IRSCalculator';
import { useCalculatorStore } from '@/stores/useCalculatorStore';
import { ref } from 'vue';
import type { IRSResult } from '@/types/IRS';

const calculatorStore = useCalculatorStore();
const calculatorTitle = ref('Simulador IRS 2025');
const active = ref(0);
const irsResult = ref<IRSResult>();
const steps = ref([
  { header: 'Informações pessoais', component: GeneralInfoForm },
  { header: 'Rendimentos e Deduções à coleta sujeito passivo A', component: IncomeTaxDeductionsA },
  { header: 'Rendimentos e Deduções à coleta sujeito passivo B', component: IncomeTaxDeductionsB },
  { header: 'Resultados', component: IRSResultComponent, props: irsResult },
]);

const calculateResult = async (nextStepFunction: any) => {
  const allStepsData = calculatorStore.getAllFields();
  let result;

  if (allStepsData.generalInfoFields.maritalStatus === 'solteiro') {
    result = await getIRSResultSingle(allStepsData.generalInfoFields, {
      ...allStepsData.incomeFieldsA,
      ...allStepsData.taxDeductionsFieldsA,
    });
  } else {
    result = await getIRSResultCouple(allStepsData.generalInfoFields, {
      ...allStepsData.incomeFieldsA,
      ...allStepsData.taxDeductionsFieldsA,
    },
    {
      ...allStepsData.incomeFieldsB,
      ...allStepsData.taxDeductionsFieldsB,
    });
  }
  console.log('IRS Result:', result);
  irsResult.value = result;
  nextStepFunction();
};

const navigateToFirstStep = (): void => {
  active.value = 0;
};
</script>

<style scoped></style>
