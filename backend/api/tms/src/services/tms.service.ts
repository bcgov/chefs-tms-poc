import { Request, Response } from 'express'
import {TMSRepository} from '../repositories/tms.repository'
import { connection } from '../common/db.connection'
import { Tenant } from '../entities/Tenant';
import { TenantUser } from '../entities/TenantUser';
import { SSOUser } from '../entities/SSOUser';

export class TMSService {

    tmsRepository:TMSRepository = new TMSRepository(connection.manager)
    
    public async createTenant(req:Request) {
        
        const tenant:Tenant = await this.setTenant(req)        
        const savedTenant = await this.tmsRepository.saveTenant(tenant)
        return {
            data : await this.setTenantResponse(savedTenant)
        }                
    }

    public async addTenantUsers(req:Request) {       
        const tenant:Tenant = await this.tmsRepository.findTenant(req.params.id)
              
        if(!tenant) {
            throw new Error("Tenant not found")
        }        
        const tenantUsers:TenantUser[] = [] 
        
        for(const user of req.body.users) {   
           const userExistsForTenant = await this.tmsRepository.checkIfUserExistsForTenant(user.ssoUserId,req.params.id)            
           if(!userExistsForTenant) {
            const tenantUser:TenantUser = new TenantUser()
            const mappedUser:SSOUser = await this.mapSSOUser(user)
            tenantUser.role = user.role
            tenantUser.ssoUser = mappedUser
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

    private async setTenant(req:Request) {

       const tenant:Tenant = new Tenant()
       const tenantUser:TenantUser = new TenantUser()

       tenant.name = req.body.name
       tenant.ministryName = req.body.ministryName

       const ssoUser:SSOUser = await this.mapSSOUser(req.body.user)       
       tenantUser.ssoUser = ssoUser
              
       tenantUser.role = req.body.user.role
       tenantUser.tenant = tenant
       tenant.users = [tenantUser]

       const savedTenant = await this.tmsRepository.saveTenant(tenant)

       return savedTenant

    }

    private async mapSSOUser(user:any) {  

       var ssoUser = await this.tmsRepository.getSSOUserById(user.ssoUserId)

       if(!ssoUser) { 

        const newSSOUser:SSOUser = new SSOUser()
        newSSOUser.firstName = user.firstName
        newSSOUser.lastName = user.lastName
        newSSOUser.displayName = user.displayName
        newSSOUser.userName = user.userName
        newSSOUser.ssoUserId = user.ssoUserId
        newSSOUser.email = user.email        

        ssoUser = await this.tmsRepository.saveSSOUser(newSSOUser)
       }
       return ssoUser        
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
            "role":user.role,            
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