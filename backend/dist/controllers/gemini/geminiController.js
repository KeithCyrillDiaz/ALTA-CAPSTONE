"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeGeminiPrompt = void 0;
const logger_1 = require("../../utils/logger");
const validTitle = ["Resume"];
const storeGeminiPrompt = async (req, res, next) => {
    try {
        logger_1.logger.event("Storing Gemini Prompt");
    }
    catch (error) {
        next(error);
    }
};
exports.storeGeminiPrompt = storeGeminiPrompt;
//# sourceMappingURL=geminiController.js.map