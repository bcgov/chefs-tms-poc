import { createRouter, createWebHistory } from 'vue-router';
import Tenancies from './components/Tenancies.vue';
import Roles from './components/Roles.vue';
import ManageTenancy from './components/ManageTenancy.vue'; // Import your new component

const routes = [
  { path: '/', redirect: '/tenancies' },
  { path: '/tenancies', component: Tenancies },
  { path: '/roles', component: Roles },
  { path: '/tenancies/:id', component: ManageTenancy, props: true }, // Add this new route
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
