import React, { useEffect, useState } from "react";
import { JobDataTypes, JobDescription } from "./client/JobFeed";
import { SkillsIcon } from "./icons/SkillsIcon";
import EducationIcon from "./icons/EducationIcon";
import { EmploymentTypeIcon, SalaryIcon, SalaryTypeIcon, ScheduleIcon, ShiftIcon } from "./icons/JobDetailsIcons";
import { useDeviceType } from "../hooks";
import { BulletCard } from "./BulletCard";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { findJob } from "../redux/slice/jobSlice";
import { removeItemInEducationOrSkillArray } from "../redux/slice/admin/jobSlice";



const IconWithLabel: React.FC<{ label: string; element: React.ReactNode }> = ({
    label,
    element,
  }) => {
    return (
      <div className="flex gap-2 items-center">
        {element}
        <p>
          <strong>{label}</strong>
        </p>
      </div>
    );
  };

const JobDescriptionCard: React.FC<{data: JobDescription}> = ({data}) => {
    const {title, paragraph, isBullet, bulletData} = data;
    return (
        <>
            {isBullet ? (
                <>
                    <p>
                        <strong>{title}</strong>
                    </p>
                    <div className="ml-4 flex flex-col gap-2">
                        {bulletData.map((item, index) => (
                            <BulletCard key={index} label={item}/>
                        ))}
                    </div>
                   
                </>
            ) : (
                //DISPLAY AS PARAGRAPH IF ITS NOT BULLET
                <>
                    <p>
                        <strong>{title}</strong>
                    </p>
                    <div className="">
                        <p>{paragraph}</p>
                    </div>
                </>
            )}
        </>
    )
}
interface RenderJobDescriptionProps {
    jobDescriptionData: JobDataTypes;
    hideApplyButton?: boolean;
    onEdit?: boolean;
}
 export const RenderJobDescription: React.FC<RenderJobDescriptionProps> = ({
    jobDescriptionData,
    hideApplyButton = false,
    onEdit = false
}) => {
    // CUSTOM HOOK
    const {isMobile} = useDeviceType();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const {_id, jobTitle, jobDescription, skills, education, isSalaryRange, minSalary, maxSalary, salaryType, employmentType, shift, schedule} = jobDescriptionData;
    
    const jobDetailsRenderFormat = [
        {
            label: 'Salary',
            element: <SalaryIcon/>,
            data: isSalaryRange ? `PHP ${minSalary} - ${maxSalary}` : `PHP ${minSalary}`
        },
        {
            label: 'Salary Type',
            element: <SalaryTypeIcon/>,
            data: salaryType
        },
        {
            label: 'Employment Type',
            element: <EmploymentTypeIcon/>,
            data: employmentType
        },
        {
            label: 'Schedule',
            element: <ScheduleIcon/>,
            data: schedule
        },
        {
            label: 'Shift',
            element: <ShiftIcon/>,
            data: shift
        },

    ]

    //MOCK LOADING EFFECT WHENEVER JOB DESCRIPTION DATA CHANGES FOR BETTER UI EXPERIENCE AND TO RESET THE SCROLL BAR
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        },400);
         //THIS WILL GET TRIGGER FIRST
        setLoading(true)
    },[jobDescriptionData]);

    const handleApply = () => {
        dispatch(findJob(_id));
        navigate(`/job/apply/${_id}`)
    }

    const handleRemoveItemOnArray = (field: "education" | "skills", value: string) => {
        dispatch(removeItemInEducationOrSkillArray({field, value}));
    }


    
    if(loading && onEdit === false) {
        return (
            <div className="feedContentContainer">
                 <Loader/>
            </div>
        )
    }
    return(
        <div className="feedContentContainer renderJobDescriptionContainer ">
            <h3><strong>{jobTitle}</strong></h3>

            {/* SKILLS */}
            <IconWithLabel
            label="Skills"
            element={<SkillsIcon/>}
            />
            <div className="bulletContainer">
                {skills.map((skill:string, index: number) => (
                    <BulletCard 
                    key={index} 
                    label={skill} 
                    onEdit={onEdit}
                    onClickDelete={(label: string) => handleRemoveItemOnArray("skills", label)}
                    />
                ))}
            </div>

            {/* EDUCATION */}
            <IconWithLabel
            label="Education"
            element={<EducationIcon/>}
            />
            <div className="bulletContainer">
                {education.map((skill:string, index: number) => (
                    <BulletCard 
                    key={index} 
                    label={skill} 
                    onEdit={onEdit} 
                    onClickDelete={(label: string) => handleRemoveItemOnArray("education", label)}/>
                ))}
            </div>

            {/* JOB DETAILS */}
            <p>
                <strong>Job Details</strong>
            </p>
            {isMobile ? (
                <>
                {jobDetailsRenderFormat.map((item, index) => {
                    const {label, data, element} = item;
                    return (
                        <div key={index} className="flex items-center gap-4">
                            <IconWithLabel
                            label={label}
                            element={element}
                            />
                            <p>{data}</p>
                        </div>
                    )
                })}
                </>
            ) : (
            // IF THE DEVICE IS DESKTOP OR TABLET
                <div className="grid-col-2 ml-4">
                    {jobDetailsRenderFormat.map((item, index) => {
                        const {label, data, element} = item;
                        return (
                        <div key={index}>
                            <IconWithLabel
                                label={label}
                                element={element}
                                />
                            <p className="ml-8">{data}</p>
                        </div>
                        )
                    })}
                </div>
            )}


            {/* JOB DESCRIPTION */}
            <p><strong>Job Description</strong></p>
            <div className="jobDescriptionContainer">
                {jobDescription.map((item, index) => (
                    <JobDescriptionCard key={index} data={item}/>
                ))}
            </div>
            
            {/* DISPLAY BUTTON IF MOBILE AND IF THE HIDE APPLY BUTTON IS NOT SET TO FALSE*/}
            {(isMobile && hideApplyButton !== false) && (
                <div className="flex justify-center">
                    <button onClick={() => handleApply()} className="primary">Apply</button>
                </div>
            )}
            
        </div>
    )
  }