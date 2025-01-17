import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";
import { retrieveFilesInGdrive } from "../../services/gdrive/gdrive";


export const retrieveFileFromGdrive = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Retrieving File in Gdrive");

        //EXTRACT THE ID FROM (router.get('/retrieveFile/:id', retrieveFileFromGdrive) IN FILE.TS IN ROUTES FOLDER)
        const {id} = req.params;

        const result = await retrieveFilesInGdrive(id);

        console.log("result: ", result);
       
    } catch (error) {
        next(error);
    }
}