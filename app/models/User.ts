import { PrismaClient, Prisma } from "@prisma/client";
import { Model } from "./Model";
const prisma =  new PrismaClient();

class User extends Model {


    async allUsers(){

        return await prisma.users.findMany({
            include: {
                user_roles: {
                    include: {
                        roles: true
                    }
                }
            }
        });

    }

    async createUser(data: Prisma.usersCreateInput){

        let store = {
            ...data,
            // user_roles: {
            //     create: [
                    
            //             {
            //                 connect: {
            //                     id: 1
            //                 }
            //             }
        
                    
            //     ]   
            // }
        }

        console.log(store);

      return await prisma.users.create({data: store});

    }


}

export default new User();