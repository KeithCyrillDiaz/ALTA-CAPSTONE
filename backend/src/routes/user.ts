import { Router } from "express";
import { authentication } from "../middleware/authentication";
import { createApplication, getOpenJobApplications } from "../controllers/user/userController";
import { upload } from "../helper/multer";

const uploadFileFields = upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
]);

export default (router: Router) => {

    router.post('/job/apply', uploadFileFields, createApplication);
    router.get('/job/getOpenJobs', getOpenJobApplications);
    
}