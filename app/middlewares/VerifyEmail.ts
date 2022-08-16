import express from 'express';
import debug from 'debug';
import { PrismaClient, Prisma } from '@prisma/client';
// import models here to check for any database or transactional information.

const log: debug.IDebugger = debug('app:users-verify-email');


const prisma = new PrismaClient();

class verifyEmail {

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

        const user_email = await prisma.users.findFirst({
            where: {
                email: req.body.email
            }
        });

        if (user_email) {
            return res.status(400).json({
                'error': {
                    'email': 'User Email already exists'
                }
            });
        }

        const username = await prisma.users.findFirst({
            where: {
                username: req.body.username
            }
        });

        if (username) {
            return res.status(400).json({
                'error': {
                    'username': 'Username already exists'
                }
            });
        }

        next();

    }


}


export default new verifyEmail();
