<template>
    <Card class="flex-1">
        <template #title>Rendimento Coletável</template>
        <template #content>
            <div class="text-base font-bold">{{ taxableIncome.toFixed(2) }} €</div>
            <divider></divider>
            <div class="text-sm font-semibold gap-6">
                <div class="flex justify-between">
                    <span class="font-[750]">Escalão atual:</span>
                    {{ bracketLevel}} Escalão
                </div>
                <divider></divider>
                <div class="flex justify-between">
                    <span class="font-[750]">Taxa marginal:</span>
                    {{ marginalTax.toFixed(2) }} %
                </div>
                <divider></divider>
                <div class="flex justify-between">
                    <span class="font-[750]">Taxa efetiva:</span>
                    {{ effectiveTax.toFixed(2) }} %
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Divider from 'primevue/divider';

defineProps<{
    taxableIncome: number;
    bracketLevel: string;
    effectiveTax: number;
    marginalTax:number;
}> ();
</script>