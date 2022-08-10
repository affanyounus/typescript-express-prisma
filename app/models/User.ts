import { PrismaClient } from "@prisma/client";


const prisma =  new PrismaClient();


class User {


    async allUsers(){

        return await prisma.users.findMany();

    }


}

export default new User();