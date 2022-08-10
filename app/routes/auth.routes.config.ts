import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import VerifyEmail from "../middlewares/VerifyEmail";
import AuthController from "../controllers/auth.controller";

export class AuthRoutes extends CommonRoutesConfig {

    constructor(app: express.Application) {
        super(app, 'AuthRoutes');
    }


    configureRoute(): express.Application {

        // this.app.route(`/auth/signup`)
        // .get((req: express.Request, res: express.Response) => {
        //     res.status(200).send(`List of users`);
        // })

        this.app.route(`/auth/signup`)
            .post(
                VerifyEmail.validateSameEmailBelongToSameUser,
                VerifyEmail.validateUserExists,
                AuthController.signup
                // (req: express.Request, res: express.Response) => {

                //     res.status(200).json(req.body.name);

                // }
                )

        // this.app.post('/auth/signup', [

        //     //middlewares
        //     //later will implement it

        // ],
        // new AuthController().signup)


        return this.app;
    }



}