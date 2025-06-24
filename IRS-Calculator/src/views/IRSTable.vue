<template>
  <div class="custom-card w-[40rem]">
    <div class="bg-[#f9f9fb] rounded-t-xl px-6 py-4 border-b border-gray-200">
      <h3 class="text-base font-semibold text-gray-800">{{ title }}</h3>
    </div>

    <div class="px-[2rem] py-[1.5rem] pl-[2rem]">
      <WDatable :table-data="taxBrackets" :headers="irsHeaders" header-class="text-sm"> </WDatable>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import WDatable from '@/components/shared/WDatable.vue';

const taxBrackets = ref([
  { escalao: '1.º', rendimento: 'até 7.703€', taxa: '13%', parcelaAbate: '0€' },
  { escalao: '2.º', rendimento: 'de 7.703€ até 11.623€', taxa: '16,5%', parcelaAbate: '269,61€' },
  { escalao: '3.º', rendimento: 'de 11.623€ até 16.472€', taxa: '22%', parcelaAbate: '908,92€' },
  { escalao: '4.º', rendimento: 'de 16.472€ até 21.321€', taxa: '25%', parcelaAbate: '1.403,08€' },
  { escalao: '5.º', rendimento: 'de 21.321€ até 27.146€', taxa: '32%', parcelaAbate: '2.895,61€' },
  {
    escalao: '6.º',
    rendimento: 'de 27.146€ até 39.791€',
    taxa: '35,5%',
    parcelaAbate: '3.845,50€',
  },
  {
    escalao: '7.º',
    rendimento: 'de 39.791€ até 43.000€',
    taxa: '43,5%',
    parcelaAbate: '7.029,08€',
  },
  { escalao: '8.º', rendimento: 'de 43.000€ até 80.000€', taxa: '45%', parcelaAbate: '7.673,78€' },
  { escalao: '9.º', rendimento: 'mais de 80.000€', taxa: '48%', parcelaAbate: '10.073,60€' },
]);

const title = ref('Escalões de IRS (art.º 68 do CIRS), ano fiscal 2024');

const irsHeaders = ref([
  { field: 'escalao', header: 'Escalões' },
  { field: 'rendimento', header: 'Rendimento' },
  { field: 'taxa', header: 'Taxa' },
  { field: 'parcelaAbate', header: 'Parcela a abater' },
]);
</script>

<style scoped></style>
