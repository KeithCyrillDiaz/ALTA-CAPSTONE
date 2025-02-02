import { EmployeeDataTypes } from "../../../pages/admin/Employees/Employees";
import axiosInstance from "../../axiosInstance";
import { endpointAdmin } from "../../endpoint";
import errorHandler from "../errorhandler"



export const getEmployees = async () => {
    try {
        console.log("Fetching All Employees");
        // PREPARE THE URL
        const url = endpointAdmin.employees.FETCH_ALL;
        const response = await axiosInstance.get(url);
        const {data} = response.data;
        return data;
    } catch (error) {
        return errorHandler(error);
    }
}

export const saveEmployee = async (employeeData: EmployeeDataTypes) => {
    try {
        console.log("Saving New Employee Details");
        const url = endpointAdmin.employees.CREATE;
        const response = await axiosInstance.post(url, employeeData);
        const {data} = response.data;
        return data;
    } catch (error) {
        return errorHandler(error);
    }
}


export const updateEmployeeDetails = async (id: string, updatedFields: EmployeeDataTypes) => {
    try {
        console.log("Saving New Employee Details");
        const url = `${endpointAdmin.employees.UPDATE_DETAILS}/${id}`;
        const response = await axiosInstance.patch(url, updatedFields);
        const {data} = response.data;
        return data;
    } catch (error) {
        return errorHandler(error);
    }
}