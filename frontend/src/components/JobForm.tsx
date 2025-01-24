import React, { useEffect, useState } from "react";
import { RenderJobDescription } from "./RenderJobDescription";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDeviceType } from "../hooks";
import { Input } from "./Input";
import { DropDown, DropDownDataType } from "./DropDown";
import { JobDataTypes } from "./JobFeed";
import { useParams } from "react-router-dom";
import { fetchChosenJob } from "../api/apiCalls";
import Loader from "./Loader";

export interface JobApplicationFormTypes {
    givenName: string;
    lastName: string;
    birthday: Date;
    gender: string;
    email: string;
    phoneNumber: number | "";
    currentCity: string;
    expectedSalary: number | "";
    resumeString: string;
    jobId: string; // Assuming it's an ID string; replace with `Types.ObjectId` if using Mongoose
    jobTitle: string;
    company: string;
    workOnsite: boolean;
  }

interface formFormatTypes {
    field: keyof JobApplicationFormTypes;
    title: string;
    placeholder: string;
    value: string | number | boolean,
    type?: string
}

const Form: React.FC = () => {

    
    const [form, setForm] = useState<JobApplicationFormTypes>({
        givenName: "",
        lastName: "",
        birthday: new Date,
        gender: "",
        email: "",
        phoneNumber: "",
        currentCity: "",
        expectedSalary: "",
        resumeString: "",
        jobId: "",
        jobTitle: "",
        company: "",
        workOnsite: false
    })

    const givenNameANdLastName: formFormatTypes[] = [
        {
            field: "givenName",
            title: "Given Name",
            placeholder: "e.g. Keith Cyrill",
            value: form.givenName,
        },
        {
            field: "lastName",
            title: "Last Name",
            placeholder: "e.g. Diaz",
            value: form.lastName,
        },
    ]

    const genderData:DropDownDataType[] = [
        {label: "Female", value: "Female"},
        {label: "Male", value: "Male"},
    ]

    const handleUpdateForm = (
        field: keyof JobApplicationFormTypes, 
        value: string | number | boolean
    ) => {
        console.log("field", field);
        setForm((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <div className="feedContentContainer">
            <h3><strong>Personal Information</strong></h3>

            {/* GIVEN NAME AND LAST NAME FIELDS */}
            <div className="form-row">
                {givenNameANdLastName.map((item, index) => {
                    const {field, title, placeholder, value} = item;
                    return (
                        <Input 
                        key={index}
                        onChange={(text) => handleUpdateForm(field, text)} 
                        value={value}
                        placeholder={placeholder}
                        label={title}
                        />
                    )
                })}
            </div>
            

            {/* BIRHTDAY AND GENDER FIELD */}
            <div className="form-row">
                
                <DropDown
                    data={genderData}
                    placeHolder="Select Gender"
                    onChange={(text) => handleUpdateForm("gender", text)}
                />
            </div>

        </div>
    )
}




export const JobForm: React.FC = () => {

    const { id } = useParams<{ id: string }>();

    const chosenJob = useSelector((state: RootState) => state.job.chosenJob);

    const [jobData, setJobData] = useState<JobDataTypes | null>(chosenJob);
    const [loading, setLoading] = useState<boolean>(false);


    //THIS FUNCTION IS FOR FETCHING THE CHOSEN JOB DATA INCASE THE USER REFRESH THE PAGE
    // THIS IS NEEDED SINCE REDUX STORAGE WILL RESET OR CLEAR AND THE JOB DATA WILL BE NULL AFTER THE PAGE IS REFRESHED
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
            <Form/>
        </div>
    )
}