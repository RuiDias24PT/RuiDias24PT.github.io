import { type FormData } from '@/stores/useCalculatorStore';
import type { Municipality, TaxBracket } from '@/types/IRS';
import {
  SOCIAL_SECURITY_TAX,
  BASE_SPECIFIC_DEDUCTION,
  tabelaIRS,
  MAX_MUNICIPALITY_PARTICIPATION_TAX,
  ALIMONY_TAX,
} from '@/constants/IRSConstants';
import { dependentsAncestorsDeductions, getCappedDeductions, maxTaxCredits, maxTaxcreditsPerCategory, sumTaxCredits } from './IRSTaxCredits';
import { incomeTaxDue, IRSJovemExemption } from './IRSDueCalculator';

//Pagamento segurança social
export const socialSecurityPayment = (income: number): number => {
  return income * SOCIAL_SECURITY_TAX;
};

//Deduções especificas
export const specificDeductionsCalculation = (income: number): number => {
  const socialSecurityToPay = socialSecurityPayment(income);
  return socialSecurityToPay > BASE_SPECIFIC_DEDUCTION
    ? socialSecurityToPay
    : BASE_SPECIFIC_DEDUCTION;
};

//Renda coletavel
export const taxableIncome = (income: number, specificDeductionsCalculation: number) => {
  const taxableIncome = income - specificDeductionsCalculation;
  if (taxableIncome > 0) {
    return taxableIncome;
  } else {
    return 0;
  }
};

//Escalão de IRS
export const getTaxBracket = (taxableIncome: number) => {
  const escalão = tabelaIRS.find((escalao: any) => {
    const minOk = taxableIncome >= escalao.min;
    const maxOk = escalao.max === null || taxableIncome <= escalao.max;
    return minOk && maxOk;
  });

  if (!escalão) {
    throw new Error('Rendimento fora dos escalões definidos.');
  }

  return {
    taxBracket: escalão.escalão,
    label: escalão.label,
    tax: escalão.tax,
    deductionAmount: escalão.deductionAmount,
  };
};


//Benefício de municipio
export const municipalityDeduction = async (
  incomeTaxDue: number,
  municipality: string,
): Promise<number> => {
  const response = await fetch('/municipios.json');
  const municipalities = await response.json();

  const municipalityObject = municipalities.find(
    (muni: Municipality) => muni.municipality === municipality,
  );

  const participation = municipalityObject.participation;
  const taxDeduction = MAX_MUNICIPALITY_PARTICIPATION_TAX - participation;

  if (incomeTaxDue === 0 || taxDeduction === 0) {
    return 0;
  } else {
    return incomeTaxDue * taxDeduction;
  }
};

export const effectiveIRSTaxRate = (taxableIncome: number, incomeTaxDue: number): number => {
  return parseFloat((incomeTaxDue / taxableIncome).toFixed(2));
};

export const IRSreimbursementPayment = (
  withHoldingTax: number,
  incomeTaxDue: number,
  taxCredits: number,
) => {
  return withHoldingTax - (incomeTaxDue - taxCredits);
};

export const getIRSResultSingle = async (
  generalInfoData: FormData,
  incomeTaxDeductionsA: FormData,
) => {

  incomeTaxDeductionsA.otherDeductions =
    incomeTaxDeductionsA.journalsMagazinesExpenses +
    incomeTaxDeductionsA.gymExpenses +
    incomeTaxDeductionsA.monthlyTransitPasses +
    incomeTaxDeductionsA.veterinaryActivities +
    incomeTaxDeductionsA.barberExpenses +
    incomeTaxDeductionsA.vehicleRepairExpenses +
    incomeTaxDeductionsA.restaurantsHouseExpenses;

  const originalGrossAnualIncome: number = incomeTaxDeductionsA.grossAnnualIncome;
  const originalTaxIncome: number = taxableIncome(originalGrossAnualIncome, incomeTaxDeductionsA.specificDeductions);
  const originalTaxBracket = getTaxBracket(originalTaxIncome);

  let grossAnnualIncome: number = incomeTaxDeductionsA.grossAnnualIncome;
  let IRSExemptionSalary = 0;
  const dependentsTaxCredits = dependentsAncestorsDeductions(
    generalInfoData.dependentsBelowThreeYears,
    generalInfoData.dependentsBetweenFourSixYears,
    generalInfoData.dependentsAboveSixYears,
    generalInfoData.dependentsAncestors,
  );
  if (incomeTaxDeductionsA.irsJovem !== 'no') {
    IRSExemptionSalary = IRSJovemExemption(grossAnnualIncome, incomeTaxDeductionsA.irsJovem);
    grossAnnualIncome = grossAnnualIncome - IRSExemptionSalary;
  }
  const specificDeductions: number = specificDeductionsCalculation(grossAnnualIncome);
  const taxableIncomeAmount: number = taxableIncome(grossAnnualIncome, specificDeductions);
  const age: number = incomeTaxDeductionsA.age;
  const IRSBracket = getTaxBracket(taxableIncomeAmount);
  let alimonyTaxDue = 0;
  if (incomeTaxDeductionsA.alimonyPayments) {
    alimonyTaxDue = incomeTaxDeductionsA.alimonyPayments * ALIMONY_TAX;
  }
  const IRSDue = incomeTaxDue(taxableIncomeAmount, IRSBracket) + alimonyTaxDue;
  const municipalityDeductionAmount = await municipalityDeduction(
    IRSDue,
    generalInfoData.municipality,
  );

  const maxTaxCredit = maxTaxcreditsPerCategory(false, age);
  debugger;
  const deductionsCappedAllCategories = getCappedDeductions(incomeTaxDeductionsA, maxTaxCredit);
  const taxCreditSumAmount = sumTaxCredits(deductionsCappedAllCategories) + dependentsTaxCredits;
  
  const maxTaxCreditsOverall = maxTaxCredits(
    taxableIncomeAmount,
    generalInfoData.dependentsAncestors +
      generalInfoData.dependentsAboveSixYears +
      generalInfoData.dependentsBetweenFourSixYears +
      generalInfoData.dependentsBelowThreeYears,
  );

  const taxCreditCapped = Math.min(taxCreditSumAmount, maxTaxCreditsOverall);

  const taxCreditFinal = Math.min(taxCreditCapped, IRSDue);

  const afterMunicipalityBenefitIRSDue =
    IRSDue === 0 ? 0 : Math.max(IRSDue - municipalityDeductionAmount, 0);

  const reiumbursement = IRSreimbursementPayment(
    incomeTaxDeductionsA.withholdingTax,
    IRSDue,
    taxCreditSumAmount,
  );

  const effectiveIrsTaxRate = effectiveIRSTaxRate(taxableIncomeAmount, IRSDue);

  return {
    grossAnnualIncome: originalGrossAnualIncome,
    taxableIncome: taxableIncomeAmount,
    irsBracketLevel: originalTaxBracket.label,
    IRSBracketMarginalTax: originalTaxBracket.tax,
    withHoldingTax: incomeTaxDeductionsA.withholdingTax,
    IRSDue: afterMunicipalityBenefitIRSDue,
    effectiveIRSTax: effectiveIrsTaxRate,
    taxCredits: taxCreditFinal,
    reiumbursement: reiumbursement,
    maxTaxCreditsOverall: maxTaxCreditsOverall,
    maxTaxcreditsPerCategory: maxTaxCredit,
  };
};

export { dependentsAncestorsDeductions };
