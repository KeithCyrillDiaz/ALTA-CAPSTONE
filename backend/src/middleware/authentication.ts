import { Request, Response, NextFunction } from "express";


export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        next(error);
    }
}