import {type FormData } from "@/stores/useCalculatorStore"

const BASE_SPECIFIC_DEDUCTION = 4350.24
const SOCIAL_SECURITY_TAX = 0.11

const DEDUCTION_PER_DEPENDENT = 600
//126€ para o primeiro dependente com idade igual ou inferior a 3 anos;
const DEDUCTION_BONUS_FIRST_UNTIL_3Y = 126
//300€ para o segundo dependente e seguintes que não ultrapassem 6 anos de idade.
const DEDUCTION_BONUS_UNTIL_6Y = 300

const DEDUCTION_ANCESTOR = 525
//110€ se existir apenas um ascendente no agregado familiar.
const DEDUCTION_BONUS_ANCESTOR = 110

//Valor minimo de aplicação da taxa de solidariedade (2.5%)
const MIN_SOLIDARITY_TAXABLE_INCOME = 80000;

//Valor máximo de aplicação da taxa de solidarieade (2.5%)
const MAX_SOLIDARITY_TAXABLE_INCOME = 250000;

//Taxa obrigatatório para todos os valores entre 80k e 250k
const SOLIDARITY_TAX_80K_TO_250K = 0.025;

//Taxa obrigatório para todos os valores acima de 250k
const SOLIDARITY_TAX_ABOVE_250K = 0.05;

//Taxa de participação maxima por município
const MAX_MUNICIPALITY_PARTICIPATION_TAX = 0.05;

const MAX_FAMILY_DEDUCTIONS = 250;

const MAX_HEALTH_DEDUCTIONS = 1000;

const MAX_EDUCATION_DEDUCTIONS = 800;

const MAX_REAL_STATE_DEDUCTIONS = 600;

const MAX_OTHER_DEDUCTIONS = 250;

const MAX_RETIREMENT_HOME_DEDUCTIONS = 403.75;

const MAX_PPR_35_50_DEDUCTIONS = 350;

const MAX_PPR_35_LOWER_DEDUCTIONS = 400;

const MAX_PPR_50_HIGHER_DEDUCTIONS = 300;

const ALIMONY_TAX = 0.2;

//Limite de salario onde não é aplicado limite de deduções
const MIN_INCOME = 8509;

//Limite de salário onde se aplica 1000 ate 2500 limite de deduções
const MAX_INCOME = 83696;

//Limite minimo de deduções à coleta
const MIN_TAX_CREDITS_CAP = 1000;

//Limite maximo de deduções à coleta
const MAX_TAX_CREDITS_CAP = 2500;

//majoração por dependente
const FACTOR_FOR_DEPENDENTS_TAX_CREDITS_LIMIT = 0.05;

const IAS_2025 = 522.5;
const IRS_JOVEM_LIMITE = 55 * IAS_2025;


//% revertida no IRS 
const PPR_RETURN = 0.2;
//% revertida no IRS 
const DONATIONS_RETURN = 0.2;

const IRS_JOVEM_INTERVALOS: { minAno: number; maxAno: number; percentagem: number }[] = [
  { minAno: 1, maxAno: 1, percentagem: 1.0 },
  { minAno: 2, maxAno: 4, percentagem: 0.75 },
  { minAno: 5, maxAno: 7, percentagem: 0.5 },
  { minAno: 8, maxAno: 10, percentagem: 0.25 },
]

export interface TaxBracket {
  label: string
  escalão: number
  min: number
  max: number | null
  taxa_marginal: number
  parcela_abater: number
}

export interface Municipality  {
  name: string
  municipality: string
  participation: number
}

//To do: Integrate with API
export const tabelaIRS: TaxBracket[] = [
  {
    label: '1.º',
    escalão: 1,
    min: 0,
    max: 7703,
    taxa_marginal: 13.0,
    parcela_abater: 0,
  },
  {
    label: '2.º',
    escalão: 2,
    min: 7703.01,
    max: 11623,
    taxa_marginal: 16.5,
    parcela_abater: 269.61,
  },
  {
    label: '3.º',
    escalão: 3,
    min: 11623.01,
    max: 16472,
    taxa_marginal: 22.0,
    parcela_abater: 908.92,
  },
  {
    label: '4.º',
    escalão: 4,
    min: 16472.01,
    max: 21321,
    taxa_marginal: 25.0,
    parcela_abater: 1403.08,
  },
  {
    label: '5.º',
    escalão: 5,
    min: 21321.01,
    max: 27146,
    taxa_marginal: 32.0,
    parcela_abater: 2895.61,
  },
  {
    label: '6.º',
    escalão: 6,
    min: 27146.01,
    max: 39791,
    taxa_marginal: 35.5,
    parcela_abater: 3845.5,
  },
  {
    label: '7.º',
    escalão: 7,
    min: 39791.01,
    max: 43000,
    taxa_marginal: 43.5,
    parcela_abater: 7029.08,
  },
  {
    label: '8.º',
    escalão: 8,
    min: 43000.01,
    max: 80000,
    taxa_marginal: 45.0,
    parcela_abater: 7673.78,
  },
  {
    label: '9.º',
    escalão: 9,
    min: 80000.01,
    max: null,
    taxa_marginal: 48.0,
    parcela_abater: 10073.6,
  },
]

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
  const escalão = tabelaIRS.find((escalao) => {
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
  const result = withHoldingTax - (incomeTaxDue - taxCredits)
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

  const taxCreditSumAmount = taxCreditSum(incomeTaxDeductionsA, maxTaxCredit) + dependentsTaxCredits;

  const maxTaxCreditsOverall = maxTaxCredits(
    taxableIncomeAmount,
    generalInfoData.dependentsAncestors +
      generalInfoData.dependentsAboveSixYears +
      generalInfoData.dependentsBetweenFourSixYears +
      generalInfoData.dependentsBelowThreeYears
  );

  const taxCreditFinal = Math.min(taxCreditSumAmount, maxTaxCreditsOverall);

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
    reiumbursement: reiumbursement
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

export const taxCreditSum = (incomeTaxDeductionsA: FormData, maxCreditAllCategories:Record<string, number>): number => {
  const generalExpenseDeductions = Math.min(
    incomeTaxDeductionsA.generalFamilyExpenses,
    maxCreditAllCategories.maxfamilyExpensesDeduction,
  )
  const maxHealthExpensesDeduction = Math.min(
    incomeTaxDeductionsA.maxHealthExpensesDeduction,
    maxCreditAllCategories.maxHealthExpensesDeduction,
  )

  const educationExpensesDeduction = Math.min(
    incomeTaxDeductionsA.maxEducationExpensesDeduction,
    maxCreditAllCategories.maxEducationExpensesDeduction,
  )

  const realStateDeductions = Math.min(
    incomeTaxDeductionsA.maxRealStateDeductions,
    maxCreditAllCategories.maxRealStateDeductions,
  )

  const alimonyDeductions = Math.min(
    incomeTaxDeductionsA.maxAlimonyDeductions,
    maxCreditAllCategories.maxAlimonyDeductions,
  )

  const otherDeductions = Math.min(
    incomeTaxDeductionsA.maxOtherDeductions,
    maxCreditAllCategories.maxOtherDeductions,
  )

  const retirementHomeDeduction = Math.min(
    incomeTaxDeductionsA.maxRetirementHomeDeduction,
    maxCreditAllCategories.maxRetirementHomeDeduction,
  )

  const PPRDeduction = Math.min(
    incomeTaxDeductionsA.maxPPRDeduction * PPR_RETURN,
    maxCreditAllCategories.maxPPRDeduction,
  )
  
  const donations = Math.min(
    incomeTaxDeductionsA.maxDonations * DONATIONS_RETURN,
    maxCreditAllCategories.maxDonations,
  )

  const taxCreditFinalSum =
    generalExpenseDeductions +
    maxHealthExpensesDeduction +
    educationExpensesDeduction +
    realStateDeductions +
    alimonyDeductions +
    otherDeductions +
    retirementHomeDeduction +
    PPRDeduction +
    donations

  return taxCreditFinalSum;
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

