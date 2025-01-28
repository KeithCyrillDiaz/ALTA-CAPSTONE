import React, {FormEvent, useEffect, useState} from "react";
import { useNavigate} from "react-router-dom";

import {fetchChosenJob, FormDataTypes, submitApplicationForm } from "../api/apiCalls/client";

import { Input, InputKeyboardTypes } from "./Input";
import { DropDown, DropDownDataType } from "./DropDown";
import { BirthdayField } from "./BirthdayField";
import { FileHandler } from "./FileHandler";
import { extractTextFromPdf } from "../utils/extractTextFromPdf";
import { CheckBoxContainer } from "./CheckBox";
import { checkForm, validateEmail, validatePhoneNumber } from "../utils/validation";
import { CustomModal } from "./modal/CustomModal";
import { getCityData } from "../constant/json";
import { FormValue, JobApplicationFormTypes } from "./JobForm";
import Loader from "./Loader";
import { JobDataTypes } from "./client/JobFeed";
import { RenderJobDescription } from "./RenderJobDescription";
import { useDeviceType, useModal } from "../hooks";
import CloseIcon from "./icons/CloseIcon";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


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

interface ModalPropsType {
    title: string; 
    message: string; 
    showModal: boolean;
    type?: 'confirmation' | null,
    showLoadingModal: boolean
    navigate?: string;
}

interface JobDescriptionModalProps {
    data: JobDataTypes; 
    visible: boolean, 
    onClose: ()=> void;
}

const JobDescriptionModal: React.FC<JobDescriptionModalProps> = ({data, visible, onClose}) => {

    const {setIsModalOpen} = useModal();

    useEffect(() => {
        setIsModalOpen(!visible);
    },[visible, setIsModalOpen])

    return(
       <>
        {visible && (
             <div className="modalLayoutContainer">
                <div className=" realtive flex flex-col bg-gray-300 max-w-[90%] gap-4  max-h-[70%] relative">
                    <div className="flex overflow-y-scroll">
                        <RenderJobDescription jobDescriptionData={data}/>
                    </div>
                    <div className="absolute right-4 top-4 scale-125" onClick={onClose}>
                        <CloseIcon/>
                    </div>
                </div>
             </div>   
        )}
       </>
    )
}


export const ApplicationForm: React.FC<{jobId: string}> = ({jobId}) => {


    const navigate = useNavigate();
    // GET THE CHOSEN JOB IN REDUX
    const chosenJob = useSelector((state: RootState) => state.job.chosenJob);

    const [loading, setLoading] = useState<boolean>(false);
    const [jobData, setJobData] = useState<JobDataTypes | null>(chosenJob);

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
        jobId: jobId, //ADDED THE ID OF THE CHOSEN JOB FOR FUTURE RETRIEVE
        position: jobData?.jobTitle || "",
        jobTitle: "",
        company: "",
        workOnsite: false
    });

    //INITIALZED FILES OBJECT FOR DISPLAY AND UPLOADING THE FILE IN BACKEND
    const [uploadedCoverLetter, setUploadedCoverLetter] = useState<File | null>();
    const [uploadedResume, setUploadedResume] = useState<File | null>();

    //VALIDATIONS
    const [isFormValid, setIsFormValid] = useState<boolean>(false)
    const [modalDetails, setModalDetails] = useState<ModalPropsType>({
        title: "",
        message: "",
        showModal: false,
        showLoadingModal: false,
        type: null
    })

    //CUSTOM HOOKS
    const {isTablet} = useDeviceType();
    
    // MODAL
    const [showJobDescritionModal, setShowJobDescriptionModal] = useState<boolean>(false)

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
            value: uploadedCoverLetter?.name || '',
        },
        {
            field: "resume",
            title: "Resume",
            placeholder: "Upload PDF",
            value:  uploadedResume?.name || '',
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

    // CONST FETCH JOB DATA
    useEffect(() => {
        const fetchJobData = async () => {
            setLoading(true)
            const data = await fetchChosenJob(jobId);
            if(data)setJobData(data);
            setLoading(false)
        }  

        if(!chosenJob) {
            fetchJobData();
        }
    }, [jobId, setJobData, setLoading, chosenJob])


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
                    showModal: false,
                    showLoadingModal: false,
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
            setUploadedCoverLetter(file)
            return;
        }

        //IF THE FILE IS RESUME
        setUploadedResume(file);
        
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
           
        
        }
        
    }

    const handleSubmit = async () => {
    
       try {
         //CHECK IF THE THE RESUME IS UPLOADED
        if (!uploadedResume || !uploadedResume.name || uploadedResume.size === 0) {
            //IF MISSING SHOW MODAL AND EXIT THE FUNCTION
            
            setModalDetails({
                title: "Oops! Resume Missing",
                message: "Please upload your resume to proceed with the application.",
                showLoadingModal: false,
                showModal: true
            });
            return;
        }

         //SET LOADING TO TRUE AND SHOW THE  LOADING MODAL FOR BETTER UI EXPERIENCE AND PREPARE THE SUCCESSFULL MESSAGE
         setLoading(true);
         //PREPARE FORM DATA
         const formData: FormDataTypes = {
             resume: uploadedResume,
             coverLetter: uploadedCoverLetter || null,
             data: JSON.stringify(form)
         }
 
         await submitApplicationForm(formData);
         console.log("Form Submitted");
         console.log("form: ", JSON.stringify(form, null, 2));

         setModalDetails({
            title: "Submission Confirmation",
            message: "Your application has been successfully submitted! We will review your details and get back to you shortly. Thank you for applying!",
            showModal: true, //HIDE THE CUSTOM MODAL
            showLoadingModal: false, //SHOW THE LOADING MODAL
            navigate: "/"
        });


       } catch (error) {
            console.log("Error Submitting Form", error);

            //IF ERROR PREPARE THE ERROR MESSAGE
            setModalDetails({
                title: "Application Submission Failed",
                message: "We encountered an issue while processing your application. Our team is already working to resolve it. Please try again later.",
                showModal: true, // Show the error modal
                showLoadingModal: false, // Hide the loading modal if error occurs
            });
       } finally {
        setLoading(false);
       }
    }

    const handleSubmitConfirmation = (e: FormEvent) => {
        e.preventDefault();
        // VALIDATE THE FORM FIRST

          //CHECK IF FORM IS INVALID
          if(!isFormValid) {
            //IF INVALID SHOW DETAILS
            console.log("Form Not Valid")
            setModalDetails((prev) => ({
                ...prev,
                showModal: true
            }))
            return ;
        };

        //CHECK IF ALL FIELDS ARE FILLED
        const isComplete = checkForm(form);

        if(!isComplete) {
            // IF NOT SHOW THE MODAL
            setModalDetails({
                title: "Form Incomplete",
                message: "Please make sure all required fields are filled before submitting your application. Double-check your information to ensure everything is correct and complete.",
                showLoadingModal: false,
                showModal: true
            });
            return;//EXIT
        }

        setModalDetails({
            type: "confirmation",
            title: "Confirm Submission",
            message: "Are you sure you want to submit the form? Please review all fields before proceeding.",
            showLoadingModal: false,
            showModal: true
        });
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

    // ONLY RENDER COMPONENTS IF JOB DATA IS NOT NULL
    if(jobData) 
    return (
        <div className="feedContentContainer">
            <h3><strong>Personal Information</strong></h3>


             {/* ONLY SHOW THIS IF ITS NOT TABLET MODE SIZE AND ABOVE*/}
                {!isTablet && (
                    // BUTTON FOR SHOW THE CHOSEN JOB IN MOBILE DEVICE
                    <div className="absolute top-2 right-2">
                        <button className="primary" onClick={() => setShowJobDescriptionModal(!showJobDescritionModal)}>
                            View Job
                        </button>
                    </div>
                )}
            {/* ...... */}

            {/* ADD THE INPUT FIELDS INSIDE THE FORM TAG FOR THE "required" PROP TO WORK*/}
            <form onSubmit={handleSubmitConfirmation}>

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
                                <div key={index} className="inputWithLabelContainer">
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

                <div className="flex justify-center items-center my-4">
                    <button 
                    type="submit" 
                    className={`primary ${isFormValid ? "" : "opacity-70"}`}>
                            Submit
                    </button>
                </div>

            </form>
            
            {/* Modal */}
            <CustomModal
            type={modalDetails.type}
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            onClickConfirm={() => handleSubmit()}
            visible={modalDetails.showModal}
            title={modalDetails.title}
            message={modalDetails.message}
            onClose={() => {
                //UPDATE THE STATE TO FALSE TO HIDE THE MODAL
                setModalDetails((prev) => ({
                    ...prev,
                    showModal: false
                }))
                //AUTO NAVIGATE AFTER CLICKING CLOSE WHEN NAVIGATE IS NOT NULL OR UNDEFINED
                if(modalDetails.navigate) {
                    navigate(modalDetails.navigate)
                    return;
                }
          
            }}
            />

            {/* ONLY SHOW THIS IF ITS NOT TABLET MODE SIZE AND ABOVE */}
            <JobDescriptionModal 
            data={jobData} 
            visible = {showJobDescritionModal && !isTablet}
            onClose={() => setShowJobDescriptionModal(false)}
            />

        </div>
    )
}
