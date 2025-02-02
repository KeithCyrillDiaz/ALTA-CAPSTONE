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
exports.deleteJobDetailsById = exports.updateJobInformation = exports.updateJobStatus = exports.getJobDetails = exports.getJobApplications = exports.createJob = void 0;
const logger_1 = require("../../utils/logger");
const date_1 = require("../../helper/date");
const resultHandler_1 = require("../../utils/resultHandler");
const mongoose_1 = __importDefault(require("mongoose"));
const jobModel_1 = require("../../models/admin/jobModel");
const createJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Creating Job");
        const { jobTitle, jobDescription, skills, education, isSalaryRange, minSalary, maxSalary, salaryType, employmentType, shift, schedule } = req.body;
        if (!jobTitle || !jobDescription || !skills || !education || !isSalaryRange || !minSalary || !maxSalary || !salaryType || !employmentType || !shift || !schedule) {
            logger_1.logger.error("error in CJB_001, Missing Required Fields");
            res.status(400).json({
                code: "CJB_001",
                message: "Missing Required Fields"
            });
            return;
        }
        if (!Array.isArray(skills) || !Array.isArray(jobDescription) || !Array.isArray(education)) {
            logger_1.logger.error("error in CJB_002, Job Description, skills and education fields should be an array");
            res.status(400).json({
                code: 'CJB_002',
                message: "Job Description, skills and education fields should be an array"
            });
            return;
        }
        const { month, year } = (0, date_1.getDateToday)();
        const newJob = new jobModel_1.JobModel({
            jobTitle,
            jobDescription,
            skills,
            education,
            isSalaryRange,
            minSalary,
            maxSalary,
            salaryType,
            employmentType,
            shift,
            schedule,
            month,
            year
        });
        const result = yield newJob.save();
        (0, resultHandler_1.createResultHandler)(res, result, "CJB_003", "creating job");
        if (!result) {
            logger_1.logger.error("error in CJB_003, Error Creating Job");
            res.status(500).json({
                code: 'CJB_003',
                message: "Error Creating Job"
            });
            return;
        }
        logger_1.logger.success("Successfully Created Job");
        res.status(201).json({
            code: "CJB_000",
            message: "Successfully Created Job"
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.createJob = createJob;
const getJobApplications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Fetching Job Applications");
        const result = yield jobModel_1.JobModel.find();
        if (result.length === 0) {
            logger_1.logger.error("No Job Application Found");
            res.status(404).json({
                code: 'GJA_001',
                message: "No Job Application Found",
                data: result
            });
            return;
        }
        logger_1.logger.success("Successfully Fetched Job Applications");
        res.status(200).json({
            code: 'GJA_000',
            message: "Successfully Fetched Job Applications",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getJobApplications = getJobApplications;
const getJobDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Fetching Job Details");
        const { id } = req.params;
        if (!id) {
            logger_1.logger.error("ID not found in Params");
            res.status(400).json({
                code: "GJD_001",
                message: "ID not found in Params"
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            logger_1.logger.error("Invalid ID format");
            res.status(400).json({
                code: 'GJD_002',
                message: "Invalid ID format"
            });
            return;
        }
        const result = yield jobModel_1.JobModel.findById(id);
        if (!result) {
            logger_1.logger.error("Error in GJD_003, Job Record Not Found");
            res.status(404).json({
                code: "GJD_003",
                message: "Job Record Not Found"
            });
            return;
        }
        logger_1.logger.success("Successfully Fetched Job Record");
        res.status(200).json({
            code: "GJD_000",
            message: "Successfully Fetched Job Record",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getJobDetails = getJobDetails;
const validJobStatus = ['Open', 'Close'];
const updateJobStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Updating Job Status");
        const { id } = req.params;
        if (!id) {
            logger_1.logger.error("ID in params is not Found");
            res.status(400).json({
                code: 'UJS_001',
                message: "ID in params is not Found"
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            logger_1.logger.error("Invalid ID format");
            res.status(400).json({
                code: 'UJS_002',
                message: "Invalid ID format"
            });
            return;
        }
        const { status } = req.body;
        if (!status || !validJobStatus.includes(status)) {
            logger_1.logger.error("Invalid Job Status");
            res.status(400).json({
                code: 'UJS_003',
                message: "Invalid Job Status"
            });
        }
        const result = yield jobModel_1.JobModel.findByIdAndUpdate(id, { status }, { new: true });
        if (!result) {
            logger_1.logger.error("Job Record not found");
            res.status(404).json({
                code: 'UJS_004',
                message: "Job Record not found"
            });
            return;
        }
        logger_1.logger.success("Successfully Updated Job Status");
        res.status(200).json({
            code: 'UJS_000',
            message: "Successfully Updated Job Status"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateJobStatus = updateJobStatus;
const updateJobInformation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Updating Job Information");
        const { id } = req.params;
        if (!id) {
            logger_1.logger.error("ID in params is not Found");
            res.status(400).json({
                code: 'UJI_001',
                message: "ID in params is not Found"
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            logger_1.logger.error("Invalid ID format");
            res.status(400).json({
                code: 'UJI_002',
                message: "Invalid ID format"
            });
            return;
        }
        const { jobTitle, jobDescription, skills, education, isSalaryRange, minSalary, maxSalary, salaryType, employmentType, shift, schedule } = req.body;
        if (!jobTitle || !jobDescription || !skills || !education || !isSalaryRange || !minSalary || !maxSalary || !salaryType || !employmentType || !shift || !schedule) {
            logger_1.logger.error("error in UJI_003, Missing Required Fields");
            res.status(400).json({
                code: "UJI_003",
                message: "Missing Required Fields"
            });
            return;
        }
        if (!Array.isArray(skills) || !Array.isArray(jobDescription) || !Array.isArray(education)) {
            logger_1.logger.error("error in UJI_004, Job Description, skills and education fields should be an array");
            res.status(400).json({
                code: 'UJI_004',
                message: "Job Description, skills and education fields should be an array"
            });
            return;
        }
        const existingJob = yield jobModel_1.JobModel.findById(id);
        if (!existingJob) {
            logger_1.logger.error("error in UJI_005, Job information is not found in database");
            res.status(404).json({
                code: 'UJI_005',
                message: "Job information is not found in database"
            });
            return;
        }
        const result = yield jobModel_1.JobModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!result) {
            logger_1.logger.error("error in UJI_006, Failed Updating Job Information");
            res.status(404).json({
                code: 'UJI_006',
                message: "Failed Updating Job Information"
            });
            return;
        }
        logger_1.logger.success("Successfully Updated Job Information");
        res.status(200).json({
            code: 'UJI_000',
            message: "Successfully Updated Job Information"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateJobInformation = updateJobInformation;
const deleteJobDetailsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Deleting Job Details");
        const { id } = req.params;
        if (!id) {
            logger_1.logger.error("ID in params is not Found");
            res.status(400).json({
                code: 'DJD_001',
                message: "ID in params is not Found"
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            logger_1.logger.error("Invalid ID format");
            res.status(400).json({
                code: 'DJD_002',
                message: "Invalid ID format"
            });
            return;
        }
        const result = yield jobModel_1.JobModel.findByIdAndDelete(id);
        if (!result) {
            logger_1.logger.error("Error in DJD_003, Job Details Not Found");
            res.status(404).json({
                code: "DJD_003",
                message: "Error in DJD_003, Job Details Not Found"
            });
            return;
        }
        logger_1.logger.success("Successfully Deleted Job Details");
        res.status(200).json({
            code: "DJD_000",
            message: "Successfully Deleted Job Details"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteJobDetailsById = deleteJobDetailsById;
//# sourceMappingURL=jobController.js.map