import { describe, it, beforeEach, vi, assert } from 'vitest';
import {
  socialSecurityPayment,
  specificDeductionsCalculation,
  taxableIncome,
  dependentsAncestorsDeductions,
  getTaxBracket,
  incomeTaxDue,
  solidarityTax,
  municipalityDeduction,
  maxTaxCredits,
} from '@/utils/IRSCalculator';

const mockMunicipalities = [
  { name: 'Lisboa', municipality: 'LISBOA', participation: 0.05 },
  { name: 'Porto', municipality: 'PORTO', participation: 0.025 },
  {
    name: 'Loulé',
    municipality: 'LOULE',
    participation: 0,
  },
];

describe('IRS utility calculations', () => {
  describe('socialSecurityPayment', () => {
    it('returns social payment of 1100 for income of 10000', () => {
      const income = 10000;
      assert.equal(socialSecurityPayment(income), 1100);
    });

    it('returns 0 of social payment for income of 0', () => {
      const income = 0;
      assert.equal(socialSecurityPayment(income), 0);
    });
  });

  describe('specificDeductionsCalculation', () => {
    it('returns 4350.24 if social security is less than the base', () => {
      const income = 30000;
      assert.equal(specificDeductionsCalculation(income), 4350.24);
    });

    it('returns the social security payment value if higher than the base', () => {
      const income = 50000;
      assert.equal(specificDeductionsCalculation(income), 5500);
    });

    it('returns the base if equal to social payment value', () => {
      const income = 39547;
      assert.equal(specificDeductionsCalculation(income), 4350.24);
    });

    it('returns the base if income is 0', () => {
      const income = 0;
      assert.equal(specificDeductionsCalculation(income), 4350.24);
    });
  });

  describe('taxableIncome', () => {
    it('returns taxable income when deductions are less than income', () => {
      const income = 50000;
      const deductions = 10000;
      assert.equal(taxableIncome(income, deductions), 40000);
    });

    it('returns 0 when deductions are equal to income', () => {
      const income = 4350.24;
      const deductions = 4350.24;
      assert.equal(taxableIncome(income, deductions), 0);
    });

    it('returns 0 when deductions exceed income', () => {
      const income = 2000;
      const deductions = 4350.24;
      assert.equal(taxableIncome(income, deductions), 0);
    });

    it('returns 0 for zero income', () => {
      const income = 0;
      const deductions = 4350.24;
      assert.equal(taxableIncome(income, deductions), 0);
    });
  });

  describe('getTaxBracket', () => {
    it('returns correct bracket for income in 1st tax bracket', () => {
      const result = getTaxBracket(5000);
      assert.deepEqual(result, {
        taxBracket: 1,
        label: '1.º',
        tax: 13.0,
        deductionAmount: 0,
      });
    });

    it('returns correct bracket for exact lower bound of 2nd bracket', () => {
      const result = getTaxBracket(7703.01);
      assert.deepEqual(result, {
        taxBracket: 2,
        label: '2.º',
        tax: 16.5,
        deductionAmount: 269.61,
      });
    });

    it('returns correct bracket for income in middle of 5th bracket', () => {
      const result = getTaxBracket(25000);
      assert.deepEqual(result, {
        taxBracket: 5,
        label: '5.º',
        tax: 32.0,
        deductionAmount: 2895.61,
      });
    });

    it('returns correct bracket for top bracket with no max', () => {
      const result = getTaxBracket(100000);
      assert.deepEqual(result, {
        taxBracket: 9,
        label: '9.º',
        tax: 48.0,
        deductionAmount: 10073.6,
      });
    });

    it('throws an error for negative income', () => {
      assert.throws(() => getTaxBracket(-100), /Rendimento fora dos escalões definidos/);
    });
  });
  describe('dependentsAncestorsDeductions', () => {
    it('returns 0 when there are no children or ancestors', () => {
      const result = dependentsAncestorsDeductions(0, 0, 0, 0);
      assert.equal(result, 0);
    });

    it('returns correct deduction for 1 child under 3', () => {
      const result = dependentsAncestorsDeductions(1, 0, 0, 0);
      assert.equal(result, 726);
    });

    it('returns correct deduction for 2 children under 3', () => {
      const result = dependentsAncestorsDeductions(2, 0, 0, 0);
      assert.equal(result, 1626);
    });

    it('returns correct deduction for 1 child 3-6 and 1 child over 6', () => {
      const result = dependentsAncestorsDeductions(0, 1, 1, 0);
      assert.equal(result, 1200);
    });

    it('returns correct deduction for 2 children: 1 under 3, 1 between 3-6', () => {
      const result = dependentsAncestorsDeductions(1, 1, 0, 0);
      assert.equal(result, 1626);
    });

    it('returns correct deduction for 3 children under 6', () => {
      const result = dependentsAncestorsDeductions(2, 1, 0, 0);
      assert.equal(result, 2526);
    });

    it('returns correct deduction for 1 ascendant only', () => {
      const result = dependentsAncestorsDeductions(0, 0, 0, 1);
      assert.equal(result, 635);
    });

    it('returns correct deduction for 2 ascendents', () => {
      const result = dependentsAncestorsDeductions(0, 0, 0, 2);
      assert.equal(result, 1050);
    });

    it('returns correct deduction for mix of children and ancestors', () => {
      const result = dependentsAncestorsDeductions(1, 1, 2, 2);
      assert.equal(result, 3876);
    });
  });
  describe('incomeTaxDue', () => {
    it('returns correct tax for taxable income in 1st bracket (no deduction)', () => {
      const taxableIncome = 7000;
      const { tax, deductionAmount } = getTaxBracket(taxableIncome);
      assert.equal(
        incomeTaxDue(taxableIncome, { taxa_marginal: tax, parcela_abater: deductionAmount }),
        910.0,
      );
    });

    it('returns correct tax for taxable income in 2nd bracket', () => {
      const taxableIncome = 8000;
      const { tax, deductionAmount } = getTaxBracket(taxableIncome);
      assert.equal(
        incomeTaxDue(taxableIncome, { taxa_marginal: tax, parcela_abater: deductionAmount }),
        1050.39,
      );
    });

    it('returns correct tax for middle-income (5th bracket)', () => {
      const taxableIncome = 25000;
      const { tax, deductionAmount } = getTaxBracket(taxableIncome);
      assert.equal(
        incomeTaxDue(taxableIncome, { taxa_marginal: tax, parcela_abater: deductionAmount }),
        5104.39,
      );
    });

    it('returns correct tax for high income in 9th bracket', () => {
      const taxableIncome = 100000;
      const { tax, deductionAmount } = getTaxBracket(taxableIncome);
      assert.equal(
        incomeTaxDue(taxableIncome, { taxa_marginal: tax, parcela_abater: deductionAmount }),
        37926.4,
      );
    });

    it('returns 0 tax when taxable income is zero', () => {
      const taxableIncome = 0;
      const { tax, deductionAmount } = getTaxBracket(0);
      assert.equal(
        incomeTaxDue(taxableIncome, { taxa_marginal: tax, parcela_abater: deductionAmount }),
        0.0,
      );
    });
  });
  describe('solidarityTax', () => {
    it('returns 0 for income below 80000', () => {
      const result = solidarityTax(75000);
      assert.equal(result, 0);
    });

    it('calculates 2.5% only for income between 80000 and 250000', () => {
      const result = solidarityTax(100000);
      const expected = (100000 - 80000) * 0.025;
      assert.equal(result, expected);
    });

    it('calculates 2.5% up to 250000 and 5% above that', () => {
      const result = solidarityTax(300000);
      const part1 = (250000 - 80000) * 0.025;
      const part2 = (300000 - 250000) * 0.05;
      const expected = part1 + part2;
      assert.equal(result, expected);
    });

    it('calculates only 5% for income just above 250000', () => {
      const result = solidarityTax(255000);
      const part1 = (250000 - 80000) * 0.025;
      const part2 = (255000 - 250000) * 0.05;
      const expected = part1 + part2;
      assert.equal(result, expected);
    });

    it('returns correct tax when income is exactly 250000', () => {
      const result = solidarityTax(250000);
      const expected = (250000 - 80000) * 0.025;
      assert.equal(result, expected);
    });
  });

  describe('municipalityDeduction', () => {
    beforeEach(() => {
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockMunicipalities),
      });
    });

    it('returns correct deduction for Lisboa', async () => {
      const result = await municipalityDeduction(10000, 'LISBOA');
      const expected = 10000 * 0;
      assert.equal(result, expected);
    });

    it('returns 0 deduction for Porto ', async () => {
      const result = await municipalityDeduction(10000, 'PORTO');
      assert.equal(result, 250);
    });

    it('returns 0 deduction for income tax due 0', async () => {
      const result = await municipalityDeduction(0, 'LISBOA');
      assert.equal(result, 0);
    });
  });

  describe('maxTaxCredits', () => {
    it('returns Infinity for income below or equal to 8059', () => {
      const result = maxTaxCredits(8059, 0);
      assert.equal(result, Infinity);
    });

    it('returns 1000 for income above 84000 and less than 3 dependents', () => {
      const result = maxTaxCredits(84000, 2);
      assert.equal(result, 1000);
    });

    it('returns interpolated limit for mid-range income and less than 3 dependents', () => {
      const income = 30000;
      const result = maxTaxCredits(income, 2);
      assert.equal(result, 2071.25);
    });

    it('applies 5% per dependent from 3rd onward', () => {
      const income = 30000;
      const dependents = 4;
      const result = maxTaxCredits(income, dependents);
      assert.equal(result, 2485.5);
    });

    it('does not apply dependent bonus for 2 dependents', () => {
      const income = 40000;
      const dependents = 2;
      const result = maxTaxCredits(income, dependents);
      assert.equal(result, 1871.75);
    });
  });
});
