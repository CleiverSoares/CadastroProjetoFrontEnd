<template>
  <div class="chart-wrap">
    <!-- Certifique-se de que as props estão sendo usadas corretamente -->
    <apexchart :type="chartType" :width="chartWidth" :options="chartOptions" :series="chartSeries"></apexchart>
  </div>
</template>

<script setup props="props">
import { defineProps } from 'vue';

// Definindo props recebidas pelo componente
const { chartType, chartWidth, chartOptions, chartSeries } = defineProps(['chartType',
 'chartWidth', 'chartOptions', 'chartSeries' ,'fetchData']);


</script>

<style scoped>
.chart-wrap {
  text-align: center;
}
</style>
