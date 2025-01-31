import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";
import { EmployeeModel } from "../../models/admin/employeeModel";
import { getDateToday } from "../../helper/date";



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

        // GET MONTH AND YEAR
        const {month, year} = getDateToday();

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
            workOnsite,
            month,
            year
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
            message: "Successfully Fetched All Employees",
            data: result
        });

    } catch (error) {
        next(error);
    }
}


export const updateEmployeeDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.event("Updating Employee Details");

        const { id } = req.params; // EXTRACT EMPLOYEE ID FROM REQUEST PARAMETERS
        const updates = req.body; // EXTRACT FIELDS TO UPDATE FROM REQUEST BODY

        // ENSURE THE REQUEST BODY IS NOT EMPTY
        if (!Object.keys(updates).length) {
            logger.error("Error in UED_001, No fields provided for updates");
            res.status(400).json({  
                code: "UED_001",
                message: "No fields provided for updates"
            });
            return;
        }

        // FIND AND UPDATE THE EMPLOYEE
        const result = await EmployeeModel.findByIdAndUpdate(
            id,
            { $set: updates }, // PROVIDE THE UPDATED FIELDS
            { new: true, runValidators: true } // RETURN THE UPDATED DOCUMENT AND VALIDATE
        );

        // IF EMPLOYEE IS NOT FOUND
        if (!result) {
            logger.error("Error in UED_002, Employee not found");
            res.status(404).json({ 
                code: "UED_002",
                message: "Employee not found" 
            });
            return;
        }
        logger.success("Employee Details Updated Successfully");

        res.status(200).json({
            code: "UED_000",
            message: "Employee Details Updated Successfully",
            data: result,
        });

    } catch (error) {
        next(error);
    }
};