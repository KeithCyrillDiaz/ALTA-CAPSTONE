import { MonthStringTypes } from "../../../../helper/date";
import axiosInstance from "../../../axiosInstance";
import { endpointAdmin } from "../../../endpoint";
import errorHandler from "../../errorhandler"


export const fetchTopData = async (month: MonthStringTypes, year: number) => {
    try {
        console.log("fetching top Data");
        
        //PREPARE THE URL
        const url = endpointAdmin.dashboard.FETCH_TOP_DATA;
        const response = await axiosInstance.post(url, {month, year});
        const {data} = response.data
        return data
    } catch (error) {
        return errorHandler(error);
    }
}