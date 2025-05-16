import { defineStore } from 'pinia';

//To do: More specific typing
export interface FormData {
  [key: string]: any
}
interface CalculatorState {
  generalInfoFields: FormData
  incomeFieldsA: FormData
  taxDeductionsFieldsA: FormData
  incomeFieldsB: FormData
  taxDeductionsFieldsB: FormData
}

export const useCalculatorStore = defineStore('calculatorStore', {
  state: (): CalculatorState => ({
    generalInfoFields: {},
    incomeFieldsA: {},
    taxDeductionsFieldsA: {},
    incomeFieldsB: {},
    taxDeductionsFieldsB: {},
  }),
  actions: {
    setGeneralInfoFields(data: FormData) {
      this.generalInfoFields = data
    },
    setIncomeFieldsA(data: FormData) {
      this.incomeFieldsA = { ...data }
    },
    setIncomeFieldsB(data: FormData) {
      this.incomeFieldsB = { ...data }
    },
    setTaxDeductionsFieldsA(data: FormData) {
      this.taxDeductionsFieldsA = { ...data }
    },
    setTaxDeductionsFieldsB(data: FormData) {
      this.taxDeductionsFieldsB = { ...data }
    },
    clearIncomeTaxDeductionsB(){
      this.incomeFieldsB = {};
      this.taxDeductionsFieldsB = {};
    },
    getAllFields() {
      return {
        generalInfoFields: this.generalInfoFields,
        incomeFieldsA: this.incomeFieldsA,
        incomeFieldsB: this.incomeFieldsB,
        taxDeductionsFieldsA: this.taxDeductionsFieldsA,
        taxDeductionsFieldsB: this.taxDeductionsFieldsB,
      }
    },
  },
})
