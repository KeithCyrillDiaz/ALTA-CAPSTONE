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
exports.sendRequestEvery15minutes = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("./logger");
const dotenv_1 = require("../config/dotenv");
const sendRequestEvery15minutes = () => {
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            logger_1.logger.event("Sending Dummy Request");
            yield axios_1.default.get(dotenv_1.configuration.backend_URL);
            logger_1.logger.success("Dummy Request Sent");
        }
        catch (error) {
            logger_1.logger.error("error sending request");
        }
    }), 840000); // 840,000 ms = 14 minutes
};
exports.sendRequestEvery15minutes = sendRequestEvery15minutes;
//# sourceMappingURL=sendIntervalReq.js.map