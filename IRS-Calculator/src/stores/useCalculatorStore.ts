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
  incomeTaxDeductionsFields: Field[]
  subjectBFields: Field[]
}

export const useCalculatorStore = defineStore('calculatorStore', {
  state: (): CalculatorState => ({
    generalInfoFields: [],
    incomeTaxDeductionsFields: [],
    subjectBFields: [],
  }),
  actions: {
    setGeneralInfoFields(data: any) {
      this.generalInfoFields = data
    },
    setIncomeTaxDeductionsFields(data: any) {
      this.incomeTaxDeductionsFields = { ...data }
    },
    setSubjectBFields(data: any) {
      this.subjectBFields = { ...data }
    },
    getAllFields() {
      return {
        generalInfoFields: this.generalInfoFields,
        stepTwoFields: this.incomeTaxDeductionsFields,
        subjectBFields: this.subjectBFields,
      }
    },
  },
})
