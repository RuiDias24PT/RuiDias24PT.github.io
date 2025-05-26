<template>
    <Card class="flex-1">
        <template #content>
            <div class="text-sm font-semibold">
                <div >Rendimento bruto:{{ grossAnualIncome }} </div>
                <divider class="my-[0.1rem]"></divider>
                <div>Deduções totais:{{ allTaxDeductions }} </div>
                <divider></divider>
                <div>IRS devido:{{ owedIRS }} </div>
                <divider></divider>
                <div>IRS retido na fonte:{{ withholdingTax }} </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Divider from 'primevue/divider';

defineProps<{
    grossAnualIncome: number;
    allTaxDeductions: string;
    owedIRS: number;
    withholdingTax:number;
}> ();
</script>