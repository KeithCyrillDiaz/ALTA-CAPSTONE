import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserApplicationTypes } from "../Dashboard";
import { getApplicantRecord } from "../../../api/apiCalls/admin/applicant";
import AdminLayout from "../../../layouts/AdminLayout";
import { Loader } from "../../../components";
import { JobDataTypes} from "../../../components/client/JobFeed";
import { RenderJobDescription } from "../../../components/RenderJobDescription";
import { ApplicationForm } from "../../../components/ApplicationForm";




const ViewApplicantRecord: React.FC = () => {

    const {id} = useParams();

    const [applicantDetails, setApplicantDetails] = useState<UserApplicationTypes>();
    const [jobData, setJobData] = useState<JobDataTypes>()
    const [loading, setLoading] =useState<boolean>(true);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getApplicantRecord(id);
            //CHECK IF DATA EXIST
            if(data) {
                // IF IT DOES

                // EXTRACT THE JOB DATA FIRST FROM JOB ID AND RENAME IT TO JOB DATA TO AVOID CONFUSION
                const {jobId: jobData} = data; //THIS IS POSSIBLE DUE TO THE "POPULATE" METHOD OF MONGODB.
                setJobData(jobData as JobDataTypes) // UPDATE THE STATE AND TELL TYPESCRIPT THAT THE TYPES ARE JOB DATA TYPES

                // FORMAT THE DATA TO PREVENT ERROR
                //INITIATE A NEW USER DATA SINCE TO REVERT THE JOB ID BACK TO STRING:
                // HONESTLY THIS IS OPTIONAL SINCE IT WILL NOT BE USED IN VIEWING THE APPLICATION. BUT JUST TO PREVENT ERRORS
                const newUserData: UserApplicationTypes = {
                    ...data, //SPREAD THE DATA TO ADD ALL THE DATA
                    jobId: data._id //UPDATE THE JOB ID TO STRING ID. 
                }
                //UPDATE THE STATE
                setApplicantDetails(newUserData);
            }
            
            setLoading(false)
        }

        fetchData();
    },[id])

    if(loading) {
        return (
            <Loader/>
        )
    }

    return (
        <AdminLayout title="APPLICANT">
        <div className="flex flex-col gap-4 relative pb-12 items-center">
            <main>
                {loading ? (
                    <Loader/>
                ) : (
                    <div className="feedContainer max-w-[1000px]">
                        {jobData && <RenderJobDescription jobDescriptionData={jobData}/>}
                        {id && jobData && applicantDetails && (
                            <ApplicationForm 
                            jobId={jobData._id} 
                            admin={true} 
                            userDetails={applicantDetails}/>
                        )}
                    </div>
                )}
            </main>
        </div>
    </AdminLayout>
    )
}


export default ViewApplicantRecord