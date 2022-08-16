import { Controller } from './Controller';
import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import moment from 'moment';
import User from '../models/User';
import { PrismaClient, Prisma } from '@prisma/client';
import { CreateUserDto } from '../models/interfaces/user/create.user.dto';
import { request } from 'http';
import { Jwt } from '../common/types/jwt';

const prisma = new PrismaClient();

// @ts-expect-error
const jwtSecret: string = process.env.JWT_SECRET;
const tokenExpirationInSeconds = 36000;

class AuthController extends Controller {


    constructor() {
        super();
    }


    async index(req: express.Request, res: express.Response) {

        console.log(req.body);


        let users = await User.allUsers().then(async () => {

            await prisma.$disconnect();

        }).catch(async (e) => {
            console.error('we have an error');
            console.error(e)
            //await this.dbClient.$disconnect();
            // process.exit(1);
        });


        return res.status(200).json({
            success: true,
            name: req.body.name,
            data: users
        });





    }


    async create(req: express.Request, res: express.Response) {


        // res.status(200).json({'status': 'inside controller'});

        let user: Prisma.usersCreateInput = req.body;

        user.password = await argon2.hash(req.body.password);


        //it will store UTC +00:00:00 time
        const date_instance = new Date();
        const date_now = moment(date_instance).format('YYYY-MM-DD HH:mm:ss');


        const data = {
            ...user,
            createdAt: date_instance,
            updatedAt: date_instance
        };

        console.log('generated data', data);

        try {

            let result = await User.createUser(data);


            if (result) {

                return res.status(201).json({
                    success: true,
                    name: req.body.name,
                    data: result
                });
            }


            return res.status(400).json({
                success: false,
                data: result
            });

        }
        catch (e: any) {

            console.log(e.toString());

            return res.status(400).json({ 'error': e })
        }


    }

    async login(req: express.Request, res: express.Response) {



        type userLoginType = {
            id: number | null,
            username: string | null,
            password: string | null,
        };

        const input: userLoginType = req.body;

        try {

            const user: userLoginType | null = await prisma.users.findFirst({
                where: {
                    username: input.username
                }
            });

            if (user == null) {

                throw new Error('user not foud');

            }

            const passwordHash: string = user.password || '';
            console.log(passwordHash);
            if (await argon2.verify(passwordHash, req.body.password)) {


                //jwt authentication
                const refreshId = user.id + jwtSecret;
                const salt = crypto.createSecretKey(crypto.randomBytes(16));
                const refreshToken = crypto
                    .createHmac('sha512', salt)
                    .update(refreshId)
                    .digest('base64');
                const refreshKey = salt.export();
                const accesToken = jwt.sign({id: user.id}, jwtSecret, {
                    expiresIn: tokenExpirationInSeconds,
                });


                return res.status(200).json({
                    success: true,
                    data: {
                        user,
                        accesToken,
                        refreshToken,
                        refreshKey
                    }
                });

            }

            return res.status(401).json({
                success: false,
                data: 'Incorrect login credentials.'
            });



        }
        catch (e: any) {

            console.log(e.toString());
            return res.status(404).json({ 'error': `User does not exist` })

        }

    }

    async showUser(req: express.Request, res: express.Response) {

      
        let user_id: number = parseInt( res.locals.id);

        try {

            const result: object | null = await prisma.users.findFirst({
                where: {
                    id: user_id
                }
            });

            if (result == null) {

                throw new Error('user not found');

            }

            res.json(result)

        }
        catch (e: any) {

            res.status(404).json({ error: `User with ID ${user_id} does not exist in the database` })
        }



    }

}

export default new AuthController();