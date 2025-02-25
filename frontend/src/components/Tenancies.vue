<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTenanciesStore } from '../stores/tenancies';
import CreateTenancyDialog from './CreateTenancyDialog.vue';
import { getUserTenants } from '../services/userService';

const tenanciesStore = useTenanciesStore();
const router = useRouter();
const dialogVisible = ref(false);

const openDialog = () => {
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
};

const goToManageTenancy = (organizationName) => {
  router.push({ path: `/tenancies/${organizationName}` });
};

const fetchUserTenants = async () => {
  try {
    const data = await getUserTenants();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

fetchUserTenants();
</script>

<template>
  <BaseSecure>
    <v-container class="mt-4">
      <v-row>
        <v-col cols="12">
          <v-btn variant="text" color="primary" prepend-icon="mdi-plus-box" @click="openDialog">
            <template v-slot:prepend>
                <v-icon color="primary" size="x-large"></v-icon>
            </template>
            Create New Tenancy
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="tenancy in tenanciesStore.tenancies" :key="tenancy.organizationName" cols="12" md="4">
          <v-card @click="goToManageTenancy(tenancy.organizationName)">
            <v-card-title>{{ tenancy.organizationName }}</v-card-title>
            <v-card-subtitle>{{ tenancy.bcMinistry }}</v-card-subtitle>
            <v-card-text>
                <p>Tenant Owner/Admin:  {{ tenancy.users[0].name }}</p>
                <p>{{ tenancy.users[0].email }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <CreateTenancyDialog :visible="dialogVisible" @close="closeDialog" />
  </BaseSecure>
</template>
