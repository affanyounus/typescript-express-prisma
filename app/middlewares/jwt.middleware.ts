import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Jwt } from '../common/types/jwt';
import { PrismaClient, Prisma } from '@prisma/client';
import debug from 'debug';
import { request } from 'http';

const log: debug.IDebugger = debug('app:auth-controller');

const prisma = new PrismaClient();

// @ts-expect-error
const jwtSecret: string = process.env.JWT_SECRET;
const tokenExpirationInSeconds = 36000;

class JwtMiddleware {


     createJWT(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {

            console.log('jwt request: ', req);

            const refreshId = req.body.id + jwtSecret;
            const salt = crypto.createSecretKey(crypto.randomBytes(16));
            const hash = crypto
                .createHmac('sha512', salt)
                .update(refreshId)
                .digest('base64');
            req.body.refreshKey = salt.export();
            const token = jwt.sign(req.body, jwtSecret, {
                expiresIn: tokenExpirationInSeconds,
            });
            req.body.accessToken = token;
            req.body.refreshToken = hash;
          //  next();
            return res
                .status(201)
                .send({ accessToken: token, refreshToken: hash });
        } catch (err) {
            log('createJWT error: %O', err);
            return res.status(500).send();
        }
    }


    verifyRefreshBodyField(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.refreshToken) {
            return next();
        } else {
            return res
                .status(400)
                .send({ errors: ['Missing required field: refreshToken'] });
        }
    }

    async validRefreshNeeded(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user: any = await prisma.users.findFirst({
            where: {
                email: res.locals.jwt.email,
            },

        });
        const salt = crypto.createSecretKey(
            Buffer.from(res.locals.jwt.refreshKey.data)
        );
        const hash = crypto
            .createHmac('sha512', salt)
            .update(res.locals.jwt.userId + jwtSecret)
            .digest('base64');
        if (hash === req.body.refreshToken) {
            req.body = {
                userId: user._id,
                email: user.email,
                permissionFlags: user.permissionFlags,
            };
            return next();
        } else {
            return res.status(400).send({ errors: ['Invalid refresh token'] });
        }
    }

   async validJWTNeeded(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {

        type toCheckType = {
            id: number;
            name: string | null;
            email: string | null ;
        }

        if (req.headers['authorization']) {
            try {
                const authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send();
                } else {
                    const decoded = jwt.verify(
                        authorization[1],
                        jwtSecret
                    ) as Jwt;

                    console.log('decoded id is ', decoded.id);

                    const toCheck: toCheckType | null = await prisma.users.findFirst({
                        where:{
                            id: decoded.id
                        }
                    });

                    if(toCheck == null){
                        throw new Error('User token mismatched');
                    }

                    // req.body.id = decoded.id;
                    res.locals.id = decoded.id;
                    

                    next();


                    // if(toCheck.id == decoded.id){

                    //     console.log('toCheckId id is ', toCheck.id);

                      
                    // }
                    
                    
                }
            } catch (err) {
                return res.status(403).send();
            }
        } else {
            return res.status(401).send();
        }
    }
}

export default new JwtMiddleware();