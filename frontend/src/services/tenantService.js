import axios from 'axios';
import { logError } from '../consolePlugin';

const tenantService = axios.create();

export const createTenancy = async (tenancy) => {
  try {
    const response = await tenantService.post(`/api/v1/tenants`, tenancy);
    return response.data.data.tenant;
  } catch (error) {
    logError(
      'Error creating tenancy:',
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

export const getUserTenants = async (userId) => {
  try {
    const response = await tenantService.get(`/api/v1/users/${userId}/tenants`);
    return response.data.data.users;
  } catch (error) {
    logError(
      'Error getting users tenancies:',
      error.response ? error.response.data : error,
    );
    throw error;
  }
};

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
    throw error;
  }
};

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
    throw error;
  }
};

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
    throw error;
  }
};

export const addTenantUsers = async (tenancyId, user, roleId = null) => {
  try {
    let request = {
      user,
    };
    if (roleId !== null) {
      request.role = {
        id: roleId,
      };
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
    throw error;
  }
};

export const assignUserRoles = async (tenancyId, userId, roleId) => {
  try {
    const response = await tenantService.put(
      `/api/v1/tenants/${tenancyId}/users/${userId}/roles/${roleId}`,
    );
    return response.data;
  } catch (error) {
    logError(
      'Error adding user to tenancy:',
      error.response ? error.response.data : error,
    );
    throw error;
  }
};
