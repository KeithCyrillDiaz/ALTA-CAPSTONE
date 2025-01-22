import React from "react";
import { useDeviceType } from "../../hooks";

interface JobCardDataType {
    _id: string;
    jobTitle: string,
    salaryType: string;
    isSalaryRange: boolean;
    minSalary: number,
    maxSalary: number,
    employmentType: string,
    shift: string,
    skills: string[],
}

interface JobCardProps {
    details: JobCardDataType;
    onClickView: (id: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
    details,
    onClickView,
}) => {
     const {_id, jobTitle, maxSalary, minSalary, shift, employmentType, skills, isSalaryRange, salaryType} = details;

    const salaryTypeLabel = salaryType === 'Monthly' ? "a month" : "per Week";

    const {isTablet} = useDeviceType();

    return(
        <div className="jobCardContainer">
            <p className="secondary-text"><strong>{jobTitle}</strong></p>
            {isSalaryRange ? (
                <p>PHP <strong>{minSalary} - {maxSalary}</strong> {salaryTypeLabel}</p>
            ) : (
                <p>PHP<strong>{minSalary}</strong> a month</p>
            )}
            <p>{employmentType}</p>
            <p>{shift}</p>
            <div className="skillsContainer">
                <p><strong>Skills:</strong></p>
                <div className="skills">
                    {skills.map((label, index) => {
                        if(index < 3) {
                            return (
                                <p key={index} className="mr-2 font-bold">{label}</p>
                                )
                        }
                    })}
                </div>
            </div>
            {/* SHOW THE BUTTONS IN DESKTOP AND TABLET MODE */}
            {isTablet && (
                <div className="buttonsContainer">
                    <button onClick={() => onClickView(_id)} className="secondary">View</button>
                    <button className="primary">Apply</button>
                </div>
            )}
            
        </div>
    )
}