export interface Municipality {
  name: string;
  municipality: string;
  participation: number;
}
export interface TaxBracket {
  label: string;
  escalão: number;
  min: number;
  max: number | null;
  tax: number;
  deductionAmount: number;
}

export interface Municipality {
  name: string;
  municipality: string;
  participation: number;
}

export interface Municipality {
  name: string;
  municipality: string;
  participation: number;
}

export interface FormData {
  [key: string]: any;
}

export interface IRSResultSingle {
  grossAnnualIncome: number;
  taxableIncome: number;
  irsBracketLevel: string;
  IRSBracketMarginalTax: number;
  withHoldingTax: number;
  IRSDueOriginal: number;
  IRSDue: number;
  effectiveIRSTax: number;
  taxCredits: number;
  taxCreditsAmount: number;
  reiumbursement: number;
  maxTaxCreditsOverall: number;
  maxTaxcreditsPerCategory: Record<string, { value: number; max: number }>;
}

export interface Field {
  label: string;
  varName: string;
  value: any;
  fieldType?: 'text' | 'posInt' | 'select' | 'int' | 'radioBox' | 'currency';
  options?: { label: string; code: string }[];
  toolTip?: string;
  required?: boolean;
  placeHolder?: string;
  filter?: boolean;
  disabled?:boolean;
};