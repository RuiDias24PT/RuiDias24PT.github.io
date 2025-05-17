<template>
  <div class="custom-card w-[50rem] mb-[2rem]">
    <div class="bg-[#f9f9fb] rounded-t-xl px-6 py-4 border-b border-gray-200">
      <h2 class="text-base font-semibold text-gray-800">{{ title }}</h2>
    </div>
    <Accordion :activeIndex="0">
      <AccordionTab v-for="tab in tabs" :key="tab.title" :header="tab.title">
        <div v-html="tab.content" class="text-sm text-gray-700"></div>
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script setup>
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import { ref } from 'vue';

const title = ref('Perguntas frequentes');
const tabs = ref([
  {
    title: 'Para que serve o simulador de IRS?',
    content:
      'O <strong>Simulador de IRS</strong> serve para ajudar os contribuintes a fazerem uma estimativa do valor que terão a pagar ou a receber no âmbito da sua declaração anual de rendimentos — o famoso acerto de contas com o Estado.',
  },
  {
    title: 'O que são as deduções à coleta e como influenciam o valor do IRS?',
    content:
      'As <strong>deduções à coleta</strong> são valores que reduzem diretamente o imposto (IRS) a pagar. Incluem despesas com saúde, educação, habitação, entre outras. Quanto maiores forem as deduções, menor será o imposto — podendo até resultar em <strong>reembolso</strong>.',
  },
  {
    title: 'Que rendimentos devem ser declarados no IRS?',
    content:
      'Os rendimentos sujeitos a IRS estão divididos em diferentes <strong>categorias</strong> e cada contribuinte pode ter simultaneamente rendimentos de várias <strong>categorias</strong>.<br><br> Atualmente, existem seis <strong>categorias</strong>: <br><br><strong>Categoria A</strong> diz respeito a rendimentos do trabalho dependente, isto é, salários, comissões, subsídios, gratificações, entre outros.<br><br> Na <strong>categoria B</strong> inserem-se os rendimentos obtidos por conta própria, através da prestação de serviços ou do exercício de atividades comerciais, industriais, agrícolas, silvícolas ou pecuárias.<br><br> A <strong>categoria E</strong> refere-se aos rendimentos de capital (como juros de depósitos e dividendos).<br><br> A <strong>categoria F</strong> destina-se aos rendimentos de arrendamento de imóveis.<br><br> Na <strong>categoria G</strong> enquadram-se os rendimentos provenientes de mais-valias e indemnizações.<br><br> Por fim, na <strong>categoria H</strong> incluem-se os rendimentos de pensões de reforma, velhice, invalidez, sobrevivência e de alimentos.',
  },
  {
    title: 'O que é a retenção na fonte?',
    content:
      'A <strong>retenção na fonte</strong> é um mecanismo pelo qual o Estado arrecada diretamente parte dos rendimentos de um trabalhador no momento em que estes são pagos, levando a que, em vez de ser o trabalhador a transferir a parte do seu salário sujeita a impostos, esse cumprimento das obrigações fiscais seja feito pela entidade empregadora. Depois de descontado o imposto, o trabalhador recebe o salário líquido. <strong>A retenção na fonte</strong> também se aplica aos rendimentos dos pensionistas e trabalhadores independentes.',
  },
  {
    title: 'O que é o IRS Jovem?',
    content:
      '​O <strong>IRS Jovem</strong> é um regime fiscal criado pelo governo português para apoiar a integração dos jovens no mercado de trabalho, oferecendo uma redução progressiva do imposto sobre os rendimentos do trabalho (categorias A e B) durante um período de até 10 anos.​',
  },
  {
    title: 'Como posso saber o valor de IRS que vou pagar?',
    content:
      'O valor de IRS a pagar pode ser estimado utilizando o <strong>Simulador de IRS</strong> disponível no Portal das Finanças. Ele leva em conta os rendimentos, deduções, e outras informações fiscais para calcular o valor aproximado a pagar ou a receber de reembolso.',
  },
  {
    title: 'Qual é o prazo para entregar o IRS?',
    content:
      'O prazo para entregar o IRS geralmente ocorre entre o final de abril e o final de junho do ano seguinte ao ano a que se refere a declaração. A data exata depende do tipo de entrega (online ou papel) e deve ser verificada no Portal das Finanças.',
  },
  {
    title: 'Quem está obrigado a entregar IRS?',
    content:
      'Todos os contribuintes que tenham rendimentos superiores ao valor do <strong>limite de isenção</strong> estão obrigados a entregar a declaração de IRS. Além disso, trabalhadores independentes, pensionistas e outros grupos com rendimentos específicos também devem submeter a declaração.',
  },
  {
    title: 'O que fazer se houver um erro na declaração de IRS?',
    content:
      'Se houver um erro na declaração de IRS, pode ser corrigido através da <strong>autofiscalização</strong> no Portal das Finanças. A correção pode ser feita até três anos após a data de entrega da declaração.',
  },
]);
</script>
