import { Router } from "express";
import { retrieveFileFromGdrive } from "../controllers/admin/fileController";




export default (router: Router) => {
    router.get('/retrieveFile/:id', retrieveFileFromGdrive);
}