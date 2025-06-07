import { incomeTaxDue, solidarityTax } from '@/utils/IRSDueCalculator';
import { describe, it, assert } from 'vitest';
import { getTaxBracket } from '@/utils/IRSCalculator';

describe('IRS Due calculations', () => {
  describe('incomeTaxDue', () => {
    it('returns correct tax for taxable income in 1st bracket (no deduction)', () => {
      const taxableIncome = 7000;
      const { tax, deductionAmount } = getTaxBracket(taxableIncome);
      assert.equal(
        incomeTaxDue(taxableIncome, { tax: tax, deductionAmount: deductionAmount }),
        910.0,
      );
    });

    it('returns correct tax for taxable income in 2nd bracket', () => {
      const taxableIncome = 8000;
      const { tax, deductionAmount } = getTaxBracket(taxableIncome);
      assert.closeTo(
        incomeTaxDue(taxableIncome, { tax: tax, deductionAmount: deductionAmount }),
        1050.39,
        0.01,
      );
    });

    it('returns correct tax for middle-income (5th bracket)', () => {
      const taxableIncome = 25000;
      const { tax, deductionAmount } = getTaxBracket(taxableIncome);
      assert.closeTo(
        incomeTaxDue(taxableIncome, { tax: tax, deductionAmount: deductionAmount }),
        5104.38,
        0.01,
      );
    });

    it('returns correct tax for high income in 9th bracket', () => {
      const taxableIncome = 100000;
      const { tax, deductionAmount } = getTaxBracket(taxableIncome);
      assert.equal(
        incomeTaxDue(taxableIncome, { tax: tax, deductionAmount: deductionAmount }),
        37926.4,
      );
    });

    it('returns 0 tax when taxable income is zero', () => {
      const taxableIncome = 0;
      const { tax, deductionAmount } = getTaxBracket(0);
      assert.equal(
        incomeTaxDue(taxableIncome, { tax: tax, deductionAmount: deductionAmount }),
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
});
