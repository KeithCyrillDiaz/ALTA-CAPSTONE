import { Response } from "express";
import { logger } from "./logger";

const toPastTense = (str: string) => {

    const extractCreating = str.split(" ")[0];
    const event = str.split(" ")[1];
    const extractCreat = extractCreating.split('i')[0];
    const createdString = `${extractCreat}ed`;

    return `${createdString} ${event}`;
}
 
export const createResultHandler = (res: Response, result: any, code: string, event:string) => {
    
    const eventPastTense = toPastTense(event);
    
    if(!result) {
                logger.error(`error in ${code}, Error ${event}`);
                res.status(500).json({
                    code: `${code}`,
                    message: `Error ${event}`
                });
                return;
            }

            const extractCode = code.split('_')[0]; //e.g. CJB

            logger.success(`Successfully ${eventPastTense}`);
            res.status(201).json({
                code: `${extractCode}_000`,
                message: `Successfully ${eventPastTense}`
            });
}