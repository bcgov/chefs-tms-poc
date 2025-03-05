<script setup>
import { ref, inject, computed } from 'vue';
import { useTenanciesStore } from '../stores/tenancies';
import { getUser } from '../services/keycloak';
import { createTenancy } from '../services/tenantService';
import { storeToRefs } from 'pinia';

const props = defineProps({
  visible: Boolean,
});
const emit = defineEmits(['close']);

const tenanciesStore = useTenanciesStore();
const alertService = inject('alertService');
const username = ref('');
const name = ref('');
const ministryName = ref('');
const formValid = ref(false);
const { tenancies } = storeToRefs(tenanciesStore);

username.value = getUser().displayName;

const rules = {
  required: (value) => !!value || 'Required',
};

const visible = computed(() => props.visible);

const ministries = [
  'Agriculture and Food',
  'Attorney General',
  'Crown Agencies and Board Resourcing Office',
  'Compliance & Enforcement Collaborative',
  'Corporate Information and Records Management Office',
  "Citizens' Services",
  'Education and Child Care',
  'Energy and Climate Solutions',
  'Emergency Management and Climate Readiness',
  'Environment and Parks',
  'BC Elections',
  'Finance',
  'Forests',
  'Government Communications and Public Engagement',
  'Housing and Municipal Affairs',
  'Health',
  'Intergovernmental Relations Secretariat',
  'Ministry of Infrastructure',
  'Indigenous Relations & Reconciliation',
  'Jobs, Economic Development and Innovation',
  'Labour',
  'Mining and Critical Materials',
  'Children and Family Development',
  'Office of the Comptroller General',
  'Office of the Chief Information Officer',
  'Office of the Premier',
  'BC Public Service Agency',
  "Public Sector Employers' Council Secretariat",
  'Post-Secondary Education and Future Skills',
  'Public Safety and Solicitor General',
  'Provincial Treasury',
  'Social Development and Poverty Reduction',
  'Tourism, Arts, Culture and Sport',
  'Treasury Board Staff',
  'Transportation and Transit',
  'Water, Land and Resource Stewardship',
];

const addTenancy = async () => {
  if (formValid.value) {
    try {
      let response = await createTenancy({
        name: name.value,
        ministryName: ministryName.value,
        user: {
          ...getUser(),
        },
      });
      name.value = '';
      ministryName.value = '';
      response.users[0].roles = [{ name: 'TMS.TENANT_ADMIN' }];
      tenancies.value.push(response);
      alertService.addAlert('New tenancy created successfully', 'success');
    } catch (error) {
      alertService.addAlert('Failed to create new tenancy', 'error');
      this.$error(error);
    } finally {
      emit('close');
    }
  }
};

const closeDialog = () => {
  emit('close');
};
</script>

<template>
  <v-dialog v-model="visible" max-width="600px">
    <v-card>
      <v-card-title> Create New Tenancy </v-card-title>
      <v-card-subtitle>
        <a href="#">Learn more about Multi-Tenancy</a>
        <v-icon color="primary">mdi-information-outline</v-icon>
      </v-card-subtitle>
      <v-card-text>
        <v-form v-model="formValid">
          <v-text-field
            v-model="username"
            label="Tenant Owner/Admin"
            readonly
            disabled
          ></v-text-field>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                label="Name of Tenancy"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="ministryName"
                :items="ministries"
                label="BC Ministries"
                :rules="[rules.required]"
                placeholder="Select an option..."
                required
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
        <v-btn variant="text" :disabled="!formValid" @click="addTenancy"
          >Finish</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
