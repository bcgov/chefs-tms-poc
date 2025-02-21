import { Tenant } from '../entities/Tenant'
import { TenantUser } from '../entities/TenantUser'
import { SSOUser } from '../entities/SSOUser'
import { Role } from '../entities/Role'
import { EntityManager, Not, UpdateDateColumn } from 'typeorm'
import { In } from 'typeorm'
import { Request} from 'express'
import { TMSConstants } from '../common/tms.constants'
import { TenantUserRole } from '../entities/TenantUserRole'
import { NotFoundError } from '../errors/NotFoundError'
import { ConflictError } from '../errors/ConflictError'
import { ro } from 'date-fns/locale'

export class TMSRepository {

    constructor (private manager: EntityManager) {
        this.manager = manager
    }

    public async saveTenant(req:Request) {
        let tenantResponse = {}
        await this.manager.transaction(async(transactionEntityManager) => {

        try {
            const tenantUser:TenantUser = new TenantUser()
            const ssoUser:SSOUser = await this.setSSOUser(req.body.user.ssoUserId,req.body.user.firstName,req.body.user.lastName,req.body.user.displayName,
                req.body.user.userName,req.body.user.email)
            tenantUser.ssoUser = ssoUser
            const tenant:Tenant = new Tenant()
            tenant.ministryName = req.body.ministryName
            tenant.name = req.body.name
            tenant.users = [tenantUser]

            const savedTenant = await transactionEntityManager.save(tenant)
                  
            const globalTenantRoles = [TMSConstants.TENANT_ADMIN, TMSConstants.TENANT_USER]
        
            const roles:Role[] = await this.findRoles(globalTenantRoles,null)

            let savedRoles:Role[]

            if(roles?.length === 0) { 
                const newRoles:Role [] = []
                for(const role of globalTenantRoles) {
                    const tempRole:Role = new Role()
                    tempRole.name = role
                    tempRole.description = (role === TMSConstants.TENANT_ADMIN ? "Tenant Administrator Role" : "Tenant User Role" )
                    newRoles.push(tempRole)          
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

    public async addTenantUsers(req:Request) {

        let response = {}
        await this.manager.transaction(async(transactionEntityManager) => {

        try {  

            if(!await this.checkIfTenantExists(req.params.id)) {  
                throw new NotFoundError("Tenant Not Found: "+req.params.id)
            } 
        
            const tenant:Tenant = await this.getTenantIfUserDoesNotExistForTenant(req.body.user.ssoUserId,req.params.id)
    
            if(!tenant) {
                throw new ConflictError("User is already added to this tenant: "+req.params.id)
            }
    
            const tenantUser:TenantUser = new TenantUser()
            tenantUser.tenant = tenant
            const user = req.body.user
            const ssoUser:SSOUser = await this.setSSOUser(user.ssoUserId,user.firstName,user.lastName,user.displayName,
                user.userName,user.email)       
            tenantUser.ssoUser = ssoUser
    
            const savedTenantUser = await transactionEntityManager.save(tenantUser)
            console.log(savedTenantUser)
    
            if(req.body.user?.role?.id) {
                const roleId = req.body.user.role.id;
                const role:Role = await transactionEntityManager.findOne(Role,{where: {id:roleId}})
                if(role) {                
                    const tenantUserRole:TenantUserRole = new TenantUserRole()
                    tenantUserRole.role = role
                    tenantUserRole.tenantUser = savedTenantUser
                    await transactionEntityManager.save(tenantUserRole)
                }
            }
            delete savedTenantUser.tenant
            response = savedTenantUser
        }
        
        catch(error) {
            console.error('Add user to a tenant transaction failure - rolling back inserts ', error);
            throw error
        }
    });  

    return response

    }

    public async createRoles(req:Request) {
        let response = {}
        await this.manager.transaction(async(transactionEntityManager) => {

            try {

                const tenantId:string = req.params.id

                const requestRole = req.body.role

                const tenant:Tenant = await transactionEntityManager.findOne(Tenant,{where: {id:tenantId}})
                if(!tenant) {  
                    throw new NotFoundError("Tenant Not Found: "+tenantId)
                }

                const dbRoles:Role [] = await this.findRoles([requestRole.name],tenantId)

                if(dbRoles?.length !== 0) {
                    throw new ConflictError("Role already exists for tenant: "+tenantId + " : " + requestRole.name)
                }   

                const role:Role = new Role()
                role.name = requestRole.name
                role.description = requestRole.description
                role.tenant = tenant
                const savedRole = await transactionEntityManager.save(role)
                response = savedRole

            }
            catch(error) {
                console.error('Create Role for tenant transaction failure - rolling back inserts ',error)
                throw error
            }

        });

        return response
    }

    public async assignUserRoles(req:Request) {
        let response = {}
        await this.manager.transaction(async(transactionEntityManager) => {
            try {
                const { tenantId, tenantUserId, roleId } = req.params;
                const tenantWithUsersAndRoles = await this.getTenantsUsersAndRoles(tenantId,tenantUserId,roleId)
                if(tenantWithUsersAndRoles) {
                    const matchingTenantUser:TenantUser =  tenantWithUsersAndRoles.users.find(
                        (user) => user.id = tenantUserId
                    )
                    const matchedRole = matchingTenantUser.roles?.some((rl) => rl.role?.id === roleId)

                    if(matchedRole) {
                       throw new ConflictError("User already mapped to this role for this tenant")
                    }

                    const matchingRole:Role = tenantWithUsersAndRoles.roles.find(
                        (role:Role) => role.id = roleId
                    )

                    const tenantUserRole:TenantUserRole = new TenantUserRole()
                    tenantUserRole.tenantUser = matchingTenantUser
                    tenantUserRole.role = matchingRole

                    const savedTenantUserRole:TenantUserRole = await transactionEntityManager.save(tenantUserRole)

                    delete savedTenantUserRole.tenantUser.roles

                    response =  {
                        user:savedTenantUserRole.tenantUser,
                        role: savedTenantUserRole.role,
                        id:savedTenantUserRole.id,
                        createdDateTime: savedTenantUserRole.createdDateTime,
                        UpdateDateColumn: savedTenantUserRole.updatedDateTime
                    }

                }
                    else {
                        throw new NotFoundError("Tenant: " + tenantId + ",  Users: " + tenantUserId +  " and / or roles: " + roleId +  " not found")
                    }

                }
                catch(error) {
                    console.error('Assign role to user transaction failure - rolling back inserts ',error)
                    throw error
                }
           
        });
        return response
    }

    public async getTenantRoles(req:Request) {
        const tenantId:string = req.params.id
        if(!await this.checkIfTenantExists(tenantId)) {
            throw new NotFoundError("Tenant Not Found: "+tenantId)
        }
        else { 
            const roles:Role [] = await this.findTenantRoles(tenantId)
            return roles
        }  
    }

    public async getTenantsUsersAndRoles(tenantId:string,tenantUserId:string,roleId:string) {
        const tenant = await this.manager
            .createQueryBuilder(Tenant,"tenant")
            .leftJoinAndSelect("tenant.users", "tenantUser")
            .leftJoinAndSelect("tenantUser.roles","turoles")
            .leftJoinAndSelect("turoles.role","role")
            .leftJoinAndSelect("tenant.roles", "roles")
            .where("tenant.id = :tenantId", { tenantId })
            .andWhere("tenantUser.id = :tenantUserId", { tenantUserId })
            .andWhere("roles.id = :roleId",{roleId})
            .getOne();
        return tenant
    }

    public async checkIfTenantExists(tenantId:string) {
        const tenantExists = await this.manager
            .createQueryBuilder()
            .from(Tenant, "t")
            .where("t.id = :tenantId", { tenantId })
            .getExists();
            console.log(tenantExists)
        return tenantExists
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
            .createQueryBuilder(TenantUser, "tu")
            .innerJoinAndSelect("tu.ssoUser", "su", "tu.sso_id = su.id")            
            .where("tu.tenant_id = :tenantId", { tenantId })
            .getMany();       
        return users
    }

    public async getTenantIfUserDoesNotExistForTenant(ssoUserId:string, tenantId:string) {
        const tenant = await this.manager
        .createQueryBuilder(Tenant, "t")
        .where("t.id = :tenantId", { tenantId })
        .andWhere(qb => {
            const subQuery = qb.subQuery()
                .select("1")
                .from(TenantUser, "tu")
                .innerJoin(SSOUser, "su", "tu.sso_id = su.id")
                .where("tu.tenant_id = t.id")
                .andWhere("su.ssoUserId = :ssoUserId", { ssoUserId })
                .getQuery();
            return `NOT EXISTS (${subQuery})`;
        })
        .getOne();
        return tenant
    }

    public async saveRoles(roles:Role []) {
        const savedRoles = await this.manager.save(roles)
        return savedRoles
    }

    public async findRoles(roleNames:string[],tenantId:string) {
        const whereCondition: any = { name: In(roleNames) };
        if (tenantId) {
            whereCondition["tenant"] = { id: tenantId }
        }      
        const roles:Role [] = await this.manager.find(Role, { where: whereCondition });
        return roles ?? []
    }

    private async setSSOUser(ssoUserId:string, firstName:string, lastName:string, displayName:string,userName:string, email:string) {
        let ssoUser:SSOUser = await this.manager.findOne(SSOUser,{where:{ssoUserId:ssoUserId}})
        if(!ssoUser) { 
            ssoUser = new SSOUser()
            ssoUser.firstName = firstName
            ssoUser.lastName = lastName
            ssoUser.displayName = displayName
            ssoUser.userName = userName
            ssoUser.ssoUserId = ssoUserId
            ssoUser.email = email        
        }
        return ssoUser
    }

    public async findTenantRoles(tenantId:string) {
        const roles = await this.manager
            .createQueryBuilder(Role, "role")
            .leftJoin("role.tenant", "tenant")
            .where("role.tenant.id = :tenantId OR role.tenant IS NULL", { tenantId })
            .getMany();
        return roles
    }

}

