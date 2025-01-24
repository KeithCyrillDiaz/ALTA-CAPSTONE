// Functions to make specific API calls
import { AxiosError } from "axios";
import { JobDataTypes } from "../components/JobFeed";
import axiosInstance from "./axiosInstance";
import {endpointClient } from "./endpoint";



export const fetchJobs = async (): Promise<JobDataTypes[] | null> => {
    try {
      console.log("Fetching Jobs");
      const apiURL = endpointClient.jobURL.FETCH_JOBS;
      const response = await axiosInstance.get(apiURL);
      //EXTRACT DATA FROM JSON DATA OF RESPONSE
      const {data} = response.data;
      // console.log("data: ", JSON.stringify(response.data, null, 2));
      return data; 
    } catch (error) {

      // CHECK IF THE ERROR IS AN INSTANCE OF AXIOS ERROR
    if (error instanceof AxiosError) {
      if (error.response) {
        console.log("Response data: ", JSON.stringify(error.response.data, null, 2));
      } else {
        console.log("No response data available");
      }

      return null;
    } else {
      // Handle other types of errors (non-AxiosError)
      console.error("Unknown error:", error);
      return null;
    }
    }
  };

  export const 