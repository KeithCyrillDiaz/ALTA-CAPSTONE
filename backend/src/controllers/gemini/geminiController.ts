import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";


const validTitle = ["Resume"];
export const storeGeminiPrompt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Storing Gemini Prompt");

    } catch (error) {
        next(error);
    }
}