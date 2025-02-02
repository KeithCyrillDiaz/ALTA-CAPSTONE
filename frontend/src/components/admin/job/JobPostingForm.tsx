import React, { FormEvent, useEffect, useState } from "react";
import { Input } from "../../Input";
import { JobDataTypes, JobDescription } from "../../client/JobFeed";
import { useDispatch } from "react-redux";
import { addAdminJobdescription, removeAdminJobDescriptionField, setAdminJobData, setEditableForm, updateAdminJobDescription, updateEditableForm, updateEducationOrSkillArray } from "../../../redux/slice/admin/jobSlice";
import Loader from "../../Loader";
import { DropDown, DropDownDataType } from "../../DropDown";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { CheckBoxContainer } from "../../CheckBox";
import { deleteJobPostById, fetchAdminJobData, saveNewJobForm, updateJobDescriptionDetails } from "../../../api/apiCalls/admin/job";
import { TrashIcon } from "../../icons/TrashIcon";
import { CustomModal } from "../../modal/CustomModal";
import { useNavigate } from "react-router-dom";
 
interface JobPostingProps {
    data: JobDataTypes,
    newJobPost?: boolean //THIS IS NEEDED FOR ADDING A NEW JOB POST. SET THIS TO ON TO SAVE THE JOB POSTING AS NEW
}
interface ConfirmationModalProps {
    navigate?: string | null
    type?: "confirmation" | null
    title: string;
    message: string;
    showModal: boolean;
    showDeletionModal?: boolean;
}


export const JobPostingForm: React.FC<JobPostingProps> = ({
    data,
    newJobPost = false
}) => {
    
    const dispatch = useDispatch();
    const skillsArray = useSelector((state: RootState) => state.adminJob.skillsArray);
    const educationArray = useSelector((state: RootState) => state.adminJob.educationArray);
    const jobData = useSelector((state: RootState) => state.adminJob.JobData);
    const navigate = useNavigate();

    type BulletStringArrayType = {index: number, value:string}
    const [bulletString, setBulletString] = useState<BulletStringArrayType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState<ConfirmationModalProps>({
        type: null,
        title: "",
        message: "",
        showModal: false,
        showDeletionModal: false,
        navigate: null
    });

    const salaryTypeData: DropDownDataType[] = [
        { value: "Hourly", label: "Hourly" },
        { value: "Daily", label: "Daily" },
        { value: "Weekly", label: "Weekly" },
        { value: "Bi-Weekly", label: "Bi-Weekly" },
        { value: "Monthly", label: "Monthly" },
        { value: "Quarterly", label: "Quarterly" },
        { value: "Annually", label: "Annually" },
        { value: "Per Project", label: "Per Project" },
        { value: "Commission-Based", label: "Commission-Based" }
    ];

    const employmentTypeData: DropDownDataType[] = [
        { value: "Full Time", label: "Full Time" },
        { value: "Part Time", label: "Part Time" },
        { value: "Contract", label: "Contract" },
        { value: "Freelance", label: "Freelance" },
        { value: "Internship", label: "Internship" },
        { value: "Temporary", label: "Temporary" },
        { value: "Seasonal", label: "Seasonal" },
        { value: "Hourly", label: "Hourly" },
        { value: "Commission", label: "Commission" },
        { value: "Volunteer", label: "Volunteer" },
        { value: "Remote", label: "Remote" }
    ];


    const scheduleTypeData: DropDownDataType[] = [
        { value: "Monday-Friday", label: "Monday-Friday" },
        { value: "Weekends", label: "Weekends" },
    ]


    const shiftTypeData: DropDownDataType[] = [
        { value: "Day Shift", label: "Day Shift" },
        { value: "Night Shift", label: "Night Shift" },
        { value: "Mid Shift", label: "Mid Shift" },
        { value: "Graveyard Shift", label: "Graveyard Shift" },
        { value: "Rotating Shift", label: "Rotating Shift" },
        { value: "Fixed Shift", label: "Fixed Shift" },
    ];

    const handleUpdateForm = (field: keyof JobDataTypes, value: unknown | JobDescription) => {
        console.log("value: ", value)
        if(field === "education" || field === "skills") {
            setDropDownValues((prev) => ({
                ...prev,
                [field]: value
            }));
            return;
        }

        dispatch(updateEditableForm({field, value}));
    }

    // THIS WILL RUN IF THE USER REFRESH THE PAGE SINCE REDUX WILL RESET IF THE PAGE IS FULLY RELOADED
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await fetchAdminJobData();
            dispatch(setAdminJobData(data))
            setLoading(false)
        }

        if(jobData.length === 0) {
            fetchData();
        }
    },[jobData, dispatch])

    const [onOthersField, setOnOthersField] = useState<{education: boolean, skills: boolean}>({
        skills: false,
        education: false
    }) 

    const [dropDownValues, setDropDownValues] = useState<{education: string, skills: string}>({
        education: "",
        skills: ""
    })

    type AllowedFields = "education" | "skills";

    const handleUpdateArray = (field: AllowedFields, value: string) => {
            dispatch(updateEducationOrSkillArray({field, value}));
    }

    const handleUpdateArrayAddButton = (field: AllowedFields) => {
        if(dropDownValues[field] === "") return //PREVENTS ADDING AN EMPTY STRING
        dispatch(updateEducationOrSkillArray({field, value: dropDownValues[field]}));
    }

    const handleUpdateOnOthersField = (field: AllowedFields, value: boolean) => {
        setOnOthersField((prev) => ({
            ...prev,
            [field]: value
        }))
    }
    

    // JOB DESCRIPTION FUNCTIONS

    const handleUpdateBulletStringArray = (index: number, value: string) => {
        if(bulletString.length === 0) {
            setBulletString([{index, value}])
            return;
        }
        const bulletStringData = bulletString.find((item) => item.index === index);
        if(!bulletStringData) {
            setBulletString((prev) => ([
                ...prev,
                {index, value}
            ]))
        } else {
            setBulletString((prev) => 
                prev.map((item) =>
                    item.index === index ? { ...item, value } : item
                )
            );
        }
    }

    const handleUpdateJobDescription = (prev: JobDescription, field: keyof JobDescription, value: string | boolean) => {
        dispatch(updateAdminJobDescription({prev, field, value}));
    }

    const handleUpdateJobDescritonBulletData = (index: number, prev: JobDescription, field: "bulletData") => {
        if(bulletString.length === 0) {
            return; //EARLY EXIT IF BULLET STRING IS UNDEFINED  
        }
        const bulletStringData = bulletString.find((item) => item.index === index);

        if(!bulletStringData) {
            console.log("Bullet String Not Found"); //DEBUGGING
            return;
        }

        const {value} = bulletStringData;

        if(value === "") return; //DO NOTHING IF BULLET STRING IS EMPTY
        dispatch(updateAdminJobDescription({prev, field, value}));
    }

    const handleAddNewField = () => {
        const newField: JobDescription = {
            dummyId: `${Date.now()}`,
            title: "",
            isBullet: false,
            bulletData: [],
            paragraph: ""
        }
        console.log("new field:", JSON.stringify(newField, null, 2));
        dispatch(addAdminJobdescription(newField));
        
        //TO APPLY AUTO SCROLL
        setTimeout(() => {
            const element = document.getElementById(newField.dummyId as string);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100); // DELAY TO ENSURE RENDEREING 
    }

    const handleRemoveField = (id: string | undefined) => {
        if(!id) {
            console.log("id is undefined");
            return;
        }
        dispatch(removeAdminJobDescriptionField({id}));
    }
    const submitConfirmation = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(newJobPost == false) {
            // SHOW THE CONFIRM UPDATE MODAL 
            setShowConfirmationModal({
                type: "confirmation",
                title: "Confirm Update",
                message: "Are you sure you want to update the job details?",
                showModal: true
            });
        } else {
            // SHOW THE CONFIRM UPDATE MODAL SINCE THE FORM IS NEW
            setShowConfirmationModal({
                type: "confirmation",
                title: "Confirm Submission",
                message: "Are you sure you want to proceed with submitting this new job post?",
                showModal: true
            });
        }
    }
    const handleSubmitForm = async () => {
        // THIS WILL ONLY TRIGGER IF THE BUTTON TYPE IS SUBMIT
        console.log("", JSON.stringify(data, null, 2));
       if(newJobPost === false) {
        setLoading(true) 
        const responseData = await updateJobDescriptionDetails(data);
        if(responseData) dispatch(setEditableForm(responseData));
        setLoading(false)
        setShowConfirmationModal({
            type: null,
            title: "Update Successful",
            message: "The job details have been successfully updated.",
            showModal: true
        });
       } else {
        setLoading(true) 
        await saveNewJobForm(data);
        setLoading(false)
        setShowConfirmationModal({
            title: "Job Post Created",
            message: "The new job listing has been successfully created and is now live.",
            showModal: true,
            navigate: "/admin/jobs"
        });
       }
    }

    const deleteConfirmation = () => {
        setShowConfirmationModal({
            type: "confirmation",
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this job post?",
            showModal: false,
            showDeletionModal: true
        });
    }

    const handleDeleteJob = async () => {
        setLoading(true);
        await deleteJobPostById(data._id);
        setLoading(false);
        setShowConfirmationModal({
            title: "Job Post Deleted",
            message: "The job post has been successfully removed.",
            showModal: true,
            navigate: "/admin/jobs"
        });

    }

   if(loading) {
    return <div className="feedContentContainer">
            <Loader/>
        </div>
   }
    
   return(
    <div className="feedContentContainer">
        <form onSubmit={submitConfirmation} className="flex flex-col gap-2">
            {/* TITLE AND AVAILABLE SLOTS */}
            <div className="flex items-center gap-2">
                <Input
                label="Title"
                onChange={(text) => handleUpdateForm("jobTitle", text)}
                value={data.jobTitle}
                type="text"
                placeholder="e.g. Software Engineer"
                maxLength={40}
                required
                />
                <Input
                label="Available Slots"
                onChange={(text) => handleUpdateForm("slot", text)}
                value={data.slot}
                type="number"
                placeholder="e.g. 2"
                required
                />
            </div>

            {/* SKILLS AND EDUCATION */}
            <div className="flex gap-2 min-h-[90px]">
                {/* SKILLS */}
                <div className="w-full">
                    <div className="flex justify-end gap-2">
                            <button 
                            type="button"
                            onClick={() => handleUpdateOnOthersField("skills", !onOthersField.skills)} 
                            className="primary">
                            {onOthersField.skills ? "Back to List": "Others"}
                            </button>   
                    </div>
                    {onOthersField.skills? (
                    // THIS WILL ALLOW THE USER TO ADD OTHER SKILLS
                    <div className="flex w-full gap-2 items-end">
                        <Input
                        label="Skills"
                        onChange={(text) => handleUpdateForm("skills", text)}
                        value={dropDownValues.skills}
                        type="text"
                        placeholder="e.g. React"
                        />
                        
                        <button 
                        type="button"
                        onClick={() => handleUpdateArray("skills", dropDownValues.skills)} 
                        className="positive h-[30px] flex items-center justify-center">
                            +
                        </button>
                        
                    </div>
                ) : (
                    <div className="flex gap-2 items-end">
                        <div className="inputContainer relative">
                            <p className="secondary-text"><strong>Skills</strong></p>
                            <DropDown 
                                data={skillsArray}
                                onChange={(value) => handleUpdateForm("skills", value)}
                                placeHolder="Skill"
                            />
                        </div>
               
                    {!onOthersField.skills && (
                             <div>
                                <button 
                                type="button"
                                onClick={() => handleUpdateArrayAddButton("skills")} 
                                className="positive h-[30px] flex items-center justify-center">
                                    +
                                </button>
                            </div>
                        )}
                   
                    </div>
                
                )}
                </div>
                {/* EDUCATION */}
                <div className="w-full">
                    <div className="flex justify-end ">
                            <button 
                            type="button"
                            onClick={() => handleUpdateOnOthersField("education", !onOthersField.education)} 
                            className="primary">
                            {onOthersField.education ? "Back to List": "Others"}
                            </button>
                    </div>
                    {onOthersField.education ? (
                        // THIS WILL ALLOW THE USER TO ADD OTHER EDUCATIONS
                        <div className="flex w-full gap-2 items-end">
                            <Input
                            label="Education"
                            onChange={(text) => handleUpdateForm("education", text)}
                            value={dropDownValues.education}
                            type="text"
                            placeholder="e.g. Bachelor's"
                            />
                            <button 
                            type="button"
                            onClick={() => handleUpdateArray("education", dropDownValues.education)} 
                            className="positive h-[30px] flex items-center justify-center">
                                +
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2 items-end">
                            <div className="inputContainer">
                                <p className="secondary-text"><strong>Education</strong></p>
                                <DropDown 
                                    data={educationArray}
                                    onChange={(value) => handleUpdateForm("education", value)}
                                    placeHolder="Education"
                                />
                            </div>
                            <div>
                                {!onOthersField.education && (
                                    <button 
                                    type="button"
                                    onClick={() => handleUpdateArrayAddButton("education")} 
                                    className="positive h-[30px] flex items-center justify-center">
                                        +
                                    </button>
                                )}
                            </div>
                        </div>
                    
                    )}
                </div>
            </div>

            {/* SALARY */}
            <div className="flex items-center gap-2 relative">
                <p className="secondary-text absolute top-0"><strong>Salary</strong></p> 

                {/* MININIMUM SALARY */}
                    <Input
                    label="Minimum"
                    onChange={(text) => handleUpdateForm("minSalary", text)}
                    value={data.minSalary}
                    type="number"
                    placeholder="e.g. Software Engineer"
                    required
                    />

                {/* MAXIMUM SALARY */}
                <div className="w-full h-[110px]">
                    <div className="flex justify-end">
                        <CheckBoxContainer
                        onClick={(bool) => handleUpdateForm("isSalaryRange", bool)}
                        value={data.isSalaryRange}
                        label="Range"
                        />
                    </div>
                    <Input
                    label="Maximum"
                    onChange={(text) => handleUpdateForm("maxSalary", text)}
                    value={data.maxSalary}
                    type="number"
                    placeholder="e.g. 2"
                    required
                    />
                </div>
            </div>

            {/* SALARY TYPE AND EMPLOYMENT TYPE */}
            <div className="flex items-center gap-2 mt-[-24px]">
                {/* SALARY TYPE */}
                <div className="inputContainer">
                    <p className="secondary-text"><strong>Salary Type</strong></p>
                        <DropDown 
                            data={salaryTypeData}
                            onChange={(value) => handleUpdateForm("salaryType", value)}
                            placeHolder="Salary Type"
                        />
                </div>

                {/* EMPLOYMENT TYPE */}
                <div className="inputContainer">
                    <p className="secondary-text"><strong>Employment Type</strong></p>
                        <DropDown 
                            data={employmentTypeData}
                            onChange={(value) => handleUpdateForm("employmentType", value)}
                            placeHolder="Employment Type"
                        />
                </div>
            </div>
            
            {/* SCHEDULE AND SHIFT */}
            <div className="flex items-center gap-2">
                {/* SCHEDULE */}
                <div className="inputContainer">
                    <p className="secondary-text"><strong>Schedule</strong></p>
                        <DropDown 
                            data={scheduleTypeData}
                            onChange={(value) => handleUpdateForm("schedule", value)}
                            placeHolder="Schedule"
                        />
                </div>

                {/* SHIFT */}
                <div className="inputContainer">
                    <p className="secondary-text"><strong>Shift</strong></p>
                        <DropDown 
                            data={shiftTypeData}
                            onChange={(value) => handleUpdateForm("shift", value)}
                            placeHolder="Shift"
                        />
                </div>
            </div>


            {/* JOB DESCRIPTION */}
            <div className="w-full relative mt-2 flex flex-col gap-2">
            <div className="flex justify-between items-center w-full">
                    <p className="secondary-text"><strong>Job Description</strong></p> 
                    <button onClick={handleAddNewField} type="button" className="primary">+ Add Field</button>
            </div>
            {data.jobDescription.length > 0 && (
                <>
                    {data.jobDescription.map((item: JobDescription, index) => {
                    const {isBullet, paragraph, title, dummyId, _id} =  item;
                        return (
                            <div id={dummyId} key={index} className="flex flex-col gap-2">

                                <div className="flex justify-between items-center w-full">

                                    <button 
                                    type="button" onClick={() => handleRemoveField(dummyId ?? _id)} 
                                    className="negative items-center flex gap-2">
                                        <TrashIcon/> Remove
                                    </button>

                                    <CheckBoxContainer
                                    value={isBullet}
                                    onClick={() => handleUpdateJobDescription(item, "isBullet", !isBullet)}  
                                    label="Bullet Form"
                                    />

                                </div>

                                {isBullet ? (
                                    // THIS CODE WILL RENDER IF IS BULLET DATA IS SET TO TRUE
                                    <div className="flex flex-col">
                                        <div className="bg-white shadow my-2 p-2 flex items-center gap-2">
                                            <p><strong>Title: </strong></p>
                                            <input
                                                className="text-[14px] font-bold"
                                                placeholder="e.g. Position Overview"
                                                value={title}
                                                onChange={(e) => handleUpdateJobDescription(item, "title", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="bg-white shadow my-2 p-2 flex items-center gap-2">
                                            <textarea
                                                className="text-[14px] w-full"
                                                placeholder="e.g. Develop and execute test plans, test cases, and scripts for software validation."
                                                onChange={(e) => handleUpdateBulletStringArray(index, e.target.value)}
                                                required = {item.bulletData.length === 0}
                                            />
                                            <div>
                                                <button
                                                type="button"
                                                onClick={() => handleUpdateJobDescritonBulletData(index, item, "bulletData")}
                                                 className="positive h-[30px] flex items-center justify-center">
                                                    +
                                                </button>
                                            </div>
                                            
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        <div className="bg-white shadow my-2 p-2 flex items-center gap-2">
                                            <p><strong>Title: </strong></p>
                                            <input
                                                className="text-[14px] font-bold"
                                                placeholder="e.g. Position Overview"
                                                value={title}
                                                onChange={(e) => handleUpdateJobDescription(item, "title", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="bg-white shadow my-2 p-2 flex items-center gap-2">
                                            <textarea
                                                value={paragraph}
                                                className="text-[14px] w-full h-[100px]"
                                                placeholder="e.g. As a Full Stack Software Engineer, you will be responsible for designing, developing, and maintaining both front-end and back-end components of our web and mobile applications. You will collaborate with cross-functional teams to deliver high-quality and scalable solutions."
                                                onChange={(e) => handleUpdateJobDescription(item, "paragraph", e.target.value)}
                                                required
                                           />
                                        </div>
                                        
                                    </div>
                                )}
                            </div>
                        
                        )
                    })}
                </>
            )}
            </div>
            <div className="flex justify-center my-4 gap-2">
                <button type="submit" className="primary">Submit</button>
                {newJobPost === false && (<button type="button" onClick={deleteConfirmation} className="negative">Delete Job Post</button>)}
            </div>
        </form>

        <CustomModal
        type={showConfirmationModal.type}
        title={showConfirmationModal.title}
        message={showConfirmationModal.message}
        visible={showConfirmationModal.showModal}
        onClickConfirm={handleSubmitForm}
        onClose={() => {
            setShowConfirmationModal((prev) => ({
                ...prev,
                showModal: false
            }))
            if(showConfirmationModal.navigate) {
                navigate(showConfirmationModal.navigate)
            }
        }}
        />
        <CustomModal
        type={showConfirmationModal.type}
        title={showConfirmationModal.title}
        message={showConfirmationModal.message}
        visible={showConfirmationModal.showDeletionModal || false}
        onClickConfirm={handleDeleteJob}
        onClose={() => {
            setShowConfirmationModal((prev) => ({
                ...prev,
                showDeletionModal: false
            }))
            if(showConfirmationModal.navigate) {
                navigate(showConfirmationModal.navigate)
            }
        }}
        />
    </div>
)
 

}