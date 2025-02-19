import { Request, Response } from 'express'
import {TMSRepository} from '../repositories/tms.repository'
import { connection } from '../common/db.connection'
import { Tenant } from '../entities/Tenant';
import { TenantUser } from '../entities/TenantUser';
import { SSOUser } from '../entities/SSOUser';
import { NotFoundError } from '../errors/NotFoundError';

export class TMSService {

    tmsRepository:TMSRepository = new TMSRepository(connection.manager)
    
    public async createTenant(req:Request) {
        const savedTenant = await this.tmsRepository.saveTenant(req)
        return {
            data : savedTenant
        }                
    }

    public async addTenantUser(req:Request) {       
       
        const response = await this.tmsRepository.addTenantUsers(req)

        return {
            data: { 
                user:response
            } 
        }
        
    }

    public async getTenantsForUser(req:Request) {

        const tenants = await this.tmsRepository.getTenantsForUser(req.params.ssoUserId)
        return {
            data: {
                tenants
            }
        }
    }
    
    public async getUsersForTenant(req:Request) {
        const users = await this.tmsRepository.getUsersForTenant(req.params.id)
        return {
            data: {
                users
            }
        }
    }

    public async createRoles(req:Request) {
        const roles = await this.tmsRepository.createRoles(req)
        return {
            data: {
                role:roles
            }
        }
    }

    private async setTenantResponse(tenant:Tenant) {

        const users = tenant.users.map(user =>({
            "id":user.id,
            "firstName":user.ssoUser.firstName,
            "lastName":user.ssoUser.lastName,
            "userName":user.ssoUser.userName,
            "displayName":user.ssoUser.displayName,
            "email":user.ssoUser.email,
            "ssoUserId":user.ssoUser.ssoUserId,
            "createdDateTime":user.ssoUser.createdDateTime,
            "updatedDateTime":user.ssoUser.updatedDateTime
        }))

        const tenantResponse = {          
              "tenant":  {
                    "id": tenant.id,
                    "name":tenant.name,
                    "ministryName":tenant.ministryName,
                    "createdDateTime": tenant.createdDateTime,
                    "updatedDateTime": tenant.updatedDateTime,
                    "users":users
                }
            }
            return tenantResponse
        }
    
}