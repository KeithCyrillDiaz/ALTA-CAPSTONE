
import { TableDataTypesValue } from "../../../components/admin/table/Table";
import { ApplicantStatusTypes } from "../../../components/ApplicationForm";
import { UserApplicationTypes } from "../../../pages/admin/Dashboard";
import axiosInstance from "../../axiosInstance";
import { endpointAdmin } from "../../endpoint";
import errorHandler from "../errorhandler"



export const getAllUserApplicants = async () => {
    try {
        console.log("Fetching All User Applicants");
        // PREPARE THE URL
        const url = endpointAdmin.applicants.FETCH_ALL_USER_APPLICANTS;
        const response = await axiosInstance.get(url);
        const {data} = response.data
        return data;
    } catch (error) {
        return errorHandler(error);
    }
}

export const getApplicantRecord = async (id: TableDataTypesValue): Promise<UserApplicationTypes | null> => {
    try {
        console.log("Fetching Applicant Record");
        const url = `${endpointAdmin.applicants.FETCH_USER_APPLICANTS}/${id}`;
        const response = await axiosInstance.get(url);
        const {data} = response.data;
        return data;
    } catch (error) {
        return errorHandler(error)
    }
}

export const updateApplicantStatus = async (id: string, value: ApplicantStatusTypes) => {
    try {
        console.log("Updating Applicant Status");
        const url = `${endpointAdmin.applicants.UPDATE_STATUS}/${id}`;
        const response = await axiosInstance.patch(url, {status: value});
        const {data} = response.data;
        return data;
    } catch (error) {
        return errorHandler(error)
    }
}