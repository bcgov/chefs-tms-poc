<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { isLoggedIn as checkIsLoggedIn, login } from '../services/keycloak';

const router = useRouter();
const isAuthenticated = ref(false);

onMounted(() => {
  if (checkIsLoggedIn()) {
    isAuthenticated.value = true;
  } else {
    // Optionally redirect to login page if not authenticated
    login();
  }
});
</script>

<template>
  <div v-if="isAuthenticated">
    <slot></slot>
  </div>
</template>
