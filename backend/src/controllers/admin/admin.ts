import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";
import { configuration } from "../../config/dotenv";
import jwt from 'jsonwebtoken'

export const adminLogIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Admin Log In Started");
        
        const {username, password} = req.body;

        if(!username || !password) {
            res.status(400).json({
                code: "ALI_001",
                message: "Please Enter both username and password",
            });
            return;
        }

        const {admin_pass, admin_user, access_secret_key, refresh_secret_key} = configuration

        if(password !== admin_pass && username !== admin_user) {
            res.status(401).json({
                code: "ALI_002",
                message: "Invalid username or password"
            });
            return;
        }
        const refreshToken = jwt.sign(
            { username: "admin" },  // Payload as an object
            refresh_secret_key, 
            { expiresIn: '1w' } // Expires in 1 week
        );
                
        // Create access token
        const accessToken = jwt.sign(
            { username: "admin" },  // Payload as an object
            access_secret_key, 
            { expiresIn: '1h' } // Expires in 1 hour
        );

        // Set the refresh token in the cookies
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,        // Prevents client-side access to the cookie (important for security)
            secure: process.env.NODE_ENV === 'production',  // Use 'secure' flag in production (ensure HTTPS)
            sameSite: 'strict',    // Prevents CSRF attacks by restricting cross-origin cookie access
            maxAge: 7 * 24 * 60 * 60 * 1000  // 1 week (matches the expiration time of the refresh token)
        });

        logger.ready("Refresh Token Stored in Cookie");

        logger.success("User Successfully Log In");
        res.status(200).json({
            code: 'ALI_000',
            message: "Log In Successfully",
            token: accessToken
        })
        

    } catch (error) {
        next(error);
    }
}

