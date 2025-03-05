<script setup>
import Header from './components/Header.vue';
import Navbar from './components/Navbar.vue';
import alertService from './services/alertService';

const alerts = alertService.state.alerts;
</script>

<template>
  <v-app>
    <div v-for="alert in alerts" :key="alert.id" class="alert-container">
      <v-alert
        :type="alert.type"
        closable
        @click="alertService.removeAlert(alert.id)"
      >
        {{ alert.message }}
      </v-alert>
    </div>
    <Header />
    <Navbar />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style scoped>
@import 'vuetify/styles';

.v-main {
  --v-layout-top: 0px;
}

.alert-container {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  z-index: 9999;
  margin-bottom: 10px;
}
</style>
