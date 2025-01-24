import { Router } from "express";
import { createApplication, getJobInformation, getOpenJobApplications } from "../controllers/user/userController";
import { upload } from "../helper/multer";
import { clientAuthentication } from "../middleware/authentication";

const uploadFileFields = upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
]);

export default (router: Router) => {
    router.use("/client", clientAuthentication);

    //PROTECTED ROUTES
    router.post('/client/job/apply', uploadFileFields, createApplication);
    router.get('/client/job/getOpenJobs', getOpenJobApplications);
    router.get('/client/job/getChosenJob/:id', getJobInformation)
    
}