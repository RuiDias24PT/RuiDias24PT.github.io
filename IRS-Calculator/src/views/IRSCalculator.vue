<template>
    <div class=" mx-auto w-[75rem]">
        <Stepper v-model:activeStep="active">
            <template v-for="(step, index) in steps" :key="index">
                <StepperPanel>
                    <template #header="{ clickCallback }">
                        <button @click="clickCallback" class="flex flex-col items-start cursor-pointer">
                            <div class="flex items-center">
                                <span :class="[
                                    'rounded-full w-[2.2rem] h-[1.7rem] inline-flex items-center justify-center border-1 text-sm',
                                    index === active ? 'bg-[#636AE8] border-[#636AE8] text-white' : 'bg-white border-[#636AE8]'
                                ]">
                                    {{ index + 1 }}
                                </span>
                                <div class="pl-[1rem] flex items-center flex-col items-start">
                                    <span :class="[
                                        'text-xs',
                                        index === active ? 'text-[#636AE8]' : 'text-gray-800'
                                    ]">
                                        {{ step.header }}
                                    </span>
                                    <div v-if="index === active" class="h-[0.25rem] bg-[#636AE8] w-full mt-[10px]">
                                    </div>
                                </div>
                                <i v-if="index !== steps.length - 1" :class="[
                                    index === active ? 'pi pi-angle-double-right' : 'pi pi-angle-right',
                                    'text-gray-700 pl-[1.2rem] align-middle'
                                ]"></i>
                            </div>
                        </button>
                    </template>
                    <template #content="{ nextCallback, prevCallback }">
                        <div class="relative mt-[3rem] w-[60rem] mx-auto text-[2rem] text-[#0e125e]">
                            <i v-if="index !== 0"
                                class="pi pi-arrow-left text-[#0e125e] absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                @click="prevCallback"></i>
                            <div class="flex justify-center">
                                <span class="font-archivo font-semibold">{{ calculatorTitle }}</span>
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
import { ref } from 'vue';

const calculatorTitle = ref("Simulador IRS 2025");

const active = ref(0);


const steps = ref([
    { header: "Informações pessoais", component: GeneralInfoForm },
    { header: "Rendimentos e Deduções à coleta sujeito passivo A", component: IncomeTaxDeductionsA },
    { header: "Rendimentos e Deduções à coleta sujeito passivo B", component: GeneralInfoForm },
    { header: "Resultados", component: IncomeTaxDeductionsA }
])
</script>

<style scoped>

</style>
