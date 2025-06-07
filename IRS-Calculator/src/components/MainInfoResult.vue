<template>
  <Card class="flex-1 py-3">
    <template #content>
      <div class="text-sm font-semibold space-y-2">
        <div class="flex justify-between">
          <span class="font-[750]">Rendimento bruto:</span>
          <span>{{ grossAnualIncome.toFixed(2) }} €</span>
        </div>
        <Divider />
        <div class="flex justify-between">
          <span class="font-[750]">Deduções totais:</span>
          <span>{{ allTaxDeductions.toFixed(2) }} €</span>
        </div>
        <Divider />
        <div class="flex justify-between">
          <span class="font-[750]">IRS devido:</span>
          <span>{{ owedIRS.toFixed(2) }} €</span>
        </div>
        <Divider />
        <div class="flex justify-between">
          <span class="font-[750]">IRS retido na fonte:</span>
          <span>{{ withholdingTax.toFixed(2) }} €</span>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Divider from 'primevue/divider';

defineProps<{
  grossAnualIncome: number;
  allTaxDeductions: number;
  owedIRS: number;
  withholdingTax: number;
}>();
</script>
