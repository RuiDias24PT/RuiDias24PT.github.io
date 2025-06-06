<template>
    <div v-if="irsResult" class=" mx-auto">
        <div class="flex items-center justify-between px-4 py-2 relative">
            <div class="absolute right-4">
                <Button class="text-blue-600" size="small" @click="$emit('goToFirstStep')">
                    Voltar ao início
                </Button>
            </div>

            <div class="mx-auto">
                <TitleResult :reimbursement="irsResult.reimbursement" />
            </div>
        </div>
        <div class="flex gap-4 p-4 pb-4">
            <Card class="w-[75%]">
                <template #content>
                    <div class="align-center px-8">
                        <IRSMeter :max-tax-credit="irsResult.maxTaxCreditsOverall" :tax-credit="irsResult.taxCredits">
                        </IRSMeter>
                        <div class="pt-[2rem] flex justify-center">
                            <DeductionPerCategory :max-taxcredits-per-category="irsResult.maxTaxcreditsPerCategory">
                            </DeductionPerCategory>
                        </div>
                    </div>
                </template>
            </Card>

            <div class="flex flex-col w-[25%] gap-4">
                <TaxableIncome :taxable-income="irsResult.taxableIncome" :bracket-level="irsResult.irsBracketLevel"
                    :effective-tax="irsResult.effectiveIRSTax" :marginal-tax="irsResult.IRSBracketMarginalTax">
                </TaxableIncome>
                <MainInfoResult :gross-anual-income="irsResult.grossAnnualIncome" :owed-i-r-s="irsResult.IRSDue"
                    :withholding-tax="irsResult.withHoldingTax" :all-tax-deductions="irsResult.taxCreditsAmount">
                </MainInfoResult>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import TitleResult from '@/components/TitleResult.vue';
import TaxableIncome from '@/components/TaxableIncomeCard.vue';
import MainInfoResult from '@/components/MainInfoResult.vue';
import IRSMeter from '@/components/IRSMeter.vue';
import Button from 'primevue/button';
import DeductionPerCategory from '@/components/DeductionPerCategory.vue';
import Card from 'primevue/card';
import type { IRSResult } from '@/types/IRS';

defineProps<{
    irsResult: IRSResult;
}>();
</script>

<style scoped></style>
