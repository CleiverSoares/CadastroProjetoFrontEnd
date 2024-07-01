<template>
    <div>
      <div style="width: 100px; margin-left: 30%">
        <label style="width: 100px;">Intervalo:</label>
        <a-select v-model="selectedValue" @change="handleChange" :placeholder="tempoDefault">
          <a-select-option v-for="option in tempos" :key="option.value" :value="option.value">{{ option.label
            }}</a-select-option>
        </a-select>
      </div>
      <apexchart :width="chartWidth" type="bar" height="650" :options="chartOptions" :series="series"></apexchart>
    </div>
  </template>
  
  <script>
  import { ref, watchEffect } from "vue";
  import VueApexCharts from "vue3-apexcharts";
  import { Select } from "ant-design-vue";
  
  export default {
    components: {
      apexchart: VueApexCharts,
      ASelect: Select,
      ASelectOption: Select.Option,
    },
    props: {
      data: {
        type: Array,
        required: true,
      },
      tempos: {
        type: Object,
        default: {}
      },
      orgao: {
        type: String,
        required: true,
      
      },
      tempoDefault: {
        type: String,
      }
    },
    setup(props) {
      const labels = ref([]);
      const valores = ref([]);
      const selectedValue = ref("item.indiceUmaHora");
  
      const chartOptions = ref({
        chart: {
          id: "grafico",
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
            barHeight: "20px",
          },
        },
        xaxis: {
          categories: [],
        },
        colors: [
          function ({ value, seriesIndex, w }) {
            if (value <= 0.1) return "#4CAF50";
            if (value <= 0.2) return "#FFC107";
            if (value <= 0.3) return "#FF5722";
            if (value <= 0.4) return "#F44336";
            return "#7E36AF";
          },
        ],
      });
  
      const handleChange = (value) => {
        selectedValue.value = value;
      };
  
      const series = ref([
        {
          name: props.orgao,
          data: [],
        },
      ]);
  
      const chartWidth = ref(500);
  
      watchEffect(() => {
        if (props.data.length > 0) {
          labels.value = props.data.map((item) => item.estacao);
          valores.value = props.data.map((item) => eval(selectedValue.value));
  
          chartOptions.value.xaxis.categories = labels.value;
          series.value[0].data = valores.value;
        }
      });
  
      const setChartWidth = () => {
        if (window.innerWidth <= 959) {
          chartWidth.value = 300;
        } else {
          chartWidth.value = 600;
        }
      };
  
      setChartWidth();
  
      window.addEventListener("resize", setChartWidth);
  
      return {
        chartOptions,
        series,
        chartWidth,
        selectedValue,
        handleChange,
      };
    },
  
    beforeUnmount() {
      window.removeEventListener("resize", this.setChartWidth);
    },
  };
  </script>
  
  <style scoped>
  div {
    display: flex;
    flex-direction: column;
    margin: 0;
  }
  
  @media (max-width: 959px) {
    .apexchart {
      max-width: 300px !important;
      width: 100% !important;
    }
  }
  </style>