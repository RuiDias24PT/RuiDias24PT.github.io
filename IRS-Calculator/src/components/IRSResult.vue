<template>
    <div class="mx-auto">
        <TitleResult :reimbursement="irsResultTest.reiumbursement" />
        <div class="flex gap-4 p-4">
            <Card class="w-[75%]">
                <template #content>
                    <div class="align-center px-8">
                        <IRSMeter :max-tax-credit="irsResultTest.maxTaxCreditsOverall"
                            :tax-credit="irsResultTest.taxCredits"> </IRSMeter>
                        <div class="pt-[3rem]">
                            <DeductionPerCategory> </DeductionPerCategory>
                        </div>
                    </div>
                </template>
            </Card>

            <div class="flex flex-col w-[25%] gap-4">
                <TaxableIncome :taxable-income="irsResultTest.taxableIncome" :bracket-level="irsResultTest.irsBracketLevel"
                    :effective-tax="irsResultTest.effectiveIRSTax" :marginal-tax="irsResultTest.IRSBracketMarginalTax">
                </TaxableIncome>
                <MainInfoResult :gross-anual-income="irsResultTest.grossAnnualIncome" :owedIRS="irsResultTest.IRSDue"
                    :withholding-tax="irsResultTest.withHoldingTax" :all-tax-deductions="irsResultTest.taxCreditsAmount">
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
import DeductionPerCategory from '@/components/DeductionPerCategory.vue';
import Card from 'primevue/card';
import { ref } from 'vue';
import type { IRSResultSingle } from '@/types/IRS';

const irsResultTest = ref<IRSResultSingle>({
    "grossAnnualIncome": 3323,
    "taxableIncome": 0,
    "irsBracketLevel": "1.º",
    "IRSBracketMarginalTax": 13,
    "withHoldingTax": 333,
    "IRSDueOriginal": 0,
    "IRSDue": 0,
    "effectiveIRSTax": 0.23,
    "taxCredits": 700,
    "taxCreditsAmount": 8601,
    "reiumbursement": 8934,
    "maxTaxCreditsOverall": 1000,
    "maxTaxcreditsPerCategory": {
        "maxfamilyExpensesDeduction": 250,
        "maxHealthExpensesDeduction": 1000,
        "maxEducationExpensesDeduction": 800,
        "maxRealStateDeductions": 600,
        "maxAlimonyDeductions": Infinity,
        "maxOtherDeductions": 250,
        "maxRetirementHomeDeduction": 403.75,
        "maxPPRDeduction": 400,
        "maxDonations": Infinity
    }
})
defineProps<{
    irsResult: IRSResultSingle;
}>();
</script>

<style scoped></style>
