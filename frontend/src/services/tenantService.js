import axios from 'axios';
import { logError } from '~/plugins/consolePlugin';
import notificationService from '~/utils/notificationService';

// Create an instance of axios for tenant service
const tenantService = axios.create();

/**
 * Creates a new tenancy.
 * @param {Object} tenancy - The tenancy data to be created.
 * @returns {Object} The created tenancy data.
 */
export const createTenancy = async (tenancy) => {
  try {
    const response = await tenantService.post(`/api/v1/tenants`, tenancy);
    return response.data.data.tenant;
  } catch (error) {
    logError(
      'Error creating tenancy:',
      error.response ? error.response.data : error,
    );
    notificationService.addNotification('Error creating tenancy', 'error');
    throw error;
  }
};

/**
 * Gets the tenancies of a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Array} The list of tenancies.
 */
export const getUserTenants = async (userId) => {
  try {
    const response = await tenantService.get(`/api/v1/users/${userId}/tenants`);
    return response.data.data.users;
  } catch (error) {
    logError(
      'Error getting users tenancies:',
      error.response ? error.response.data : error,
    );
    notificationService.addNotification(
      'Error getting users tenancies',
      'error',
    );
    throw error;
  }
};

/**
 * Gets the users of a specific tenancy.
 * @param {string} tenancyId - The ID of the tenancy.
 * @returns {Array} The list of users.
 */
export const getTenantUsers = async (tenancyId) => {
  try {
    const response = await tenantService.get(
      `/api/v1/tenants/${tenancyId}/users`,
    );
    return response.data.data.users;
  } catch (error) {
    logError(
      'Error getting tenancy users:',
      error.response ? error.response.data : error,
    );
    notificationService.addNotification('Error getting tenancy users', 'error');
    throw error;
  }
};

/**
 * Gets the roles of a specific tenancy.
 * @param {string} tenancyId - The ID of the tenancy.
 * @returns {Array} The list of roles.
 */
export const getTenantRoles = async (tenancyId) => {
  try {
    const response = await tenantService.get(
      `/api/v1/tenants/${tenancyId}/roles`,
    );
    return response.data.data.roles;
  } catch (error) {
    logError(
      'Error getting tenancy roles:',
      error.response ? error.response.data : error,
    );
    notificationService.addNotification('Error getting tenancy roles', 'error');
    throw error;
  }
};

/**
 * Gets the roles of a specific user in a tenancy.
 * @param {string} tenancyId - The ID of the tenancy.
 * @param {string} userId - The ID of the user.
 * @returns {Array} The list of user roles.
 */
export const getTenantUserRoles = async (tenancyId, userId) => {
  try {
    const response = await tenantService.get(
      `/api/v1/tenants/${tenancyId}/users/${userId}/roles`,
    );
    return response.data.data.roles;
  } catch (error) {
    logError(
      'Error getting tenancy users roles:',
      error.response ? error.response.data : error,
    );
    notificationService.addNotification(
      'Error getting tenancy users roles',
      'error',
    );
    throw error;
  }
};

/**
 * Adds a user to a specific tenancy.
 * @param {string} tenancyId - The ID of the tenancy.
 * @param {Object} user - The user data to be added.
 * @param {string|null} [roleId=null] - The ID of the role to be assigned (optional).
 * @returns {Object} The added user data.
 */
export const addTenantUsers = async (tenancyId, user, roleId = null) => {
  try {
    let request = { user };
    if (roleId !== null) {
      request.role = { id: roleId };
    }
    const response = await tenantService.post(
      `/api/v1/tenants/${tenancyId}/users`,
      request,
    );
    return response.data.data;
  } catch (error) {
    logError(
      'Error adding user to tenancy:',
      error.response ? error.response.data : error,
    );
    notificationService.addNotification(
      'Error adding user to tenancy',
      'error',
    );
    throw error;
  }
};

/**
 * Assigns a role to a specific user in a tenancy.
 * @param {string} tenancyId - The ID of the tenancy.
 * @param {string} userId - The ID of the user.
 * @param {string} roleId - The ID of the role to be assigned.
 * @returns {Object} The response data.
 */
export const assignUserRoles = async (tenancyId, userId, roleId) => {
  try {
    const response = await tenantService.put(
      `/api/v1/tenants/${tenancyId}/users/${userId}/roles/${roleId}`,
    );
    return response.data;
  } catch (error) {
    logError(
      'Error assigning user role in tenancy:',
      error.response ? error.response.data : error,
    );
    notificationService.addNotification(
      'Error assigning user role in tenancy',
      'error',
    );
    throw error;
  }
};
