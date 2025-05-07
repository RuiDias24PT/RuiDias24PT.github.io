import { describe, it, expect } from 'vitest'
import { socialSecurityPayment, specificDeductionsCalculation } from '@/components/IRSCalculator.ts'

describe('IRS utility calculations', () => {
  it('Check if social Security Payment result is correct', () => {
    const income = 10000
    expect(socialSecurityPayment(income)).toBeCloseTo(1100)
  })

  it('Checks if it returns 4350.24 if social security is less than that', () => {
    const income = 30000;
    expect(specificDeductionsCalculation(income)).toBeCloseTo(4350.24)
  })

  it('Checks if it returns the social payment value if social payment value is higher than the base deduction', () => {
    const income = 50000;
    expect(specificDeductionsCalculation(income)).toBeCloseTo(5500)
  })

  it('Checks if it returns the base if social payment value is equal to the base', () => {
    const income = 39547;
    expect(specificDeductionsCalculation(income)).toBeCloseTo(4350.24);
  })
})
