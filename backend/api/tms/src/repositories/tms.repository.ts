import { Tenant } from '../entities/Tenant'
import { TenantUser } from '../entities/TenantUser'
import { SSOUser } from '../entities/SSOUser'
import { EntityManager } from 'typeorm'

export class TMSRepository {

    constructor (private manager: EntityManager) {
        this.manager = manager
      }

    public async saveTenant(tenant:Tenant) {
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
        const tenants = this.manager.createQueryBuilder(Tenant, "t")
            .innerJoin("t.users", "tu")
            .innerJoin("tu.ssoUser", "su")
            .where("su.ssoUserId = :ssoUserId", { ssoUserId })
            .getMany();
        return tenants;
    }

    public async getUsersForTenant(tenantId:string) {
        const users = await this.manager
            .createQueryBuilder(SSOUser, "su")
            .innerJoin(TenantUser, "tu", "tu.sso_id = su.id")
            .where("tu.tenant_id = :tenantId", { tenantId })
            .getMany();
        return users
    }

    public async getSSOUserById(ssoUserId:string) {
        const ssoUser = await this.manager.findOne(SSOUser,{where:{ssoUserId:ssoUserId}})
        return ssoUser

    }

    public async saveSSOUser(ssoUser:SSOUser) {
        const savedSSOUser:SSOUser = await this.manager.save(ssoUser)
        return savedSSOUser
    }

    public async checkIfUserExistsForTenant(ssoUserId:string, tenantId:string) {
        const userExistsForTenant = await this.manager.createQueryBuilder()
            .from(TenantUser, "tu")
            .innerJoin(Tenant, "t", "tu.tenant_id = t.id")
            .innerJoin(SSOUser, "su", "tu.sso_id = su.id")
            .where("t.id = :tenantId", { tenantId })
            .andWhere("su.ssoUserId = :ssoUserId", { ssoUserId })
            .getExists();        
        return userExistsForTenant                                
    }
}

