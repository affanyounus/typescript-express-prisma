import express from 'express';
export abstract class CommonRoutesConfig {
    app: express.Application;
    name: string;

    //this is an abstract method that may be used to call individually for each route for any additional functionality.
    abstract configureRoute(): express.Application;

    constructor(app: express.Application, name: string) {
        this.app = app;
        this.name = name;
    }
    getName() {
        return this.name;
    }
}