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
 
        const {givenName, lastName, birthday, gender, email, phoneNumber, currentCity, expectedSalary, resumeString, jobId, position, jobTitle, company, workOnsite} = parsedData;

        //validate fields
        if (!givenName || !lastName || !birthday || !gender || !email || !phoneNumber || !currentCity || !expectedSalary || !resumeString || !jobId || !position || !jobTitle || !company || workOnsite === undefined) {
            res.status(400).json({
                code: "CAP_002",
                message: "All fields are required: givenName, lastName, birthday, gender, email, phoneNumber, currentCity, expectedSalary, jobId, position,jobTitle, company, workOnsite"
            });
            return;

        }

        //CHECK IF RESUME IS EXISTING, IF NOT CANCEL THE REQUEST
        if(!resumeFile) {
            res.status(400).json({
                code: "CAP_003",
                message: "Invalid Resume File"
            });
            return;
        }
        
        const {month, year} = getDateToday();

        logger.event("Sending Resume Accuarcy Prompt to Gemini");

        // GET THE JOB DESCRIPTION FOR GEMINI PROMPT AND UPDATE THE APPLICANTS COUNT AS WELL
        const updatedJob = await JobModel.findByIdAndUpdate(
            jobId,
            { $inc: { applicants: 1 } }, //INCREMENT APPLICANTS BY 1 
            { new: true } // RETURN THE UPDATED DOCUMENT AND STORE IT IN updatedJob
        );

        //SET PROMPT FORMAT TO RESUME PROMPT
        const prompt = resumePrompt(resumeString, updatedJob);

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

        //PREPARE THE PROMISES ARRAY
        const uploadPromises = [
            uploadResumeInGdrive(resumeFile, next), // THIS WILL ALWAYS UPLOAD THE RESUME IN GRIVE
          ];
        
        //CONDITIONALLY ADD THE COVER LETTER IF THE FILE IS EXISTING
        if (coverLetterFile) {
            uploadPromises.push(uploadCoverLetterInGdrive(coverLetterFile, next));
          }

        //WAIT FOR BOTH UPLOADS TO COMPLETE
        const [uploadedResumeDetails, uploadedCoverLetterDetails] = await Promise.all(uploadPromises);
        

        //EXTRACT THE FILE ID'S FROM GDRIVE API
        const resumeFileID = uploadedResumeDetails.id;

        //CHECK IF THE COVER LETTER EXIST BEFORE EXTRACTING
        const coverFileID = uploadedCoverLetterDetails ? uploadedCoverLetterDetails.id : null;
     
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
            position,

            // PREV COMPANY DETAILS
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
        //DELETE THE COVER LETTER IF TIS EXISTING
      if(coverLetterFile) {
        fs.unlink(coverLetterFile.path, (err) => {
            if (err) {
                logger.error(`Cover Letter File is already deleted in Backend Server Files`);
            } else {
                logger.success("Local file successfully deleted in Backend Server Files");
            }
        });
      }
    }
}


export const getOpenJobApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Fetching Job Applications");

        const result = await JobModel.find({status: 'Open'});

        if(result.length === 0) {
            logger.error("No Open Job Application Found");
            res.status(404).json({
                code: 'GJA_001',
                message: "No Open Job Application Found",
                data: result
            });
            return;
        }

        logger.success("Successfully Fetched Open Job Applications");

        res.status(200).json({
            code: 'GJA_000',
            message: "Successfully Fetched Open Job Applications",
            data: result
        });

    } catch (error) {
        next(error);
    }
}


export const getJobInformation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Fetching Job Infomration By ID");

        const {id} = req.params;

        const result = await JobModel.findById(id);

        if(!result) {
            logger.error("Job Information Not Found");
            res.status(404).json({
                code: "GJI_001",
                message: "Job Information Not Found"
            });
            return;
        }

        logger.success("Successfully Fetched Job Information");
        res.status(200).json({
            code: "GJI_000",
            message: "Successfully Fetched Job Information",
            data: result
        })

    } catch (error) {
        next(error);
    }
}