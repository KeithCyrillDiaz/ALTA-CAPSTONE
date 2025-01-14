import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";
import { ApplicationModel } from "../../models/user/applicationModel";
import { getDateToday } from "../../helper/date";
import { resumePrompt } from "../../services/geminiAI/promptEngineering/resume/resumePrompts";
import { JobModel } from "../../models/admin/jobModel";
import { sendPromptToGemini } from "../../services/geminiAI/sendMessage";
import { GeminiResumeModel } from "../../models/gemini/geminiResumeModel";
import { ResumePromptTypes } from "../../services/geminiAI/promptEngineering/resume/promptsConstantData";
import mongoose from "mongoose";
import { removeTrailingCommas } from "../../helper/json";



export const createApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Creating Application");

        const {givenName, lastName, birthday, gender, email, phoneNumber, currentCity, expectedSalary, coverLetterURL, resumeURL, resumeString, jobId, jobTitle, company, workOnsite} = req.body;

        //validate fields
        if (!givenName || !lastName || !birthday || !gender || !email || !phoneNumber || !currentCity || !expectedSalary || !coverLetterURL || !resumeURL || !resumeString || !jobId || !jobTitle || !company || workOnsite === undefined) {
            res.status(400).json({
                code: "CAP_001",
                message: "All fields are required: givenName, LastName, birthday, gender, email, phoneNumber, currentCity, expectedSalary, jobTitle, company, workOnsite"
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

            console.log("response: ", response);
            
            //CLEAN THE JSON STRING RESPONSE TO PREVENT ERROR ON PARSING
            const cleanedJsonString = removeTrailingCommas(response);
            
            //CONVERTS THE JSON STRING TO JSON USING PARSE AND ADD RESUME PROMPT TYPES TO MATCH THE PROMPT FORMAT TO GEMINI RESUME MODEL
            const parsedResponse: ResumePromptTypes = JSON.parse(cleanedJsonString);
            console.log("json: ", parsedResponse)
            //EXTRACT THE DATA
            const {rating, shortExplanation, fullExplanation} = parsedResponse;

            const newPrompt = new GeminiResumeModel({
                applicationId,
                rating: rating,
                shortExplanation: shortExplanation,
                fullExplanation: fullExplanation,
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
            coverLetterURL,
            resumeURL,
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
    }
}