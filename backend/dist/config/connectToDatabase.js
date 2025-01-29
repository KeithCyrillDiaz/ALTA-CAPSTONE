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
exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("./dotenv");
const logger_1 = require("../utils/logger");
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve the MongoDB Atlas connection URL from env through configuration variable
    const MongDB_URL = dotenv_1.configuration.MongoDB_URL_Atlas;
    // If the MongoDB URL is not provided, exit the function
    if (!MongDB_URL) {
        throw new Error("MongoDB URL is not defined");
    }
    try {
        // Set mongoose to use native JavaScript promises
        mongoose_1.default.Promise = Promise;
        // Connect to MongoDB using the URL from configuration
        yield mongoose_1.default.connect(MongDB_URL);
        // Log a message to indicate whether MongoDB is running on Atlas or localhost
        if (MongDB_URL !== dotenv_1.configuration.MongoDB_URL_Atlas) {
            console.log("Ready - ".green + "MongoDB is running at localhost");
        }
        else {
            console.log("Ready - ".green + "MongoDB is running at Atlas");
        }
    }
    catch (error) {
        // If an error occurs during the connection attempt, log the error
        logger_1.logger.error("Failed Connecting to MongoDB", error);
    }
});
exports.connectToDatabase = connectToDatabase;
//# sourceMappingURL=connectToDatabase.js.map