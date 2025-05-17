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

export interface Field {
  label: string;
  varName: string;
  value: any;
  fieldType?: 'text' | 'posInt' | 'select' | 'int' | 'radioBox' | 'currency';
  options?: { label: string; key: string }[];
  toolTip?: string;
  required?: boolean;
  placeHolder?: string;
  filter?: boolean;
}
export interface FormData {
  [key: string]: any;
}