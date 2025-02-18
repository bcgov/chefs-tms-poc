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
        console.log('hello')
        const savedTenant = await this.tmsRepository.saveTenant(req)
        console.log(savedTenant)
        return {
            data : savedTenant
        }                
    }

    public async addTenantUsers(req:Request) {       
        const tenant:Tenant = await this.tmsRepository.findTenant(req.params.id)
              
        if(!tenant) {
            throw new NotFoundError("Tenant not found: "+req.params.id)
        }        
        const tenantUsers:TenantUser[] = [] 
        
        for(const user of req.body.users) {   
           const userExistsForTenant = await this.tmsRepository.checkIfUserExistsForTenant(user.ssoUserId,req.params.id)            
           if(!userExistsForTenant) {
            const tenantUser:TenantUser = new TenantUser()
        //    const mappedUser:SSOUser = await this.tmsRepository.mapSSOUser(user)
       //     tenantUser.ssoUser = mappedUser
            tenantUser.tenant = tenant
            tenantUsers.push(tenantUser)
           }           
        }
        const users = await this.tmsRepository.addTenantUsers(tenantUsers)

        return {
            data: { 
                users 
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