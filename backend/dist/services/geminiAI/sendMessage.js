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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPromptToGemini = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = require("../../config/dotenv");
const logger_1 = require("../../utils/logger");
const sendPromptToGemini = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const modelName = dotenv_1.geminiConfig.modelName;
        const apiKey = dotenv_1.geminiConfig.apiKey;
        if (!apiKey || !modelName) {
            logger_1.logger.error("gemini API_KEY or Model Name is not set in env");
            throw new Error("gemini API_KEY or Model Name is not set in env");
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });
        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048
        };
        const safetySettings = [
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];
        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: []
        });
        const result = yield chat.sendMessage(prompt);
        const response = result.response;
        return response.text();
    }
    catch (error) {
        logger_1.logger.error("Error sending prompt to Gemini:", error);
    }
});
exports.sendPromptToGemini = sendPromptToGemini;
// export const sendResumeAccuracyPrompt = async () => {
//     try {
//         const prompt = 
//     } catch (error) {
//         logger.error("Error sending prompt to Gemini:", error);
//     }
// }
//# sourceMappingURL=sendMessage.js.map