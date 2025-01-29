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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("../../utils/logger");
const dotenv_1 = require("../../config/dotenv");
const sendEmail = (recipientEmail, subject, htmlContent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Sending Email");
        //SET UP EMAIL TRANSPORTER
        const { clientAppPassword, clientEmail } = dotenv_1.gmailCredentials;
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: clientEmail, // EMAIL ADDRESS OF GMAIL
                pass: clientAppPassword, // GENERATED APP PASSWORD
            },
        });
        //EMAIL OPTIONS
        const mailOptions = {
            from: clientEmail, // SENDER'S EMAIL ADDRESS
            to: recipientEmail, // RECIPIENT EMAIL
            subject, // SUBJECT EMAIL
            html: htmlContent, // BODY OF THE EMAIL
        };
        //SEND EMAIL
        yield transporter.sendMail(mailOptions);
        logger_1.logger.success(`Email sent successfully to ${recipientEmail}`);
    }
    catch (error) {
        logger_1.logger.error("Failed to Send email", error);
    }
});
exports.sendEmail = sendEmail;
//# sourceMappingURL=gmail.js.map