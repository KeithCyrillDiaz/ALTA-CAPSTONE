import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";
import { JobModel } from "../../models/admin/jobModel";
import { getDateToday } from "../../helper/date";
import { createResultHandler } from "../../utils/resultHandler";

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

        // if(!result) {
        //     logger.error("error in CJB_003, Error Creating Job");
        //     res.status(500).json({
        //         code: 'CJB_003',
        //         message: "Error Creating Job"
        //     });
        //     return;
        // }

        // logger.success("Successfully Created Job");
        // res.status(201).json({
        //     code: "CJB_000",
        //     message: "Successfully Created Job"
        // });

        return;

    } catch (error) {
        next(error);
    }
}

