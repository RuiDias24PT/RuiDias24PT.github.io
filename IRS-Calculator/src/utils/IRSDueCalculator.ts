import { IRS_JOVEM_INTERVALOS, IRS_JOVEM_LIMITE, MAX_SOLIDARITY_TAXABLE_INCOME, MIN_SOLIDARITY_TAXABLE_INCOME, SOLIDARITY_TAX_80K_TO_250K, SOLIDARITY_TAX_ABOVE_250K } from "@/constants/IRSConstants";
import type { TaxBracket } from "@/types/IRS";

//To do: Create classes for IRS calculations 

//Coleta de IRS
export const incomeTaxDue = (taxableIncome: number, taxBracket: Partial<TaxBracket>): number => {
  const { tax, deductionAmount } = taxBracket;
  if (!tax || deductionAmount === undefined) {
    return 0;
  }
  const taxaDecimal = tax / 100;

  return  taxableIncome * taxaDecimal - deductionAmount;
};

export const IRSJovemExemption = (salarioAnualBruto: number, IRSJovemYear: number) => {
  if (IRSJovemYear < 1 || IRSJovemYear > 10) {
    throw new Error('O ano deve estar entre 1 e 10.');
  }

  const intervalo = IRS_JOVEM_INTERVALOS.find(
    (i) => IRSJovemYear >= i.minAno && IRSJovemYear <= i.maxAno,
  );

  if (!intervalo) {
    throw new Error('Não foi encontrada uma percentagem de isenção para o ano especificado.');
  }

  const isencaoBruta = salarioAnualBruto * intervalo.percentagem;

  return Math.min(isencaoBruta, IRS_JOVEM_LIMITE);
};

//Solidarity tax amount
export const solidarityTax = (taxableIncome: number): number => {
  let tax = 0;

  if (taxableIncome > MIN_SOLIDARITY_TAXABLE_INCOME) {
    const upperLimit = Math.min(taxableIncome, MAX_SOLIDARITY_TAXABLE_INCOME);
    tax += (upperLimit - MIN_SOLIDARITY_TAXABLE_INCOME) * SOLIDARITY_TAX_80K_TO_250K;
  }

  if (taxableIncome > MAX_SOLIDARITY_TAXABLE_INCOME) {
    tax += (taxableIncome - MAX_SOLIDARITY_TAXABLE_INCOME) * SOLIDARITY_TAX_ABOVE_250K;
  }

  return parseFloat(tax.toFixed(2));
};