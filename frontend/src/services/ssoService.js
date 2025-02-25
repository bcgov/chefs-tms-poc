import axios from 'axios';
import { useSSOStore } from '../stores/auth';

const ssoService = axios.create();

ssoService.interceptors.request.use(
  async config => {
    const ssoStore = useSSOStore();

    if (!ssoStore.token) {
      await ssoStore.fetchInitialBearerToken();
    }

    if (ssoStore.token) {
      config.headers.Authorization = `Bearer ${ssoStore.token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default ssoService;
