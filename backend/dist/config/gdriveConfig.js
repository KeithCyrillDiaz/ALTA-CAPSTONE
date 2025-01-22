"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
const dotenv_2 = require("./dotenv");
const logger_1 = require("../utils/logger");
dotenv_1.default.config();
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const { clientEmail, clientKey } = dotenv_2.gdriveCredentials;
const JWTClient = new googleapis_1.google.auth.JWT(clientEmail, null, clientKey, SCOPES);
JWTClient.authorize(function (err) {
    if (err) {
        throw new Error(err.message);
    }
    else {
        logger_1.logger.ready("Google Autorization Complete");
    }
});
exports.default = JWTClient;
//# sourceMappingURL=gdriveConfig.js.map