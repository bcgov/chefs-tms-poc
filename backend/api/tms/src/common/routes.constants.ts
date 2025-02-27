export class RoutesConstants {
    public static HEALTH = '/v1/health'
    public static CREATE_TENANTS = '/v1/tenants'
    public static ADD_TENANT_USERS = '/v1/tenants/:id/users'
    public static GET_USER_TENANTS = '/v1/users/:ssoUserId/tenants'
    public static GET_TENANT_USERS = '/v1/tenants/:id/users'
    public static CREATE_TENANT_ROLES = '/v1/tenants/:id/roles'
    public static ASSIGN_USER_ROLES = '/v1/tenants/:tenantId/users/:tenantUserId/roles/:roleId'
    public static GET_TENANT_ROLES = '/v1/tenants/:id/roles'
    public static GET_USER_ROLES = '/v1/tenants/:id/users/:tenantUserId/roles'
    public static UNASSIGN_USER_ROLES = '/v1/tenants/:id/users/:tenantUserId/roles/:roleId'
    public static SEARCH_BC_GOV_IDIR_USERS = '/v1/users/bcgovssousers/idir/search'
  }