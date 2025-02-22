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
exports.getAccessToken = void 0;
const logger_1 = require("../../utils/logger");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("../../config/dotenv");
const getAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Creating Access Token");
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            logger_1.logger.error("Refresh Token is Missing");
            res.status(401).json({
                code: "GAT_001",
                message: "Refresh Token is Missing"
            });
            return;
        }
        const { refresh_secret_key, access_secret_key } = dotenv_1.configuration;
        jsonwebtoken_1.default.verify(refreshToken, refresh_secret_key);
        const token = jsonwebtoken_1.default.sign({ tokenName: "access" }, access_secret_key, { expiresIn: '1h' });
        res.status(201).json({
            code: "GAT_000",
            message: "Access Token Created Successfully",
            token
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.getAccessToken = getAccessToken;
//# sourceMappingURL=accessTokenController.js.map