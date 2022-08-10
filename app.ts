import express from 'express';
import * as http from 'http';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import {CommonRoutesConfig} from './app/common/common.routes.config';
import {UsersRoutes} from './app/routes/users.routes.config';
import debug from 'debug';
import { AuthRoutes } from './app/routes/auth.routes.config';


const app: express.Application  = express();
const server: http.Server = http.createServer(app);

const port: string =  (process.env.PORT) || '3000';

const routes: Array<CommonRoutesConfig> = [];

// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js

const debugLog: debug.IDebugger = debug('app');
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
      winston.format.json(),
      winston.format.prettyPrint(),
      winston.format.colorize({ all: true })
  ),
};
if (!process.env.DEBUG) {
  loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

console.log('here we have logger options console logging');
console.log(loggerOptions);



// // parse various different custom JSON types as JSON
// app.use(express.json({ type: 'application/*+json' }));
// // parse some custom thing into a Buffer
// app.use(express.raw({ type: 'application/vnd.custom-type' }));
// // parse an HTML body into a string
// app.use(express.text({ type: 'text/html' }));

app.use(cors());

app.use(express.json());
// parse urlencoded types to JSON
app.use(express.urlencoded({
  extended: true
}));

app.use(expressWinston.logger(loggerOptions))


// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage)
});

routes.push(new AuthRoutes(app));
routes.push(new UsersRoutes(app));

// this is express winston logger, it is debugging all routes.
server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {

    route.configureRoute();

      debugLog(`Routes configured for ${route.getName()}`);
  });
  // our only exception to avoiding console.log(), because we
  // always want to know when the server is done starting up
  console.log(runningMessage);
});





