<template>
    <div class="mx-auto">
        <TitleResult :reimbursement="irsResultTest.reiumbursement" />
        <div class="flex gap-4 p-4">
            <Card class="w-[75%]">
                <template #content>
                    <div class="align-center px-8">
                        <IRSMeter
:max-tax-credit="irsResultTest.maxTaxCreditsOverall"
                            :tax-credit="irsResultTest.taxCredits"> </IRSMeter>
                        <div class="pt-[3rem] flex justify-center">
                            <DeductionPerCategory :max-taxcredits-per-category="irsResultTest.maxTaxcreditsPerCategory">
                            </DeductionPerCategory>
                        </div>
                    </div>
                </template>
            </Card>

            <div class="flex flex-col w-[25%] gap-4">
                <TaxableIncome
:taxable-income="irsResultTest.taxableIncome"
                    :bracket-level="irsResultTest.irsBracketLevel" :effective-tax="irsResultTest.effectiveIRSTax"
                    :marginal-tax="irsResultTest.IRSBracketMarginalTax">
                </TaxableIncome>
                <MainInfoResult
:gross-anual-income="irsResultTest.grossAnnualIncome" :owed-i-r-s="irsResultTest.IRSDue"
                    :withholding-tax="irsResultTest.withHoldingTax"
                    :all-tax-deductions="irsResultTest.taxCreditsAmount">
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
import type { IRSResult } from '@/types/IRS';

const irsResultTest = ref<IRSResult>({
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
        "generalFamilyExpenses": {
            "value": 100,
            "max": 250
        },
        "healthExpenses": {
            "value": 0,
            "max": 1000
        },
        "educationExpenses": {
            "value": 0,
            "max": 800
        },
        "rentExpenses": {
            "value": 0,
            "max": 600
        },
        "alimonyExpenses": {
            "value": 0,
            "max": Infinity
        },
        "otherDeductions": {
            "value": 0,
            "max": 250
        },
        "careHomeExpenses": {
            "value": 0,
            "max": 403.75
        },
        "pprExpenses": {
            "value": 0,
            "max": 400
        },
        "donations": {
            "value": 0,
            "max": Infinity
        }
    }
})
defineProps<{
    irsResult: IRSResult;
}>();
</script>

<style scoped></style>
