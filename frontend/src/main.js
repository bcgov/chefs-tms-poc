import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import alertService from './services/alertService';
import { initKeycloak } from './services/keycloak';
import { createPinia } from 'pinia';
import BaseSecure from './components/BaseSecure.vue';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import consolePlugin from './consolePlugin';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
});

const app = createApp(App);

app.provide('alertService', alertService);

app.use(router);
app.use(createPinia());
app.use(vuetify);
app.use(consolePlugin);
app.component('BaseSecure', BaseSecure);

initKeycloak(() => {
  app.mount('#app');
});
