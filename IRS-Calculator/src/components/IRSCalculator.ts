//IRSCalculator.ts
const BASE_SPECIFIC_DEDUCTION = 4350.24;
const SOCIAL_SECURITY_TAX = 0.11;


export const socialSecurityPayment = (income: number): number => { 
    return income * SOCIAL_SECURITY_TAX;
}

export const specificDeductionsCalculation = (income: number): number => {
    const socialSecurityToPay = socialSecurityPayment(income)
    return socialSecurityToPay > BASE_SPECIFIC_DEDUCTION ? socialSecurityToPay : BASE_SPECIFIC_DEDUCTION;
}

