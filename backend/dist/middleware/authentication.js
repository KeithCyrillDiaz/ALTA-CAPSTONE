"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const logger_1 = require("../utils/logger");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("../config/dotenv");
const authentication = async (req, res, next) => {
    try {
        logger_1.logger.event("Checking if the user is authenticated");
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
                code: 'AUTH_001',
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
};
exports.authentication = authentication;
//# sourceMappingURL=authentication.js.map