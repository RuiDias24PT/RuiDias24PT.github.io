import { defineStore } from 'pinia';

interface Field {
  label?: string,
  varName: string
  value: any,
  fieldType: string,
  options?: object[],
  toolTip?: string,
  required?: boolean,
}

interface CalculatorState {
  generalInfoFields: Field[]
  incomeTaxDeductionsFieldsA: Field[]
  incomeTaxDeductionsFieldsB: Field[]
}

export const useCalculatorStore = defineStore('calculatorStore', {
  state: (): CalculatorState => ({
    generalInfoFields: [],
    incomeTaxDeductionsFieldsA: [],
    incomeTaxDeductionsFieldsB: [],
  }),
  actions: {
    setGeneralInfoFields(data: any) {
      this.generalInfoFields = data
    },
    setIncomeTaxDeductionsFieldsA(data: any) {
      this.incomeTaxDeductionsFieldsA = { ...data }
    },
    setIncomeTaxDeductionsFieldsB(data: any) {
      this.incomeTaxDeductionsFieldsB = { ...data }
    },
    getAllFields() {
      return {
        generalInfoFields: this.generalInfoFields,
        incomeTaxDeductionsFieldsA: this.incomeTaxDeductionsFieldsA,
        incomeTaxDeductionsFieldsB: this.incomeTaxDeductionsFieldsB,
      }
    },
  },
})
