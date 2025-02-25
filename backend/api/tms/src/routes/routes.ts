import { Request, Response } from 'express'
import { RoutesConstants } from '../common/routes.constants'
import {TMSController} from '../controllers/tms.controller'
import { validate, ValidationError } from 'express-validation'
import validator from '../common/tms.validator'

require('dotenv').config()

export class Routes {

    public tmsController:TMSController = new TMSController()

    public routes (app:any) {
        app.route(RoutesConstants.HEALTH).get((req:Request, res:Response) => this.tmsController.health(req, res))
        app.route(RoutesConstants.CREATE_TENANTS).post(validate(validator.createTenant,{},{}),(req:Request,res:Response) => this.tmsController.createTenant(req,res))
        app.route(RoutesConstants.ADD_TENANT_USERS).post(validate(validator.addTenantUser,{},{}),(req:Request,res:Response) => this.tmsController.addTenantUser(req,res))
        app.route(RoutesConstants.GET_USER_TENANTS).get(validate(validator.getUserTenants,{},{}),(req:Request,res:Response) => this.tmsController.getTenantsForUser(req,res))
        app.route(RoutesConstants.GET_TENANT_USERS).get(validate(validator.getTenantUsers,{},{}),(req:Request,res:Response) => this.tmsController.getUsersForTenant(req,res))
        app.route(RoutesConstants.CREATE_TENANT_ROLES).post(validate(validator.createTenantRoles,{},{}),(req:Request,res:Response) => this.tmsController.createRoles(req,res))
        app.route(RoutesConstants.ASSIGN_USER_ROLES).put((req:Request,res:Response) => this.tmsController.assignUserRoles(req,res))
        app.route(RoutesConstants.GET_TENANT_ROLES).get((req:Request,res:Response) => this.tmsController.getTenantRoles(req,res))
        app.route(RoutesConstants.GET_USER_ROLES).get((req:Request,res:Response) => this.tmsController.getUserRoles(req,res))
        app.route(RoutesConstants.UNASSIGN_USER_ROLES).delete((req:Request,res:Response) => this.tmsController.unassignUserRoles(req,res))

        app.use(function (error: Error, req: any, res: Response<any, Record<string, any>>, next: any) {
            console.log(error.message)
            if (error instanceof ValidationError) {
                return res.status(error.statusCode).json(error)
            }
        })

    }
}