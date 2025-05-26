<template>
  <MeterGroup :value="meterValue">
    <template #start>
      <div class="flex text-sm justify-between font-bold mt-3 mb-2 w-full">
        <span>Deduções à coleta</span>
        <span class="ml-auto">{{maxTaxCredit}} €</span>
      </div>
    </template>
  </MeterGroup>
</template>

<script setup lang="ts">
import MeterGroup from 'primevue/metergroup';
import { ref } from 'vue';

const maxTaxCredit = ref(1000);
const meterValue = ref([{ label: 'Deduções à coleta', value: 95 }]);

defineProps<{
  maxTaxCredit: number;
  taxCredit: number;
}>();
</script>

<style scoped></style>
