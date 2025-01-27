import { TotalDataType } from "../../components/admin/dashboard/HeroSection";
import { getDateToday } from "../../helper/date";
import { FormStateTypes } from "../../pages/admin/Login";
import axiosInstance from "../axiosInstance";
import { endpointAdmin } from "../endpoint";
import errorHandler from "./errorhandler";



export const adminLogin = async (form: FormStateTypes) => {
    try {
        //PREPARE THE URL
        const url = endpointAdmin.ADMIN_LOGIN;
        const response = await axiosInstance.post(url, form);
         //EXTRACT DATA FROM JSON DATA OF RESPONSE
        // console.log("data: ", JSON.stringify(response.data, null, 2));
        // EXTRACT THE TOKEN FROM THE data
        const {token} = response.data;
        localStorage.setItem("authToken", token);
        return true;
    } catch (error) {
        return errorHandler(error)
    }
}

export const adminLogout = async () => {
    try {
        console.log("logging Out");
        // PREPARE THE URL
        const url = endpointAdmin.ADMIN_LOGOUT;
        await axiosInstance.post(url);
        // CLEAR LOCAL STORAGE
        return true;
    } catch (error) {
        return errorHandler(error);
    } finally {
        // CLEAR THE LOCAL STORAGE EITHER SUCCESSFUL OR NOT
        localStorage.clear();
    }
}

export interface ExtendedFormatData extends Record<keyof TotalDataType, number> {
    month: string; 
    year: number; 
}
export const fetchTotalCounts = async (prevData: TotalDataType | null): Promise<TotalDataType | null> => {
    try {
        console.log("Fetching total Counts");
        //EXTRACT THE PREV VALUE
        
        // FORMAT THE DATA
        const { month, year } = getDateToday();
        let formatData: ExtendedFormatData = {
            totalApplicants: 0,
            totalJob: 0,
            totalEmployees: 0,
            month, 
            year,
        }
        // CHECK IF PREVIOUS DATA IS NOT NULL
        if(prevData) {
            // IF PREV DATA IS NOT NULL
            // USE REDUCE TO MAKE THE FORMAT DATA AS OBJECT
            formatData = Object.keys(prevData).reduce((acc, key) => {
                const { value } = data[key as keyof TotalDataType];
                acc[key as keyof TotalDataType] = value;
                return acc;
            }, { month, year } as ExtendedFormatData);
        }

        // PREPARE THE API URL
        const url = endpointAdmin.ADMIN_TOTAL;
        const response = await axiosInstance.post(url, formatData);
        const {data} = response.data;
        return data;
    } catch (error) {
        return errorHandler(error);
    }
}