"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessTokenController_1 = require("../controllers/token/accessTokenController");
exports.default = (router) => {
    router.get("/getAccessToken", accessTokenController_1.getAccessToken);
};
//# sourceMappingURL=token.js.map