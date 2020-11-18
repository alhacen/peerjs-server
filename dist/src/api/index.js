"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
// import cors from "cors";
const express_1 = __importDefault(require("express"));
const app_json_1 = __importDefault(require("../../app.json"));
const auth_1 = require("./middleware/auth");
const calls_1 = __importDefault(require("./v1/calls"));
const public_1 = __importDefault(require("./v1/public"));
exports.Api = ({ config, realm, messageHandler }) => {
    const authMiddleware = new auth_1.AuthMiddleware(config, realm);
    const app = express_1.default.Router();
    const jsonParser = body_parser_1.default.json();
    // app.use(cors());
    app.use(function (req, res, next) {
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        const allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:3000', 'https://alhacen.ddns.net'];
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', "true");
        next();
    });
    app.get("/", (_, res) => {
        res.send(app_json_1.default);
    });
    app.use("/:key", public_1.default({ config, realm }));
    app.use("/:key/:id/:token", authMiddleware.handle, jsonParser, calls_1.default({ realm, messageHandler }));
    return app;
};
