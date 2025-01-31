import { TableDataTypesValue } from "../../../components/admin/table/Table";
import axiosInstance from "../../axiosInstance";
import { endpointAdmin } from "../../endpoint";
import errorHandler from "../errorhandler"



export const fetchAdminJobData = async () => {
    try {
        console.log("Fetching Job Data");
        // PREPARE THE URL
        const url = endpointAdmin.job.FETCH_ALL_JOBS;
        const response = await axiosInstance.get(url);
        const{data} = response.data;
        return data;
    } catch (error) {
        return errorHandler(error);
    }
}


export const fetchJobDataById = async (id: TableDataTypesValue) => {
    try {
        console.log("Fetching Job Data by id");
        //PREPARE URL
        const url = `${endpointAdmin.job.FETCH_ONE_JOB}/${id}`;
        const response = await axiosInstance.get(url);
        const {data} = response.data;
        return data;
    } catch (error) {
        return errorHandler(error)
    }
}