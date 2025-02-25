import { defineStore } from 'pinia';

export const useTenanciesStore = defineStore('tenancies', {
  state: () => ({
    tenancies: []
  }),
  actions: {
    addTenancy(organizationName, bcMinistry, users) {
      this.tenancies.push({
        organizationName,
        bcMinistry,
        users
      });
    }
  }
});
