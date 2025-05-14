<template>
    <Accordion class="p-[1rem]" :activeIndex="0" expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
        <AccordionTab :header="stepTitleIncome">
            <StepHeader :title=stepTitleIncome icon="pi-money-bill" class="" />
            <div class="fields-container p-[2rem]">
                <WField v-for="(field, index) in localFieldsIncome" :key="index" :field="field"
                    :disabled="field.disabled || formDisabled" />
            </div>
        </AccordionTab>
        <AccordionTab :header="stepTitleDeductions">
            <StepHeader :title=stepTitleDeductions icon="pi-money-bill" />
            <div class="fields-container-by-3 p-[2rem] pt-[2.5rem]" >
                <WField v-for="(field, index) in localFieldsDeductions" :key="index" :field="field"
                    :disabled="field.disabled || formDisabled" />
            </div>
        </AccordionTab>
    </Accordion>

    <div class="p-[2rem]">
        <div v-if="formDisabled" class=" pb-[1rem] text-red-700 text-sm">* Visto que não é casado ou unido de facto, este passo será ignorado. </div>
        <StepButton :disabled="!isFormValid" label="Avançar" @click="nextStep" />
    </div>
</template>

<script setup lan="ts">
import { ref, computed, watch } from 'vue'
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import WField from '@/components/WField.vue'
import StepHeader from '@/components/StepHeader.vue'
import StepButton from '@/components/StepButton.vue'
import { useCalculatorStore } from '@/stores/useCalculatorStore'
import { specificDeductionsCalculation } from '@/utils/IRSCalculator'

const emit = defineEmits(['nextCallback'])

const calculatorStore = useCalculatorStore();

const formDisabled  = ref(false);

const estadoCivil = computed(() => {
    return calculatorStore.generalInfoFields.maritalStatus;
})

watch(
    () => estadoCivil.value,
    (estadoCivil) => {
        formDisabled.value = estadoCivil !== 'casado';
        clearStoredValues();
    }
)

const clearStoredValues= () => {
    calculatorStore.clearIncomeTaxDeductionsB();
    clearAllFieldValues();
}

const clearAllFieldValues = () => {
    for (const field of localFieldsIncome.value) {
        if (field.varName !== 'specificDeductions') {
            field.value = null;
        }
    }
    for (const field of localFieldsDeductions.value) {
        field.value = null;
    }
}

const specificDeductions = computed(() => {
    const rendimentoField = localFieldsIncome.value.find(field => field.varName === 'grossAnnualIncome')
    const income = Number(rendimentoField?.value ?? 0)
    return specificDeductionsCalculation(income);
});


let localFieldsIncome = ref([
    {
        label: 'Rendimento bruto anual',
        varName: 'grossAnnualIncome',
        value: null,
        fieldType: 'currency',
        required: true,
        toolTip: 'É o total que o trabalhador recebe anualmente antes de descontos (como IRS e Segurança Social).'
    },
    {
        label: 'Pensões Alimentos',
        varName: 'alimonyEarnings',
        value: null,
        fieldType: 'currency',
        placeHolder: '0,00€',
        toolTip: 'Valor total anual recebido para sustentar os filhos após separação.'
    },
    {
        label: 'Deduções especificas',
        varName: 'specificDeductions',
        value: specificDeductions,
        fieldType: 'currency',
        disabled: true,
        toolTip: 'As deduções específicas são valores que reduzem o rendimento sujeito a IRS automaticamente. Incluem, por exemplo, os descontos para a Segurança Social.'
    },
    {
        label: 'Retenção na Fonte IRS',
        varName: 'withholdingTax',
        value: null,
        fieldType: 'currency',
        required: true,
        toolTip: 'A retenção na fonte é o desconto do IRS diretamente no salário do trabalhador, feito pelo empregador.'
    },
    {
        label: 'IRS Jovem',
        varName: 'irsJovem',
        value: null,
        fieldType: 'select',
        options: [
            { label: 'Não', code: 'no' },
            { label: '1.° Ano', code: '1' },
            { label: '2.° Ano', code: '2' },
            { label: '3.° Ano', code: '3' },
            { label: '4.° Ano', code: '4' },
            { label: '5.° Ano', code: '5' },
            { label: '6.° Ano', code: '6' },
            { label: '7.° Ano', code: '7' },
            { label: '8.° Ano', code: '8' },
            { label: '9.° Ano', code: '9' },
            { label: '10.° Ano', code: '10' },
        ],
        required: true
    },
    {
        label: 'Idade',
        varName: 'age',
        value: null,
        fieldType: 'posInt',
        required: true
    },
])

let localFieldsDeductions = ref([
    {
        label: 'Ded. Despesas gerais e familiares',
        varName: 'generalFamilyExpenses',
        value: null,
        fieldType: 'currency',
        placeHolder: '0,00€',
        toolTip: 'Inclui: supermercado, vestuário, água, eletricidade, telecomunicações, combustíveis, etc.'
    },
    {
        label: 'Ded. Saúde',
        varName: 'healthExpenses',
        value: null,
        fieldType: 'currency',
        placeHolder: '0,00€',
        toolTip: 'Inclui: consultas, medicamentos, seguros de saúde (desde que isentos de IVA ou com receita médica).'
    },
    {
        label: 'Ded. Educação e formação',
        varName: 'educationExpenses',
        value: null,
        fieldType: 'currency',
        placeHolder: '0,00€',
        toolTip: 'Inlui: propinas, manuais escolares, explicações, rendas de quarto em cidade universitária (com contrato e fatura).'
    },
    {
        label: 'Ded. Habitação',
        varName: 'rentExpenses',
        value: null,
        fieldType: 'currency',
        placeHolder: '0,00€',
        toolTip: 'Arrendatários e titulares de empréstimos antigos para habitação podem deduzir rendas e juros no IRS, com limites ajustados ao rendimento. Senhorios podem deduzir despesas como IMI, obras e condomínio, desde que comprovadas.'
    },
    {
        label: 'Ded. Lares',
        varName: 'careHomeExpenses',
        value: null,
        fieldType: 'currency',
        placeHolder: '0,00€',
        toolTip: 'Inlcui: apoio domiciliário, lares e instituições de apoio à terceira idade. Encargos com dependentes, ascendentes e colaterais até ao 3.º grau, com deficiência e com rendimentos inferiores ao salário mínimo nacional(870€ em 2025).'
    },
    {
        label: 'Ded. Jornais e Revistas',
        varName: 'journalsMagazinesExpenses',
        value: null,
        fieldType: 'currency',
        placeHolder: '0,00€'
    },
    {
        label: 'Ded. Ginásios',
        varName: 'gymExpenses',
        value: null,
        fieldType: 'currency',
        placeHolder: '0,00€'
    },
    {
        label: 'Ded. Passes mensais',
        varName: 'monthlyTransitPasses',
        value: null,
        fieldType: 'currency',
        placeHolder: '0,00€'
    },
    {
        label: 'Ded. Atividades veterinárias',
        varName: 'veterinaryActivities',
        value: null,
        fieldType: 'currency',
        placeHolder: '0,00€'
    },
    {
        label: 'Ded. Cabeleireiros',
        varName: 'barberExpenses',
        value: null,
        fieldType: 'currency',
        placeHolder: '0,00€'
    },
    {
        label: 'Ded. Restauração e alojamento',
        varName: 'restaurantsHouseExpenses',
        value: null,
        fieldType: 'currency',
        placeHolder: '0,00€'
    },
    {
        label: 'Ded. Reparação de veículos',
        varName: 'vehicleRepairExpenses',
        value: null,
        fieldType: 'currency',
        placeHolder: '0,00€',
        toolTip: 'Inclui apenas despesas associadas a automovéis e motociclos'
    },
    {
        label: 'Pensão de alimentos',
        varName: 'alimonyExpenses',
        value: null,
        fieldType: 'currency',
        placeHolder: '0,00€',
        toolTip: 'São consideradas apenas as pensões de alimentos cujo pagamento tenha sido decretado por sentença judicial ou acordo homologado.'
    },
    {
        label: 'Plano Poupança Reforma',
        varName: 'pprExpenses',
        value: null,
        fieldType: 'currency',
        placeHolder: '0,00€'
    },
    {
        label: 'Donativos',
        varName: 'donations',
        value: null,
        fieldType: 'currency',
        placeHolder: '0,00€'
    },
])

const stepTitleIncome = 'Rendimentos sujeito passivo B'
const stepTitleDeductions = 'Deduções à coleta sujeito passivo B'

const isFormValid = computed(() => {
    if(formDisabled){
        return true;
    }
    return localFieldsIncome.value.every(field => {
        if (field.required) {
            return field.value !== null && field.value !== '';
        }
        return true;
    });
});

const nextStep = () => {
    if (!isFormValid.value) {
        return;
    }
    
    const formDataIncome = localFieldsIncome.value.reduce((formDataAcc, field) => {
        formDataAcc[field.varName] = field.value;
        return formDataAcc;
    }, {});

    const formDataDeductions = localFieldsDeductions.value.reduce((formDataAcc, field) => {
        formDataAcc[field.varName] = field.value;
        return formDataAcc;
    }, {});

    calculatorStore.setIncomeFieldsB(formDataIncome);
    calculatorStore.setTaxDeductionsFieldsB(formDataDeductions);
    emit('nextCallback')
}

</script>

<style scoped></style>
