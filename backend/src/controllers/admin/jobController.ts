import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";

import { getDateToday } from "../../helper/date";
import { createResultHandler } from "../../utils/resultHandler";
import mongoose from "mongoose";
import { JobModel } from "../../models/admin/jobModel";

export const createJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Creating Job");

        const {jobTitle, jobDescription, skills, education, isSalaryRange, minSalary, maxSalary, salaryType, employmentType, shift, schedule} = req.body;

        if (!jobTitle || !jobDescription || !skills || !education || !isSalaryRange || !minSalary || !maxSalary || !salaryType || !employmentType ||!shift || !schedule) {

            logger.error("error in CJB_001, Missing Required Fields");

            res.status(400).json({
                code: "CJB_001",
                message: "Missing Required Fields"
            });
            return;
        }

        if(!Array.isArray(skills) || !Array.isArray(jobDescription) ||!Array.isArray(education)) {

            logger.error("error in CJB_002, Job Description, skills and education fields should be an array");

            res.status(400).json({
                code: 'CJB_002',
                message: "Job Description, skills and education fields should be an array"
            });
            return
        }

        const {month, year} = getDateToday();

        const newJob = new JobModel({
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

        const result = await newJob.save();

        createResultHandler(res, result, "CJB_003", "creating job");

        if(!result) {
            logger.error("error in CJB_003, Error Creating Job");
            res.status(500).json({
                code: 'CJB_003',
                message: "Error Creating Job"
            });
            return;
        }

        logger.success("Successfully Created Job");
        res.status(201).json({
            code: "CJB_000",
            message: "Successfully Created Job"
        });

        return;

    } catch (error) {
        next(error);
    }
}

export const getJobApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Fetching Job Applications");

        const result = await JobModel.find();

        if(result.length === 0) {
            logger.error("No Job Application Found");
            res.status(404).json({
                code: 'GJA_001',
                message: "No Job Application Found",
                data: result
            });
            return;
        }

        logger.success("Successfully Fetched Job Applications");

        res.status(200).json({
            code: 'GJA_000',
            message: "Successfully Fetched Job Applications",
            data: result
        });

    } catch (error) {
        next(error);
    }
}

export const getJobDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Fetching Job Details");
        const {id} = req.params;

        if(!id) {
            logger.error("ID not found in Params");
            res.status(400).json({
                code: "GJD_001",
                message: "ID not found in Params"
            });
            return;
        }

        if(!mongoose.Types.ObjectId.isValid(id)) {
            logger.error("Invalid ID format");
            res.status(400).json({
                code: 'GJD_002',
                message: "Invalid ID format"
            });
            return;
        }

        const result = await JobModel.findById(id);

        if(!result) {
            logger.error("Error in GJD_003, Job Record Not Found");
            res.status(404).json({
                code: "GJD_003",
                message: "Job Record Not Found"
            });
            return;
        }

        logger.success("Successfully Fetched Job Record");

        res.status(200).json({
            code: "GJD_000",
            message: "Successfully Fetched Job Record",
            data: result
        })
          
        
    } catch (error) {
        next(error)
    }
}


const validJobStatus = ['Open', 'Close'];

export const updateJobStatus = async (req: Request, res: Response, next:NextFunction) => {
    try {
        logger.event("Updating Job Status");

        const {id} = req.params;

        if(!id) {
                logger.error("ID in params is not Found");
                res.status(400).json({
                    code: 'UJS_001',
                    message: "ID in params is not Found"
                });
                return;
            }
            
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.error("Invalid ID format");
            res.status(400).json({
                code: 'UJS_002',
                message: "Invalid ID format"
            });
            return;
        }

        const {status} = req.body;

        if(!status || !validJobStatus.includes(status)) {
            logger.error("Invalid Job Status");
            res.status(400).json({
                code: 'UJS_003',
                message: "Invalid Job Status"
            })
        }

        const result = await JobModel.findByIdAndUpdate(
            id,
            {status},
            {new: true}
        );
        
        if(!result){
            logger.error("Job Record not found");
            res.status(404).json({
                code: 'UJS_004',
                message: "Job Record not found"
            });
            return;
        }

        logger.success("Successfully Updated Job Status");

        res.status(200).json({
            code: 'UJS_000',
            message: "Successfully Updated Job Status"
        });

    } catch (error) {
        next(error);
    }
}


export const updateJobInformation = async (req: Request, res: Response, next: NextFunction) => {
    try {

        logger.event("Updating Job Information");

        const {id} = req.params;

        if(!id) {
                logger.error("ID in params is not Found");
                res.status(400).json({
                    code: 'UJI_001',
                    message: "ID in params is not Found"
                });
                return;
            }
            
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.error("Invalid ID format");
            res.status(400).json({
                code: 'UJI_002',
                message: "Invalid ID format"
            });
            return;
        }
        

        const {jobTitle, jobDescription, skills, education, isSalaryRange, minSalary, maxSalary, salaryType, employmentType, shift, schedule} = req.body;

        if (!jobTitle || !jobDescription || !skills || !education || !isSalaryRange || !minSalary || !maxSalary || !salaryType || !employmentType ||!shift || !schedule) {

            logger.error("error in UJI_003, Missing Required Fields");

            res.status(400).json({
                code: "UJI_003",
                message: "Missing Required Fields"
            });
            return;
        }

        if(!Array.isArray(skills) || !Array.isArray(jobDescription) ||!Array.isArray(education)) {

            logger.error("error in UJI_004, Job Description, skills and education fields should be an array");

            res.status(400).json({
                code: 'UJI_004',
                message: "Job Description, skills and education fields should be an array"
            });
            return;
        }
        
        const existingJob = await JobModel.findById(id);

        if(!existingJob) {
            logger.error("error in UJI_005, Job information is not found in database");

            res.status(404).json({
                code: 'UJI_005',
                message: "Job information is not found in database"
            });
            return;
        }

        const result = await JobModel.findByIdAndUpdate(
            id,
            req.body,
            {new: true}
        )

        if(!result) {
            logger.error("error in UJI_006, Failed Updating Job Information");

            res.status(404).json({
                code: 'UJI_006',
                message: "Failed Updating Job Information"
            });
            return;
        }

        logger.success("Successfully Updated Job Information");

        res.status(200).json({
            code: 'UJI_000',
            message: "Successfully Updated Job Information"
        });

    } catch (error) {
        next(error);
    }
}
