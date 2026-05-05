import { createApp } from 'vue';
import App from './App.vue';
import router from "./router";
import GoogleSignInPlugin from 'vue3-google-signin';

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const app = createApp(App);

app.use(GoogleSignInPlugin, {
  clientId: '797338336354-iqc1blg7q5he8skksldhbtcg290c186p.apps.googleusercontent.com',
});

app.use(router);

app.mount('#app');