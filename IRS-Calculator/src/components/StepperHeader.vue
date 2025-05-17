<template>
  <button
    @click="isClickable ? clickCallback($event) : null"
    :class="['flex flex-col items-start', isClickable ? 'cursor-pointer' : 'cursor-default']"
  >
    <div class="flex items-center">
      <span
        :class="[
          'rounded-full w-[2.2rem] h-[1.7rem] inline-flex items-center justify-center border-1 text-sm',
          isActive ? 'bg-[#636AE8] border-[#636AE8] text-white' : 'bg-white border-[#636AE8]',
        ]"
      >
        {{ stepNumber }}
      </span>
      <div class="pl-[1rem] flex items-center flex-col items-start">
        <span :class="['text-xs', isActive ? 'text-[#636AE8]' : 'text-gray-800']">
          {{ header }}
        </span>
        <div v-if="isActive" class="h-[0.25rem] bg-[#636AE8] w-full mt-[10px]"></div>
      </div>
      <i
        v-if="!isLast"
        :class="[
          isActive ? 'pi pi-angle-double-right' : 'pi pi-angle-right',
          'text-gray-700 pl-[1.2rem] align-middle',
        ]"
      ></i>
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  isActive: boolean;
  isClickable: boolean;
  isLast: boolean;
  stepNumber: number;
  header: string;
  clickCallback: (event: Event) => void;
}>();
</script>
