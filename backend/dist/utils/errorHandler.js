"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const errorHandler = (err, req, res, next) => {
    const ERROR_MESSAGE = {
        code: "ERR_001",
        status: err.name === "JsonWebTokenError" || err.message === "jwt expired" ? 401 : err.status || 500,
        message: err.message,
    };
    if (err.name === "JsonWebTokenError") {
        logger_1.logger.error("Token Expired", {
            ERROR_MESSAGE,
            stack: err.stack,
        });
        res.status(err.status).json({
            code: "AUTH_002",
            message: err.message,
        });
        return;
    }
    logger_1.logger.error("Unhandled Error", {
        ERROR_MESSAGE,
        stack: err.stack,
    });
    res.status(ERROR_MESSAGE.status).json(ERROR_MESSAGE);
    return;
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map