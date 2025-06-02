<template>
    <div class="w-[40rem]">
        <div class="pb-6 font-bold text-center">
            Limite de dedução à coleta por categoria</div>
        <Carousel :value="products" :numVisible="3" :numScroll="1">
            <template #item="slotProps">
                <div
                    class="w-[10rem] bg-gray-100 dark:border-surface-700 rounded-xl h-[15.5rem] m-2 p-4 flex flex-col justify-between">
                    <div>
                        <div class="relative mx-auto mb-5">
                            <div class="rounded-2xl p-1 shadow-md w-[5rem] h-[5rem] mx-auto flex items-center justify-center"
                                :style="{ backgroundColor: slotProps.data.backgroundColor }">
                                <template v-if="slotProps.data.multiple">
                                    <div class="flex flex-wrap justify-center items-center gap-1">
                                        <i v-for="(icon, index) in slotProps.data.icons" :key="index"
                                            :class="icon + ' text-[1.2rem] text-white'"></i>
                                    </div>
                                </template>
                                <template v-else>
                                    <i :class="slotProps.data.icon + ' text-[2.5rem] text-white'"></i>
                                </template>
                            </div>
                        </div>
                        <div class="text-black-1000 font-bold text-[0.9rem] text-center">
                            {{ slotProps.data.name }}
                        </div>
                    </div>
                    <div class="flex justify-center items-center w-[full]">
                        <MeterGroup class="w-[7rem]" :value="slotProps.data.meterValue">
                            <template #start>
                                <div class="flex justify-center items-center gap-1 text-base">
                                    <span class="font-bold">
                                        {{ maxTaxcreditsPerCategory[slotProps.data.varName].value }}
                                    </span>
                                    <span class="text-xs">/</span>
                                    <span class="font-medium">
                                        {{ maxTaxcreditsPerCategory[slotProps.data.varName].max }} €
                                    </span>
                                </div>
                            </template>

                            <template #label>
                                <span class="text-sm"></span>
                            </template>
                        </MeterGroup>
                    </div>
                </div>
            </template>
        </Carousel>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Carousel from 'primevue/carousel';
import MeterGroup from 'primevue/metergroup';

const props = defineProps<{
  maxTaxcreditsPerCategory: Record<string, { value: number; max: number }>;
}>();

const getTaxCreditPercentage = (taxCredit: number, taxCreditMax: number) => {
    return (taxCredit / taxCreditMax) * 100
}

const products = ref([
  {
    icon: 'mdi mdi-human-male-female-child',
    name: 'Despesas gerais Familiares',
    backgroundColor: '#48c1d9',
    varName: 'generalFamilyExpenses',
    meterValue: [{ value: getTaxCreditPercentage(props.maxTaxcreditsPerCategory.generalFamilyExpenses.value, props.maxTaxcreditsPerCategory.generalFamilyExpenses.max ) }],
  },
  {
    icon: 'mdi mdi-heart-pulse',
    name: 'Saúde',
    backgroundColor: '#fc5858',
    varName: 'healthExpenses',
    meterValue: [{ value: getTaxCreditPercentage(props.maxTaxcreditsPerCategory.healthExpenses.value, props.maxTaxcreditsPerCategory.healthExpenses.max) }],
  },
  {
    icon: 'mdi mdi-book-open-blank-variant-outline',
    name: 'Educação',
    backgroundColor: '#fd873a',
    varName: 'educationExpenses',
    meterValue: [{ value: getTaxCreditPercentage(props.maxTaxcreditsPerCategory.educationExpenses.value, props.maxTaxcreditsPerCategory.educationExpenses.max) }],
  },
  {
    icon: 'mdi mdi-home-outline',
    name: 'Habitação',
    backgroundColor: '#95d654',
    varName: 'rentExpenses',
    meterValue: [{ value: getTaxCreditPercentage(props.maxTaxcreditsPerCategory.rentExpenses.value, props.maxTaxcreditsPerCategory.rentExpenses.max) }],
  },
  {
    icon: 'mdi mdi-human-walker',
    name: 'Lares',
    backgroundColor: '#6cb764',
    varName: 'careHomeExpenses',
    meterValue: [{ value: getTaxCreditPercentage(props.maxTaxcreditsPerCategory.careHomeExpenses.value, props.maxTaxcreditsPerCategory.careHomeExpenses.max) }],
  },
  {
    icons: [
      'mdi mdi-content-cut',
      'mdi mdi-silverware-fork-knife',
      'mdi mdi-car-wrench',
      'mdi mdi-paw-outline',
      'mdi mdi-weight-lifter',
      "mdi mdi-newspaper"
    ],
    name: 'Outros',
    multiple: true,
    backgroundColor: '#48c1d9',
    varName: 'otherDeductions',
    meterValue: [{ value: getTaxCreditPercentage(props.maxTaxcreditsPerCategory.otherDeductions.value, props.maxTaxcreditsPerCategory.otherDeductions.max) }],
  },
]);
</script>
