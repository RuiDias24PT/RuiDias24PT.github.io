import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TitleResult from '@/components/TitleResult.vue';

describe('TitleResult ', () => {
  it('displays reimbursement message when reimbursement > 0', () => {
    const wrapper = mount(TitleResult , {
      props: { reimbursement: 150.789 },
    });

    expect(wrapper.text()).toContain('Vais receber 150.79€ de reembolso!');
  });

  it('displays payment message when reimbursement < 0', () => {
    const wrapper = mount(TitleResult , {
      props: { reimbursement: -89.456 },
    });

    expect(wrapper.text()).toContain('Vais pagar 89.46€');
    const p = wrapper.find('p');
    expect(p.classes()).toContain('text-red-600');
  });

  it('displays neutral message when reimbursement === 0', () => {
    const wrapper = mount(TitleResult , {
      props: { reimbursement: 0 },
    });

    expect(wrapper.text()).toContain('Não vais receber nada');
  });
});
