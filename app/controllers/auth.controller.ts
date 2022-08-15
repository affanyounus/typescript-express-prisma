
import { Controller} from './Controller';
import express from 'express';
import argon2 from 'argon2';
import User from '../models/User';
import { PrismaClient, Prisma  } from '@prisma/client';
import { CreateUserDto } from '../models/interfaces/user/create.user.dto';
import { request } from 'http';

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


        let user: Prisma.usersCreateInput = req.body;

        // req.body.password = await argon2.hash(req.body.password);
        // const userId = await usersService.create(req.body);
        // res.status(201).send({ id: userId });

        console.log(user);

       let result = await User.createUser(user).then(async ()=>{
        
        await prisma.$disconnect();

       }).catch(async (e)=>{

            console.error('we have an error');
            console.error(e)
           // process.exit(1);


        });

        res.status(201).json({
            success: true,
            name: req.body.name,
            data: result
         });


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