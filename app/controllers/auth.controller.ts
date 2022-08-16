
import { Controller} from './Controller';
import express from 'express';
import argon2 from 'argon2';
import moment from 'moment';
import User from '../models/User';
import { PrismaClient, Prisma  } from '@prisma/client';
import { CreateUserDto } from '../models/interfaces/user/create.user.dto';
import { request } from 'http';
import { json } from 'stream/consumers';

const prisma = new PrismaClient();

class AuthController extends Controller {


    constructor(){
        super();
    }

   
   async index(req: express.Request, res: express.Response){

        console.log(req.body);


        let users = await User.allUsers().then(async ()=>{

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

    async create(req: express.Request, res: express.Response){


       // res.status(200).json({'status': 'inside controller'});

        let user: Prisma.usersCreateInput = req.body;

        // req.body.password = await argon2.hash(req.body.password);
        // const userId = await usersService.create(req.body);
        // res.status(201).send({ id: userId });


        //it will store UTC +00:00:00 time
        const date_instance = new Date();  
        const date_now = moment(date_instance).format('YYYY-MM-DD HH:mm:ss');
        

        const data = {
            ...user,
            createdAt: date_instance,
            updatedAt: date_instance
        }; 

        console.log('generated data', data);

        try{

            let result = await User.createUser(data);


            if(result){

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
        catch(e: any){

            console.log(e.toString());

           return res.status(400).json({ 'error': e })
        }       


    }

    async showById(req: express.Request, res: express.Response){

        let user: number = parseInt( req.params.id );

        try{

            const result: object | null = await prisma.users.findFirst({
                where: {
                    id: user
            }
        });

        if(result == null){

            throw new Error('user not found');

        }

      
    
        res.json(result)

        }
        catch(e: any){

            res.status(404).json({ error: `User with ID ${user} does not exist in the database` })
        }
       


    }

}

export default new AuthController();