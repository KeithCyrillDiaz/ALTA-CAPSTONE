import { useEffect, useState } from "react";
import { JobCard } from "./client/JobCard";
import { useDispatch } from "react-redux";
import { findJob, setJobs } from "../redux/slice/jobSlice";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchJobs } from "../api/apiCalls";
import Loader from "./Loader";
import { SkillCard } from "./SkillCard";

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



  interface RenderJobDescriptionProps {
    jobDescriptionData: JobDataTypes, 
}
  const RenderJobDescription:React.FC<RenderJobDescriptionProps> = ({
    jobDescriptionData,
}) => {

    const {jobTitle, jobDescription, skills, education, isSalaryRange, minSalary, maxSalary, salaryType, employmentType, shift, schedule, status} = jobDescriptionData;
    return(
        <div>
            <h1>{jobTitle}</h1>
            {skills.map((skill:string, index: number) => (
                <SkillCard key={index} label={skill}/>
            ))}
        </div>
    )
  }
  
  const RenderJobs: React.FC<{data: JobDataTypes[], onClick: (id: string) => void}> = ({
    data,
    onClick
  }) => {
    return (
      <div className='my-4 flex flex-col gap-4'>
        {data.map((job) => {
          return (
                <JobCard onClickView={onClick} key={job._id} details={job}/>
          )
        })}
      </div>
    )
  }

export const JobFeed: React.FC= () => {

  //REDUX
  const dispatch = useDispatch();
  const chosenJob = useSelector((state: RootState) => state.job.chosenJob);
  const jobs = useSelector((state: RootState) => state.job.filteredJob);

  //REACT HOOKS
  const [loading, setLoading] = useState<boolean>(true);

  const handleChooseJob = (id: string) => {
    dispatch(findJob(id));
  }

 useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchJobs();
      if(data)dispatch(setJobs(data));
   
      setLoading(false)
    };
    fetchData();

 },[dispatch])

  if(loading) {
    return <Loader/>
  }

    return (
        <div className="container">
            {jobs ? (
              <>
                {chosenJob && <RenderJobDescription jobDescriptionData={chosenJob}/>}
                <RenderJobs data={jobs} onClick={handleChooseJob}/>
              </>
            ) : (
              <h1>No open job at the Moment</h1>
            )}
        </div>
    )
}