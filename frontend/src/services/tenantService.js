import axios from 'axios';

const tenantService = axios.create();

export const createTenancy = async (tenancy) => {
    try {
        const response = await tenantService.post(`/api/v1/tenants`, tenancy);
        return response.data.data.tenant;
    } catch (error) {
        console.error('Error creating tenancy:', error.response ? error.response.data : error);
        throw error;
    }
};

export const getUserTenants = async (userId) => {
    try {
        const response = await tenantService.get(`/api/v1/users/${userId}/tenants`);
        return response.data.data.users;
    } catch (error) {
        console.error('Error getting tenancy users:', error.response ? error.response.data : error);
        throw error;
    }
};

export const getTenantUsers = async (tenancyId) => {
    try {
        const response = await tenantService.get(`/api/v1/tenants/${tenancyId}/users`);
        return response.data.data.users;
    } catch (error) {
        console.error('Error getting tenancy users:', error.response ? error.response.data : error);
        throw error;
    }
};

export const getTenantUserRoles = async (tenancyId, userId) => {
    try {
        const response = await tenantService.get(`/api/v1/tenants/${tenancyId}/users/${userId}/roles`);
        return response.data.data.roles;
    } catch (error) {
        console.error('Error getting tenancy users:', error.response ? error.response.data : error);
        throw error;
    }
};

export const addTenantUsers = async (tenancyId, user) => {
    try {
        const response = await tenantService.post(`/api/v1/tenants/${tenancyId}/users`, user);
        return response.data;
    } catch (error) {
        console.error('Error getting tenancy users:', error.response ? error.response.data : error);
        throw error;
    }
};