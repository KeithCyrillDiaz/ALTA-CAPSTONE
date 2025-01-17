import { Router } from "express";
import { authentication } from "../middleware/authentication";
import { createApplication } from "../controllers/user/userController";
import { upload } from "../helper/multer";

const uploadFileFields = upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
]);

export default (router: Router) => {

    router.post('/applyJob', uploadFileFields, createApplication);
    
    router.use('/user', authentication);
    
}