import "./style.css";
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from "./App.vue";
import vuetify from "./plugins/vuetify"

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

const app = createApp(App);
app.use(vuetify);
app.use(pinia);

app.mount("#app");
