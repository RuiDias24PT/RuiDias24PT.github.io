<template>
    <Card class="flex-1">
        <template #content>
            <div class="text-sm font-semibold space-y-2">
                <div class="flex justify-between">
                    <span class="font-[750]">Rendimento bruto:</span>
                    <span>{{ grossAnualIncome }} €</span>
                </div>
                <Divider />
                <div class="flex justify-between">
                    <span class="font-[750]">Deduções totais:</span>
                    <span>{{ allTaxDeductions }} €</span>
                </div>
                <Divider />
                <div class="flex justify-between">
                    <span class="font-[750]">IRS devido:</span>
                    <span>{{ owedIRS }} €</span>
                </div>
                <Divider />
                <div class="flex justify-between">
                    <span class="font-[750]">IRS retido na fonte:</span>
                    <span>{{ withholdingTax }} €</span>
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
}> ();
</script>