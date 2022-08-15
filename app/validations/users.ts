import Joi from 'joi';
import express from 'express';
import debug from 'debug';
// import models here to check for any database or transactional information.

const log: debug.IDebugger = debug('app:users-verify-email');

class userSchema{

    async validateUserId(req: express.Request, res: express.Response, next: express.NextFunction ) {


        const schema = Joi.object({
            id: Joi.number()
                .min(1)
                .max(30)
                .required(),
        });

        try {
            const value = await schema.validateAsync(req.params);

            
            next();
        }
        catch (err) { 

            return res.status(422).json({errors: err});

        }

        return res.status(200).json({status: 'middleware working'});
    
    }
    
    async validateCreateUser(req: express.Request, res: express.Response, next: express.NextFunction){

        const schema = Joi.object({
            name: Joi.string()
                    .min(3)
                    .max(50)
                    .required(),
            username: Joi.string()
                        .alphanum()
                        .min(5)
                        .max(32)
                        .required(),
            password: Joi.string()
                        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                        .required(),

            repeat_password: Joi.ref('password'),

            email: Joi.string()
                    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                    .required()

        });

        try {
            const value = await schema.validateAsync(req.body, {abortEarly: false});

            if(!value.error) {
                next();
            }
            
           
        }
        catch (err) { 

            return res.status(422).json({errors: err});

        }

        return res.status(200).json({status: 'middleware working'});

    }

}


export default new userSchema();



