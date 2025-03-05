<script setup>
import { ref } from 'vue';
import {
  logout,
  isLoggedIn as checkIsLoggedIn,
  getUser,
} from '../services/keycloak';

const isLoggedIn = ref(checkIsLoggedIn());
const userInfo = ref(null);

if (isLoggedIn.value) {
  userInfo.value = getUser();
}

const handleLogout = () => {
  logout();
};
</script>

<template>
  <v-app-bar elevation="1">
    <v-toolbar-title>Tenant Manager</v-toolbar-title>
    <v-spacer></v-spacer>
    <template #append>
      <div v-if="isLoggedIn">
        <v-icon icon="mdi-account-outline" size="x-large"></v-icon>
        <span>{{ userInfo?.displayName }} | </span>
        <v-btn @click="handleLogout">Logout</v-btn>
      </div>
    </template>
  </v-app-bar>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
