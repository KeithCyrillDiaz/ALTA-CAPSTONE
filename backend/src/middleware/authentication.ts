import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import jwt from "jsonwebtoken";
import { configuration } from "../config/dotenv";

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Checking if the user is authenticated");

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
                code: 'AUTH_001',
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