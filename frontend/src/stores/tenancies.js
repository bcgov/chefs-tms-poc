import { defineStore } from 'pinia';

/**
 * Define the tenancies store using Pinia.
 * This store manages the state related to tenancies.
 */
export const useTenanciesStore = defineStore('tenancies', {
  // Initial state of the store
  state: () => ({
    tenancies: [], // Array to hold the tenancies
  }),
});
