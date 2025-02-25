<script setup>
import { ref } from 'vue';
import { isLoggedIn as checkIsLoggedIn } from '../services/keycloak';
import { RouterLink } from 'vue-router';

const isLoggedIn = ref(checkIsLoggedIn());
</script>

<template>
  <v-toolbar app flat elevation="0">
    <v-btn to="/tenancies" text>Tenancies</v-btn>
    <v-btn to="/roles" text>My Roles</v-btn>
  </v-toolbar>
</template>

<style scoped>
  /* Ensure the Navbar is positioned correctly below the Header */
  .v-toolbar {
    margin-top: 64px; /* Adjust this value to match the height of your Header */
  }
</style>
