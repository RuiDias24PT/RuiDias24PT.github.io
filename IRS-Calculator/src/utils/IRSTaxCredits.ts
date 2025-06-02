import { ALIMONY_TAX, DEDUCTION_ANCESTOR, DEDUCTION_BONUS_ANCESTOR, DEDUCTION_BONUS_FIRST_UNTIL_3Y, DEDUCTION_BONUS_UNTIL_6Y, DEDUCTION_PER_DEPENDENT, DONATIONS_RETURN, FACTOR_FOR_DEPENDENTS_TAX_CREDITS_LIMIT, MAX_EDUCATION_DEDUCTIONS, MAX_FAMILY_DEDUCTIONS, MAX_HEALTH_DEDUCTIONS, MAX_INCOME, MAX_OTHER_DEDUCTIONS, MAX_PPR_35_50_DEDUCTIONS, MAX_PPR_35_LOWER_DEDUCTIONS, MAX_PPR_50_HIGHER_DEDUCTIONS, MAX_REAL_STATE_DEDUCTIONS, MAX_RETIREMENT_HOME_DEDUCTIONS, MAX_TAX_CREDITS_CAP, MIN_INCOME, MIN_TAX_CREDITS_CAP, PPR_RETURN } from "@/constants/IRSConstants";
import type { FormData } from "@/types/IRS";

//Deduções por dependentes e ascendentes
export const dependentsAncestorsDeductions = (
  childrenUnder3: number,
  children3to6: number,
  childrenOver6: number,
  ancestors: number,
): number => {
  const totalChildren = childrenUnder3 + children3to6 + childrenOver6;

  let childDeductions = totalChildren * DEDUCTION_PER_DEPENDENT;

  if (childrenUnder3 >= 1) {
    childDeductions += DEDUCTION_BONUS_FIRST_UNTIL_3Y;
  }

  const totalChildrenUnder6 = childrenUnder3 + children3to6;
  if (totalChildrenUnder6 > 1) {
    childDeductions += (totalChildrenUnder6 - 1) * DEDUCTION_BONUS_UNTIL_6Y;
  }

  let ancestorDeductions = ancestors * DEDUCTION_ANCESTOR;

  if (ancestors === 1) {
    ancestorDeductions += DEDUCTION_BONUS_ANCESTOR;
  }

  return childDeductions + ancestorDeductions;
};

//Deduções máximas por PPR
export const maxPPRExpensesDeductions = (age: number): number => {
  if (age < 35) {
    return MAX_PPR_35_LOWER_DEDUCTIONS;
  } else if (age >= 35 && age <= 50) {
    return MAX_PPR_35_50_DEDUCTIONS;
  } else {
    return MAX_PPR_50_HIGHER_DEDUCTIONS;
  }
};

export const getCappedDeductions = (
  incomeTaxDeductionsA: FormData,
  maxCreditAllCategories: Record<string, number>,
): Record<string, number> => {
  return {
    generalExpenseDeductions: Math.min(
      incomeTaxDeductionsA.generalFamilyExpenses,
      maxCreditAllCategories.maxfamilyExpensesDeduction,
    ),
    maxHealthExpensesDeduction: Math.min(
      incomeTaxDeductionsA.healthExpenses,
      maxCreditAllCategories.maxHealthExpensesDeduction,
    ),
    educationExpensesDeduction: Math.min(
      incomeTaxDeductionsA.educationExpenses,
      maxCreditAllCategories.maxEducationExpensesDeduction,
    ),
    realStateDeductions: Math.min(
      incomeTaxDeductionsA.rentExpenses,
      maxCreditAllCategories.maxRealStateDeductions,
    ),
    alimonyDeductions: Math.min(
      incomeTaxDeductionsA.alimonyExpenses * ALIMONY_TAX,
      maxCreditAllCategories.maxAlimonyDeductions,
    ),
    otherDeductions: Math.min(
      incomeTaxDeductionsA.otherDeductions,
      maxCreditAllCategories.maxOtherDeductions,
    ),
    retirementHomeDeduction: Math.min(
      incomeTaxDeductionsA.careHomeExpenses,
      maxCreditAllCategories.maxRetirementHomeDeduction,
    ),
    PPRDeduction: Math.min(
      incomeTaxDeductionsA.pprExpenses * PPR_RETURN,
      maxCreditAllCategories.maxPPRDeduction,
    ),
    donations: Math.min(
      incomeTaxDeductionsA.donations * DONATIONS_RETURN,
      maxCreditAllCategories.maxDonations,
    ),
  };
};

export const getValueAndCapForDeductions = (
  incomeTaxDeductionsA: FormData,
  married: boolean,
  age: number,
): Record<string, { value: number; max: number }> => {
  const maxCreditAllCategories = maxTaxcreditsPerCategory(married, age);

  const valueAndCap = {
    generalFamilyExpenses: {
      value: Math.min(
        incomeTaxDeductionsA.generalFamilyExpenses,
        maxCreditAllCategories.maxfamilyExpensesDeduction,
      ),
      max: maxCreditAllCategories.maxfamilyExpensesDeduction,
    },
    healthExpenses: {
      value: Math.min(
        incomeTaxDeductionsA.healthExpenses,
        maxCreditAllCategories.maxHealthExpensesDeduction,
      ),
      max: maxCreditAllCategories.maxHealthExpensesDeduction,
    },
    educationExpenses: {
      value: Math.min(
        incomeTaxDeductionsA.educationExpenses,
        maxCreditAllCategories.maxEducationExpensesDeduction,
      ),
      max: maxCreditAllCategories.maxEducationExpensesDeduction,
    },
    rentExpenses: {
      value: Math.min(
        incomeTaxDeductionsA.rentExpenses,
        maxCreditAllCategories.maxRealStateDeductions,
      ),
      max: maxCreditAllCategories.maxRealStateDeductions,
    },
    alimonyExpenses: {
      value: Math.min(
        incomeTaxDeductionsA.alimonyExpenses * ALIMONY_TAX,
        maxCreditAllCategories.maxAlimonyDeductions,
      ),
      max: maxCreditAllCategories.maxAlimonyDeductions,
    },
    otherDeductions: {
      value: Math.min(
        incomeTaxDeductionsA.otherDeductions,
        maxCreditAllCategories.maxOtherDeductions,
      ),
      max: maxCreditAllCategories.maxOtherDeductions,
    },
    careHomeExpenses: {
      value: Math.min(
        incomeTaxDeductionsA.careHomeExpenses,
        maxCreditAllCategories.maxRetirementHomeDeduction,
      ),
      max: maxCreditAllCategories.maxRetirementHomeDeduction,
    },
    pprExpenses: {
      value: Math.min(
        incomeTaxDeductionsA.pprExpenses * PPR_RETURN,
        maxCreditAllCategories.maxPPRDeduction,
      ),
      max: maxCreditAllCategories.maxPPRDeduction,
    },
    donations: {
      value: Math.min(
        incomeTaxDeductionsA.donations * DONATIONS_RETURN,
        maxCreditAllCategories.maxDonations,
      ),
      max: maxCreditAllCategories.maxDonations,
    },
  };

  return valueAndCap;
};

export const sumTaxCredits = (
  deductions: Record<string, { value: number; max: number }>,
): number => {
  return Object.values(deductions).reduce((total, current) => total + current.value, 0);
};

export const maxTaxCredits = (taxableIncome: number, numberDependents: number): number => {
  if (taxableIncome <= MIN_INCOME) {
    return Infinity;
  }

  if (taxableIncome > MAX_INCOME) {
    return MIN_TAX_CREDITS_CAP;
  }

  const fator = (MAX_INCOME - taxableIncome) / (MAX_INCOME - MIN_INCOME);

  const limite = MIN_TAX_CREDITS_CAP + (MAX_TAX_CREDITS_CAP - MIN_TAX_CREDITS_CAP) * fator;

  const rawMaxDeductions = Math.round(limite * 100) / 100;

  if (numberDependents >= 3) {
    const dependentsFactor = FACTOR_FOR_DEPENDENTS_TAX_CREDITS_LIMIT * numberDependents;

    return rawMaxDeductions + rawMaxDeductions * dependentsFactor;
  } else {
    return rawMaxDeductions;
  }
};

export const maxTaxcreditsPerCategory = (married: boolean, age: number): Record<string, number> => {
  const maxfamilyExpensesDeduction = married ? MAX_FAMILY_DEDUCTIONS * 2 : MAX_FAMILY_DEDUCTIONS;
  const maxHealthExpensesDeduction = MAX_HEALTH_DEDUCTIONS;
  const maxEducationExpensesDeduction = MAX_EDUCATION_DEDUCTIONS;
  const maxRealStateDeductions = MAX_REAL_STATE_DEDUCTIONS;
  const maxAlimonyDeductions = Infinity;
  const maxOtherDeductions = MAX_OTHER_DEDUCTIONS;
  const maxRetirementHomeDeduction = MAX_RETIREMENT_HOME_DEDUCTIONS;
  const maxPPRDeduction = maxPPRExpensesDeductions(age);
  const maxPPRDeductionFinal = married ? maxPPRDeduction * 2 : maxPPRDeduction;
  const maxDonations = Infinity;

  return {
    maxfamilyExpensesDeduction: maxfamilyExpensesDeduction,
    maxHealthExpensesDeduction: maxHealthExpensesDeduction,
    maxEducationExpensesDeduction: maxEducationExpensesDeduction,
    maxRealStateDeductions: maxRealStateDeductions,
    maxAlimonyDeductions: maxAlimonyDeductions,
    maxOtherDeductions: maxOtherDeductions,
    maxRetirementHomeDeduction: maxRetirementHomeDeduction,
    maxPPRDeduction: maxPPRDeductionFinal,
    maxDonations: maxDonations,
  };
};