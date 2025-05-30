<template>
  <MeterGroup :value="meterValue">
    <template #start>
      <div class="flex text-sm justify-between font-bold mt-3 mb-2 w-full">
        <span>Deduções à coleta</span>
        <span class="ml-auto">{{ maxTaxCredit }} €</span>
      </div>
    </template>
  </MeterGroup>
</template>

<script setup lang="ts">
import MeterGroup from 'primevue/metergroup';
import { computed, ref } from 'vue';

const getTaxCreditPercentage = computed(() => {
  return (props.taxCredit/props.maxTaxCredit) * 100
});

const getMeterColor = computed(() => {
  const taxCreditPercentage: number = getTaxCreditPercentage.value;
  if (taxCreditPercentage >= 65){
    return '#229A00'
  }else if(taxCreditPercentage >= 40) {
    return '#F2CB15'
  } else {
    return '#F82C00'
  }
});

const meterValue = ref([{
  label: 'Deduções à coleta', 
  value: getTaxCreditPercentage,
  color: getMeterColor,
  icon: 'pi pi-wallet'
}]);



const props = defineProps<{
  maxTaxCredit: number;
  taxCredit: number;
}>();
</script>

<style scoped></style>
