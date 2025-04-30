import { reactive } from 'vue'

const state = reactive({
  generalInfoFields: {},
  stepTwoFields: {},
  subjectBFields: {},
})

export function useCalculatorStore() {
  function setGeneralInfoFields(data: any) {
    state.generalInfoFields = { ...data }
  }

  function setStepTwoFields(data: any) {
    state.stepTwoFields = { ...data }
  }

  function setSubjectBFields(data: any) {
    state.subjectBFields = { ...data }
  }

  function getAllFields() {
    return { ...state }
  }

  return {
    state,
    setGeneralInfoFields,
    setStepTwoFields,
    setSubjectBFields,
    getAllFields,
  }
}
