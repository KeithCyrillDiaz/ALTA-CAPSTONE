"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRequestEvery15minutes = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("./logger");
const dotenv_1 = require("config/dotenv");
const sendRequestEvery15minutes = () => {
    setInterval(async () => {
        try {
            logger_1.logger.event("Sending Dummy Request");
            await axios_1.default.get(dotenv_1.configuration.backend_URL);
            logger_1.logger.success("Dummy Request Sent");
        }
        catch (error) {
            logger_1.logger.error("error sending request");
        }
    }, 900000); // 900000 ms = 15 minutes
};
exports.sendRequestEvery15minutes = sendRequestEvery15minutes;
//# sourceMappingURL=sendIntervalReq.js.map