import axios from 'axios';
import { getUser } from './keycloak';

const userService = axios.create();

export const getUserTenants = async () => {
  const user = getUser();
  if (user && user.idir_user_guid) {
    try {
      const response = await userService.get(`/api/v1/users/${user.idir_user_guid}/tenants`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user tenants:', error.response ? error.response.data : error);
      throw error;
    }
  } else {
    throw new Error('User ID is not available');
  }
};