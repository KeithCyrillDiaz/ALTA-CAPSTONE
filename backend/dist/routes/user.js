"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/user/userController");
const multer_1 = require("../helper/multer");
const authentication_1 = require("../middleware/authentication");
const uploadFileFields = multer_1.upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
]);
exports.default = (router) => {
    router.use("/client", authentication_1.clientAuthentication);
    //PROTECTED ROUTES
    router.post('/client/job/apply', uploadFileFields, userController_1.createApplication);
    router.get('/client/job/getOpenJobs', userController_1.getOpenJobApplications);
    router.get('/client/job/getChosenJob/:id', userController_1.getJobInformation);
};
//# sourceMappingURL=user.js.map