import { Request, Response, NextFunction } from "express"
import { logger } from "../../utils/logger";
import { deleteFilesInGdrive } from "../../services/gdrive/gdrive";
import { ApplicationModel } from "../../models/user/applicationModel";
import mongoose from "mongoose";
import { GeminiResumeModel } from "../../models/gemini/geminiResumeModel";
import { userGmailDesign } from "../../services/gmail/html/emailToUserTemplates";
import { JobDocument } from "../../models/admin/jobModel";
import { sendEmail } from "../../services/gmail/gmail";


const validEmploymentStatus = [
  'Pending', 
  'Rejected', //REJECTING APPLICAITON
  'Approved', //APPROVING APPLICAITON
  'Failed',   //FAILED INTERVIEW
  'Employed', //SUCCESSFUL INTERVIEW
  'Blocked'
];


export const updateEmploymentStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Updating Employment Status of User Application");
        
        //EXTRACT ID IN PARAMS
        const {id} = req.params;

        if(!id) {
            logger.error("ID not found in Params");
            res.status(400).json({
                code: "UES_001",
                message: "ID not found in Params"
            });
            return;
        }

        if(!mongoose.Types.ObjectId.isValid(id)) {
            logger.error("Invalid ID format");
            res.status(400).json({
                code: 'UES_002',
                message: "Invalid ID format"
            });
            return;
        }

        const existingApplicant = await ApplicationModel.findById(id).populate<{ jobId: JobDocument }>('jobId');

        if(!existingApplicant) {
            logger.error("Applicant Not Found");
            res.status(400).json({
                code: 'UES_002',
                message: "Invalid ID format"
            });
            return;
        }

        //EXTRACT STATUS IN BODY
        const {status} = req.body;

        if(!status || !validEmploymentStatus.includes(status)) {
            logger.error("Invalid Status");
            res.status(400).json({
                code: 'UES_003',
                message: "Invalid Status"
            })
        }
        
        //UPDATE THE STATUS
        const result = await ApplicationModel.findByIdAndUpdate(
            id,
            {employmentStatus: status},
            {new: true}
        );

        if(!result) {
            logger.error(`Document not found or failed to update employment status for ID: ${id}`);
            res.status(404).json({
                code: 'UES_004',
                message: `No document found with the provided ID: ${id}. Unable to update employment status.`
            });
            return;
        }

        logger.success("Employment status updated successfully");

        //IF STATUS IS BLOCKED OR APPROVED, NO NEED FOR EMAIL SENDING SO RETURN THE RESPONSE
        if(status === 'Blocked' || status === 'Approved') {
            res.status(200).json({
                code: 'UES_000',
                message: "Employment status updated successfully.",
                data: result
            });
            return;
        }

        //PREPARING EMAIL SENDING TO USER

        //GET THE NECESSARY DETAILS FOR SENDING EMAIL
        const {givenName, lastName, jobId, email} = existingApplicant
   
        const position = jobId.jobTitle;

        //CONCATENATE TO MAKE IT FULL NAME
        const name = `${givenName} ${lastName}`

        //SET UP THE PROPER KEY BASED ON THE TEMPLATE MAP
        const emailKeyTemplate = 
        status === 'Rejected' ? 'Rejection Email' :
        status === 'Failed' ? 'Interview Rejection Email': 
        'Welcome Email'

        //SET THE SUBJECT

        //SET THE SUBJECT BASED ON THE EMAIL KEY
        let subject: string;
        switch (emailKeyTemplate) {
        case 'Rejection Email':
            subject = `Application Status: ${position} - Rejection`;
            break;
        case 'Interview Rejection Email':
            subject = `Interview Outcome: ${position} - Rejection`;
            break;
        case 'Welcome Email':
            subject = `Welcome to Alta Celestia, ${name}!`; 
            break;
        default:
            subject = `Thank You for Applying to ${position}`;
        }

        //GET THE RIGHT TEMPLATE
        const emailTemplate = userGmailDesign[emailKeyTemplate](name, position);

        //SEND EMAIL
        await sendEmail(email, subject, emailTemplate);

        res.status(200).json({
            code: 'UES_000',
            message: `Employment status updated successfully and a ${emailTemplate} is sent to the user.`,
            data: result
        });

    } catch (error) {
        next(error);
    }
}


export const deleteUserApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Deleting User Application");

        const {id} = req.params;

        if(!id) {
            logger.error("ID in params is not Found");
            res.status(400).json({
                code: 'DUA_001',
                message: "ID in params is not Found"
            });
            return;
        }
        

        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.error("Invalid ID format");
            res.status(400).json({
                code: 'DUA_002',
                message: "Invalid ID format"
            });
            return;
        }

        //GET THE APPLICATION DATA BASED ON THE OBJECT ID
        const existingApplication = await ApplicationModel.findById(id);

        //CHECK IF THE APPLICATION IS EXISTING IN DATABASE
        if(!existingApplication) {
            logger.error("Application Not Found");
            res.status(400).json({
                code: 'DUA_003',
                message: "Application Not Found"
            });
            return;
        }

        logger.event("Deleting the resume and cover letter in Gdrive");
        //DELETE RESUME AND COVER LETTER IN GDRIVE
        const {resumeGdriveID, coverLetterGdriveID} = existingApplication;

        await Promise.all([
            deleteFilesInGdrive(resumeGdriveID),
            deleteFilesInGdrive(coverLetterGdriveID)
        ]);
        
        logger.event("Deleting the Gemini Prompt in Database");
        //DELETE THE GEMINI PROMPT IN MONGODB 
        await GeminiResumeModel.findOneAndDelete({applicationId: id});

        logger.success("Successfully Deleted Gemini Resume Response");

        //DELETE THE APPLICATION
        await ApplicationModel.findByIdAndDelete(id);

        logger.success("Successfully Deleted the Application");
        
        res.status(200).json({
            code: 'DUA_000',
            message: "Successfully Deleted the Application"
        });

    } catch (error) {
        next(error);
    }
}


export const getAllUserApplicants = async ( req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Fetching All User Applicants");

        const result = await ApplicationModel.find();

        if(result.length === 0) {
            logger.error("No User Applicants Record Found");
            res.status(404).json({
                code: "GAUP_001",
                message: "No User Applicants Record Found"
            });
            return; 
        }

        logger.success("Successfully Fetched Records of User Applicants");
        res.status(200).json({
            code: "GAUP_000",
            message: "Successfully Fetched Records of User Applicants",
            data: result
        });

    } catch (error) {
       next(error);
    }
}

export const getUserApplicantRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Fetching User Applicant Record");

        const {id} = req.params;
        if(!id) {
            logger.error("Error in GUAR_001, id field is required");
            res.status(400).json({
                code: "GUAR_001",
                message: "id field is required"
            });
            return;
        }

        // POPOULATE THE JOB ID SO IT WILL ALSO INCLUDE ALL THE DOCUMENT DATA OF THAT JOB ID FROM JOBS COLLECTION
        const result = await ApplicationModel.findById(id).populate("jobId"); 

        if(!result) {
            logger.error("Error in GUAR_002, no Record Found");
            res.status(404).json({
                code: "GUAR_002",
                message: "No Record Found"
            });
            return;
        }

        logger.success("Successfully Fetched Applicant Record");
        res.status(200).json({
            code: "GUAR_002",
            message: "Successfully Fetched Applicant Record",
            data: result
        });

        return;

    } catch (error) {
        next(error);
    }
}