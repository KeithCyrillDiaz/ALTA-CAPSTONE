import { Router } from "express";
import { authentication } from "../middleware/authentication";

export default (router: Router) => {

    router.use('/admin', authentication);
}