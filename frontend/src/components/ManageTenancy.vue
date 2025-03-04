<script setup>
import { ref, computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTenanciesStore } from '../stores/tenancies';
import { ROLES } from '../constants';
import { searchIdirUsers } from '../services/userService';
import { getTenantRoles, addTenantUsers } from '../services/tenantService';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();
const tenanciesStore = useTenanciesStore();
const alertService = inject('alertService');
const { tenancies } = storeToRefs(tenanciesStore);
const tenancy = computed(() => tenancies.value.find(t => t.id === route.params.id));

const breadcrumbs = computed(() => [
    { title: 'Tenancies', disabled: false, href: '/tenancies', },
    { title: tenancy.value.name, disabled: false, href: `/tenancies/${tenancy.value.id}`, },
]);

const loadingSearchResults = ref(false);
const tab = ref(1);
const roles = ref([]);
const searchOption = ref('firstName');
const searchText = ref('');
const searchResults = ref([]);
const selectedUser = ref(null);
const selectedRole = ref('');

const deleteDialogVisible = ref(false);

const fetchTenantRoles = async () => {
  try {
    const response = await getTenantRoles(route.params.id);
    roles.value = response;
  } catch (error) {
    console.error(error);
  }
};

const searchUsers = async () => {
  if (searchOption.value && searchText.value) {
    try {
      loadingSearchResults.value = true;
      let params = {};
      if (searchOption.value === 'firstName') {
        params.firstName = searchText.value.toLowerCase();
      } if (searchOption.value === 'lastName') {
        params.lastName = searchText.value.toLowerCase();
      } else if (searchOption.value === 'email') {
        params.email = searchText.value.toLowerCase();
      }
      const response = await searchIdirUsers(params);
      searchResults.value = response.map(user => {
        const displayName = user.attributes.display_name ? user.attributes.display_name[0] : user.attributes.displayName;
        const ssoUserId = user.attributes.idir_user_guid ? user.attributes.idir_user_guid[0] : user.attributes.idir_userid;

        if (!displayName || !ssoUserId) {
          return null;
        }

        return {
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: displayName,
          userName: user.username,
          ssoUserId: ssoUserId,
          email: user.email,
        };
      }).filter(user => user !== null);
    } catch (error) {
      console.log(error);
    } finally {
      loadingSearchResults.value = false;
    }
  }
};

const addUserToTenancy = async () => {
  if (tenancy.value && selectedUser.value) {
    try {
      /* tenancy.value.users.push({
        ...selectedUser.value[0],
        role: selectedRole.value
      }); */
      let addTenantUserResponse = await addTenantUsers(tenancy.value.id, {
        user: {
          ...selectedUser.value[0],
        }
      });
      if (addTenantUserResponse?.id) {

      }
      console.log(addTenantUserResponse);
    } catch (error) {
      console.error(error);
    } finally {
      searchResults.value = [];
      selectedUser.value = null;
      selectedRole.value = '';
    }
  }
};

const deleteTenancy = () => {
  tenanciesStore.tenancies = tenanciesStore.tenancies.filter(t => t.name !== tenancy.value.name);
  alertService.addAlert('Tenancy deleted successfully', 'success');
  router.push('/tenancies');
};

fetchTenantRoles();
</script>

<template>
  <BaseSecure>
    <v-breadcrumbs :items="breadcrumbs" divider=">" color="primary"/>
    <v-container fluid>
      <v-sheet class="pa-4" width="100%" color="grey-lighten-3">
        <v-row>
          <v-col cols="6">
            <h1>{{ tenancy?.name }}</h1>
          </v-col>
          <v-col cols="6" class="d-flex justify-end">
            <v-menu>
              <template #activator="{ props }">
                <v-btn icon v-bind="props">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title>Edit Tenancy</v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteDialogVisible = true">
                  <v-list-item-title>Delete Tenancy</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="tenancy?.ministryName"
              label="BC Ministry"
              readonly
              class="readonly-field"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="tenancy?.users[0]?.ssoUser?.displayName"
              label="Tenant Owner/Admin"
              readonly
              class="readonly-field"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-sheet>

      <v-card>
        <v-tabs v-model="tab">
          <v-tab :value="1">Project Information</v-tab>
          <v-tab :value="2">User Management</v-tab>
          <v-tab :value="3">Available Services</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item :value="1">
            <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <p>Content for Project Information tab</p>
                </v-col>
              </v-row>
            </v-container>
          </v-tabs-window-item>

          <v-tabs-window-item :value="2">
            <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <v-data-table
                    :items="tenancy.users"
                    item-value="id"
                    :headers="[
                      { title: 'Name', value: 'ssoUser.displayName' },
                      { title: 'Roles', value: 'roles' },
                      { title: 'Email', value: 'ssoUser.email' }
                    ]"
                  >
                    <template v-slot:no-data>
                      <v-alert type="info">You have no users in this tenancy.</v-alert>
                    </template>
                    <template #item.roles="{ item }">
                      <v-chip v-for="role in item.roles" :key="role.id" color="primary" class="mr-2">
                        {{ role.name }}
                      </v-chip>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row>
                <v-col cols="12">
                  <v-data-table
                    v-model="selectedUser"
                    :items="searchResults"
                    item-value="email"
                    :headers="[
                      { title: 'First Name', value: 'firstName' },
                      { title: 'Last Name', value: 'lastName' },
                      { title: 'Email', value: 'email' }
                    ]"
                    :loading="loadingSearchResults"
                    show-select
                    return-object
                    select-strategy="single"
                  >
                    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                        <tr>
                            <template v-for="column in columns" :key="column.key">
                            <th>
                                <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.title }}</span>
                                <template v-if="isSorted(column)">
                                <v-icon :icon="getSortIcon(column)"></v-icon>
                                </template>
                                <v-icon v-if="column.removable" icon="$close" @click="() => remove(column.key)"></v-icon>
                            </th>
                            </template>
                        </tr>
                    </template>
                    <template v-slot:no-data>
                      <v-alert type="info">You have not searched for any users yet</v-alert>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>

              <v-divider></v-divider>
              <v-row v-if="selectedUser">
                <v-col cols="12">
                  <h3>Add a user to this Tenancy</h3>
                  <p>1. Search for a user based on the selection criteria below:</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="searchOption"
                    label="Search by name or email"
                    :items="[
                      { title: 'First Name', key: 'firstName' }, 
                      { title: 'Last Name', key: 'lastName' }, 
                      { title: 'Email', key: 'email'},
                    ]"
                    item-title="title"
                    item-value="key"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="searchText"
                    label="Enter text here"
                    append-icon="mdi-magnify"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-btn
                    :disabled="!searchOption || !searchText"
                    @click="searchUsers"
                  >Search</v-btn>
                </v-col>
              </v-row>

              <v-row v-if="selectedUser">
                <v-col cols="12">
                  <p>2. Assign this user to a role:</p>
                  <v-select
                    v-model="selectedRole"
                    label="Select a role"
                    :items="roles"
                    item-title="description"
                    item-value="name"
                  ></v-select>
                  <v-btn
                    :disabled="!selectedRole"
                    @click="addUserToTenancy"
                  >Add User</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-tabs-window-item>

          <v-tabs-window-item :value="3">
            <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <p>Content for Available Services tab</p>
                </v-col>
              </v-row>
            </v-container>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </v-container>

    <!-- Delete Tenancy Dialog -->
    <v-dialog v-model="deleteDialogVisible" persistent dismissable max-width="500px">
      <v-card color="red-lighten-4">
        <v-card-title>
            <v-icon color="red" icon="mdi-alert-circle-outline" size="x-small" />
            Delete this Tenancy?
            <v-icon class="float-right" icon="mdi-close" @click="deleteDialogVisible = false" />
        </v-card-title>
        <v-card-text>
            All users, roles and permissions related to this tenancy will be permanently deleted.
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="deleteDialogVisible = false">Keep Tenancy</v-btn>
          <v-btn color="red" variant="outlined" @click="deleteTenancy">Delete Tenancy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </BaseSecure>
</template>