import { Joi } from 'express-validation'
import { TMSConstants } from './tms.constants'

export default {

    createTenant: {
        body: Joi.object({
            name: Joi.string().min(1).max(20).required(),
            ministryName: Joi.string().min(1).max(100).required(),
            user: Joi.object().keys({
                firstName: Joi.string().min(1).max(50),
                lastName: Joi.string().min(1).max(50),
                displayName: Joi.string().min(1).max(50),
                userName: Joi.string().min(1).max(50),
                ssoUserId: Joi.string().required(), // will need to be updated to the right regex and length
                email:Joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).max(100).required(),                
            }).min(1)
        }).options({abortEarly:false,convert:false})
    }

}