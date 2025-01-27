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