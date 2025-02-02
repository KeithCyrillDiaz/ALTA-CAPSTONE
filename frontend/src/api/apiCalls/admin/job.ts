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

export const saveNewJobForm = async (jobData: JobDataTypes) => {
    try {
        console.log("Saving New Job Post");
        //PREPARE THE URL
        const url = `${endpointAdmin.job.CREATE_JOB}`
        const response = await axiosInstance.post(url, jobData);
        const {data} = response.data;
        return data;
    } catch (error) {
        return errorHandler(error);
    }
}

export const deleteJobPostById = async (id: string) => {
    try {
        console.log("Deleting Job Post");
        //PREPARE URL
        const url = `${endpointAdmin.job.DELETE_JOB_ID}/${id}`
        await axiosInstance.delete(url);
        return;
    } catch (error) {
        return errorHandler(error);
    }
}