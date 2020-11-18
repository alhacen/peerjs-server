import bodyParser from "body-parser";
// import cors from "cors";
import express from "express";
import publicContent from "../../app.json";
import { IConfig } from "../config";
import { IMessageHandler } from "../messageHandler";
import { IRealm } from "../models/realm";
import { AuthMiddleware } from "./middleware/auth";
import CallsApi from "./v1/calls";
import PublicApi from "./v1/public";

export const Api = ({ config, realm, messageHandler }: {
  config: IConfig;
  realm: IRealm;
  messageHandler: IMessageHandler;
}): express.Router => {
  const authMiddleware = new AuthMiddleware(config, realm);

  const app = express.Router();

  const jsonParser = bodyParser.json();

  // app.use(cors());
  app.use(function (req, res, next) {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    const allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:3000','https://alhacen.ddns.net'];
    const origin: any = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin',origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', "true");
    next();
  });
  app.get("/", (_, res) => {
    res.send(publicContent);
  });

  app.use("/:key", PublicApi({ config, realm }));
  app.use("/:key/:id/:token", authMiddleware.handle, jsonParser, CallsApi({ realm, messageHandler }));

  return app;
};
