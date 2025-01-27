import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDeviceType } from "../hooks";

import { JobDataTypes } from "./client/JobFeed";
import { useParams } from "react-router-dom";
import { fetchChosenJob, } from "../api/client/apiCalls";
import Loader from "./Loader";
import { ApplicationForm } from "./ApplicationForm";
import { RenderJobDescription } from "./RenderJobDescription";


export type FormValue = string | number | boolean | Date | null
export interface JobApplicationFormTypes {
    givenName: string;
    lastName: string;
    birthday: Date | null;
    gender: string;
    email: string;
    phoneNumber: number | "";
    currentCity: string;
    expectedSalary: number | "";
    resumeString: string;
    jobId: string;
    jobTitle: string;
    company: string;
    workOnsite: boolean;
  }



export const JobForm: React.FC = () => {

    const { id } = useParams<{ id: string }>();

    const chosenJob = useSelector((state: RootState) => state.job.chosenJob);

    const [jobData, setJobData] = useState<JobDataTypes | null>(chosenJob);
    const [loading, setLoading] = useState<boolean>(false);


    //THIS FUNCTION IS FOR FETCHING THE CHOSEN JOB DATA INCASE THE USER REFRESH THE PAGE
    // THIS IS NEEDED SINCE REDUX STORAGE WILL RESET OR CLEARED AND THE JOB DATA WILL BE NULL AFTER THE PAGE IS REFRESHED
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            //CHECK IF ID IS INCLUDED IN PARAMS ROUTE
            if(!id) {
                // IF NOT, RETURN OR EXIT THE FUNCTION
                console.log("id Is Undefiend in Params");
                return;
            }
            const data = await fetchChosenJob(id);
            setJobData(data);
            setLoading(false);
        }
    
        if(!jobData) {
            console.log("jobData is null");
            fetchData();
        }

    },[jobData, setLoading, id])

    //CUSTOM HOOKS
    const {isDesktop, isTablet} = useDeviceType();

    if(loading) {
        return (
            <div className="container">
                <Loader/>
            </div>
        )
    }

    return (
        <div className="feedContainer">
            {jobData && (isDesktop || isTablet) && <RenderJobDescription jobDescriptionData={jobData}/>}
            {id && jobData && (<ApplicationForm jobId={id}/>)}
        </div>
    )
}