import { createRouter, createWebHistory } from 'vue-router';
import Tenancies from './components/Tenancies.vue';
import Roles from './components/Roles.vue';
import ManageTenancy from './components/ManageTenancy.vue';
const routes = [
  { path: '/', redirect: '/tenancies' },
  { path: '/tenancies', component: Tenancies },
  { path: '/roles', component: Roles },
  { path: '/tenancies/:id', component: ManageTenancy, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
