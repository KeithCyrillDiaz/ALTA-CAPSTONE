import { TableDataTypesValue } from "../../../components/admin/table/Table";
import { JobDataTypes } from "../../../components/client/JobFeed";
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


export const updateJobDescriptionDetails = async (jobData: JobDataTypes) => {
    try {
        console.log("Updating Job Form");
        // PREPARE THE URL
        // EXTRACT OBJECT ID AND RENAME IT TO id
        const {_id: id} = jobData;
        const url = `${endpointAdmin.job.UPDATE_ALL}/${id}`;
        const response = await axiosInstance.patch(url, jobData);
        const {data} = response.data;
        return data;

    } catch (error) {
        return errorHandler(error);
    }
}