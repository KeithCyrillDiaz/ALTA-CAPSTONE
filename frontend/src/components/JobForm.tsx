import React, { FormEvent, useEffect, useState } from "react";
import { RenderJobDescription } from "./RenderJobDescription";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDeviceType } from "../hooks";
import { Input, InputKeyboardTypes } from "./Input";
import { DropDown, DropDownDataType } from "./DropDown";
import { JobDataTypes } from "./JobFeed";
import { useParams } from "react-router-dom";
import { fetchChosenJob, FormDataTypes, submitApplicationForm } from "../api/client/apiCalls";
import Loader from "./Loader";
import { BirthdayField } from "./BirthdayField";
import { FileHandler } from "./FileHandler";
import { extractTextFromPdf } from "../utils/extractTextFromPdf";
import { CheckBoxContainer } from "./CheckBox";
import { validateEmail, validatePhoneNumber } from "../utils/validation";
import { CustomModal } from "./modal/CustomModal";
import { getCityData } from "../constant/json";


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
    jobTitle: string;
    company: string;
    workOnsite: boolean;
  }

interface formFormatTypes {
    field: keyof JobApplicationFormTypes ;
    title: string;
    placeholder: string;
    value: string | number | boolean,
    type: InputKeyboardTypes
}

// USE OMIT TO EXCLUDE THE FIELD PROPERTY
interface FilesFieldFormat {
    field: "resume" | "coverLetter";
    title: string;
    placeholder: string;
    value: string,
    
}

const Form: React.FC = () => {

    
    const [loading, setLoading] = useState<boolean>(false)
    const [form, setForm] = useState<JobApplicationFormTypes>({
        givenName: "",
        lastName: "",
        birthday: null,
        gender: "",
        email: "",
        phoneNumber: "",
        currentCity: "",
        expectedSalary: "",
        resumeString: "",
        jobTitle: "",
        company: "",
        workOnsite: false
    });

    interface FileObjectTypes {
        name: string; 
        file: File | null
    }

    //INITIALZED FILES OBJECT FOR DISPLAY AND UPLOADING THE FILE IN BACKEND
    const [uploadedCoverLetter, setUploadedCoverLetter] = useState<FileObjectTypes>({
        name: "",
        file: null
    });
    const [uploadedResume, setUploadedResume] = useState<FileObjectTypes>({
        name: "",
        file: null
    });

    //VALIDATIONS
    const [isFormValid, setIsFormValid] = useState<boolean>(false)
    const [modalDetails, setModalDetails] = useState<{title: string; message: string; showModal: boolean}>({
        title: "",
        message: "",
        showModal: false
    })

    const givenNameANdLastName: formFormatTypes[] = [
        {
            field: "givenName",
            title: "Given Name",
            placeholder: "e.g. Keith Cyrill",
            value: form.givenName,
            type: 'text'
        },
        {
            field: "lastName",
            title: "Last Name",
            placeholder: "e.g. Diaz",
            value: form.lastName,
            type: 'text'
        },
    ]

    const contactDetails: formFormatTypes[] = [
        {
            field: "email",
            title: "Email",
            placeholder: "e.g example@gmail.com",
            value: form.email,
            type: 'email'
        },
        {
            field: "phoneNumber",
            title: "Phone Number",
            placeholder: "e.g. 09391232234",
            value: form.phoneNumber,
            type: 'tel'
        },
    ]

    const cityAndSalary: formFormatTypes[] = [
        {
            field: "currentCity",
            title: "Current City",
            placeholder: "City",
            value: form.currentCity,
            type: 'text'
        },
        {
            field: "expectedSalary",
            title: "Salary",
            placeholder: "e.g. 27000",
            value: form.expectedSalary,
            type: 'number'
        },
    ]

    const filesFields: FilesFieldFormat[] = [
        {
            field: "coverLetter",
            title: "Cover Letter",
            placeholder: "Upload PDF",
            value: uploadedCoverLetter.name,
        },
        {
            field: "resume",
            title: "Resume",
            placeholder: "Upload PDF",
            value: uploadedResume.name,
        },
    ]

    const jobTitleAndCompany: formFormatTypes[] = [
        {
            field: "jobTitle",
            title: "Job Title",
            placeholder: "e.g. Junior Developer",
            value: form.jobTitle,
            type: 'text'
        },
        {
            field: "company",
            title: "Company",
            placeholder: "e.g. Accenture",
            value: form.company,
            type: 'text'
        },
    ]

    const genderData:DropDownDataType[] = [
        {label: "Female", value: "Female"},
        {label: "Male", value: "Male"},
    ]


    const handleUpdateForm = (
        field: keyof JobApplicationFormTypes, //TO MAKE IT DYNAMIC
        value: FormValue
    ) => {
        
        // VALIDATE PHONE NUMBER
        if(field === "phoneNumber") {
            const isValueValid = validatePhoneNumber(value);
            // IF ITS NOT VALID EXIT THE FUNCTION TO PREVENT THE FORM STATE FROM UPDATING
            if(!isValueValid) return; //EXIT
        }

        //VALIDATE EMAIL
        if(field === "email") {
            const isValueValid = validateEmail(value);
            if(!isValueValid) {
                //IF FORM NOT VALID SET THE STATE TO FALSE AND SHOW THE MODAL WITH PROPER TITLE AND MESSAGE
                setIsFormValid(false)
                setModalDetails((prev) => ({
                    ...prev,
                    title: "Invalid Email Address",
                    message: "The email address entered is not in a valid format. Please provide a properly formatted email.",
                }))
            } else {
                //RESET THE STATES IF FORM IS VALID
                setIsFormValid(true);
                setModalDetails({
                    title: "",
                    message: "",
                    showModal: false
                })
            }
        }

        setForm((prev) => ({
            ...prev,//SPREAD THE PREVIOUS VALUES TO RETAIN THE UNCHANGE VARIABLES
            [field]: value //FIELD IS THE KEY OF JOB APPLICATION
        }))
    }

    const handleUploadFile = async (fileType: 'resume' | 'coverLetter', file: File) => {
        //CHECK IF THE UPLOADED FILE IS COVERLETTER
        if(fileType === "coverLetter") {
            console.log("cover: ", JSON.stringify(file, null, 2));
            //UPDATE THE NAME OF THE STATE
            setUploadedCoverLetter({
                name: file.name,
                file: file
            })
            return;
        }

        //IF THE FILE IS RESUME
        const fileURL = URL.createObjectURL(file);//GENERATE A TEMPORARY URL TO POINT THE UPLOADED FILE 
        //EXTRACT THE RESUME AS TEXT FOR PROMPTING TO GEMINI IN BACKEND
        const resumeText = await extractTextFromPdf(fileURL) //PASS THE URL TO EXTRACT THE TEXT FROM THE PDF
        
        //CHECK IF THE TEXT IS SUCCESSFULLY EXTRACTED
        if(resumeText) {
            //ONLY UPDATE THE FORM STATE IF ITS SUCCESSFULLY EXTRACTED THE TEXTS
            setForm((prev) => ({
                ...prev, //SPREAD THE PREVIOUS VALUES TO RETAIN THE UNCHANGE VARIABLES
                resumeString: resumeText
            }))
            console.log("file: ", file)
            setUploadedResume({
                name: file.name,
                file: file
            })
       
        }
        
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        //CHECK IF FORM IS INVALID
        if(!isFormValid) {
            //IF INVALID SHOW DETAILS
            console.log("Form Not Valid")
            setModalDetails((prev) => ({
                ...prev,
                showModal: true
            }))
            return 
        }
        console.log("uploaded resume", JSON.stringify(uploadedResume, null, 2))

        //CHECK IF THE THE RESUME IS UPLOADED
        if(!uploadedResume.file || Object.keys(uploadedResume.file).length === 0) {
            //IF MISSING SHOW MODAL AND EXIT THE FUNCTION
            setModalDetails({
                title: "Oops! Resume Missing",
                message: "Please upload your resume to proceed with the application.",
                showModal: true
            });
            return;
        }
        console.log("uploaded resume", JSON.stringify(uploadedResume, null, 2))
       try {
         //SET LOADING TO TRUE FOR BETTER UI EXPERIENCE
         setLoading(true);

         //PREPARE FORM DATA
         const formData: FormDataTypes = {
             resume: uploadedResume.file,
             coverLetter: uploadedCoverLetter.file,
             data: JSON.stringify(form)
         }
 
         await submitApplicationForm(formData);
         console.log("Form Submitted");
         console.log("form: ", JSON.stringify(form, null, 2));

       } catch (error) {
            console.log("Error Submitting Form", error);
       } finally {
        setLoading(false)
       }
    }

    //INITIALIZED CONSTANT REQUIRED VARIABLE FOR EASY CHANGES
    const required = true;

    if(loading) {
        return (
            <div className="feedContentContainer">
                <Loader/>
            </div>
        )
    }

    return (
        <div className="feedContentContainer">
            <h3><strong>Personal Information</strong></h3>

            <form onSubmit={handleSubmit}>
                   {/* GIVEN NAME AND LAST NAME FIELDS */}
            <div className="form-row">
                {givenNameANdLastName.map((item, index) => {
                    const {field, title, placeholder, value, type} = item;
                    return (
                        <Input 
                        key={index}
                        onChange={(text) => handleUpdateForm(field, text)} 
                        value={value}
                        placeholder={placeholder}
                        label={title}
                        required={required}
                        type={type}
                        />
                    )
                })}
            </div>
            

            {/* BIRHTDAY AND GENDER FIELD */}
            <div className="form-row">
                <div className="inputWithLabelContainer">
                    <p className="secondary-text"><strong>Gender</strong></p>
                    <DropDown
                        data={genderData}
                        placeHolder="Gender"
                        onChange={(text) => handleUpdateForm("gender", text)}
                    />
                </div>
                <div className="inputWithLabelContainer">
                    <p className="secondary-text"><strong>Gender</strong></p>
                    <BirthdayField
                    onChange={(date) => handleUpdateForm("birthday", date)}
                    value={form.birthday}
                    required={required}
                    />
                </div>
            </div>
            
              {/* EMAIL AND PHONE NUMBER FIELDS */}
              <div className="form-row">
                {contactDetails.map((item, index) => {
                    const {field, title, placeholder, value, type} = item;
                    return (
                        <Input 
                        key={index}
                        onChange={(text) => handleUpdateForm(field, text)} 
                        value={value}
                        placeholder={placeholder}
                        label={title}
                        required={required}
                        type={type}
                        />
                    )
                })}
                </div>

                {/* CITY AND SALARY */}
              <div className="form-row">
                {cityAndSalary.map((item, index) => {
                    const {field, title, placeholder, value, type} = item;
                    if(field === "currentCity") {
                        return (
                            <div className="inputWithLabelContainer">
                                <p className="secondary-text"><strong>{title}</strong></p>
                                <DropDown
                                    search
                                    data={getCityData()}
                                    placeHolder={placeholder}
                                    onChange={(text) => handleUpdateForm(field, text)}
                                    value={form.currentCity}
                                />
                            </div>
                        )
                        
                    } else {
                        // Salary
                        return (
                            <Input 
                            key={index}
                            onChange={(text) => handleUpdateForm(field, text)} 
                            value={value}
                            placeholder={placeholder}
                            label={title}
                            required={required}
                            type={type}
                            />
                        )
                    }
                  
                })}
                </div>

                {/* COVER LETTER AND RESUME FIELDS */}
                <div className="form-row">
                    {filesFields.map((item, index) => {
                        const {field, title, placeholder, value} = item;
                        return (
                           <div key={index} className="inputWithLabelContainer">
                            <p className="secondary-text"><strong>{title}</strong></p>
                             <FileHandler
                                key={index}
                                onChange={(file) =>{handleUploadFile(field, file)}} 
                                value={value}
                                placeholder={placeholder}
                                type="upload"
                                />
                           </div>
                        )
                    })}
                </div>

                <div className="flex justify-center mt-4">
                    <CheckBoxContainer
                    label="Willing to work on-site"
                    value={form.workOnsite}
                    onClick={(bool) => handleUpdateForm("workOnsite", bool)}
                    />
                </div>

                {/* LATEST JOB EXPERIENCE */}
                <h3><strong>Latest Job Experience</strong></h3>
                
                {/* JOB TITLE AND COMPANY */}
                <div className="form-row">
                {jobTitleAndCompany.map((item, index) => {
                    const {field, title, placeholder, value, type} = item;
                    return (
                        <Input 
                        key={index}
                        onChange={(text) => handleUpdateForm(field, text)} 
                        value={value}
                        placeholder={placeholder}
                        label={title}
                        required={required}
                        type={type}
                        />
                    )
                })}
                </div>

                <div className="flex justify-center my-4">
                    <button 
                    type="submit" 
                    className={`primary ${isFormValid ? "" : "opacity-70"}`}>
                            Submit
                    </button>
                </div>

            </form>
            
            {/* Modal */}
            <CustomModal
            visible={modalDetails.showModal}
            title={modalDetails.title}
            message={modalDetails.message}
            onClose={() => setModalDetails((prev) => ({
                ...prev,
                showModal: false
            }))}
            />
    
        </div>
    )
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
            <Form/>
        </div>
    )
}