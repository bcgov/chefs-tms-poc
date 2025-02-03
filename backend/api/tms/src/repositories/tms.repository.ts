import { Tenant } from '../entities/Tenant'
import { TenantUser } from '../entities/TenantUser'
import { EntityManager } from 'typeorm'

require ('dotenv').config()

export class TMSRepository {

    constructor (private manager: EntityManager) {
        this.manager = manager
      }

    public async createTenant(tenant:Tenant) {
        const savedTenant = await this.manager.save(tenant)
        return savedTenant
    }

    public async findTenant(id:string) {
        const tenant:Tenant = await this.manager.findOne(Tenant, {where: {id:id}})
        return tenant
    }

    public async addTenantUsers(tenantUsers:TenantUser []) {
        const savedUsers = await this.manager.save(TenantUser,tenantUsers)
        return savedUsers
    }

    public async getTenantsForUser(ssoUserId:string) {
        const tenants = await this.manager
            .createQueryBuilder(Tenant, "tenant")
            .innerJoin("tenant.users", "tenantUser")
            .where("tenantUser.ssoUserId = :ssoUserId", { ssoUserId })
            .getMany();
        return tenants;
    }
}