"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobInformation = exports.getOpenJobApplications = exports.createApplication = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = require("../../utils/logger");
const applicationModel_1 = require("../../models/user/applicationModel");
const date_1 = require("../../helper/date");
const resumePrompts_1 = require("../../services/geminiAI/promptEngineering/resume/resumePrompts");
const jobModel_1 = require("../../models/admin/jobModel");
const sendMessage_1 = require("../../services/geminiAI/sendMessage");
const geminiResumeModel_1 = require("../../models/gemini/geminiResumeModel");
const json_1 = require("../../helper/json");
const gdrive_1 = require("../../services/gdrive/gdrive");
const createApplication = async (req, res, next) => {
    let resumeFile;
    let coverLetterFile;
    try {
        logger_1.logger.event("Creating Application");
        //NEED TO EXPLICIT THE TYPES OF REQ.FILES FOR TYPE SAFETY OF TYPESCRIPT
        const files = req.files;
        //ACCESS THE FILES
        resumeFile = files?.resume?.[0];
        coverLetterFile = files?.coverLetter?.[0];
        //EXTRACT DATA FROM REQ.BODY SINCE DATA IS EMBEDDED IN FORMDATA FROM FRONTEND
        const { data } = req.body;
        if (!data) {
            res.status(400).json({
                code: "CAP_001",
                message: "form applcation details is not included in req"
            });
            return;
        }
        // CONVERT DATA TO JSON TO ACCESS THE KEYS OF THE OBJECT
        const parsedData = JSON.parse(data);
        const { givenName, lastName, birthday, gender, email, phoneNumber, currentCity, expectedSalary, resumeString, jobId, jobTitle, company, workOnsite } = parsedData;
        //validate fields
        if (!givenName || !lastName || !birthday || !gender || !email || !phoneNumber || !currentCity || !expectedSalary || !resumeString || !jobId || !jobTitle || !company || workOnsite === undefined) {
            res.status(400).json({
                code: "CAP_002",
                message: "All fields are required: givenName, LastName, birthday, gender, email, phoneNumber, currentCity, expectedSalary, jobTitle, company, workOnsite"
            });
            return;
        }
        if (!files) {
            res.status(400).json({
                code: "CAP_003",
                message: "Invalid Cover Letter or Resume File"
            });
            return;
        }
        const { month, year } = (0, date_1.getDateToday)();
        logger_1.logger.event("Sending Resume Accuarcy Prompt to Gemini");
        const jobData = await jobModel_1.JobModel.findById(jobId);
        //SET PROMPT FORMAT TO RESUME PROMPT
        const prompt = (0, resumePrompts_1.resumePrompt)(resumeString, jobData);
        //SEND PROMPT AND GET THE RESPONSE
        const response = await (0, sendMessage_1.sendPromptToGemini)(prompt);
        //DECLARE AN OBJECT ID VARIABLE AND RESUME RATING OF GEMINI RESPONSE TO STORE IT IN USER APPLICAITON
        let geminiObjectId;
        let geminiResumeRating;
        //MANUALLY CREATE THE OBJECT ID TO ADD IT BOTH IN GEMINI RESUME MODEL AND  USER APPLICAITON MODEL
        const applicationId = new mongoose_1.default.Types.ObjectId();
        //ONLY ADD GEMINI PROMPT RESPONSE IN DATABASE IF IT IS SUCCESSFUL
        if (response) {
            console.log("gemini response: ", response);
            //CLEAN THE JSON STRING RESPONSE TO PREVENT ERROR ON PARSING
            const cleanedJsonString = (0, json_1.removeTrailingCommas)(response);
            console.log("cleanedJsonString: ", cleanedJsonString);
            //CONVERTS THE JSON STRING TO JSON USING PARSE AND ADD RESUME PROMPT TYPES TO MATCH THE PROMPT FORMAT TO GEMINI RESUME MODEL
            const parsedResponse = JSON.parse(cleanedJsonString);
            console.log("parsed Gemini Response: ", parsedResponse);
            //EXTRACT THE DATA
            const { rating, shortExplanation, "Full Explanation": fullExplanation } = parsedResponse;
            const newPrompt = new geminiResumeModel_1.GeminiResumeModel({
                applicationId,
                rating: rating,
                shortExplanation: shortExplanation,
                "Full Explanation": fullExplanation,
            });
            //SAVE THE RESPONSE TO MONGODB DATABASE
            const geminiResult = await newPrompt.save();
            //EXTRACT THE NEEDED DATA AND RENAMED THEM TO AVOID CONFLICT
            const { _id: objectId, rating: resumeRating } = geminiResult;
            geminiObjectId = objectId;
            geminiResumeRating = resumeRating;
            if (!geminiResult) {
                logger_1.logger.error("Failed to Create Gemini Resume Prompt");
            }
            else {
                logger_1.logger.success("Successfully Created Gemini Resume Prompt");
            }
        }
        logger_1.logger.event("Uploading files to Gdrive");
        //UPLOAD THE FILES TO GDRIVE
        const [uploadedResumeDetails, uploadedCoverLetterDetails] = await Promise.all([
            (0, gdrive_1.uploadResumeInGdrive)(resumeFile, next),
            (0, gdrive_1.uploadCoverLetterInGdrive)(coverLetterFile, next)
        ]);
        //EXTRACT THE FILE ID'S FROM GDRIVE API
        const resumeFileID = uploadedResumeDetails.id;
        const coverFileID = uploadedCoverLetterDetails.id;
        //CREATE A NEW APPLICATION DOCUMENT
        const newApplication = new applicationModel_1.ApplicationModel({
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
            logger_1.logger.error("Failed to create application");
            res.status(500).json({
                code: "CAP_002",
                message: "Failed to create application"
            });
            return;
        }
        logger_1.logger.success("Application created successfully");
        res.status(201).json({
            code: 'CAP_000',
            message: 'Application created successfully',
        });
        return;
    }
    catch (error) {
        next(error);
    }
    finally {
        //ENSURE THAT THE FILES UPLOADED ARE DELETED LOCALLY IN BACKEND SERVER FILES
        fs_1.default.unlink(resumeFile.path, (err) => {
            if (err) {
                logger_1.logger.error(`Resume file is already deleted in Backend Server Files`);
            }
            else {
                logger_1.logger.success("Local file successfully deleted in Backend Server Files");
            }
        });
        fs_1.default.unlink(coverLetterFile.path, (err) => {
            if (err) {
                logger_1.logger.error(`Cover Letter File is already deleted in Backend Server Files`);
            }
            else {
                logger_1.logger.success("Local file successfully deleted in Backend Server Files");
            }
        });
    }
};
exports.createApplication = createApplication;
const getOpenJobApplications = async (req, res, next) => {
    try {
        logger_1.logger.event("Fetching Job Applications");
        const result = await jobModel_1.JobModel.find({ status: 'Open' });
        if (result.length === 0) {
            logger_1.logger.error("No Open Job Application Found");
            res.status(404).json({
                code: 'GJA_001',
                message: "No Open Job Application Found",
                data: result
            });
            return;
        }
        logger_1.logger.success("Successfully Fetched Open Job Applications");
        res.status(200).json({
            code: 'GJA_000',
            message: "Successfully Fetched Open Job Applications",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOpenJobApplications = getOpenJobApplications;
const getJobInformation = async (req, res, next) => {
    try {
        logger_1.logger.event("Fetching Job Infomration By ID");
        const { id } = req.params;
        const result = await jobModel_1.JobModel.findById(id);
        if (!result) {
            logger_1.logger.error("Job Information Not Found");
            res.status(404).json({
                code: "GJI_001",
                message: "Job Information Not Found"
            });
            return;
        }
        logger_1.logger.success("Successfully Fetched Job Information");
        res.status(200).json({
            code: "GJI_000",
            message: "Successfully Fetched Job Information",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getJobInformation = getJobInformation;
//# sourceMappingURL=userController.js.map