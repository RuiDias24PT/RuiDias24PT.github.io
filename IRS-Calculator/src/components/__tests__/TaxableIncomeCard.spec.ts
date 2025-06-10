import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import RendimentoColetavelCard from '@/components/TaxableIncomeCard.vue';

describe('RendimentoColetavelCard', () => {
  const defaultProps = {
    taxableIncome: 30500.456,
    bracketLevel: '3.º',
    effectiveTax: 12.3498,
    marginalTax: 23.999,
  };

  it('renders the correct taxable income with 2 decimals and euro symbol', () => {
    const wrapper = mount(RendimentoColetavelCard, {
      props: defaultProps,
    });
    expect(wrapper.text()).toContain('30500.46 €');
  });

  it('displays the bracket level with correct formatting', () => {
    const wrapper = mount(RendimentoColetavelCard, {
      props: defaultProps,
    });
    expect(wrapper.text()).toContain('3.º Escalão');
  });

  it('renders the marginal tax with 2 decimal places and % symbol', () => {
    const wrapper = mount(RendimentoColetavelCard, {
      props: defaultProps,
    });
    expect(wrapper.text()).toContain('24.00 %');
  });

  it('renders the effective tax with 2 decimal places and % symbol', () => {
    const wrapper = mount(RendimentoColetavelCard, {
      props: defaultProps,
    });
    expect(wrapper.text()).toContain('12.35 %');
  });

  it('has all required labels', () => {
    const wrapper = mount(RendimentoColetavelCard, {
      props: defaultProps,
    });
    expect(wrapper.text()).toContain('Escalão atual:');
    expect(wrapper.text()).toContain('Taxa marginal:');
    expect(wrapper.text()).toContain('Taxa efetiva:');
    expect(wrapper.text()).toContain('Rendimento Coletável');
  });
});
