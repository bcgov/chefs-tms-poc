import '@mdi/font/css/materialdesignicons.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from '~/App.vue';
import BaseSecure from '~/components/BaseSecure.vue';
import vuetify from '~/plugins/vuetify'; // Import Vuetify configuration
import consolePlugin from '~/plugins/consolePlugin';
import router from '~/router';
import { initKeycloak } from '~/services/keycloak';
import notificationService from '~/utils/notificationService';

// Create a new Vue application instance
const app = createApp(App);

app.provide('notificationService', notificationService);

// Use the necessary plugins and components
app.use(router);
app.use(createPinia());
app.use(vuetify);
app.use(consolePlugin);
app.component('BaseSecure', BaseSecure);

// Initialize Keycloak and mount the app once authenticated
initKeycloak(() => {
  app.mount('#app');
});
