<template>
    <DataTable :value="tableData">
        <Column v-for="col in headers" 
            :key="col.field" 
            :field="col.field" 
            :header="col.header" 
            />
    </DataTable>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

interface Header {
    field: string;
    header: string;
}

interface RowData {
    [key: string]: any;
}

defineProps < {
    headers: Array <Header>,
    tableData: Array<RowData>
}>();

</script>

<style scoped>

</style>