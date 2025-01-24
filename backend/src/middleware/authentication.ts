import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import jwt from "jsonwebtoken";
import { configuration, frontEndCredentials } from "../config/dotenv";

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Checking if the Admin User is authenticated");

        const {authorization} = req.headers;

        if(!authorization || !authorization.startsWith("Bearer ")) {
            logger.error("Access Token is Missing");
            res.status(401).json({
                code: 'AUTH_001',
                message: "Access Token is Missing"
            });
            return;
        }
        
        //EXTRACT TOKEN FROM AUTHORIZATION HEADER
        const token = authorization.split(" ")[1];

        if(!token) {
            logger.error("Access Token is Missing");
            res.status(401).json({
                code: 'AUTH_002',
                message: "Access Token is Missing"
            });
            return;
        }

        //WILL RETURN AN ERROR IF TOKEN IS INVALID SO NO NEED FOR ERROR HANDLING
        jwt.verify(token, configuration.access_secret_key);

        logger.ready("User is Authorized");
        //PROCEED TO ENDPOINT IF TOKEN IS VALID
        next();

    } catch (error) {
        next(error);
    }
}

export const clientAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Checking if Client Request is Authenticated");

        const {authorization} = req.headers;

        if(!authorization || !authorization.startsWith("Bearer ")) {
            logger.error("Access Token is Missing");
            res.status(401).json({
                code: 'CAUTH_001',
                message: "Access Token is Missing"
            });
            return;
        }

        //EXTRACT THE TOKEN
        const token = authorization.split(" ")[1];

        if(!token) {
            logger.error("Access Token is Missing");
            res.status(401).json({
                code: 'CAUTH_002',
                message: "Access Token is Missing"
            });
            return;
        }

        //GET THE CLIENT TOKEN IN ENV AND COMPARE IT TO THE AUTH TOKEN IN REQ
        const CLIENT_TOKEN = frontEndCredentials.clientToken
        if(CLIENT_TOKEN !== token) {
            logger.error("Invalid Token");
            res.status(401).json({
                code: 'CAUTH_003',
                message: "Invalid Token"
            });
            return;
        }

        logger.ready("Client Request is Authorized");
        next();

    } catch (error) {
        next(error);
    }
}