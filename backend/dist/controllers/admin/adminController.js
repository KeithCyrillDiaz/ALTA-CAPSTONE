"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogOut = exports.adminLogIn = void 0;
const logger_1 = require("../../utils/logger");
const dotenv_1 = require("../../config/dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminLogIn = async (req, res, next) => {
    try {
        logger_1.logger.event("Admin Log In Started");
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({
                code: "ALI_001",
                message: "Please Enter both username and password",
            });
            return;
        }
        const { admin_pass, admin_user, access_secret_key, refresh_secret_key } = dotenv_1.configuration;
        if (password !== admin_pass && username !== admin_user) {
            res.status(401).json({
                code: "ALI_002",
                message: "Invalid username or password"
            });
            return;
        }
        const refreshToken = jsonwebtoken_1.default.sign({ tokenName: "refresh" }, // Payload as an object
        refresh_secret_key, { expiresIn: '1w' } // Expires in 1 week
        );
        // Create access token
        const accessToken = jsonwebtoken_1.default.sign({ tokenName: "access" }, // Payload as an object
        access_secret_key, { expiresIn: '1h' } // Expires in 1 hour
        );
        // Set the refresh token in the cookies
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Prevents client-side access to the cookie (important for security)
            secure: process.env.NODE_ENV === 'production', // Use 'secure' flag in production (ensure HTTPS)
            sameSite: 'strict', // Prevents CSRF attacks by restricting cross-origin cookie access
            maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week (matches the expiration time of the refresh token)
        });
        logger_1.logger.ready("Refresh Token Stored in Cookie");
        logger_1.logger.success("User Successfully Log In");
        res.status(200).json({
            code: 'ALI_000',
            message: "Log In Successfully",
            token: accessToken
        });
    }
    catch (error) {
        next(error);
    }
};
exports.adminLogIn = adminLogIn;
const adminLogOut = async (req, res, next) => {
    try {
        logger_1.logger.event("Admin User is Logging Out");
        res.clearCookie('refreshToken', {
            httpOnly: true, // ENSURE THE COOKIE IS ONLY ACCESSIBLE BY THE SERVER 
            secure: true,
            sameSite: 'strict',
        });
        res.status(200).json({
            code: 'ALO_000',
            message: 'Successfully logged out',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.adminLogOut = adminLogOut;
//# sourceMappingURL=adminController.js.map