import axios from 'axios';
import { logError } from '~/plugins/consolePlugin';
import { getUser } from '~/services/keycloak';
import notificationService from '~/utils/notificationService';

// Create an instance of axios for user service
const userService = axios.create();

/**
 * Gets the tenancies of the current user.
 * @returns {Array} The list of tenancies.
 */
export const getUserTenants = async () => {
  const user = getUser();
  if (user && user.ssoUserId) {
    try {
      const response = await userService.get(
        `/api/v1/users/${user.ssoUserId}/tenants`,
      );
      return response.data;
    } catch (error) {
      logError(
        'Error fetching user tenants:',
        error.response ? error.response.data : error,
      );
      notificationService.addNotification(
        'Error fetching user tenants',
        'error',
      );
      throw error;
    }
  } else {
    const error = new Error('User ID is not available');
    logError(error);
    notificationService.addNotification('User ID is not available', 'error');
    throw error;
  }
};

/**
 * Searches for IDIR users based on the provided parameters.
 * @param {Object} params - The search parameters.
 * @returns {Array} The list of matching IDIR users.
 */
export const searchIdirUsers = async (params) => {
  try {
    const response = await userService.get(
      `/api/v1/users/bcgovssousers/idir/search`,
      {
        params,
      },
    );
    return response.data.data;
  } catch (error) {
    logError(
      'Error getting IDIR users:',
      error.response ? error.response.data : error,
    );
    notificationService.addNotification('Error getting IDIR users', 'error');
    throw error;
  }
};
