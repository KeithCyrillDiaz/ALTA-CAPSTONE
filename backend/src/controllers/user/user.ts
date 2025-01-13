import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";
import { ApplicationModel } from "../../models/User/applicationModel";
import { getDateToday } from "../../helper/date";


export const createApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Creating Application");

        const {givenName, lastName, birthday, gender, email, phoneNumber, currentCity, expectedSalary, coverLetterURL, resumeURL, jobTitle, company, workOnsite} = req.body;

        //validate fields
        if (!givenName || !lastName || !birthday || !gender || !email || !phoneNumber || !currentCity || !expectedSalary || !coverLetterURL || !resumeURL || !jobTitle || !company || workOnsite === undefined) {
            res.status(400).json({
                code: "CAP_001",
                message: "All fields are required: givenName, LastName, birthday, gender, email, phoneNumber, currentCity, expectedSalary, jobTitle, company, workOnsite"
            });
            return;

        }

        const {month, year} = getDateToday();

        // Create a new application document
        const newApplication = new ApplicationModel({
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
            jobTitle,
            company,
            workOnsite,
            month,
            year,
            resumeAccuracy:  Math.floor(Math.random() * 100) + 1 //for the meantime
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