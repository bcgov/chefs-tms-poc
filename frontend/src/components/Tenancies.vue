<script setup>
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTenanciesStore } from '../stores/tenancies';
import CreateTenancyDialog from './CreateTenancyDialog.vue';
import { getUserTenants } from '../services/userService';
import { getTenantUsers, getTenantUserRoles } from '../services/tenantService';

const tenanciesStore = useTenanciesStore();
const router = useRouter();
const dialogVisible = ref(false);
const { tenancies } = storeToRefs(tenanciesStore);

const openDialog = () => {
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
};

const goToManageTenancy = (organizationName) => {
  router.push({ path: `/tenancies/${organizationName}` });
};

const firstAdminUser = computed(() => {
  return tenancies.value?.flatMap(tenancy => tenancy.users)?.find(user => 
    user.roles.some(role => role.name === 'TMS.TENANT_ADMIN')
  ) || null;
});

const fetchUserTenants = async () => {
  try {
    let tcies = [];
    const data = await getUserTenants();
    for (const tcy of data.data.tenants) {
      let tenancy = tcy;
      tenancy.users = [];
      const tenancyUsers = await getTenantUsers(tcy.id);
      for (const tcyUser of tenancyUsers) {
        let tenancyUser = tcyUser;
        const userRoles = await getTenantUserRoles(tcy.id, tcyUser.id);
        tenancyUser.roles = userRoles;
        tenancy.users.push(tenancyUser);
      }
      tcies.push(tenancy);
    }
    tenancies.value = tcies;
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
        <v-col v-for="tenancy in tenancies" :key="tenancy.ministryName" cols="12" md="4">
          <v-card @click="goToManageTenancy(tenancy.ministryName)">
            <v-card-title>{{ tenancy.name }}</v-card-title>
            <v-card-subtitle>{{ tenancy.ministryName }}</v-card-subtitle>
            <v-card-text v-if="firstAdminUser != null">
                <p>Tenant Owner/Admin:  {{ firstAdminUser.ssoUser.displayName }}</p>
                <p>{{ firstAdminUser.ssoUser.email }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <CreateTenancyDialog :visible="dialogVisible" @close="closeDialog" />
  </BaseSecure>
</template>
