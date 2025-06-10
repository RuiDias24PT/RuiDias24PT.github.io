import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MainInfoResult from '@/components/MainInfoResult.vue'; // adjust path if needed

describe('MainInfoResult', () => {
  const props = {
    grossAnualIncome: 35000.987,
    allTaxDeductions: 4200.555,
    owedIRS: 5300.456,
    withholdingTax: 5000.499,
  };

  it('displays gross annual income correctly formatted', () => {
    const wrapper = mount(MainInfoResult, { props });
    expect(wrapper.text()).toContain('Rendimento bruto:');
    expect(wrapper.text()).toContain('35000.99 €');
  });

  it('displays total deductions correctly formatted', () => {
    const wrapper = mount(MainInfoResult, { props });
    expect(wrapper.text()).toContain('Deduções totais:');
    expect(wrapper.text()).toContain('4200.56 €');
  });

  it('displays IRS owed correctly formatted', () => {
    const wrapper = mount(MainInfoResult, { props });
    expect(wrapper.text()).toContain('IRS devido:');
    expect(wrapper.text()).toContain('5300.46 €');
  });

  it('displays withholding tax correctly formatted', () => {
    const wrapper = mount(MainInfoResult, { props });
    expect(wrapper.text()).toContain('IRS retido na fonte:');
    expect(wrapper.text()).toContain('5000.50 €');
  });
});
