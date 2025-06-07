import { describe, it, beforeEach, vi, assert } from 'vitest';
import {
  dependentsAncestorsDeductions,
  maxTaxCredits,
  maxPPRExpensesDeductions,
  municipalityDeduction,
} from '@/utils/IRSTaxCredits';

const mockMunicipalities = [
  { name: 'Lisboa', municipality: 'LISBOA', participation: 5 },
  { name: 'Porto', municipality: 'PORTO', participation: 3.5 },
  {
    name: 'Loulé',
    municipality: 'LOULE',
    participation: 0,
  },
];

describe('Tax credits calculations', () => {
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
  describe('maxPPRExpensesDeductions', () => {
    it('returns 400 for age less than 35', () => {
      const result = maxPPRExpensesDeductions(25);
      assert.equal(result, 400);
    });

    it('returns 350 for age exactly 35', () => {
      const result = maxPPRExpensesDeductions(35);
      assert.equal(result, 350);
    });

    it('returns 350 for age between 35 and 50 inclusive', () => {
      const result = maxPPRExpensesDeductions(45);
      assert.equal(result, 350);
    });

    it('returns 300 for age greater than 50', () => {
      const result = maxPPRExpensesDeductions(60);
      assert.equal(result, 300);
    });
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
    assert.equal(result, 0);
  });

  it('returns 0 deduction for Porto', async () => {
    const result = await municipalityDeduction(10000, 'PORTO');
    assert.equal(result, 150);
  });

  it('returns 0 deduction for income tax due 0', async () => {
    const result = await municipalityDeduction(0, 'LISBOA');
    assert.equal(result, 0);
  });
});
