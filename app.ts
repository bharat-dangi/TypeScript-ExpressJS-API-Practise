import dotenv from "dotenv";
const dotenvResult = dotenv.config();
import express, { Request, Response } from "express";
import * as http from "http";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import debug from "debug";
import { Application } from "express";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { UserRoutes } from "./users/users.routes.config";
import { AuthRoutes } from "./auth/auth.routes.config";

const app: Application = express();
const server: http.Server = http.createServer(app);
const port: Number = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug("app");

if (dotenvResult.error) {
  throw dotenvResult.error;
}

app.use(express.json());
app.use(cors());

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false;
}

app.use(expressWinston.logger(loggerOptions));
routes.push(new AuthRoutes(app));
routes.push(new UserRoutes(app));

const runningMessage = `Server running at http://localhost:${port}`;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send(runningMessage);
});

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });

  console.log(runningMessage);
});
