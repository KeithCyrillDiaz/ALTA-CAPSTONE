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
exports.updateEmployeeDetails = exports.getAllEmployees = exports.createEmployee = void 0;
const logger_1 = require("../../utils/logger");
const employeeModel_1 = require("../../models/admin/employeeModel");
const date_1 = require("../../helper/date");
const createEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Creating Employee");
        const { givenName, lastName, birthday, gender, email, phoneNumber, currentCity, salary, companyEmail, position, workOnsite } = req.body;
        if (!givenName || !lastName || !birthday || !gender || !email || !phoneNumber || !currentCity || !salary || !companyEmail || !position || !workOnsite) {
            logger_1.logger.error("All required fields must be provided.");
            res.status(400).json({
                code: "CEP_001",
                message: "Missing required fields: givenName, lastName, birthday, gender, email, phoneNumber, currentCity, salary, companyEmail, position, workOnsite."
            });
            return;
        }
        // GET MONTH AND YEAR
        const { month, year } = (0, date_1.getDateToday)();
        //CREATE THE DATA OBJECT
        const newEmployee = new employeeModel_1.EmployeeModel({
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
        const result = yield newEmployee.save();
        //CHECK THE RESULT IF SUCCESSFUL OR NOT
        if (!result) {
            logger_1.logger.error("Failed to Add New Employee in Mongodb");
            res.status(500).json({
                code: 'CEP_002',
                message: "Failed to Add New Employee in Mongodb"
            });
            return;
        }
        logger_1.logger.success("Successfully Added New Employee Details");
        res.status(201).json({
            code: 'CEP_000',
            message: "Successfully Added New Employee Details"
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.createEmployee = createEmployee;
const getAllEmployees = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Fetching All Employees");
        const result = yield employeeModel_1.EmployeeModel.find();
        if (result.length === 0) {
            logger_1.logger.error("No EMployees Recourd Found");
            res.status(404).json({
                code: 'GAE_001',
                message: "No EMployees Recourd Found"
            });
            return;
        }
        logger_1.logger.success("Successfully Fetched All Employees");
        res.status(200).json({
            code: 'GAE_000',
            message: "Successfully Fetched All Employees",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllEmployees = getAllEmployees;
const updateEmployeeDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.event("Updating Employee Details");
        const { id } = req.params; // EXTRACT EMPLOYEE ID FROM REQUEST PARAMETERS
        const updates = req.body; // EXTRACT FIELDS TO UPDATE FROM REQUEST BODY
        // ENSURE THE REQUEST BODY IS NOT EMPTY
        if (!Object.keys(updates).length) {
            logger_1.logger.error("Error in UED_001, No fields provided for updates");
            res.status(400).json({
                code: "UED_001",
                message: "No fields provided for updates"
            });
            return;
        }
        // FIND AND UPDATE THE EMPLOYEE
        const result = yield employeeModel_1.EmployeeModel.findByIdAndUpdate(id, { $set: updates }, // PROVIDE THE UPDATED FIELDS
        { new: true, runValidators: true } // RETURN THE UPDATED DOCUMENT AND VALIDATE
        );
        // IF EMPLOYEE IS NOT FOUND
        if (!result) {
            logger_1.logger.error("Error in UED_002, Employee not found");
            res.status(404).json({
                code: "UED_002",
                message: "Employee not found"
            });
            return;
        }
        logger_1.logger.success("Employee Details Updated Successfully");
        res.status(200).json({
            code: "UED_000",
            message: "Employee Details Updated Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateEmployeeDetails = updateEmployeeDetails;
//# sourceMappingURL=employeeController.js.map