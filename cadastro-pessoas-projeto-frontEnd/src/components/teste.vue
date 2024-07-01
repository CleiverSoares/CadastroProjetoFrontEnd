<template>
        <div class="chart-wrap">
            <div id="chart">
                <apexchart type="donut" width="380" :options="chartOptions" :series="series"></apexchart>
                <button @click="fetchData">
                    Atualizar Dados
                </button>
            </div>
        </div>
        <!-- Ações para interagir com o gráfico (opcional) -->
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import services from '../services'; // Importe seus serviços aqui

// Estado reativo
const series = ref([]);
const chartOptions = ref({});

const fetchData = () => {
    services.categoriasEsporte.getCategoriasSelecionadas()
        .then(response => {
            const data = response.data;

            // Atualiza os dados de forma reativa
            series.value = data.map(item => item.quantidade_pessoas);

            // Define chartOptions dentro da função para garantir reatividade
            chartOptions.value = {
                labels: data.map(item => item.nome_categoria),
                chart: {
                    width: 380,
                    type: 'donut',
                },
                dataLabels: {
                    enabled: false,
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            show: false,
                        },
                    },
                }],
                legend: {
                    position: 'right',
                    offsetY: 0,
                    height: 230,
                },
            };

            // Exibe no console para verificação
            console.log(chartOptions.value.labels);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
};

onMounted(fetchData);
setInterval(fetchData, 10000);
const components = {
    apexchart: VueApexCharts,
};
</script>

<style scoped>
/* Estilos opcionais */
</style>
