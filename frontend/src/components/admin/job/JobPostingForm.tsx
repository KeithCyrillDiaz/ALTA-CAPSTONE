import React, { KeyboardEvent, useEffect, useState } from "react";
import { Input } from "../../Input";
import { JobDataTypes, JobDescription } from "../../client/JobFeed";
import { useDispatch } from "react-redux";
import { setAdminJobData, updateAdminJobDescription, updateEditableForm, updateEducationOrSkillArray } from "../../../redux/slice/admin/jobSlice";
import Loader from "../../Loader";
import { DropDown, DropDownDataType } from "../../DropDown";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { CheckBoxContainer } from "../../CheckBox";
import { fetchAdminJobData } from "../../../api/apiCalls/admin/job";
import { TrashIcon } from "../../icons/TrashIcon";
 
interface JobPostingProps {
    data: JobDataTypes,
    onEdit?: boolean;
}

export const JobPostingForm: React.FC<JobPostingProps> = ({
    data
}) => {
    
    const dispatch = useDispatch();
    const skillsArray = useSelector((state: RootState) => state.adminJob.skillsArray);
    const educationArray = useSelector((state: RootState) => state.adminJob.educationArray);
    const jobData = useSelector((state: RootState) => state.adminJob.JobData);
    const [loading, setLoading] = useState<boolean>(false);

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

    type BulletStringArrayType = {index: number, value:string}
    const [bulletString, setBulletString] = useState<BulletStringArrayType[]>([]);



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

    const handleUpdateArray = (e: KeyboardEvent<HTMLInputElement>, field: AllowedFields, value: string) => {
        if (e.key === "Enter") {
            dispatch(updateEducationOrSkillArray({field, value}));
        }
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

    const handleUpdateJobDescritonBulletData = (e: KeyboardEvent<HTMLInputElement>, index: number, prev: JobDescription, field: "bulletData") => {
        if (e.key === "Enter") {

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
            console.log(e.key)
    
            dispatch(updateAdminJobDescription({prev, field, value}));
        }
    }

   if(loading) {
    return <div className="feedContentContainer">
            <Loader/>
        </div>
   }
    
   return(
    <div className="feedContentContainer">
        {/* TITLE AND AVAILABLE SLOTS */}
        <div className="flex items-center gap-2">
            <Input
            label="Title"
            onChange={(text) => handleUpdateForm("jobTitle", text)}
            value={data.jobTitle}
            type="text"
            placeholder="e.g. Software Engineer"
            maxLength={40}
            />
            <Input
            label="Available Slots"
            onChange={(text) => handleUpdateForm("slot", text)}
            value={data.slot}
            type="number"
            placeholder="e.g. 2"
            />
        </div>

        {/* SKILLS AND EDUCATION */}
        <div className="flex gap-2 min-h-[90px]">
            {/* SKILLS */}
            <div className="w-full">
                <div className="flex justify-between gap-2">
                        <button 
                        onClick={() => handleUpdateOnOthersField("skills", !onOthersField.skills)} 
                        className="primary">
                           {onOthersField.skills ? "Back to List": "Others"}
                        </button>   
                </div>
                {onOthersField.skills? (
                // THIS WILL ALLOW THE USER TO ADD OTHER SKILLS
                <Input
                    label="Skills"
                    onChange={(text) => handleUpdateForm("skills", text)}
                    value={dropDownValues.skills}
                    type="text"
                    placeholder="e.g. React"
                    onKeyDown={(e) => handleUpdateArray(e, "skills", dropDownValues.skills)}
                />
            ) : (
                <div className="flex gap-2 items-end">
                    <div className="inputContainer relative">
                        <p className="secondary-text"><strong>Skills</strong></p>
                        <DropDown 
                            data={skillsArray}
                            onChange={(value) => handleUpdateForm("skills", value)}
                            placeHolder="Select Skill"
                        />
                    </div>
                   <div>
                   {!onOthersField.skills && (
                        <button 
                        onClick={() => handleUpdateArrayAddButton("skills")} 
                        className="positive">
                            +
                        </button>
                    )}
                   </div>
                </div>
               
            )}
            </div>
            {/* EDUCATION */}
            <div className="w-full">
                <div className="flex justify-end ">
                        <button 
                        onClick={() => handleUpdateOnOthersField("education", !onOthersField.education)} 
                        className="primary">
                           {onOthersField.education ? "Back to List": "Others"}
                        </button>
                </div>
                {onOthersField.education ? (
                    // THIS WILL ALLOW THE USER TO ADD OTHER EDUCATIONS
                    <Input
                        label="Education"
                        onChange={(text) => handleUpdateForm("education", text)}
                        value={dropDownValues.education}
                        type="text"
                        placeholder="e.g. Bachelor's"
                        onKeyDown={(e) => handleUpdateArray(e, "education", dropDownValues.education)}
                    />
                ) : (
                    <div className="flex gap-2 items-end">
                        <div className="inputContainer">
                            <p className="secondary-text"><strong>Education</strong></p>
                            <DropDown 
                                data={educationArray}
                                onChange={(value) => handleUpdateForm("education", value)}
                                placeHolder="Select Education"
                            />
                        </div>
                        <div>
                            {!onOthersField.education && (
                                <button 
                                onClick={() => handleUpdateArrayAddButton("education")} 
                                className="positive">
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
                        placeHolder="Select Salary Type"
                    />
            </div>

            {/* EMPLOYMENT TYPE */}
            <div className="inputContainer">
                <p className="secondary-text"><strong>Employment Type</strong></p>
                    <DropDown 
                        data={employmentTypeData}
                        onChange={(value) => handleUpdateForm("employmentType", value)}
                        placeHolder="Select Employment Type"
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
                        placeHolder="Select Salary Type"
                    />
            </div>

            {/* SHIFT */}
            <div className="inputContainer">
                <p className="secondary-text"><strong>Shift</strong></p>
                    <DropDown 
                        data={shiftTypeData}
                        onChange={(value) => handleUpdateForm("shift", value)}
                        placeHolder="Select Employment Type"
                    />
            </div>
        </div>


        {/* JOB DESCRIPTION */}
        <div className="w-full relative mt-2 flex flex-col gap-2">
           <div className="flex justify-between items-center w-full">
                <p className="secondary-text"><strong>Job Description</strong></p> 
                <button className="primary">+ Add Field</button>
           </div>
           {data.jobDescription.length > 0 && (
            <>
                {data.jobDescription.map((item: JobDescription, index) => {
                const {isBullet, paragraph, title} =  item;
                    return (
                        <div key={index} className="flex flex-col gap-2">
                            <div className="flex justify-between items-center w-full">
                                <button className="negative items-center flex gap-2"><TrashIcon/> Remove</button>
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
                                        />
                                    </div>
                                    <div className="bg-white shadow my-2 p-2 flex items-center gap-2">
                                        <input
                                            className="text-[14px] w-full"
                                            placeholder="e.g. Develop and execute test plans, test cases, and scripts for software validation."
                                            onChange={(e) => handleUpdateBulletStringArray(index, e.target.value)}
                                            onKeyDown={(e) => handleUpdateJobDescritonBulletData(e, index, item, "bulletData")}
                                        />
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
                                        />
                                    </div>
                                    <div className="bg-white shadow my-2 p-2 flex items-center gap-2">
                                        <textarea
                                            value={paragraph}
                                            className="text-[14px] w-full h-[100px]"
                                            placeholder="e.g. As a Full Stack Software Engineer, you will be responsible for designing, developing, and maintaining both front-end and back-end components of our web and mobile applications. You will collaborate with cross-functional teams to deliver high-quality and scalable solutions."
                                            onChange={(e) => handleUpdateJobDescription(item, "paragraph", e.target.value)}
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
    </div>
)
 

}