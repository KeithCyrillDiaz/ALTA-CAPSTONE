"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopData = exports.getTotalData = void 0;
const logger_1 = require("../../utils/logger");
const applicationModel_1 = require("../../models/user/applicationModel");
const jobModel_1 = require("../../models/admin/jobModel");
const employeeModel_1 = require("../../models/admin/employeeModel");
const totalCountModel_1 = require("../../models/admin/totalCountModel");
const date_1 = require("../../helper/date");
const math_1 = require("../../helper/math");
const validMonths = date_1.monthArray;
const getTotalData = async (req, res, next) => {
    try {
        logger_1.logger.event("Fetching Data for Admin Header Section");
        const { month, year } = req.body;
        //VALIDATION OF MONTH AND YEAR TO PREVENT ERROR
        if (!month || !year) {
            logger_1.logger.error("Error in GTD_001. Month and Year fields are required");
            res.status(400).json({
                code: 'GTD_001',
                message: "Month and Year fields are required"
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
        const existingTotalData = await totalCountModel_1.TotalModel.findOne({ month, year });
        //COUNT THE DOCUMENTS
        const totalApplicants = await applicationModel_1.ApplicationModel.countDocuments();
        const totalJob = await jobModel_1.JobModel.countDocuments();
        const totalEmployees = await employeeModel_1.EmployeeModel.countDocuments();
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
            result = await newTotal.save();
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
            //EXTRACT THE PREVIOUS DATA TO CALCULATE THE INCREASE AND RENAMING THEM TO AVOID CONFLICT
            const { totalApplicants: prevApplicantTotalValue, totalEmployees: prevEmployeesTotalValue, totalJob: prevJobTotalValue } = existingTotalData;
            //CHECK IF THE VALUE CHANGES
            if (prevApplicantTotalValue !== totalApplicants ||
                prevEmployeesTotalValue !== totalEmployees ||
                prevJobTotalValue !== totalJob) {
                //IF THE VALUES DID NOT CHANGE RETURN THE RESPONSE RIGHT AWAY
                logger_1.logger.event("Values did not change");
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
            result = await totalCountModel_1.TotalModel.findOneAndUpdate({ month, year }, {
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
};
exports.getTotalData = getTotalData;
//NOT FINISH, UNDECIDED IF ITS NEEDED
const getTopData = async (req, res, next) => {
    try {
        logger_1.logger.event("Fetching Top Data");
        const topClients = await applicationModel_1.ApplicationModel.find()
            .sort({ resumeAccuracy: -1 }) // SORT BY RESUME ACCURACY IN DESCENDING ORDER
            .limit(5); // LLIMIT THE RESULT TO 5 DOCUMENTS
    }
    catch (error) {
        next(error);
    }
};
exports.getTopData = getTopData;
//# sourceMappingURL=dashboardController.js.map