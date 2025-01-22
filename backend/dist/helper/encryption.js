"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptData = void 0;
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = require("../config/dotenv");
const encryptData = (data) => {
    // Use SHA-256 to create a 32-byte key from the encryption key
    const encryptionKey = crypto_1.default.createHash('sha256').update(dotenv_1.configuration.encryptionKey).digest();
    // Create IV (Initialization Vector) for AES-256-CBC encryption (16 bytes)
    const iv = encryptionKey.slice(0, 16); // Use the first 16 bytes for the IV
    // Create the cipher instance
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
};
exports.encryptData = encryptData;
//# sourceMappingURL=encryption.js.map