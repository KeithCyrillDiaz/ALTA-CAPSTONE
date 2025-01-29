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
exports.retrieveFileFromGdrive = void 0;
const logger_1 = require("../../utils/logger");
const gdrive_1 = require("../../services/gdrive/gdrive");
const retrieveFileFromGdrive = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Retrieving File in Gdrive");
        //EXTRACT THE ID FROM (router.get('/retrieveFile/:id', retrieveFileFromGdrive) IN FILE.TS IN ROUTES FOLDER)
        const { id } = req.params;
        const result = yield (0, gdrive_1.retrieveFilesInGdrive)(id);
        console.log("result: ", result);
    }
    catch (error) {
        next(error);
    }
});
exports.retrieveFileFromGdrive = retrieveFileFromGdrive;
//# sourceMappingURL=fileController.js.map