import React, { useEffect, useState } from "react";
import { RenderJobDescription } from "./RenderJobDescription";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDeviceType } from "../hooks";
import { Input } from "./Input";
import { DropDown, DropDownDataType } from "./DropDown";
import { JobDataTypes } from "./JobFeed";
import { useLocation } from "react-router-dom";

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

    const location = useLocation();
    const {id} = location.state;

    const chosenJob = useSelector((state: RootState) => state.job.chosenJob);

    const [jobData, setJobData] = useState<JobDataTypes | null>(chosenJob)

    useEffect(() => {
        if(!jobData) {
            
        }

        const fetchData = async () => {
            
        }
    },[jobData])

    //CUSTOM HOOKS
    const {isDesktop, isTablet} = useDeviceType();
    return (
        <div className="feedContainer">
            {chosenJob && (isDesktop || isTablet) && <RenderJobDescription jobDescriptionData={chosenJob}/>}
            <Form/>
        </div>
    )
}