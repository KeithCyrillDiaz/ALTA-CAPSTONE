import { Router } from "express";
import { authentication } from "../middleware/authentication";
import { adminLogIn, adminLogOut } from "../controllers/admin/adminController";
import { createJob, updateJobStatus } from "../controllers/admin/jobController";
import { deleteUserApplication, updateEmploymentStatus } from "../controllers/admin/userApplicationController";
import { getJobPositions, getTopData, getTotalData } from "../controllers/admin/dashboardController";


export default (router: Router) => {

    router.post('/login', adminLogIn);
    router.post('/logout', adminLogOut);
    
    //APPLY TOKEN AUTHENTICATION FOR SECURING API
    router.use('/admin', authentication);

    //PROTECTED API ROUTES

    //JOB
    router.post('/admin/job/create', createJob);
    router.patch('/admin/job/updateStatus/:id', updateJobStatus);

    //APPLICATION
    router.patch('/admin/application/updateStatus/:id', updateEmploymentStatus);

    router.delete('/admin/application/delete/:id', deleteUserApplication);

    //DASHBOARD
    router.post('/admin/dashboard/totalCounts', getTotalData);
    router.post('/admin/dashboard/fetchTopData', getTopData);
    router.post('/admin/dashboard/fetchJobPositions', getJobPositions);
}