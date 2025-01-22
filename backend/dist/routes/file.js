"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fileController_1 = require("../controllers/admin/fileController");
exports.default = (router) => {
    router.get('/retrieveFile/:id', fileController_1.retrieveFileFromGdrive);
};
//# sourceMappingURL=file.js.map