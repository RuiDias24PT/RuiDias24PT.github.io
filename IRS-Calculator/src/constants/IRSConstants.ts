import type { TaxBracket } from '@/types/IRS';

export const BASE_SPECIFIC_DEDUCTION = 4350.24;
export const SOCIAL_SECURITY_TAX = 0.11;

export const DEDUCTION_PER_DEPENDENT = 600;
// 126€ para o primeiro dependente com idade igual ou inferior a 3 anos;
export const DEDUCTION_BONUS_FIRST_UNTIL_3Y = 126;
// 300€ para o segundo dependente e seguintes que não ultrapassem 6 anos de idade.
export const DEDUCTION_BONUS_UNTIL_6Y = 300;

export const DEDUCTION_ANCESTOR = 525;
// 110€ se existir apenas um ascendente no agregado familiar.
export const DEDUCTION_BONUS_ANCESTOR = 110;

// Valor mínimo de aplicação da taxa de solidariedade (2.5%)
export const MIN_SOLIDARITY_TAXABLE_INCOME = 80000;

// Valor máximo de aplicação da taxa de solidariedade (2.5%)
export const MAX_SOLIDARITY_TAXABLE_INCOME = 250000;

// Taxa obrigatória para todos os valores entre 80k e 250k
export const SOLIDARITY_TAX_80K_TO_250K = 0.025;

// Taxa obrigatória para todos os valores acima de 250k
export const SOLIDARITY_TAX_ABOVE_250K = 0.05;

// Taxa de participação máxima por município
export const MAX_MUNICIPALITY_PARTICIPATION_TAX = 0.05;

export const MAX_FAMILY_DEDUCTIONS = 250;

export const MAX_HEALTH_DEDUCTIONS = 1000;

export const MAX_EDUCATION_DEDUCTIONS = 800;

export const MAX_REAL_STATE_DEDUCTIONS = 600;

export const MAX_OTHER_DEDUCTIONS = 250;

export const MAX_RETIREMENT_HOME_DEDUCTIONS = 403.75;

export const MAX_PPR_35_50_DEDUCTIONS = 350;

export const MAX_PPR_35_LOWER_DEDUCTIONS = 400;

export const MAX_PPR_50_HIGHER_DEDUCTIONS = 300;

export const ALIMONY_TAX = 0.2;

// Limite de salário onde não é aplicado limite de deduções
export const MIN_INCOME = 8509;

// Limite de salário onde se aplica 1000 até 2500 limite de deduções
export const MAX_INCOME = 83696;

// Limite mínimo de deduções à coleta
export const MIN_TAX_CREDITS_CAP = 1000;

// Limite máximo de deduções à coleta
export const MAX_TAX_CREDITS_CAP = 2500;

// Majoração por dependente
export const FACTOR_FOR_DEPENDENTS_TAX_CREDITS_LIMIT = 0.05;

export const IAS_2025 = 522.5;
export const IRS_JOVEM_LIMITE = 55 * IAS_2025;

// % revertida no IRS
export const PPR_RETURN = 0.2;
// % revertida no IRS
export const DONATIONS_RETURN = 0.2;

export const IRS_JOVEM_INTERVALOS: { minAno: number; maxAno: number; percentagem: number }[] = [
  { minAno: 1, maxAno: 1, percentagem: 1.0 },
  { minAno: 2, maxAno: 4, percentagem: 0.75 },
  { minAno: 5, maxAno: 7, percentagem: 0.5 },
  { minAno: 8, maxAno: 10, percentagem: 0.25 },
];

// To do: Integrate with API
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
];
