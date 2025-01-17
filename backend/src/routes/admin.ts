import { Router } from "express";
import { authentication } from "../middleware/authentication";
import { adminLogIn } from "../controllers/admin/adminController";
import { createJob } from "../controllers/admin/jobController";
import { deleteUserApplication, updateEmploymentStatus } from "../controllers/admin/userApplicationController";


export default (router: Router) => {

    router.post('/login', adminLogIn);
    
    //APPLY TOKEN AUTHENTICATION
    router.use('/admin', authentication);

    //protected routes
    router.post('/admin/job/create', createJob);
    
    router.patch('/admin/application/updateStatus/:id', updateEmploymentStatus);

    router.delete('/admin/application/delete/:id', deleteUserApplication);
}