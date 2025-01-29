"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientAuthentication = exports.authentication = void 0;
const logger_1 = require("../utils/logger");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("../config/dotenv");
const authentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Checking if the Admin User is authenticated");
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith("Bearer ")) {
            logger_1.logger.error("Access Token is Missing");
            res.status(401).json({
                code: 'AUTH_001',
                message: "Access Token is Missing"
            });
            return;
        }
        //EXTRACT TOKEN FROM AUTHORIZATION HEADER
        const token = authorization.split(" ")[1];
        if (!token) {
            logger_1.logger.error("Access Token is Missing");
            res.status(401).json({
                code: 'AUTH_002',
                message: "Access Token is Missing"
            });
            return;
        }
        //WILL RETURN AN ERROR IF TOKEN IS INVALID SO NO NEED FOR ERROR HANDLING
        jsonwebtoken_1.default.verify(token, dotenv_1.configuration.access_secret_key);
        logger_1.logger.ready("User is Authorized");
        //PROCEED TO ENDPOINT IF TOKEN IS VALID
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.authentication = authentication;
const clientAuthentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Checking if Client Request is Authenticated");
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith("Bearer ")) {
            logger_1.logger.error("Access Token is Missing");
            res.status(401).json({
                code: 'CAUTH_001',
                message: "Access Token is Missing"
            });
            return;
        }
        //EXTRACT THE TOKEN
        const token = authorization.split(" ")[1];
        if (!token) {
            logger_1.logger.error("Access Token is Missing");
            res.status(401).json({
                code: 'CAUTH_002',
                message: "Access Token is Missing"
            });
            return;
        }
        //GET THE CLIENT TOKEN IN ENV AND COMPARE IT TO THE AUTH TOKEN IN REQ
        const CLIENT_TOKEN = dotenv_1.frontEndCredentials.clientToken;
        if (CLIENT_TOKEN !== token) {
            logger_1.logger.error("Invalid Token");
            res.status(401).json({
                code: 'CAUTH_003',
                message: "Invalid Token"
            });
            return;
        }
        logger_1.logger.ready("Client Request is Authorized");
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.clientAuthentication = clientAuthentication;
//# sourceMappingURL=authentication.js.map