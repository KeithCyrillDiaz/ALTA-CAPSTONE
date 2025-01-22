"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResultHandler = void 0;
const logger_1 = require("./logger");
const toPastTense = (str) => {
    const extractCreating = str.split(" ")[0];
    const event = str.split(" ")[1];
    const extractCreat = extractCreating.split('i')[0];
    const createdString = `${extractCreat}ed`;
    return `${createdString} ${event}`;
};
const createResultHandler = (res, result, code, event) => {
    const eventPastTense = toPastTense(event);
    if (!result) {
        logger_1.logger.error(`error in ${code}, Error ${event}`);
        res.status(500).json({
            code: `${code}`,
            message: `Error ${event}`
        });
        return;
    }
    const extractCode = code.split('_')[0]; //e.g. CJB
    logger_1.logger.success(`Successfully ${eventPastTense}`);
    res.status(201).json({
        code: `${extractCode}_000`,
        message: `Successfully ${eventPastTense}`
    });
};
exports.createResultHandler = createResultHandler;
//# sourceMappingURL=resultHandler.js.map