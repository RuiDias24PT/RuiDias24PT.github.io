<template>
    <div class="mx-auto">
        <TitleResult :reimbursement="100" />
        <div class="flex gap-4 p-4">
            <Card class="w-[70%]">
                <template #content>
                    <div class="align-center px-8">
                        <IRSMeter> </IRSMeter>
                        <div class="pt-[3rem]">
                            <DeductionPerCategory> </DeductionPerCategory>
                        </div>
                    </div>
                </template>
            </Card>

            <div class="flex flex-col w-[30%] gap-4">
                <TaxableIncome> </TaxableIncome>
                <MainInfoResult> </MainInfoResult>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import TitleResult from '@/components/TitleResult.vue';
import TaxableIncome from '@/components/TaxableIncomeCard.vue';
import MainInfoResult from '@/components/MainInfoResult.vue';
import IRSMeter from '@/components/IRSMeter.vue';
import DeductionPerCategory from '@/components/DeductionPerCategory.vue';
import Card from 'primevue/card';
import { ref } from 'vue';
import type { IRSResultSingle } from '@/types/IRS';

const reimbursement = ref(-100);
const meterValue = ref([{ label: 'Deduções à coleta', value: 15 }]);

defineProps<{
    irsResult: IRSResultSingle;
}>();
</script>

<style scoped></style>
