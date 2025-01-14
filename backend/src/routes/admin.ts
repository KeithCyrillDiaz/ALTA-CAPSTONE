import { Router } from "express";
import { authentication } from "../middleware/authentication";
import { adminLogIn } from "../controllers/admin/adminController";
import { createJob } from "../controllers/admin/jobController";

export default (router: Router) => {

    router.post('/login', adminLogIn);
    router.use('/admin', authentication);

    //protected routes
    router.post('/admin/createJob', createJob);
}