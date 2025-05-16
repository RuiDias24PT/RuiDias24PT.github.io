import {type FormData } from "@/stores/useCalculatorStore"
import type { Municipality, TaxBracket } from "@/types/IRS"
import { SOCIAL_SECURITY_TAX, BASE_SPECIFIC_DEDUCTION, MIN_SOLIDARITY_TAXABLE_INCOME, MAX_SOLIDARITY_TAXABLE_INCOME, SOLIDARITY_TAX_80K_TO_250K, SOLIDARITY_TAX_ABOVE_250K, tabelaIRS, MAX_MUNICIPALITY_PARTICIPATION_TAX, DEDUCTION_PER_DEPENDENT, DEDUCTION_BONUS_FIRST_UNTIL_3Y, DEDUCTION_BONUS_UNTIL_6Y, DEDUCTION_ANCESTOR, DEDUCTION_BONUS_ANCESTOR, IRS_JOVEM_INTERVALOS, IRS_JOVEM_LIMITE, ALIMONY_TAX, MAX_PPR_35_LOWER_DEDUCTIONS, MAX_PPR_35_50_DEDUCTIONS, MAX_PPR_50_HIGHER_DEDUCTIONS, PPR_RETURN, DONATIONS_RETURN, MIN_INCOME, MAX_INCOME, MIN_TAX_CREDITS_CAP, MAX_TAX_CREDITS_CAP, FACTOR_FOR_DEPENDENTS_TAX_CREDITS_LIMIT, MAX_FAMILY_DEDUCTIONS, MAX_HEALTH_DEDUCTIONS, MAX_EDUCATION_DEDUCTIONS, MAX_REAL_STATE_DEDUCTIONS, MAX_OTHER_DEDUCTIONS, MAX_RETIREMENT_HOME_DEDUCTIONS } from "../constants/IRSConstants"

//Pagamento segurança social
export const socialSecurityPayment = (income: number): number => {
  return income * SOCIAL_SECURITY_TAX
}

//Deduções especificas
export const specificDeductionsCalculation = (income: number): number => {
  const socialSecurityToPay = socialSecurityPayment(income)
  return socialSecurityToPay > BASE_SPECIFIC_DEDUCTION
    ? socialSecurityToPay
    : BASE_SPECIFIC_DEDUCTION
}

//Renda coletavel
export const taxableIncome = (income: number, specificDeductionsCalculation: number) => {
  const taxableIncome = income - specificDeductionsCalculation
  if (taxableIncome > 0) {
    return taxableIncome
  } else {
    return 0
  }
}

//Solidarity tax amount
export const solidarityTax = (taxableIncome: number): number => {
  let tax = 0

  if (taxableIncome > MIN_SOLIDARITY_TAXABLE_INCOME) {
    const upperLimit = Math.min(taxableIncome, MAX_SOLIDARITY_TAXABLE_INCOME)
    tax += (upperLimit - MIN_SOLIDARITY_TAXABLE_INCOME) * SOLIDARITY_TAX_80K_TO_250K
  }

  if (taxableIncome > MAX_SOLIDARITY_TAXABLE_INCOME) {
    tax += (taxableIncome - MAX_SOLIDARITY_TAXABLE_INCOME) * SOLIDARITY_TAX_ABOVE_250K
  }

  return parseFloat(tax.toFixed(2))
}

//Escalão de IRS
export const getTaxBracket = (taxableIncome: number) => {
  const escalão = tabelaIRS.find((escalao:any) => {
    const minOk = taxableIncome >= escalao.min
    const maxOk = escalao.max === null || taxableIncome <= escalao.max
    return minOk && maxOk
  })

  if (!escalão) {
    throw new Error('Rendimento fora dos escalões definidos.')
  }

  return {
    taxBracket: escalão.escalão,
    label: escalão.label,
    tax: escalão.taxa_marginal,
    deductionAmount: escalão.parcela_abater,
  }
}

//Coleta de IRS
export const incomeTaxDue = (taxableIncome: number, taxBracket: Partial<TaxBracket>): number => {
  
  const { taxa_marginal, parcela_abater } = taxBracket
  if(!taxa_marginal || parcela_abater === undefined){
    return 0
  }
  const taxaDecimal = taxa_marginal / 100

  const incomeTaxDue = taxableIncome * taxaDecimal - parcela_abater
  return parseFloat(incomeTaxDue.toFixed(2))
}

//Benefício de municipio
export const municipalityDeduction = async (incomeTaxDue: number, municipality: string): Promise<number> => {
  
  const response = await fetch('/municipios.json');
  const municipalities = await response.json();

  const municipalityObject = municipalities.find(
    (muni: Municipality) => muni.municipality === municipality,
  );
  
  const participation = municipalityObject.participation;
  const taxDeduction = MAX_MUNICIPALITY_PARTICIPATION_TAX - participation;

  if(incomeTaxDue === 0 || taxDeduction === 0) {
    return 0;
  } else {
    return incomeTaxDue * taxDeduction;
  }
}

//Deduções por dependentes e ascendentes
export const dependentsAncestorsDeductions = (
  childrenUnder3: number,
  children3to6: number,
  childrenOver6: number,
  ancestors: number,
): number => {
  const totalChildren = childrenUnder3 + children3to6 + childrenOver6

  let childDeductions = totalChildren * DEDUCTION_PER_DEPENDENT

  if (childrenUnder3 >= 1) {
    childDeductions += DEDUCTION_BONUS_FIRST_UNTIL_3Y
  }

  const totalChildrenUnder6 = childrenUnder3 + children3to6
  if (totalChildrenUnder6 > 1) {
    childDeductions += (totalChildrenUnder6 - 1) * DEDUCTION_BONUS_UNTIL_6Y
  } 

  let ancestorDeductions = ancestors * DEDUCTION_ANCESTOR

  if (ancestors === 1) {
    ancestorDeductions += DEDUCTION_BONUS_ANCESTOR
  }

  return childDeductions + ancestorDeductions
}

export const effectiveIRSTaxRate = (taxableIncome:number, incomeTaxDue:number):number => {
  return parseFloat((incomeTaxDue / taxableIncome).toFixed(2))
}


export const IRSreimbursementPayment = (withHoldingTax:number, incomeTaxDue:number, taxCredits:number) => {

  return withHoldingTax - (incomeTaxDue - taxCredits)
}

export const IRSJovemExemption = (salarioAnualBruto: number, IRSJovemYear: number) => {
  if (IRSJovemYear < 1 || IRSJovemYear > 10) {
    throw new Error('O ano deve estar entre 1 e 10.')
  }

  const intervalo = IRS_JOVEM_INTERVALOS.find(
    (i) => IRSJovemYear >= i.minAno && IRSJovemYear <= i.maxAno,
  )

  if (!intervalo) {
    throw new Error('Não foi encontrada uma percentagem de isenção para o ano especificado.')
  }

  const isencaoBruta = salarioAnualBruto * intervalo.percentagem

  return Math.min(isencaoBruta, IRS_JOVEM_LIMITE)
}

export const getIRSResultSingle = async (generalInfoData: FormData, incomeTaxDeductionsA: FormData) => {
  incomeTaxDeductionsA.otherDeductions =
    incomeTaxDeductionsA.journalsMagazinesExpenses +
    incomeTaxDeductionsA.gymExpenses +
    incomeTaxDeductionsA.monthlyTransitPasses +
    incomeTaxDeductionsA.veterinaryActivities +
    incomeTaxDeductionsA.barberExpenses +
    incomeTaxDeductionsA.vehicleRepairExpenses +
    incomeTaxDeductionsA.restaurantsHouseExpenses;

  let grossAnnualIncome:number = incomeTaxDeductionsA.grossAnnualIncome;
  let IRSExemptionSalary = 0;
  const dependentsTaxCredits = dependentsAncestorsDeductions(
    generalInfoData.dependentsBelowThreeYears,
    generalInfoData.dependentsBetweenFourSixYears,
    generalInfoData.dependentsAboveSixYears,
    generalInfoData.dependentsAncestors,
  )
  if (incomeTaxDeductionsA.irsJovem !== 'no') {
    IRSExemptionSalary = IRSJovemExemption(grossAnnualIncome, incomeTaxDeductionsA.irsJovem);
    grossAnnualIncome = grossAnnualIncome - IRSExemptionSalary;
  }
  const specificDeductions: number = specificDeductionsCalculation(grossAnnualIncome);
  const taxableIncomeAmount: number = taxableIncome(grossAnnualIncome, specificDeductions);
  const age: number = incomeTaxDeductionsA.age;
  const IRSBracket = getTaxBracket(taxableIncomeAmount);
  let alimonyTaxDue = 0;
  if(incomeTaxDeductionsA.alimonyPayments){
    alimonyTaxDue = incomeTaxDeductionsA.alimonyPayments * ALIMONY_TAX;
  }
  const IRSDue = incomeTaxDue(taxableIncomeAmount, IRSBracket) + alimonyTaxDue;
  const municipalityDeductionAmount = await municipalityDeduction(IRSDue, generalInfoData.municipality);

  const maxTaxCredit = maxTaxcreditsPerCategory(false, age);

  const deductionsCappedAllCategories = getCappedDeductions(incomeTaxDeductionsA, maxTaxCredit)
  const taxCreditSumAmount = sumTaxCredits(deductionsCappedAllCategories) + dependentsTaxCredits

  const maxTaxCreditsOverall = maxTaxCredits(
    taxableIncomeAmount,
    generalInfoData.dependentsAncestors +
      generalInfoData.dependentsAboveSixYears +
      generalInfoData.dependentsBetweenFourSixYears +
      generalInfoData.dependentsBelowThreeYears
  );

  const taxCreditCapped = Math.min(taxCreditSumAmount, maxTaxCreditsOverall);

  const taxCreditFinal = Math.min(taxCreditCapped, IRSDue);

  const afterMunicipalitybenefitIRSDue = IRSDue - municipalityDeductionAmount;

  const reiumbursement = IRSreimbursementPayment(
    generalInfoData.withholdingTax + alimonyTaxDue,
    IRSDue,
    taxCreditSumAmount,
  )

  const effectiveIrsTaxRate = effectiveIRSTaxRate(taxableIncomeAmount, IRSDue);

  return {
    grossAnnualIncome: grossAnnualIncome,
    taxableIncome: taxableIncomeAmount,
    irsBracketLevel: IRSBracket.label,
    IRSBracketMarginalTax: IRSBracket.tax,
    withHoldingTax: incomeTaxDeductionsA.withholdingTax,
    IRSDue: afterMunicipalitybenefitIRSDue,
    effectiveIRSTax: effectiveIrsTaxRate,
    taxCredits: taxCreditFinal,
    reiumbursement: reiumbursement,
    maxTaxCreditsOverall: maxTaxCreditsOverall
  }
}

export const maxPPRExpensesDeductions = (age: number):number => {
  if(age < 35){
    return MAX_PPR_35_LOWER_DEDUCTIONS;
  } else  if(age >= 35 && age <= 50) {
    return MAX_PPR_35_50_DEDUCTIONS;
  } else {
    return MAX_PPR_50_HIGHER_DEDUCTIONS;
  }
}

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
      incomeTaxDeductionsA.maxHealthExpensesDeduction,
      maxCreditAllCategories.maxHealthExpensesDeduction,
    ),
    educationExpensesDeduction: Math.min(
      incomeTaxDeductionsA.maxEducationExpensesDeduction,
      maxCreditAllCategories.maxEducationExpensesDeduction,
    ),
    realStateDeductions: Math.min(
      incomeTaxDeductionsA.maxRealStateDeductions,
      maxCreditAllCategories.maxRealStateDeductions,
    ),
    alimonyDeductions: Math.min(
      incomeTaxDeductionsA.maxAlimonyDeductions,
      maxCreditAllCategories.maxAlimonyDeductions,
    ),
    otherDeductions: Math.min(
      incomeTaxDeductionsA.maxOtherDeductions,
      maxCreditAllCategories.maxOtherDeductions,
    ),
    retirementHomeDeduction: Math.min(
      incomeTaxDeductionsA.maxRetirementHomeDeduction,
      maxCreditAllCategories.maxRetirementHomeDeduction,
    ),
    PPRDeduction: Math.min(
      incomeTaxDeductionsA.maxPPRDeduction * PPR_RETURN,
      maxCreditAllCategories.maxPPRDeduction,
    ),
    donations: Math.min(
      incomeTaxDeductionsA.maxDonations * DONATIONS_RETURN,
      maxCreditAllCategories.maxDonations,
    ),
  }
}

export const sumTaxCredits = (deductions: Record<string, number>): number => {
  return Object.values(deductions).reduce((total, current) => total + current, 0)
}

//limite de deduções á coleta
export const maxTaxCredits = (taxableIncome: number, numberDependents:number): number => {
  if (taxableIncome <= MIN_INCOME) {
    return Infinity
  }

  if (taxableIncome > MAX_INCOME) {
    return MIN_TAX_CREDITS_CAP
  }

  const fator = (MAX_INCOME - taxableIncome) / (MAX_INCOME - MIN_INCOME)

  const limite = MIN_TAX_CREDITS_CAP + (MAX_TAX_CREDITS_CAP - MIN_TAX_CREDITS_CAP) * fator

  const rawMaxDeductions = (Math.round(limite * 100) / 100);

  if(numberDependents >= 3){
    const dependentsFactor = FACTOR_FOR_DEPENDENTS_TAX_CREDITS_LIMIT * numberDependents;

    return (rawMaxDeductions + (rawMaxDeductions * dependentsFactor));

  } else {
    return rawMaxDeductions;
  }
}

export const maxTaxcreditsPerCategory = (married: boolean, age: number): Record<string, number> => {
  const maxfamilyExpensesDeduction = married ? MAX_FAMILY_DEDUCTIONS * 2 : MAX_FAMILY_DEDUCTIONS;
  const maxHealthExpensesDeduction = MAX_HEALTH_DEDUCTIONS;
  const maxEducationExpensesDeduction = MAX_EDUCATION_DEDUCTIONS;
  const maxRealStateDeductions = MAX_REAL_STATE_DEDUCTIONS;
  const maxAlimonyDeductions = Infinity;
  const maxOtherDeductions = MAX_OTHER_DEDUCTIONS;
  const maxRetirementHomeDeduction = MAX_RETIREMENT_HOME_DEDUCTIONS;
  const maxPPRDeduction = maxPPRExpensesDeductions(age);
  const maxPPRDeductionFinal = married ? maxPPRDeduction * 2: maxPPRDeduction;
  const maxDonations = Infinity;

  return {
    maxfamilyExpensesDeduction: maxfamilyExpensesDeduction,
    maxHealthExpensesDeduction: maxHealthExpensesDeduction,
    maxEducationExpensesDeduction: maxEducationExpensesDeduction,
    maxRealStateDeductions: maxRealStateDeductions,
    maxAlimonyDeductions: maxAlimonyDeductions,
    maxOtherDeductions: maxOtherDeductions,
    maxRetirementHomedDeduction: maxRetirementHomeDeduction,
    maxPPRDeduction: maxPPRDeductionFinal,
    maxDonations: maxDonations,
  }
}

