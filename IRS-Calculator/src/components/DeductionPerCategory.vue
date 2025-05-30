<template>
    <div class="w-[40rem]">
        <Carousel :value="products" :numVisible="3" :numScroll="1">
            <template #item="slotProps">
                <div class="w-[10rem] bg-gray-100 dark:border-surface-700 rounded-xl h-[14rem] m-2 p-4">
                    <div class="mb-4">
                        <div class="relative mx-auto">
                            <div class="rounded-2xl p-3 shadow-md w-[5rem] h-[5rem] mx-auto flex items-center justify-center"
                                :style="{ backgroundColor: slotProps.data.backgroundColor }">
                                <template v-if="slotProps.data.multiple">
                                    <div class="flex flex-wrap justify-center items-center gap-1">
                                        <i v-for="(icon, index) in slotProps.data.icons" :key="index"
                                            :class="icon + ' text-[1.2rem] text-white'">
                                        </i>
                                    </div>
                                </template>
                                <template v-else>
                                    <i :class="slotProps.data.icon + ' text-[2.5rem] text-white'"></i>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="text-black-1000 mb-4 font-bold text-[0.9rem] text-center">{{ slotProps.data.name }}
                    </div>
                    <div class="flex justify-between items-center">
                        
                    </div>
                </div>
            </template>
        </Carousel>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Carousel from 'primevue/carousel';
import MeterGroup from 'primevue/metergroup';
const products = ref([
  {
    icon: 'mdi mdi-human-male-female-child',
    name: 'Despesas gerais Familiares',
    backgroundColor: '#48c1d9'
  },
  {
    icon: 'mdi mdi-heart-pulse',
    name: 'Saúde',
    backgroundColor: '#fc5858'
  },
  {
    icon: 'mdi mdi-book-open-blank-variant-outline',
    name: 'Educação',
    backgroundColor: '#fd873a'
  },
  {
    icon: 'mdi mdi-home-outline',
    name: 'Habitação',
    backgroundColor: '#95d654'
  },
  {
    icon: 'mdi mdi-human-walker',
    name: 'Lares', 
    backgroundColor: '#6cb764'
  },
  {
    icons: ['mdi mdi-content-cut', 'mdi mdi-silverware-fork-knife', 'mdi mdi-car-wrench', 'mdi mdi-paw-outline'],
    name: 'Outros',
    multiple: true,
    backgroundColor: '#48c1d9'
  }
    
]);
</script>
