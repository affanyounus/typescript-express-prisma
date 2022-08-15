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

      return await prisma.users.create({data});

    }

}

export default new User();