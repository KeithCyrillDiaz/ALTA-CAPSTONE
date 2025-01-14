import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";
import jwt from 'jsonwebtoken'
import { configuration } from "../../config/dotenv";


export const getAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Creating Access Token");
        const { refreshToken } = req.cookies;

        if(!refreshToken) {
            logger.error("Refresh Token is Missing");
            res.status(401).json({
                code: "GAT_001",
                message: "Refresh Token is Missing"
            });
            return;
        }
        const {refresh_secret_key, access_secret_key} = configuration;
        jwt.verify(refreshToken, refresh_secret_key);

        const token = jwt.sign(
            {tokenName: "access"}, 
            access_secret_key,
            {expiresIn: '1h'}
        );
    
        res.status(201).json({
            code: "GAT_000",
            message: "Access Token Created Successfully",
            token
        });

        return
 
    } catch (error) {
        next(error);
    }
}