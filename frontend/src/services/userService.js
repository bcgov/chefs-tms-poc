import axios from 'axios';
import { getUser } from './keycloak';

const userService = axios.create();

export const getUserTenants = async () => {
  const user = getUser();
  if (user && user.ssoUserId) {
    try {
      const response = await userService.get(`/api/v1/users/${user.ssoUserId}/tenants`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user tenants:', error.response ? error.response.data : error);
      throw error;
    }
  } else {
    throw new Error('User ID is not available');
  }
};

export const searchIdirUsers = async (params) => {
    try {
        const response = await userService.get(`/api/v1/users/bcgovssousers/idir/search`, {
          params
        });
        return response.data.data;
    } catch (error) {
        console.error('Error getting idir users:', error.response ? error.response.data : error);
        throw error;
    }
};