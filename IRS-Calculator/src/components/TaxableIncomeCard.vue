<template>
    <Card class="flex-1">
        <template #title>Rendimento Coletável</template>
        <template #content>
            <div class="text-base font-bold">{{ taxableIncome }} €</div>
            <divider></divider>
            <div class="text-sm font-semibold gap-6">
                <div>Escalão atual:{{ bracketLevel }} </div>
                <divider></divider>
                <div>Taxa marginal:{{ marginalTax }} </div>
                <divider></divider>
                <div>Taxa efetiva:{{ effectiveTax }} </div>
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