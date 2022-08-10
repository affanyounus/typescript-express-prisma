import express from 'express';
import debug from 'debug';
// import models here to check for any database or transactional information.

const log: debug.IDebugger = debug('app:users-verify-email');

class verifyEmail{

    async validateSameEmailDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {

        // const user = await userService.getUserByEmail(req.body.email);
        // if (user) {
        //     res.status(400).send({ error: `User email already exists` });
        // } else {
        //     next();
        // }

        

        next();
    }
    
    async validateSameEmailBelongToSameUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        // const user = await userService.getUserByEmail(req.body.email);
        // if (user && user.id === req.params.userId) {
        //     next();
        // } else {
        //     res.status(400).send({ error: `Invalid email` });
        // }

       
        next();


    }

    async validateUserExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        // const user = await userService.readById(req.params.userId);
        // if (user) {
        //     next();
        // } else {
        //     res.status(404).send({
        //         error: `User ${req.params.userId} not found`,
        //     });
        // }

        next();

    }


}


export default new verifyEmail();
