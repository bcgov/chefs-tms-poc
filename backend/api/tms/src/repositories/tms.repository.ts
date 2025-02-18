import { Tenant } from '../entities/Tenant'
import { TenantUser } from '../entities/TenantUser'
import { SSOUser } from '../entities/SSOUser'
import { Role } from '../entities/Role'
import { EntityManager } from 'typeorm'
import { In } from 'typeorm'
import { Request} from 'express'
import { TenantUserRole } from '../entities/TenantUserRole'

export class TMSRepository {

    constructor (private manager: EntityManager) {
        this.manager = manager
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
        const ssoUser:SSOUser = await this.manager.findOne(SSOUser,{where:{ssoUserId:ssoUserId}})
        return ssoUser

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

    public async saveRoles(roles:Role []) {
        const savedRoles = await this.manager.save(roles)
        return savedRoles
    }

    public async findRoles(roleNames:string[]) {
        const roles = await this.manager.find(Role,{where:{name:In(roleNames)}})        
        return roles ?? []
    }

    public async saveTenant(req:Request) {
        let tenantResponse = {}
        await this.manager.transaction(async(transactionEntityManager) => {

        try {
            const tenantUser:TenantUser = new TenantUser()
        
            const ssoUser:SSOUser = await this.getSSOUserById(req.body.user.ssoUserId) 
            if(!ssoUser) {  
            const newSSOUser:SSOUser = new SSOUser()
            newSSOUser.firstName = req.body.user.firstName
            newSSOUser.lastName = req.body.user.lastName
            newSSOUser.displayName = req.body.user.displayName
            newSSOUser.userName = req.body.user.userName
            newSSOUser.ssoUserId = req.body.user.ssoUserId
            newSSOUser.email = req.body.user.email        
            const savedSSOUser:SSOUser = await transactionEntityManager.save(newSSOUser)
                console.log(savedSSOUser)
            tenantUser.ssoUser = savedSSOUser
            } else {
                tenantUser.ssoUser = ssoUser
            }

            const tenant:Tenant = new Tenant()
            tenant.ministryName = req.body.ministryName
            tenant.name = req.body.name
            tenant.users = [tenantUser]

            const savedTenant = await transactionEntityManager.save(tenant)
        
            const globalTenantRoles = ["TMS.TENANT_ADMIN","TMS.TENANT_USER"]
        
            const roles:Role[] = await this.findRoles(globalTenantRoles)

            let savedRoles:Role[]

            if(roles?.length === 0) { 
                const newRoles:Role [] = []
                for(const role of globalTenantRoles) {
                    const tempRole:Role = new Role()
                    tempRole.name = role
                    tempRole.description = (role === "TMS.TENANT_ADMIN" ? "Tenant Administrator Role" : "Tenant User Role" )
                    newRoles.push(tempRole)          
                    console.log(savedRoles)    
                }
                savedRoles = await transactionEntityManager.save(newRoles)
            }
            else {
                savedRoles = roles
            }

            const tenantUserRoles:TenantUserRole [] = []
            for(const role of savedRoles) {
                const tenantUserRole:TenantUserRole = new TenantUserRole()
                tenantUserRole.role = role
                tenantUserRole.tenantUser = savedTenant.users[0]
                tenantUserRoles.push(tenantUserRole)
            }
            await transactionEntityManager.save(tenantUserRoles)

            tenantResponse = await transactionEntityManager
                .createQueryBuilder(Tenant, 'tenant')
                .leftJoinAndSelect('tenant.users','tu')
                .leftJoinAndSelect('tu.ssoUser','sso')
            //   .leftJoinAndSelect('tu.roles','turoles')
            //    .leftJoinAndSelect('turoles.role','role')
                .where('tenant.id = :id', { id: savedTenant.id })
                .getOne(); 
        } catch(error) {
            console.error('Create tenant transaction failure - rolling back inserts ', error);
            throw error
        }
    });

    return tenantResponse
        
    }

}

