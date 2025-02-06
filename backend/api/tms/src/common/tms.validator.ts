import { Joi } from 'express-validation'
import { TMSConstants } from './tms.constants'

export default {

    createTenant: {
        body: Joi.object({
            name: Joi.string().min(1).max(20).required(),
            user: Joi.object().keys({
                ssoUserId: Joi.string().length(32).required(), // will need to be updated to the right regex
                role: Joi.string().valid(TMSConstants.TENANT_ADMIN,TMSConstants.TENANT_USER).required()
            }).min(1)
        }).options({abortEarly:false,convert:false})
    }

}