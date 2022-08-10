
import { Controller} from './Controller';
import express from 'express';
import User from '../models/User';
import { PrismaClient  } from '@prisma/client';

class AuthController extends Controller {

   
   async signup(req: express.Request, res: express.Response){

        console.log(req.body);

        const prisma = new PrismaClient();
        let users = await User.allUsers().catch(async (e) => {
            console.error('we have an error');
            console.error(e)
            await prisma.$disconnect();
            process.exit(1);
          });


         res.status(200).json({
            success: true,
            name: req.body.name,
            data: users
         });



    }

}

export default new AuthController();