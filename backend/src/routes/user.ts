import { Router } from "express";
import { authentication } from "../middleware/authentication";
import { createApplication } from "../controllers/user/user";


export default (router: Router) => {

    router.post('/applyJob', createApplication);

    router.use('/user', authentication);
    
}