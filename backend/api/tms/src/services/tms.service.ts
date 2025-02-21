import { Request, Response } from 'express'
import {TMSRepository} from '../repositories/tms.repository'
import { connection } from '../common/db.connection'
import { Tenant } from '../entities/Tenant';
import { TenantUser } from '../entities/TenantUser';
import { SSOUser } from '../entities/SSOUser';
import { NotFoundError } from '../errors/NotFoundError';
import { TenantUserRole } from '../entities/TenantUserRole';

export class TMSService {

    tmsRepository:TMSRepository = new TMSRepository(connection.manager)
    
    public async createTenant(req:Request) {
        const savedTenant = await this.tmsRepository.saveTenant(req)
        return {
            data: { 
                tenant:savedTenant
            }   
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

    public async assignUserRoles(req:Request) {
        const data = await this.tmsRepository.assignUserRoles(req)
        return {
           data
        }
    }

    public async getTenantRoles(req:Request) {
        const roles = await this.tmsRepository.getTenantRoles(req)
        return { 
            data : {
                roles
            }
        }
    }
    
}