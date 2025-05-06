<template>
    <div class=" mx-auto w-[75rem]">
        <Stepper v-model:activeStep="active">
            <template v-for="(step, index) in steps" :key="index">
                <StepperPanel>
                    <template #header="{ clickCallback }">
                        <StepperHeader :isActive="index === active" :isClickable="index <= active"
                            :isLast="index === steps.length - 1" :stepNumber="index + 1" :header="step.header"
                            :clickCallback="clickCallback" />
                    </template>
                    <template #content="{ nextCallback, prevCallback }">
                        <div class="relative mt-[3rem] w-[60rem] mx-auto text-[2rem] text-[#0e125e]">
                            <i v-if="index !== 0"
                                class="pi pi-arrow-left text-[#0e125e] absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                @click="prevCallback"></i>
                            <div class="flex justify-center">
                                <span class="font-Roboto font-semibold">{{ calculatorTitle }}</span>
                            </div>
                        </div>
                        <div class="custom-card my-[2rem] w-[60rem] mx-auto">
                            <component :is="step.component" @nextCallback="nextCallback" :prevCallback="prevCallback" />
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
import GeneralInfoForm from '@/components/GeneralInfoForm.vue'
import IncomeTaxDeductionsA from '@/components/IncomeTaxDeductionsA.vue'
import IncomeTaxDeductionsB from '@/components/IncomeTaxDeductionsB.vue';
import StepperHeader from '@/components/StepperHeader.vue';
import { ref } from 'vue';

const calculatorTitle = ref("Simulador IRS 2025");

const active = ref(0);


const steps = ref([
    { header: "Informações pessoais", component: GeneralInfoForm },
    { header: "Rendimentos e Deduções à coleta sujeito passivo A", component: IncomeTaxDeductionsA },
    { header: "Rendimentos e Deduções à coleta sujeito passivo B", component: IncomeTaxDeductionsB },
    { header: "Resultados", component: IncomeTaxDeductionsA }
])
</script>

<style scoped>

</style>
