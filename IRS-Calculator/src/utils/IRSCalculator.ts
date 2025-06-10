import { type FormData } from '@/stores/useCalculatorStore';
import type { IRSResult, TaxBracket } from '@/types/IRS';
import {
  SOCIAL_SECURITY_TAX,
  BASE_SPECIFIC_DEDUCTION,
  tabelaIRS,
  ALIMONY_TAX,
} from '@/constants/IRSConstants';
import {
  dependentsAncestorsDeductions,
  getValueAndCapForDeductions,
  getValueAndCapForDeductionsCouple,
  maxTaxCredits,
  municipalityDeduction,
  sumTaxCredits,
} from './IRSTaxCredits';
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
export const getTaxBracket = (
  taxableIncome: number,
): Pick<TaxBracket, 'taxBracket' | 'label' | 'tax' | 'deductionAmount'> => {
  const bracket = tabelaIRS.find((escalao: TaxBracket) => {
    const minOk = taxableIncome >= escalao.min;
    const maxOk = escalao.max === null || taxableIncome <= escalao.max;
    return minOk && maxOk;
  });

  if (!bracket) {
    throw new Error('Rendimento fora dos escalões definidos.');
  }

  return {
    taxBracket: bracket.taxBracket,
    label: bracket.label,
    tax: bracket.tax,
    deductionAmount: bracket.deductionAmount,
  };
};

export const effectiveIRSTaxRate = (taxableIncome: number, incomeTaxDue: number): number => {
  if (taxableIncome === 0) {
    return 0;
  }
  return (incomeTaxDue / taxableIncome) * 100;
};

export const IRSreimbursementPayment = (
  withHoldingTax: number,
  incomeTaxDue: number,
  taxCredits: number,
) => {
  return withHoldingTax - (incomeTaxDue - taxCredits);
};

const calculateOtherDeductions = (deductions: FormData): number => {
  return (
    deductions.journalsMagazinesExpenses +
    deductions.gymExpenses +
    deductions.monthlyTransitPasses +
    deductions.veterinaryActivities +
    deductions.barberExpenses +
    deductions.vehicleRepairExpenses +
    deductions.restaurantsHouseExpenses
  );
};

const getDependentsTotal = (info: FormData): number => {
  return (
    info.dependentsAncestors +
    info.dependentsAboveSixYears +
    info.dependentsBetweenFourSixYears +
    info.dependentsBelowThreeYears
  );
};

export const getIRSResultSingle = async (
  generalInfoData: FormData,
  incomeTaxDeductionsA: FormData,
): Promise<IRSResult> => {
  incomeTaxDeductionsA.otherDeductions = calculateOtherDeductions(incomeTaxDeductionsA);

  const {
    grossAnnualIncome: origGross,
    specificDeductions,
    irsJovem,
    age,
    alimonyEarnings,
    withholdingTax,
  } = incomeTaxDeductionsA;
  const originalTaxIncome = taxableIncome(origGross, specificDeductions);
  const originalTaxBracket = getTaxBracket(originalTaxIncome);

  let grossAnnualIncome = origGross;
  let IRSExemptionSalary = 0;
  if (irsJovem !== 'no') {
    IRSExemptionSalary = IRSJovemExemption(grossAnnualIncome, irsJovem);
    grossAnnualIncome -= IRSExemptionSalary;
  }

  const specificDed = specificDeductionsCalculation(grossAnnualIncome);
  const taxableIncomeAmount = taxableIncome(grossAnnualIncome, specificDed);
  const IRSBracket = getTaxBracket(taxableIncomeAmount);
  const alimonyTaxDue = alimonyEarnings ? alimonyEarnings * ALIMONY_TAX : 0;
  const IRSDue = incomeTaxDue(taxableIncomeAmount, IRSBracket) + alimonyTaxDue;
  const municipalityDeductionAmount = await municipalityDeduction(
    IRSDue,
    generalInfoData.municipality,
  );

  const capAndDeductionPerCategory = getValueAndCapForDeductions(incomeTaxDeductionsA, false, age);
  const dependentsTaxCredits = dependentsAncestorsDeductions(
    generalInfoData.dependentsBelowThreeYears,
    generalInfoData.dependentsBetweenFourSixYears,
    generalInfoData.dependentsAboveSixYears,
    generalInfoData.dependentsAncestors,
  );
  const taxCreditSumAmount = sumTaxCredits(capAndDeductionPerCategory) + dependentsTaxCredits;

  let maxTaxCreditsOverall = maxTaxCredits(
    taxableIncomeAmount,
    getDependentsTotal(generalInfoData),
  );
  const afterMunicipalityBenefitIRSDue =
    IRSDue === 0 ? 0 : Math.max(IRSDue - municipalityDeductionAmount, 0);
  if (!isFinite(maxTaxCreditsOverall)) maxTaxCreditsOverall = afterMunicipalityBenefitIRSDue;

  const taxCreditFinal = Math.min(Math.min(taxCreditSumAmount, maxTaxCreditsOverall), IRSDue);

  return {
    grossAnnualIncome: origGross,
    taxableIncome: taxableIncomeAmount,
    irsBracketLevel: originalTaxBracket.label,
    IRSBracketMarginalTax: originalTaxBracket.tax,
    withHoldingTax: withholdingTax,
    IRSDueOriginal: IRSDue,
    IRSDue: afterMunicipalityBenefitIRSDue,
    effectiveIRSTax: effectiveIRSTaxRate(taxableIncomeAmount, IRSDue),
    taxCredits: taxCreditFinal,
    taxCreditsAmount: taxCreditSumAmount,
    reimbursement: IRSreimbursementPayment(
      withholdingTax,
      afterMunicipalityBenefitIRSDue,
      taxCreditFinal,
    ),
    maxTaxCreditsOverall: maxTaxCreditsOverall,
    maxTaxcreditsPerCategory: capAndDeductionPerCategory,
  };
};

export const getIRSResultCouple = async (
  generalInfoData: FormData,
  incomeTaxDeductionsA: FormData,
  incomeTaxDeductionsB: FormData,
): Promise<IRSResult> => {
  incomeTaxDeductionsA.otherDeductions = calculateOtherDeductions(incomeTaxDeductionsA);
  incomeTaxDeductionsB.otherDeductions = calculateOtherDeductions(incomeTaxDeductionsB);
  debugger;
  const {
    grossAnnualIncome: origGrossA,
    specificDeductions: specificDeductionsA,
    irsJovem: irsJovemA,
    age: ageA,
    alimonyDeductions: alimonyEarningsA,
    withholdingTax: withholdingTaxA,
  } = incomeTaxDeductionsA;

  const {
    grossAnnualIncome: origGrossB,
    specificDeductions: specificDeductionsB,
    irsJovem: irsJovemB,
    alimonyDeductions: alimonyEarningsB,
    withholdingTax: withholdingTaxB,
  } = incomeTaxDeductionsB;
  

  const origGross = origGrossA + origGrossB;

  const originalTaxIncomeA = taxableIncome(origGrossA, specificDeductionsA);
  const originalTaxIncomeB = taxableIncome(origGrossB, specificDeductionsB);

  const originalTaxIncome = originalTaxIncomeA + originalTaxIncomeB;

  const originalTaxBracket = getTaxBracket(originalTaxIncome);

  let grossAnnualIncomeA = origGrossA;
  let grossAnnualIncomeB = origGrossB;

  let IRSExemptionSalaryA = 0;
  if (irsJovemA !== 'no') {
    IRSExemptionSalaryA = IRSJovemExemption(origGrossA, irsJovemA);
    grossAnnualIncomeA -= IRSExemptionSalaryA;
  }

  let IRSExemptionSalaryB = 0;
  if (irsJovemB !== 'no') {
    IRSExemptionSalaryB = IRSJovemExemption(origGrossB, irsJovemB);
    grossAnnualIncomeB -= IRSExemptionSalaryB;
  }

  const specificDedA = specificDeductionsCalculation(grossAnnualIncomeA);
  const specificDedB = specificDeductionsCalculation(grossAnnualIncomeA); 

  const taxableIncomeAmountA = taxableIncome(grossAnnualIncomeA, specificDedA);
  const taxableIncomeAmountB = taxableIncome(grossAnnualIncomeB, specificDedB);
  
  const taxableIncomeAmount = taxableIncomeAmountA + taxableIncomeAmountB;

  const IRSBracket = getTaxBracket(taxableIncomeAmount);

  const alimonyTaxDueA = alimonyEarningsA ? alimonyEarningsA * ALIMONY_TAX : 0;
  const alimonyTaxDueB = alimonyEarningsB ? alimonyEarningsB * ALIMONY_TAX : 0;

  const IRSDue = incomeTaxDue(taxableIncomeAmount, IRSBracket) + alimonyTaxDueA + alimonyTaxDueB;

  const municipalityDeductionAmount = await municipalityDeduction(
    IRSDue,
    generalInfoData.municipality,
  );

  const capAndDeductionPerCategory = getValueAndCapForDeductionsCouple(incomeTaxDeductionsA,incomeTaxDeductionsB, true, ageA);

  const dependentsTaxCredits = dependentsAncestorsDeductions(
    generalInfoData.dependentsBelowThreeYears,
    generalInfoData.dependentsBetweenFourSixYears,
    generalInfoData.dependentsAboveSixYears,
    generalInfoData.dependentsAncestors,
  );
  const taxCreditSumAmount = sumTaxCredits(capAndDeductionPerCategory) + dependentsTaxCredits;

  let maxTaxCreditsOverall = maxTaxCredits(
    taxableIncomeAmount,
    getDependentsTotal(generalInfoData),
  );
  const afterMunicipalityBenefitIRSDue =
    IRSDue === 0 ? 0 : Math.max(IRSDue - municipalityDeductionAmount, 0);
  if (!isFinite(maxTaxCreditsOverall)) maxTaxCreditsOverall = afterMunicipalityBenefitIRSDue;

  const taxCreditFinal = Math.min(Math.min(taxCreditSumAmount, maxTaxCreditsOverall), IRSDue);

  return {
    grossAnnualIncome: origGross,
    taxableIncome: taxableIncomeAmount,
    irsBracketLevel: originalTaxBracket.label,
    IRSBracketMarginalTax: originalTaxBracket.tax,
    withHoldingTax: withholdingTaxA + withholdingTaxB,
    IRSDueOriginal: IRSDue,
    IRSDue: afterMunicipalityBenefitIRSDue,
    effectiveIRSTax: effectiveIRSTaxRate(taxableIncomeAmount, IRSDue),
    taxCredits: taxCreditFinal,
    taxCreditsAmount: taxCreditSumAmount,
    reimbursement: IRSreimbursementPayment(
      withholdingTaxA + withholdingTaxB,
      afterMunicipalityBenefitIRSDue,
      taxCreditFinal,
    ),
    maxTaxCreditsOverall: maxTaxCreditsOverall,
    maxTaxcreditsPerCategory: capAndDeductionPerCategory,
  };
};