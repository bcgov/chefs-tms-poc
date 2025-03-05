import { defineStore } from 'pinia';

export const useTenanciesStore = defineStore('tenancies', {
  state: () => ({
    tenancies: [],
  }),
});
