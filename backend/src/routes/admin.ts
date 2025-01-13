import { Router } from "express";
import { authentication } from "../middleware/authentication";
import { adminLogIn } from "../controllers/admin";

export default (router: Router) => {

    router.post('/login', adminLogIn);
    router.use('/admin', authentication);
}