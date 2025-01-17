import mongoose from "mongoose";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";
import { ApplicationModel } from "../../models/user/applicationModel";
import { getDateToday } from "../../helper/date";
import { resumePrompt } from "../../services/geminiAI/promptEngineering/resume/resumePrompts";
import { JobModel } from "../../models/admin/jobModel";
import { sendPromptToGemini } from "../../services/geminiAI/sendMessage";
import { GeminiResumeModel } from "../../models/gemini/geminiResumeModel";
import { ResumePromptTypes } from "../../services/geminiAI/promptEngineering/resume/promptsConstantData";
import { removeTrailingCommas } from "../../helper/json";
import { deleteFilesInGdrive, uploadCoverLetterInGdrive, uploadResumeInGdrive} from "../../services/gdrive/gdrive";


type MulterFiles = {
    resume?: Express.Multer.File[];
    coverLetter?: Express.Multer.File[];
  };

export const createApplication = async (req: Request, res: Response, next: NextFunction) => {

    let resumeFile;
    let coverLetterFile;

    try {
        logger.event("Creating Application");

        //NEED TO EXPLICIT THE TYPES OF REQ.FILES FOR TYPE SAFETY OF TYPESCRIPT
        const files = req.files as MulterFiles;

        //ACCESS THE FILES
        resumeFile = files?.resume?.[0];
        coverLetterFile = files?.coverLetter?.[0];

        //EXTRACT DATA FROM REQ.BODY SINCE DATA IS EMBEDDED IN FORMDATA FROM FRONTEND
        const {data} = req.body
        
        if(!data) {
            res.status(400).json({
                code: "CAP_001",
                message: "form applcation details is not included in req"
            });
            return;
        }

        // CONVERT DATA TO JSON TO ACCESS THE KEYS OF THE OBJECT
        const parsedData = JSON.parse(data);
 
        const {givenName, lastName, birthday, gender, email, phoneNumber, currentCity, expectedSalary, resumeString, jobId, jobTitle, company, workOnsite} = parsedData;

        //validate fields
        if (!givenName || !lastName || !birthday || !gender || !email || !phoneNumber || !currentCity || !expectedSalary || !resumeString || !jobId || !jobTitle || !company || workOnsite === undefined) {
            res.status(400).json({
                code: "CAP_002",
                message: "All fields are required: givenName, LastName, birthday, gender, email, phoneNumber, currentCity, expectedSalary, jobTitle, company, workOnsite"
            });
            return;

        }

        if(!files) {
            res.status(400).json({
                code: "CAP_003",
                message: "Invalid Cover Letter or Resume File"
            });
            return;
        }

        const {month, year} = getDateToday();

        logger.event("Sending Resume Accuarcy Prompt to Gemini");

        const jobData = await JobModel.findById(jobId);

        //SET PROMPT FORMAT TO RESUME PROMPT
        const prompt = resumePrompt(resumeString, jobData);

        //SEND PROMPT AND GET THE RESPONSE
        const response = await sendPromptToGemini(prompt);
        
        //DECLARE AN OBJECT ID VARIABLE AND RESUME RATING OF GEMINI RESPONSE TO STORE IT IN USER APPLICAITON
        let geminiObjectId;
        let geminiResumeRating;

        //MANUALLY CREATE THE OBJECT ID TO ADD IT BOTH IN GEMINI RESUME MODEL AND  USER APPLICAITON MODEL
        const applicationId = new mongoose.Types.ObjectId(); 

        //ONLY ADD GEMINI PROMPT RESPONSE IN DATABASE IF IT IS SUCCESSFUL
        if(response) {

            console.log("gemini response: ", response);
            
            //CLEAN THE JSON STRING RESPONSE TO PREVENT ERROR ON PARSING
            const cleanedJsonString = removeTrailingCommas(response);

            console.log("cleanedJsonString: ", cleanedJsonString);
            
            //CONVERTS THE JSON STRING TO JSON USING PARSE AND ADD RESUME PROMPT TYPES TO MATCH THE PROMPT FORMAT TO GEMINI RESUME MODEL
            const parsedResponse: ResumePromptTypes = JSON.parse(cleanedJsonString);
            console.log("parsed Gemini Response: ", parsedResponse)
            
            //EXTRACT THE DATA
            const {rating, shortExplanation, "Full Explanation": fullExplanation} = parsedResponse;

            const newPrompt = new GeminiResumeModel({
                applicationId,
                rating: rating,
                shortExplanation: shortExplanation,
                "Full Explanation": fullExplanation,
            });

            //SAVE THE RESPONSE TO MONGODB DATABASE
            const geminiResult = await newPrompt.save();

            //EXTRACT THE NEEDED DATA AND RENAMED THEM TO AVOID CONFLICT
            const {_id: objectId, rating: resumeRating} = geminiResult;

            geminiObjectId = objectId;
            geminiResumeRating = resumeRating;

            if(!geminiResult) {
                logger.error("Failed to Create Gemini Resume Prompt");
            } else {
                logger.success("Successfully Created Gemini Resume Prompt");
            }
        }


        
        logger.event("Uploading files to Gdrive");

        //UPLOAD THE FILES TO GDRIVE
        const [uploadedResumeDetails, uploadedCoverLetterDetails] = await Promise.all([
            uploadResumeInGdrive(resumeFile, next),
            uploadCoverLetterInGdrive(coverLetterFile, next)
        ]);
        

        //EXTRACT THE FILE ID'S FROM GDRIVE API
        const resumeFileID = uploadedResumeDetails.id;
        const coverFileID = uploadedCoverLetterDetails.id;
     
      

        //CREATE A NEW APPLICATION DOCUMENT
        const newApplication = new ApplicationModel({
            _id: applicationId, // MANUALLY ASSIGN A VALUE FOR _id
            givenName,
            lastName,
            birthday,
            gender,
            email,
            phoneNumber,
            currentCity,
            expectedSalary,
            coverLetterGdriveID: coverFileID,
            resumeGdriveID: resumeFileID,
            resumeString,
            jobId,
            jobTitle,
            company,
            workOnsite,

            //ADD THE GEMINI OBJECT ID AND RATING
            resumeAccuracy: geminiResumeRating,
            geminiResponseId: geminiObjectId,

            month,
            year,
           
        });

        // Save the application to the database
        const result = await newApplication.save();

        // Check if the save was successful
        if (!result) {
            logger.error("Failed to create application");
            res.status(500).json({
                code: "CAP_002",
                message: "Failed to create application"
            });

            return;
        }

        logger.success("Application created successfully");

        res.status(201).json({
            code: 'CAP_000',
            message: 'Application created successfully',
        });

        return;

    } catch (error) {

        next(error);

    } finally {
        
        //ENSURE THAT THE FILES UPLOADED ARE DELETED LOCALLY IN BACKEND SERVER FILES
         fs.unlink(resumeFile.path, (err) => {
            if (err) {
                logger.error(`Resume file is already deleted in Backend Server Files`);
            } else {
                logger.success("Local file successfully deleted in Backend Server Files");
            }
        });
        
        fs.unlink(coverLetterFile.path, (err) => {
            if (err) {
                logger.error(`Cover Letter File is already deleted in Backend Server Files`);
            } else {
                logger.success("Local file successfully deleted in Backend Server Files");
            }
        });
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