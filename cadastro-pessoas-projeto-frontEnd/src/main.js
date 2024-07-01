import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import router from "../src/router/index";
import VueApexCharts from "vue3-apexcharts";
const app = createApp(App);
app.use(Antd).use(VueApexCharts).use(router).mount("#app");
