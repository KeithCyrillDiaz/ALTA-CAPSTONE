"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveFileFromGdrive = void 0;
const logger_1 = require("../../utils/logger");
const gdrive_1 = require("../../services/gdrive/gdrive");
const retrieveFileFromGdrive = async (req, res, next) => {
    try {
        logger_1.logger.event("Retrieving File in Gdrive");
        //EXTRACT THE ID FROM (router.get('/retrieveFile/:id', retrieveFileFromGdrive) IN FILE.TS IN ROUTES FOLDER)
        const { id } = req.params;
        const result = await (0, gdrive_1.retrieveFilesInGdrive)(id);
        console.log("result: ", result);
    }
    catch (error) {
        next(error);
    }
};
exports.retrieveFileFromGdrive = retrieveFileFromGdrive;
//# sourceMappingURL=fileController.js.map