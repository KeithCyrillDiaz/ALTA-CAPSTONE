import { useEffect, useState } from "react";
import { JobCard } from "./client/JobCard";
import { useDispatch } from "react-redux";
import { findJob, setJobs } from "../redux/slice/jobSlice";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchJobs } from "../api/apiCalls";
import Loader from "./Loader";
import { RenderJobDescription } from "./RenderJobDescription";
import { useDeviceType } from "../hooks";
import { useNavigate } from "react-router-dom";


export interface JobDescription {
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

  interface RenderJobsProps {
    data: JobDataTypes[], 
    onClickView: (id: string) => void;
    onClickApply: (id: string) => void;
  }

  const RenderJobs: React.FC<RenderJobsProps> = ({
    data,
    onClickView,
    onClickApply
  }) => {
    const [loading, setLoading] = useState<boolean>(true);

    //MOCK LOADING WHENEVER IT RERENDERS FOR BETTER USER EXPERIENCE
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        },400)
        setLoading(true);
    },[])

    if(loading) {
      return (
        <div className="renderJobDescriptionContainer">
          <Loader/>
        </div>
      )
    }
    
    return (
      <div className='renderJob'>
        {data.map((job) => {
          return (
                <JobCard onClickApply={onClickApply} onClickView={onClickView} key={job._id} details={job}/>
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
  const navigate = useNavigate();

  //CUSTOME HOOKS
  const {isTablet, isDesktop} = useDeviceType();

  const handleChooseJob = (id: string) => {
    dispatch(findJob(id));
  }

 useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchJobs();
      if(data) {
        dispatch(setJobs(data));
      }
     
      setLoading(false);
    };
    fetchData();

 },[dispatch])

  if(loading) {
    return (
      <div className="container">
        <Loader/>
      </div>
    )
  }

    return (
        <div className="feedContainer">
            {jobs ? (
              <>
                {chosenJob && ( isTablet || isDesktop)  && <RenderJobDescription jobDescriptionData={chosenJob}/>}
                <RenderJobs data={jobs} onClickView={handleChooseJob} onClickApply={() => {navigate('/job/apply')}}/>
              </>
            ) : (
              <h1>No open job at the Moment</h1>
            )}
        </div>
    )
}