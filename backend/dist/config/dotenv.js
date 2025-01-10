"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.configuration = {
    MongoDB_URL_Local: process.env.MONGODB_URI_LOCAL,
    MongoDB_URL_Atlas: process.env.MONGODB_URI_ATLAS,
    port: process.env.PORT || 3000,
    jwt_secret_user: process.env.JWT_SECRET_USER,
    jwt_secret_admin: process.env.JWT_SECRET_ADMIN,
    admin_pass: process.env.ADMIN_PASS,
    admin_user: process.env.ADMIN_USER,
    secretKey: process.env.SECRET_KEY,
    localOrigin: process.env.LOCAL_ORIGIN,
    globalOrigin: process.env.GLOBAL_ORIGIN
};
//# sourceMappingURL=dotenv.js.map