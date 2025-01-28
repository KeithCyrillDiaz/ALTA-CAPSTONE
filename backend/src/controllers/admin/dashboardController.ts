import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";
import { ApplicationModel } from "../../models/user/applicationModel";
import { JobModel } from "../../models/admin/jobModel";
import { EmployeeModel } from "../../models/admin/employeeModel";
import { TotalModel } from "../../models/admin/totalCountModel";
import { monthArray } from "../../helper/date";
import { caclucateIncreasePercentage } from "../../helper/math";

const validMonths = monthArray;

export const getTotalData = async (req: Request, res: Response, next: NextFunction    ) => {
    try {
        logger.event("Fetching Data for Admin Header Section");
        
        // EXTRACT THE DATA AND ASSIGNED NEW VARIABLE NAMES FOR THEM TO AVOID CONFLICT
        const {month, year, totalApplicants: prevApplicantTotalValue, totalJob:prevJobTotalValue, totalEmployees: prevEmployeesTotalValue } = req.body;
        
        // VALIDATION OF MONTH AND YEAR TO PREVENT ERROR
        if(!month || !year || prevApplicantTotalValue === null || prevEmployeesTotalValue === null || prevJobTotalValue === null) {
            logger.error("Error in GTD_001. Month, Year, prevApplicantTotalValue, prevEmployeesTotalValue, and prevJobTotalValue fields are required");
            res.status(400).json({
                code: 'GTD_001',
                message: "Month, Year, prevApplicantTotalValue, prevEmployeesTotalValue, and prevJobTotalValue fields are required."
            });
            return;
        }

        if(!validMonths.includes(month) || typeof(month) !== 'string' || typeof(year) !== "number") {

            logger.error("Error in GTD_002. Invalid Type and inputs for month or year");

            res.status(400).json({
                code: 'GTD_002',
                message: "Invalid Type and inputs for month or year"
            });
            return;
        }

        //FETCHED TOTAL DATA FOR THE SPECIFIED MONTH AND YEAR
        const existingTotalData = await TotalModel.findOne({month, year});

        //COUNT THE DOCUMENTS
        const totalApplicants = await ApplicationModel.countDocuments();
        const totalJob = await JobModel.countDocuments();
        const totalEmployees = await EmployeeModel.countDocuments();
        //NO CLIENT YET
        //NO COLLABORATORS YET

        let result;

        //CHECK IF TOTAL DATA FOR THAT MONTH AND YEAR IS ALREADY EXISTING
        if(!existingTotalData) {
            //IF NOT EXISTING
            logger.error("Total Information is Not Found");
            logger.event(`Creating New Total Document for ${month} ${year}`)
            
            const newTotal  = new TotalModel({
                totalApplicants,
                totalEmployees,
                totalJob,
                month,
                year
            });

            result = await newTotal.save();

            if(!result) {
                logger.error("Failed to created new total information");
                res.status(500).json({
                    code: 'GTD_002',
                    message: "Failed to created new total information"
                });
            }

            logger.success(`Successfully created new total document for ${month} ${year}`);
            
            res.status(200).json({
                code: 'GTD_000',
                message: `Successfully Fetched Count Documents for ${month} ${year}`,
                data: {
                    totalApplicants: {value: totalApplicants, increase: 0},
                    totalJob: {value: totalJob, increase: 0},
                    totalEmployees: {value: totalEmployees, increase: 0}
                }
            });
            return;

        } else {
            //IF TOTAL DATA IS EXISTING
            logger.event(`Updating the existing total data for ${month} ${year}`);

            //CHECK IF THE PREV VALUES ARE 0 MEANING THIS ARE THE FIRST FETCH
            if(
                prevApplicantTotalValue === 0 && 
                prevEmployeesTotalValue === 0 &&
                prevJobTotalValue === 0
            ) {
                //IF THE VALUES DID NOT CHANGE RETURN THE RESPONSE RIGHT AWAY
                logger.event("First Data Fetched");
                logger.success("Successfully Fetched Count Documents");

                res.status(200).json({
                    code: 'GTD_000',
                    message: `Successfully Fetched Count Documents for ${month} ${year}`,
                    data: {
                        totalApplicants: {value: totalApplicants, increase: 0},
                        totalJob: {value: totalJob, increase: 0},
                        totalEmployees: {value: totalEmployees, increase: 0}
                    }
                });
                return;
            }

            //IF THE VALUE CHANGES

            //GET THE TOTAL APPLICATION COUNT INCREASE IN PERCENTAGE
            const totalApplicantIncreasePercentage = caclucateIncreasePercentage(prevApplicantTotalValue, totalApplicants);

            //GET THE TOTAL EMPLOYEES COUNT INCREASE IN PERCENTAGE
            const totalEmployeesIncreasePercentage = caclucateIncreasePercentage(prevEmployeesTotalValue, totalEmployees);

            //GET THE TOTAL JOB COUNT INCREASE IN PERCENTAGE
            const totalJobIncreasePercentage = caclucateIncreasePercentage(prevJobTotalValue, totalJob);

            //UPDATE THE EXISTING DOCUMENT
            result = await TotalModel.findOneAndUpdate(
                {month, year},
                {
                    totalApplicants,
                    totalEmployees,
                    totalJob
                },
                {new: true}
            );


            if(!result) {
                logger.error("Error in GTD_003. Failed to update new total information");
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

    } catch (error) {
        next(error);
    }
}


//THIS FUNCTION CURRENTLY IS FOR APPLICATNS ONLY AS OF THE MOMENT
export const getTopData = async (req: Request, res: Response, next: NextFunction) => {
    try {

        logger.event("Fetching Top Data");

        const {month, year, position} = req.body;

        if(!month || !year || !position) {
            logger.error("Error in GTD_001, month, year, and position fields are required");
            res.status(400).json({
                code: "GTD_001",
                message: "Error in GTD_001, month, year and position fields are required"
            });
            return;
        }

        const topClients = await ApplicationModel.find(
            {month, year, position}
        )
        .sort({ resumeAccuracy: -1 }) // SORT BY RESUME ACCURACY IN DESCENDING ORDER
        .limit(5); // LLIMIT THE RESULT TO 5 DOCUMENTS

        // PLANNING TO ADD THE OTHER TOP DATA LIKE CLIENTS, PROJECTS, AND ETC

        logger.success("Successfully fetch Client Data");

        res.status(200).json({
            code: "GTCD_000",
            message: "Successfully fetch Client Data",
            data: {
                topClients: topClients
                // ADD THE OTHER TOP DATA LKE CLIENTS PROJECT AND ETC
            }
        });

        return;
        
    } catch (error) {
        next(error);
    }
}

export const getJobPositions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Fetching Job Positions");

        const result = await JobModel.find({status: "Open"});

        if(result.length === 0) {
            logger.error("No Job Found");
            res.status(404).json({
                code: "GJP_001",
                message: "No Job Found",
            });
            return;
        }

        const positions = result.map((item) => item.jobTitle);

        // REMOVE THE DUPLICATES
        const uniquePositions = [... new Set(positions)]

        logger.success("Job Positions Fetched Successfully");
        res.status(200).json({
            code: "GJP_000",
            message: "Job Positions Fetched Successfully",
            data: uniquePositions,
        });

    } catch (error) {
        next(error);
    }
}
