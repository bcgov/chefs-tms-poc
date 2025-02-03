import { Request, Response } from 'express'
import {TMSRepository} from '../repositories/tms.repository'
import { connection } from '../common/db.connection'
import { Tenant } from '../entities/Tenant';
import { TenantUser } from '../entities/TenantUser';
import { toDateWithOptions } from 'date-fns-tz/fp';
require('dotenv').config()

export class TMSService {

    tmsRepository:TMSRepository = new TMSRepository(connection.manager)
    
    public async createTenant(req:Request) {
        
        const tenant:Tenant = await this.setTenant(req)        
        const savedTenant = await this.tmsRepository.createTenant(tenant)
        return savedTenant
    }

    public async addTenantUsers(req:Request) {       
        const tenant:Tenant = await this.tmsRepository.findTenant(req.params.id)
              
        if(!tenant) {
            throw new Error("Tenant not found")
        }        
        const tenantUsers:TenantUser[] = [] 
        const requestUsers = req.body.users

        for(const user of requestUsers) {
            const tenantUser:TenantUser = new TenantUser()
            tenantUser.ssoUserId = user.ssoUserId
            tenantUser.role = user.role
            tenantUser.tenant = tenant
            tenantUsers.push(tenantUser)
        }

        //console.log(tenantUsers)
        const savedUsers = await this.tmsRepository.addTenantUsers(tenantUsers)
        return savedUsers
    }

    public async getTenantsForUser(req:Request) {

        const tenants = await this.tmsRepository.getTenantsForUser(req.params.ssoUserId)
        return tenants

    }
    
    public async getUsersForTenant(req:Request) {
        const users = await this.tmsRepository.getUsersForTenant(req.params.id)
        return users
    }

    private async setTenant(req:Request) {
        const tenant:Tenant = new Tenant()
        tenant.name = req.body.name

        const tenantUser:TenantUser = new TenantUser()
        tenantUser.id = req.body.user.id
        tenantUser.role  = req.body.user.role ?? 'TENANT_ADMIN'
        tenantUser.ssoUserId = req.body.user.ssoUserId
        tenantUser.tenant = tenant
        
        tenant.users = [tenantUser]
        return tenant
    }

}