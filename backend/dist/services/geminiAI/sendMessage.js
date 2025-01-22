"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPromptToGemini = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = require("../../config/dotenv");
const logger_1 = require("../../utils/logger");
const sendPromptToGemini = async (prompt) => {
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
        const result = await chat.sendMessage(prompt);
        const response = result.response;
        return response.text();
    }
    catch (error) {
        logger_1.logger.error("Error sending prompt to Gemini:", error);
    }
};
exports.sendPromptToGemini = sendPromptToGemini;
// export const sendResumeAccuracyPrompt = async () => {
//     try {
//         const prompt = 
//     } catch (error) {
//         logger.error("Error sending prompt to Gemini:", error);
//     }
// }
//# sourceMappingURL=sendMessage.js.map