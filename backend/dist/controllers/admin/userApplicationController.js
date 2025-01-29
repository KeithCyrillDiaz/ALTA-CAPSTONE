"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserApplicantRecord = exports.getAllUserApplicants = exports.deleteUserApplication = exports.updateEmploymentStatus = void 0;
const logger_1 = require("../../utils/logger");
const gdrive_1 = require("../../services/gdrive/gdrive");
const applicationModel_1 = require("../../models/user/applicationModel");
const mongoose_1 = __importDefault(require("mongoose"));
const geminiResumeModel_1 = require("../../models/gemini/geminiResumeModel");
const emailToUserTemplates_1 = require("../../services/gmail/emailToUserTemplates");
const gmail_1 = require("../../services/gmail/gmail");
const validEmploymentStatus = [
    'Pending',
    'Rejected', //REJECTING APPLICAITON
    'Approved', //APPROVING APPLICAITON
    'Interviewed',
    'Failed', //FAILED INTERVIEW
    'Employed', //SUCCESSFUL INTERVIEW
    'Blocked'
];
const updateEmploymentStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Updating Employment Status of User Application");
        //EXTRACT ID IN PARAMS
        const { id } = req.params;
        if (!id) {
            logger_1.logger.error("ID not found in Params");
            res.status(400).json({
                code: "UES_001",
                message: "ID not found in Params"
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            logger_1.logger.error("Invalid ID format");
            res.status(400).json({
                code: 'UES_002',
                message: "Invalid ID format"
            });
            return;
        }
        const existingApplicant = yield applicationModel_1.ApplicationModel.findById(id).populate('jobId');
        if (!existingApplicant) {
            logger_1.logger.error("Applicant Not Found");
            res.status(400).json({
                code: 'UES_002',
                message: "Invalid ID format"
            });
            return;
        }
        //EXTRACT STATUS IN BODY
        const { status } = req.body;
        if (!status || !validEmploymentStatus.includes(status)) {
            logger_1.logger.error("Invalid Status");
            res.status(400).json({
                code: 'UES_003',
                message: "Invalid Status"
            });
        }
        let updateFields = { employmentStatus: status };
        //UPDATE EXPIRES AT IF THE STATUS IS FAILED
        if (status === 'Failed') {
            const sixMonthsFromNow = new Date();
            sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6); // ADD 6 MONTHS
            updateFields.expiresAt = sixMonthsFromNow; // THIS DOCUMENT TILL EXPIRE AFTER 6 MONTHS, THEN THE USER CAN REAPPLY AGAIN
        }
        //UPDATE THE THE MODEL BASED ON THE UPDATE FIELDS
        const result = yield applicationModel_1.ApplicationModel.findByIdAndUpdate(id, updateFields, { new: true });
        if (!result) {
            logger_1.logger.error(`Document not found or failed to update employment status for ID: ${id}`);
            res.status(404).json({
                code: 'UES_004',
                message: `No document found with the provided ID: ${id}. Unable to update employment status.`
            });
            return;
        }
        logger_1.logger.success("Employment status updated successfully");
        //IF STATUS IS BLOCKED OR APPROVED OR INTERVIEWED, NO NEED FOR EMAIL SENDING SO RETURN THE RESPONSE
        if (status === 'Blocked' || status === 'Approved' || status === "Interviewed") {
            res.status(200).json({
                code: 'UES_000',
                message: "Employment status updated successfully.",
                data: result
            });
            return; //END THE FUNCTION
        }
        //PREPARING EMAIL SENDING TO USER
        //GET THE NECESSARY DETAILS FOR SENDING EMAIL
        const { givenName, lastName, jobId, email } = existingApplicant;
        const position = jobId.jobTitle;
        //CONCATENATE TO MAKE IT FULL NAME
        const name = `${givenName} ${lastName}`;
        //SET UP THE PROPER KEY BASED ON THE TEMPLATE MAP
        const emailKeyTemplate = status === 'Rejected' ? 'Rejection Email' :
            status === 'Failed' ? 'Interview Rejection Email' :
                'Welcome Email';
        //SET THE SUBJECT
        //SET THE SUBJECT BASED ON THE EMAIL KEY
        let subject;
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
        const emailTemplate = emailToUserTemplates_1.userGmailDesign[emailKeyTemplate](name, position);
        res.status(200).json({
            code: 'UES_000',
            message: `Employment status updated successfully and a ${emailTemplate} is sent to the user.`,
            data: result
        });
        //SEND EMAIL
        yield (0, gmail_1.sendEmail)(email, subject, emailTemplate);
    }
    catch (error) {
        next(error);
    }
});
exports.updateEmploymentStatus = updateEmploymentStatus;
const deleteUserApplication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Deleting User Application");
        const { id } = req.params;
        if (!id) {
            logger_1.logger.error("ID in params is not Found");
            res.status(400).json({
                code: 'DUA_001',
                message: "ID in params is not Found"
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            logger_1.logger.error("Invalid ID format");
            res.status(400).json({
                code: 'DUA_002',
                message: "Invalid ID format"
            });
            return;
        }
        //GET THE APPLICATION DATA BASED ON THE OBJECT ID
        const existingApplication = yield applicationModel_1.ApplicationModel.findById(id);
        //CHECK IF THE APPLICATION IS EXISTING IN DATABASE
        if (!existingApplication) {
            logger_1.logger.error("Application Not Found");
            res.status(400).json({
                code: 'DUA_003',
                message: "Application Not Found"
            });
            return;
        }
        logger_1.logger.event("Deleting the resume and cover letter in Gdrive");
        //DELETE RESUME AND COVER LETTER IN GDRIVE
        const { resumeGdriveID, coverLetterGdriveID } = existingApplication;
        yield Promise.all([
            (0, gdrive_1.deleteFilesInGdrive)(resumeGdriveID),
            (0, gdrive_1.deleteFilesInGdrive)(coverLetterGdriveID)
        ]);
        logger_1.logger.event("Deleting the Gemini Prompt in Database");
        //DELETE THE GEMINI PROMPT IN MONGODB 
        yield geminiResumeModel_1.GeminiResumeModel.findOneAndDelete({ applicationId: id });
        logger_1.logger.success("Successfully Deleted Gemini Resume Response");
        //DELETE THE APPLICATION
        yield applicationModel_1.ApplicationModel.findByIdAndDelete(id);
        logger_1.logger.success("Successfully Deleted the Application");
        res.status(200).json({
            code: 'DUA_000',
            message: "Successfully Deleted the Application"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUserApplication = deleteUserApplication;
const getAllUserApplicants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Fetching All User Applicants");
        const result = yield applicationModel_1.ApplicationModel.find();
        if (result.length === 0) {
            logger_1.logger.error("No User Applicants Record Found");
            res.status(404).json({
                code: "GAUP_001",
                message: "No User Applicants Record Found"
            });
            return;
        }
        logger_1.logger.success("Successfully Fetched Records of User Applicants");
        res.status(200).json({
            code: "GAUP_000",
            message: "Successfully Fetched Records of User Applicants",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUserApplicants = getAllUserApplicants;
const getUserApplicantRecord = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Fetching User Applicant Record");
        const { id } = req.params;
        if (!id) {
            logger_1.logger.error("Error in GUAR_001, id field is required");
            res.status(400).json({
                code: "GUAR_001",
                message: "id field is required"
            });
            return;
        }
        // POPOULATE THE JOB ID SO IT WILL ALSO INCLUDE ALL THE DOCUMENT DATA OF THAT JOB ID FROM JOBS COLLECTION
        const result = yield applicationModel_1.ApplicationModel.findById(id).populate("jobId");
        if (!result) {
            logger_1.logger.error("Error in GUAR_002, no Record Found");
            res.status(404).json({
                code: "GUAR_002",
                message: "No Record Found"
            });
            return;
        }
        logger_1.logger.success("Successfully Fetched Applicant Record");
        res.status(200).json({
            code: "GUAR_002",
            message: "Successfully Fetched Applicant Record",
            data: result
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.getUserApplicantRecord = getUserApplicantRecord;
//# sourceMappingURL=userApplicationController.js.map