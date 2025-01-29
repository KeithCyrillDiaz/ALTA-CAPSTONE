"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("../middleware/authentication");
const adminController_1 = require("../controllers/admin/adminController");
const jobController_1 = require("../controllers/admin/jobController");
const userApplicationController_1 = require("../controllers/admin/userApplicationController");
const dashboardController_1 = require("../controllers/admin/dashboardController");
exports.default = (router) => {
    router.post('/login', adminController_1.adminLogIn);
    router.post('/logout', adminController_1.adminLogOut);
    //APPLY TOKEN AUTHENTICATION FOR SECURING API
    router.use('/admin', authentication_1.authentication);
    //PROTECTED API ROUTES
    //JOB
    router.post('/admin/job/create', jobController_1.createJob);
    router.patch('/admin/job/updateStatus/:id', jobController_1.updateJobStatus);
    //APPLICATION
    router.patch('/admin/application/updateStatus/:id', userApplicationController_1.updateEmploymentStatus);
    router.delete('/admin/application/delete/:id', userApplicationController_1.deleteUserApplication);
    //DASHBOARD
    router.post('/admin/dashboard/totalCounts', dashboardController_1.getTotalData);
    router.post('/admin/dashboard/fetchTopData', dashboardController_1.getTopData);
    router.get('/admin/dashboard/fetchJobPositions', dashboardController_1.getJobPositions);
};
//# sourceMappingURL=admin.js.map