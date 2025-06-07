import { describe, it, assert } from 'vitest';
import {
  socialSecurityPayment,
  specificDeductionsCalculation,
  taxableIncome,
  getTaxBracket,
} from '@/utils/IRSCalculator';

import { incomeTaxDue, solidarityTax } from '@/utils/IRSDueCalculator';

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
});
