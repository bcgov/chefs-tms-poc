import { defineStore } from 'pinia';
import axios from 'axios';

export const useSSOStore = defineStore('sso', {
  state: () => ({
    token: null
  }),
  actions: {
    async fetchInitialBearerToken() {
      try {
        const response = await axios.post(`/sso/${import.meta.env.VITE_SSO_TOKEN_URL}`, new URLSearchParams({
          client_id: import.meta.env.VITE_SSO_CLIENT_ID,
          client_secret: import.meta.env.VITE_SSO_CLIENT_SECRET,
          grant_type: 'client_credentials'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        this.token = response.data.access_token;
      } catch (error) {
        console.error('Error fetching initial bearer token:', error);
      }
    }
  }
});
