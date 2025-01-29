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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobPositions = exports.getTopData = exports.getTotalData = void 0;
const logger_1 = require("../../utils/logger");
const applicationModel_1 = require("../../models/user/applicationModel");
const jobModel_1 = require("../../models/admin/jobModel");
const employeeModel_1 = require("../../models/admin/employeeModel");
const totalCountModel_1 = require("../../models/admin/totalCountModel");
const date_1 = require("../../helper/date");
const math_1 = require("../../helper/math");
const validMonths = date_1.monthArray;
const getTotalData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Fetching Data for Admin Header Section");
        // EXTRACT THE DATA AND ASSIGNED NEW VARIABLE NAMES FOR THEM TO AVOID CONFLICT
        const { month, year, totalApplicants: prevApplicantTotalValue, totalJob: prevJobTotalValue, totalEmployees: prevEmployeesTotalValue } = req.body;
        // VALIDATION OF MONTH AND YEAR TO PREVENT ERROR
        if (!month || !year || prevApplicantTotalValue === null || prevEmployeesTotalValue === null || prevJobTotalValue === null) {
            logger_1.logger.error("Error in GTD_001. Month, Year, prevApplicantTotalValue, prevEmployeesTotalValue, and prevJobTotalValue fields are required");
            res.status(400).json({
                code: 'GTD_001',
                message: "Month, Year, prevApplicantTotalValue, prevEmployeesTotalValue, and prevJobTotalValue fields are required."
            });
            return;
        }
        if (!validMonths.includes(month) || typeof (month) !== 'string' || typeof (year) !== "number") {
            logger_1.logger.error("Error in GTD_002. Invalid Type and inputs for month or year");
            res.status(400).json({
                code: 'GTD_002',
                message: "Invalid Type and inputs for month or year"
            });
            return;
        }
        //FETCHED TOTAL DATA FOR THE SPECIFIED MONTH AND YEAR
        const existingTotalData = yield totalCountModel_1.TotalModel.findOne({ month, year });
        //COUNT THE DOCUMENTS
        const totalApplicants = yield applicationModel_1.ApplicationModel.countDocuments();
        const totalJob = yield jobModel_1.JobModel.countDocuments();
        const totalEmployees = yield employeeModel_1.EmployeeModel.countDocuments();
        //NO CLIENT YET
        //NO COLLABORATORS YET
        let result;
        //CHECK IF TOTAL DATA FOR THAT MONTH AND YEAR IS ALREADY EXISTING
        if (!existingTotalData) {
            //IF NOT EXISTING
            logger_1.logger.error("Total Information is Not Found");
            logger_1.logger.event(`Creating New Total Document for ${month} ${year}`);
            const newTotal = new totalCountModel_1.TotalModel({
                totalApplicants,
                totalEmployees,
                totalJob,
                month,
                year
            });
            result = yield newTotal.save();
            if (!result) {
                logger_1.logger.error("Failed to created new total information");
                res.status(500).json({
                    code: 'GTD_002',
                    message: "Failed to created new total information"
                });
            }
            logger_1.logger.success(`Successfully created new total document for ${month} ${year}`);
            res.status(200).json({
                code: 'GTD_000',
                message: `Successfully Fetched Count Documents for ${month} ${year}`,
                data: {
                    totalApplicants: { value: totalApplicants, increase: 0 },
                    totalJob: { value: totalJob, increase: 0 },
                    totalEmployees: { value: totalEmployees, increase: 0 }
                }
            });
            return;
        }
        else {
            //IF TOTAL DATA IS EXISTING
            logger_1.logger.event(`Updating the existing total data for ${month} ${year}`);
            //CHECK IF THE PREV VALUES ARE 0 MEANING THIS ARE THE FIRST FETCH
            if (prevApplicantTotalValue === 0 &&
                prevEmployeesTotalValue === 0 &&
                prevJobTotalValue === 0) {
                //IF THE VALUES DID NOT CHANGE RETURN THE RESPONSE RIGHT AWAY
                logger_1.logger.event("First Data Fetched");
                logger_1.logger.success("Successfully Fetched Count Documents");
                res.status(200).json({
                    code: 'GTD_000',
                    message: `Successfully Fetched Count Documents for ${month} ${year}`,
                    data: {
                        totalApplicants: { value: totalApplicants, increase: 0 },
                        totalJob: { value: totalJob, increase: 0 },
                        totalEmployees: { value: totalEmployees, increase: 0 }
                    }
                });
                return;
            }
            //IF THE VALUE CHANGES
            //GET THE TOTAL APPLICATION COUNT INCREASE IN PERCENTAGE
            const totalApplicantIncreasePercentage = (0, math_1.caclucateIncreasePercentage)(prevApplicantTotalValue, totalApplicants);
            //GET THE TOTAL EMPLOYEES COUNT INCREASE IN PERCENTAGE
            const totalEmployeesIncreasePercentage = (0, math_1.caclucateIncreasePercentage)(prevEmployeesTotalValue, totalEmployees);
            //GET THE TOTAL JOB COUNT INCREASE IN PERCENTAGE
            const totalJobIncreasePercentage = (0, math_1.caclucateIncreasePercentage)(prevJobTotalValue, totalJob);
            //UPDATE THE EXISTING DOCUMENT
            result = yield totalCountModel_1.TotalModel.findOneAndUpdate({ month, year }, {
                totalApplicants,
                totalEmployees,
                totalJob
            }, { new: true });
            if (!result) {
                logger_1.logger.error("Error in GTD_003. Failed to update new total information");
                res.status(500).json({
                    code: 'GTD_003',
                    message: "Failed to update new total information"
                });
            }
            res.status(200).json({
                code: 'GTD_000',
                message: `Successfully Fetched Count Documents for ${month} ${year}`,
                data: {
                    totalApplicants: {
                        value: totalApplicants,
                        increase: totalApplicantIncreasePercentage
                    },
                    totalJob: {
                        value: totalJob,
                        increase: totalJobIncreasePercentage
                    },
                    totalEmployees: {
                        value: totalEmployees,
                        increase: totalEmployeesIncreasePercentage
                    }
                }
            });
            return;
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getTotalData = getTotalData;
//THIS FUNCTION CURRENTLY IS FOR APPLICATNS ONLY AS OF THE MOMENT
const getTopData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Fetching Top Data");
        const { month, year, position } = req.body;
        if (!month || !year || !position) {
            logger_1.logger.error("Error in GTD_001, month, year, and position fields are required");
            res.status(400).json({
                code: "GTD_001",
                message: "Error in GTD_001, month, year and position fields are required"
            });
            return;
        }
        const topClients = yield applicationModel_1.ApplicationModel.find({ month, year, position })
            .sort({ resumeAccuracy: -1 }) // SORT BY RESUME ACCURACY IN DESCENDING ORDER
            .limit(5); // LLIMIT THE RESULT TO 5 DOCUMENTS
        // PLANNING TO ADD THE OTHER TOP DATA LIKE CLIENTS, PROJECTS, AND ETC
        logger_1.logger.success("Successfully fetch Client Data");
        res.status(200).json({
            code: "GTCD_000",
            message: "Successfully fetch Client Data",
            data: {
                topClients: topClients
                // ADD THE OTHER TOP DATA LKE CLIENTS PROJECT AND ETC
            }
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.getTopData = getTopData;
const getJobPositions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Fetching Job Positions");
        const result = yield jobModel_1.JobModel.find({ status: "Open" });
        if (result.length === 0) {
            logger_1.logger.error("No Job Found");
            res.status(404).json({
                code: "GJP_001",
                message: "No Job Found",
            });
            return;
        }
        const positions = result.map((item) => item.jobTitle);
        // REMOVE THE DUPLICATES
        const uniquePositions = [...new Set(positions)];
        logger_1.logger.success("Job Positions Fetched Successfully");
        res.status(200).json({
            code: "GJP_000",
            message: "Job Positions Fetched Successfully",
            data: uniquePositions,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getJobPositions = getJobPositions;
//# sourceMappingURL=dashboardController.js.map