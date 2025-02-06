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
        const tenantResponse = await this.tmsService.createTenant(req)
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

    public async getUsersForTenant(req:Request, res:Response) {
        try {
            const users = await this.tmsService.getUsersForTenant(req)
            res.status(200).send(users)
        }
        catch(error) {
            console.log(error)
            this.errorHandler.generalError(res,"Error occurred getting users for a tenant", error.message, 500, "Internal Server Error")
        }
    }
}