import { Joi } from 'express-validation'
import { TMSConstants } from './tms.constants'

export default {

    createTenant: {
        body: Joi.object({
            name: Joi.string().min(1).max(20).required(),
            ministryName: Joi.string().min(1).max(100).required(),
            user: Joi.object().keys({
                firstName: Joi.string().min(1).max(50).required(),
                lastName: Joi.string().min(1).max(50).required(),
                displayName: Joi.string().min(1).max(50).required(),
                userName: Joi.string().min(1).max(50).required(),
                ssoUserId: Joi.string().required(), // will need to be updated to the right regex and length
                email:Joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).max(100).required(),                
            }).min(1)
        }).options({abortEarly:false,convert:false})
    },

    addTenantUser: {
        params: Joi.object({
            id: Joi.string().guid().required()
        }),
        body: Joi.object({
            user: Joi.object().keys({
                firstName: Joi.string().min(1).max(50).required(),
                lastName: Joi.string().min(1).max(50).required(),
                displayName: Joi.string().min(1).max(50).required(),
                userName: Joi.string().min(1).max(50).required(),
                ssoUserId: Joi.string().required(), // will need to be updated to the right regex and length
                email:Joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).max(100).required(),                
            }).min(1)
        })
    }

}