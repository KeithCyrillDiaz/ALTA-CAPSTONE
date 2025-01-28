import { MonthStringTypes } from "../../../../helper/date";
import axiosInstance from "../../../axiosInstance";
import { endpointAdmin } from "../../../endpoint";
import errorHandler from "../../errorhandler"


export const fetchTopData = async (month: MonthStringTypes, year: number, position: string) => {
    try {
        console.log("fetching top Data");
        
        //PREPARE THE URL
        const url = endpointAdmin.dashboard.FETCH_TOP_DATA;
        const response = await axiosInstance.post(url, {month, year, position});
        const {data} = response.data;
        return data;
    } catch (error) {
        return errorHandler(error);
    }
}


export const fetchJobPositions = async () => {
    try {
        console.log("Fetching Job Positions");

        // PREPARE URL
        const url = endpointAdmin.dashboard.FETCH_JOB_POSITIONS;
        const response = await axiosInstance.get(url);
        const {data} = response.data;
        return data;

    } catch (error) {
        return errorHandler(error)
    }
}