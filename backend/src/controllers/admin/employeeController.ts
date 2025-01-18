import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";
import { EmployeeModel } from "../../models/admin/employeeModel";



export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Creating Employee");

        const {givenName, lastName, birthday, gender, email, phoneNumber, currentCity, salary, companyEmail, position, workOnsite} = req.body;

        if(!givenName || !lastName || !birthday || !gender || !email || !phoneNumber || !currentCity || !salary || !companyEmail || !position || !workOnsite) {
            logger.error("All required fields must be provided.");
            res.status(400).json({
                code: "CEP_001",
                message: "Missing required fields: givenName, lastName, birthday, gender, email, phoneNumber, currentCity, salary, companyEmail, position, workOnsite."
            });
            return;
        }

        //CREATE THE DATA OBJECT
        const newEmployee = new EmployeeModel({
            givenName,
            lastName,
            birthday,
            gender,
            email,
            phoneNumber,
            currentCity,
            salary,
            companyEmail,
            position,
            workOnsite
        });

        //SAVE EMPLOYEE DETAILS IN MONGODB DATABASE
        const result = await newEmployee.save();
        
        //CHECK THE RESULT IF SUCCESSFUL OR NOT
        if(!result) {
            logger.error("Failed to Add New Employee in Mongodb");
            res.status(500).json({
                code: 'CEP_002',
                message: "Failed to Add New Employee in Mongodb"
            });
            return;
        }


        logger.success("Successfully Added New Employee Details");

        res.status(201).json({
            code: 'CEP_000',
            message: "Successfully Added New Employee Details"
        });

        return;

    } catch (error) {
        next(error);
    }
}

export const getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Fetching All Employees");

        const result = await EmployeeModel.find();

        if(result.length === 0) {
            logger.error("No EMployees Recourd Found");
            res.status(404).json({
                code: 'GAE_001',
                message: "No EMployees Recourd Found"
            });
            return;
        }

        logger.success("Successfully Fetched All Employees");

        res.status(200).json({
            code: 'GAE_000',
            message: "Successfully Fetched All Employees"
        });

    } catch (error) {
        next(error);
    }
}