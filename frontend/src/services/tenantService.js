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
        console.error('Error getting users tenancies:', error.response ? error.response.data : error);
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

export const getTenantRoles = async (tenancyId) => {
    try {
        const response = await tenantService.get(`/api/v1/tenants/${tenancyId}/roles`);
        return response.data.data.roles;
    } catch (error) {
        console.error('Error getting tenancy roles:', error.response ? error.response.data : error);
        throw error;
    }
};

export const getTenantUserRoles = async (tenancyId, userId) => {
    try {
        const response = await tenantService.get(`/api/v1/tenants/${tenancyId}/users/${userId}/roles`);
        return response.data.data.roles;
    } catch (error) {
        console.error('Error getting tenancy users roles:', error.response ? error.response.data : error);
        throw error;
    }
};

export const addTenantUsers = async (tenancyId, user) => {
    try {
        const response = await tenantService.post(`/api/v1/tenants/${tenancyId}/users`, user);
        return response.data.user;
    } catch (error) {
        console.error('Error adding user to tenancy:', error.response ? error.response.data : error);
        throw error;
    }
};

export const assignUserRoles = async (tenancyId, userId, roleId) => {
    try {
        const response = await tenantService.put(`/api/v1/tenants/${tenancyId}/users/${userId}/roles/${roleId}`);
        return response;
    } catch (error) {
        console.error('Error adding user to tenancy:', error.response ? error.response.data : error);
        throw error;
    }
};