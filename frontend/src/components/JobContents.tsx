import { useState } from "react";
import { JobCard } from "./client/JobCard";
import { BulletIcon } from "./icons/BulletIcon";



interface JobDescription {
    title: string;
    paragraph: string;
    isBullet: boolean;
    bulletData: string[];
  }
  
export interface JobDataTypes {
    _id: string;
    jobTitle: string;
    jobDescription: JobDescription[];
    skills: string[];
    education: string[];
    isSalaryRange: boolean;
    minSalary: number;
    maxSalary: number;
    salaryType: string;
    employmentType: string;
    shift: string;
    schedule: string;
  
    status: string;
    month: string;
    year: number;
    createdAt: Date;
    updatedAt: Date;
  }

  interface SkillCardProps {
    label: string, 
}
  const SkillsCard: React.FC<SkillCardProps> = ({
   
    label,

}) => {

    

    return (
        <div className={`${onEdit ? "highlight" : ""} flex items-center`}>
            {label}
            <div onClick={onClick}>
                <BulletIcon/>
            </div>
            
        </div>
   
    )
  }

  interface RenderJobDescriptionProps {
    jobDescriptionData: JobDataTypes, 
    onEdit: boolean,
    onClick: ()=> void
}
  const RenderJobDescription:React.FC<RenderJobDescriptionProps> = ({
    jobDescriptionData,
    onEdit,
    onClick
}) => {

    const {jobTitle, jobDescription, skills, education, isSalaryRange, minSalary, maxSalary, salaryType, employmentType, shift, schedule, status} = jobDescriptionData;
    return(
        <div>
            <h1>{jobTitle}</h1>
            {skills.map((skill, index) => (
                <SkillsCard key={index} label={skill}/>
            ))}
        </div>
    )
  }
  
  const RenderJobs: React.FC<{data: JobDataTypes[], onClick: (id: string) => void}> = ({
    data,
    onClick
  }) => {
    return (
      <div className='container my-4 flex flex-col gap-4'>
        {data.map((job) => {
     
          return (
                <JobCard onClickView={onClick} key={job._id} details={job}/>
          )
        })}
      </div>
    )
  }

export const JobContents: React.FC<{data: JobDataTypes[], onEdit: boolean}> = ({
    data,
    onEdit
}) => {

    const [chosenJob, setChosenJob] = useState<JobDataTypes>(data[0]);
    const handleChooseJob = (id: string) => {
        const job = data.find((item) => item._id === id);
        if(job) setChosenJob(job);
    }


    return (
        <div className="container">
            <div className="flex items-center justify-between">
                <RenderJobDescription jobDescriptionData={chosenJob}/>
                <RenderJobs data={data as any} onClick={handleChooseJob}/>
            </div>
        </div>
    )
}