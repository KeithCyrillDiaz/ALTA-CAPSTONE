import React, { ReactNode, useEffect, useState } from "react";
import {fetchTotalCounts } from "../../api/apiCalls/admin";
import Loader from "../Loader";
import { HeroCard } from "./HeroCard";
import { ApplicantIconHero } from "../icons/admin/ApplicantsIcon";
import { JobIconHero } from "../icons/admin/JobIcon";
import { EmployeesIconHero } from "../icons/admin/EmployeesIcon";



export interface TotalDataType {
totalApplicants: {
    value: number,
    increase: number
},
totalJob: {
    value: number,
    increase: number
},
totalEmployees: {
    value: number,
    increase: number
}
}

const titleMap: { [key in keyof TotalDataType]: string } = {
    totalApplicants: "Total Applicants",
    totalJob: "Total Jobs",
    totalEmployees: "Total Employees",
  };

  const iconMap:  { [key in keyof TotalDataType]: ReactNode } ={
    totalApplicants: <ApplicantIconHero/>,
    totalJob: <JobIconHero/>,
    totalEmployees: <EmployeesIconHero/>,
  }


export const HeroSection:React.FC = () => {

    const [data, setData] = useState<TotalDataType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
  
      useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const result = await fetchTotalCounts(); // Pass `prevData` here
            setData(result);
            setLoading(false);
        };
    
        fetchData();
    }, []); 

    if(loading){
       return <div className="absolute w-full top-0 left-0">
         <Loader/>
       </div>
    }
    
    if(data)
    return (    
        <div className="flex items-center justify-center gap-12 w-[100%]">
            {Object.keys(data).map((key, index) => {
                const {value, increase} = data[key as keyof TotalDataType];
                return (
                    <HeroCard
                    key={index}
                    title={titleMap[key as keyof TotalDataType]}
                    value={value}
                    percentageIncrease={increase}
                    icon={iconMap[key as keyof TotalDataType]}
                    />
                )
            })}
        </div>
    )
}