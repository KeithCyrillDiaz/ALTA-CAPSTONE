"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = __importDefault(require("./admin"));
const user_1 = __importDefault(require("./user"));
const token_1 = __importDefault(require("./token"));
const file_1 = __importDefault(require("./file"));
const router = (0, express_1.Router)();
exports.default = () => {
    (0, token_1.default)(router);
    (0, admin_1.default)(router);
    (0, user_1.default)(router);
    (0, file_1.default)(router);
    return router;
};
//# sourceMappingURL=index.js.map