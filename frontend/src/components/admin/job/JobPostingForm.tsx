import React, { KeyboardEvent, useState } from "react";
import { Input } from "../../Input";
import { JobDataTypes, JobDescription } from "../../client/JobFeed";
import { useDispatch } from "react-redux";
import { updateEditableForm, updateEducationOrSkillArray } from "../../../redux/slice/admin/jobSlice";
import Loader from "../../Loader";
import { DropDown } from "../../DropDown";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { CheckBoxContainer } from "../../CheckBox";
 
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

    const handleUpdateOnOthersField = (field: AllowedFields, value: boolean) => {
        setOnOthersField((prev) => ({
            ...prev,
            [field]: value
        }))
    }
    
   if(!data) {
    return <Loader/>
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
        <div className="flex gap-2">
            <div className="w-full min-h-[90px]">
                <div className="flex justify-end">
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
                <div className="inputContainer relative">
                    
                    <p className="secondary-text"><strong>Skills</strong></p>
                    <DropDown 
                        data={skillsArray}
                        onChange={(value) => handleUpdateForm("skills", value)}
                        placeHolder="Select Skill"
                    />
                </div>
            )}
            </div>
            <div className="w-full min-h-[90px]">
                <div className="flex justify-end">
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
                    <div className="inputContainer">
                        <p className="secondary-text"><strong>Education</strong></p>
                        <DropDown 
                            data={educationArray}
                            onChange={(value) => handleUpdateForm("education", value)}
                            placeHolder="Select Education"
                        />
                    </div>
                )}
            </div>
           
        </div>


        {/* SALARY */}
        <div className="flex items-center gap-2 relative">
            <p className="secondary-text absolute top-0"><strong>Salary</strong></p>  
                <Input
                label="Minimum"
                onChange={(text) => handleUpdateForm("minSalary", text)}
                value={data.minSalary}
                type="number"
                placeholder="e.g. Software Engineer"
                />
      
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
    </div>
)
 

}