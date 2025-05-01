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
  stepTwoFields: Field[]
  subjectBFields: Field[]
}

export const useCalculatorStore = defineStore('calculatorStore', {
  state: (): CalculatorState => ({
    generalInfoFields: [],
    stepTwoFields: [],
    subjectBFields: [],
  }),
  actions: {
    setGeneralInfoFields(data: any) {
      this.generalInfoFields = data
    },
    setStepTwoFields(data: any) {
      this.stepTwoFields = { ...data }
    },
    setSubjectBFields(data: any) {
      this.subjectBFields = { ...data }
    },
    getAllFields() {
      return {
        generalInfoFields: this.generalInfoFields,
        stepTwoFields: this.stepTwoFields,
        subjectBFields: this.subjectBFields,
      }
    },
  },
})
