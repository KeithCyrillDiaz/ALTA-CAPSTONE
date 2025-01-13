

import {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, SafetySetting} from '@google/generative-ai'
import { geminiConfig } from '../../config/dotenv'


export const sendPromptToGemini = async (prompt: string) => {
    
    const modelName = geminiConfig.modelName;
    const apiKey = geminiConfig.apiKey;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({model: modelName});

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048
    };

    const safetySettings: SafetySetting[] = [
        {
            category:HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category:HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category:HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category:HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history:[]
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    console.log("response: ", response.text())

}