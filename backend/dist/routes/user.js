"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/user/userController");
const multer_1 = require("../helper/multer");
const uploadFileFields = multer_1.upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
]);
exports.default = (router) => {
    router.post('/job/apply', uploadFileFields, userController_1.createApplication);
    router.get('/job/getOpenJobs', userController_1.getOpenJobApplications);
};
//# sourceMappingURL=user.js.map