import Joi from 'joi';
import express from 'express';
import debug from 'debug';
// import models here to check for any database or transactional information.

const log: debug.IDebugger = debug('app:users-verify-email');

class userSchema{

    async validateUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {


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

    
    
    }
    





}


export default new userSchema();



