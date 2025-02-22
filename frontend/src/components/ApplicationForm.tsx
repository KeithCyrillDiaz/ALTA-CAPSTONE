import React, {FormEvent, useEffect, useState} from "react";
import { useNavigate} from "react-router-dom";

import {fetchChosenJob, FormDataTypes, submitApplicationForm } from "../api/apiCalls/client";

import { Input, InputKeyboardTypes } from "./Input";
import { DropDown} from "./DropDown";
import { BirthdayField } from "./BirthdayField";
import { FileHandler } from "./FileHandler";
import { extractTextFromPdf } from "../utils/extractTextFromPdf";
import { CheckBoxContainer } from "./CheckBox";
import { checkForm, validateEmail, validatePhoneNumber } from "../utils/validation";
import { CustomModal } from "./modal/CustomModal";
import { getCityData } from "../constant/json";
import { FormValue, JobApplicationFormTypes } from "./client/JobForm";
import Loader from "./Loader";
import { JobDataTypes } from "./client/JobFeed";
import { RenderJobDescription } from "./RenderJobDescription";
import { useDeviceType, useModal } from "../hooks";
import CloseIcon from "./icons/CloseIcon";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { UserApplicationTypes } from "../pages/admin/Dashboard";
import { updateApplicantStatus } from "../api/apiCalls/admin/applicant";
import { genderData } from "../constant/data";


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
    fileId?: string;
}

interface ModalPropsType {
    title: string; 
    message: string; 
    showModal: boolean;
    showAdminModal?: boolean;
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

interface ApplicationFormProps {
    jobId: string;
    userDetails?: UserApplicationTypes;
    admin?: boolean;
}

  
export type ApplicantStatusTypes = 
    | 'Pending' 
    | 'Rejected' //REJECTING APPLICAITON
    | 'Approved' //APPROVING APPLICAITON
    | 'Interviewed' 
    | 'Failed' //FAILED INTERVIEW
    | 'Employed' //SUCCESSFUL INTERVIEW
    | 'Blocked'

export const ApplicationForm: React.FC<ApplicationFormProps> = ({jobId, userDetails, admin = false}) => {


    const navigate = useNavigate();
    // GET THE CHOSEN JOB IN REDUX
    const chosenJob = useSelector((state: RootState) => state.job.chosenJob);

    const [loading, setLoading] = useState<boolean>(false);
    const [jobData, setJobData] = useState<JobDataTypes | null>(chosenJob);

    // FOR ADMIN
    const [applicantStatus, setApplicantStatus] = useState<ApplicantStatusTypes>(userDetails?.employmentStatus as ApplicantStatusTypes)
    

    // USER DETAILS IS THERE FOR VIEWING THE FORM IN ADMIN "??" MEANS IF USER DETAILS IS NULL THEN IT WILL BE AN EMPTY STRING ("")
    const [form, setForm] = useState<JobApplicationFormTypes>({
        givenName: userDetails?.givenName ?? "",
        lastName: userDetails?.lastName ?? "",
        birthday: userDetails?.birthday ? new Date(userDetails.birthday) : null,
        gender: userDetails?.gender ?? "",
        email: userDetails?.email ?? "",
        phoneNumber: userDetails?.phoneNumber ?? "",
        currentCity: userDetails?.currentCity ?? "",
        expectedSalary: userDetails?.expectedSalary ?? "",
        resumeString: userDetails?.resumeString ?? "",
        jobId: jobId, //ADDED THE ID OF THE CHOSEN JOB FOR FUTURE RETRIEVE
        position: jobData?.jobTitle || "",
        jobTitle: userDetails?.jobTitle ?? "",
        company: userDetails?.company ?? "",
        workOnsite: userDetails?.workOnsite ?? false
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
        showAdminModal: false,
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
            title: "Expected Salary",
            placeholder: "e.g. 27000",
            value: form.expectedSalary,
            type: 'number'
        },
    ]

    const filesFields: FilesFieldFormat[] = [
        {
            field: "coverLetter",
            title: "Cover Letter",
            placeholder: `${admin === false  ? "Upload" : "Download"} PDF`,
            value: uploadedCoverLetter?.name || '',
            fileId: userDetails?.coverLetterGdriveID ?? ""
        },
        {
            field: "resume",
            title: "Resume",
            placeholder:  `${admin === false ? "Upload" : "Download"} PDF`,
            value:  uploadedResume?.name || '',
            fileId: userDetails?.resumeGdriveID ?? ""
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

    // FOR CLIENT
    const handleSubmit = async () => {
        if(admin === true) return; //EARLY EXIT IF ADMIN TO PREVENT ERROR IN BACKEND
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
            // NAIVGATE PAGE ACCORDINGLY '/' FOR CLIENT AND THE OTHER ONE IS FOR ADMIN
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

    // FOR CLIENT
    const handleSubmitConfirmation = (e: FormEvent) => {
        e.preventDefault();
        if(admin === true) return; //EARLY EXIT IF ADMIN TO PREVENT ERROR IN BACKEND
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

    // FOR ADMIN 
    const handleAdminButtonClick = async (value: ApplicantStatusTypes) => {
        const action = value === "Approved" ? "approve" 
        : value ==="Rejected" ? "reject" 
        : value ==="Interviewed" ? 'mark as "Interviewed"' 
        : value ==="Employed" ? 'mark as "employed"'
        : 'mark as "failed"' 
        setApplicantStatus(value);
        setModalDetails({
            title: "Update Application Status Confirmation",
            message: `Are you sure you want to ${action} this applicant? Please note, this action is irreversible.`,
            showModal: false, //HIDE THE CUSTOM MODAL
            showAdminModal: true,
            showLoadingModal: false, 
            type: "confirmation",
        });
    }

    const updateStatus = async () => {
        if(!userDetails?._id) {
            console.log("user Id is Undefined");
            return;
        }

        setLoading(true);
        const data = await updateApplicantStatus(userDetails._id, applicantStatus);
        setForm(data);
        setLoading(false);

        setModalDetails({
            title: "Status Updated Successfully",
            message: `The status of this application has ben updated to "${applicantStatus}"`,
            showModal: false, //HIDE THE CUSTOM MODAL
            showLoadingModal: false, 
            showAdminModal: true,
            // NAIVGATE PAGE ACCORDINGLY '/' FOR CLIENT AND THE OTHER ONE IS FOR ADMIN
            navigate: `reload`
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
            {admin === true && (
                <div className="absolute top-2 right-2">
                    <p className={
                        userDetails?.employmentStatus === "Approved" || userDetails?.employmentStatus === "Employed" ? 'positive' 
                         : userDetails?.employmentStatus === "Rejected" || userDetails?.employmentStatus === "Failed" ?'negative' : 'primary'}>
                        <strong>{userDetails?.employmentStatus === "Pending" ? "" : userDetails?.employmentStatus.toUpperCase()}</strong>
                    </p>
                </div>
            )}

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
                            disabled={admin === true}
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
                            disabled={admin === true}
                            data={genderData}
                            placeHolder="Gender"
                            onChange={(text) => handleUpdateForm("gender", text)}
                            value={form.gender}
                        />
                    </div>
                    <div className="inputWithLabelContainer">
                        <p className="secondary-text"><strong>Birthday</strong></p>
                        <BirthdayField
                        disabled={admin === true}
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
                            disabled={admin === true}
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
                                        disabled={admin === true}
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
                                disabled={admin === true}
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
                        const {field, title, placeholder, value, fileId} = item;
                        return (
                        <div key={index} className="inputWithLabelContainer">
                            <p className="secondary-text"><strong>{title}</strong></p>
                            <FileHandler
                                key={index}
                                onChange={(file) =>{handleUploadFile(field, file)}} 
                                value={value}
                                placeholder={placeholder}
                                fileId={fileId}
                                type= {admin == false ? "upload": "download"}
                                />
                        </div>
                        )   
                    })}
                </div>

                <div className="flex justify-center mt-4">
                    <CheckBoxContainer
                    disabled={admin === true}
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
                            disabled={admin === true}
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
                    
                    {admin === false && (
                        // THIS BUTTON WILL ONLY SHOW IF THE ADMIN PROP IS SET TO FALSE OR NULL
                        <button 
                        type="submit" 
                        className={`primary ${isFormValid ? "" : "opacity-70"}`}>
                                Submit
                        </button>
                    )}
                </div>

            </form>
            {admin === true && userDetails?.employmentStatus !== "Failed" && userDetails?.employmentStatus !== "Employed" && (

                // ONLY SHOW THESE BUTTONS IF ADMIN IS SET TO TRUE AND IF THE STATUS IS EITHER NOT FAILED OR EMPLOYED
                
                 <div className="flex items-center justify-center gap-2 mt-[-24px]">

                    {userDetails?.employmentStatus === "Pending" && (

                        // THESE BUTTONS WILL SHOW IF THE STATUS IS PENDING
                         <>
                            <button 
                                onClick={() => handleAdminButtonClick("Rejected")} 
                                className={`negative`}>
                                        Reject
                            </button>  
                        
                            <button 
                            onClick={() => handleAdminButtonClick("Approved")} 
                            className={`positive`}>
                                    Approved
                            </button>
                        </>

                    )}

                    {userDetails?.employmentStatus === "Interviewed" && (
                         // THIS BUTTON WILL SHOW IF THE STATUS IS INTERVEIWED.
                         <>
                            <button 
                            onClick={() => handleAdminButtonClick("Employed")} 
                            className={`positive`}>
                                    Employed
                            </button>
                            <button 
                            onClick={() => handleAdminButtonClick("Failed")} 
                            className={`negative`}>
                                    Failed
                            </button>
                        </>
                    )}

                    {/*THESE BUTTONS WILL SHOW WHEN STATUS IS APPROVED */}
                    {userDetails?.employmentStatus === "Approved" && (
                       <>
                            <button 
                                onClick={() => handleAdminButtonClick("Rejected")} 
                                className={`negative`}>
                                        Reject
                            </button>  
                    
                            <button
                                onClick={() => handleAdminButtonClick("Interviewed")}
                                className={`primary`}>
                                        Mark as Interviewed
                            </button>
                       </>
                    )}
                </div>
            )}
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
            {/* ADMIN MODAL */}
             <CustomModal
            type={modalDetails.type}
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            onClickConfirm={() => updateStatus()}
            visible={modalDetails.showAdminModal || false}
            title={modalDetails.title}
            message={modalDetails.message}
            onClose={() => {
                //UPDATE THE STATE TO FALSE TO HIDE THE MODAL
                setModalDetails((prev) => ({
                    ...prev,
                    showAdminModal: false
                }))
                //AUTO RELOAD THE PAGE AFTER UPDATE
                if(modalDetails.navigate === "reload") {
                    window.location.reload();
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
