import { Request, Response } from 'express'
import { TMSService } from '../services/tms.service'
import { ErrorHandler } from '../common/error.handler';

export class TMSController {

    tmsService: TMSService = new TMSService()
    errorHandler:ErrorHandler = new ErrorHandler()

    public async health(req:Request, res:Response) {
        const currentTimestamp = new Date().toISOString();
        res.status(200).send(
            {
             apiStatus:'Healthy',
             time: currentTimestamp
            });
    }

    public async createTenant(req:Request, res:Response) {
    try {
        const savedTenant = await this.tmsService.createTenant(req)
        const tenantResponse = {
            tenant: {
                id: savedTenant.id,
                name: savedTenant.name,
                createdDateTime: savedTenant.createdDateTime,
                updatedDateTime: savedTenant.updatedDateTime,
                users: [
                    {
                        id:savedTenant.users[0].id,
                        ssoUserId:savedTenant.users[0].ssoUserId,
                        role:savedTenant.users[0].role
                    }
                ]
            }
        }
            res.status(201).send(tenantResponse);
    } 
    catch(error) {
            console.log(error)
            this.errorHandler.generalError(res,"Error occurred during tenant creation", error.message, 500, "Internal Server Error")
        }
    }

    public async addTenantUsers(req:Request,res:Response) {
        try {
            const savedUsers = await this.tmsService.addTenantUsers(req)
            res.status(201).send(savedUsers)
        }
        catch(error) {
            console.log(error)
            this.errorHandler.generalError(res,"Error occurred adding user(s) to tenant", error.message, 500, "Internal Server Error")
        }
    }

    public async getTenantsForUser(req:Request,res:Response) {
        try {
            const tenants = await this.tmsService.getTenantsForUser(req)
            res.status(200).send(tenants)
        }
        catch(error) {
            console.log(error)
            this.errorHandler.generalError(res,"Error occurred getting tenants for a user", error.message, 500, "Internal Server Error")
        }
    }
}