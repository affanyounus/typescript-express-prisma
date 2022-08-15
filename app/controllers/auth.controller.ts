
import { Controller} from './Controller';
import express from 'express';
import User from '../models/User';
import { PrismaClient, Prisma  } from '@prisma/client';
import { CreateUserDto } from '../models/interfaces/user/create.user.dto';

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

}

export default new AuthController();