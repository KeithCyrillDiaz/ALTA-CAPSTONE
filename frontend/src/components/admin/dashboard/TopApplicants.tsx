import React, { useEffect, useState } from "react";
import { fetchTopData } from "../../../api/apiCalls/admin";
import { MonthStringTypes } from "../../../helper/date";
import Loader from "../../Loader";

export interface UserApplicationTypes {
    _id: string;
    givenName: string;
    lastName: string;
    birthday: string; // ISO date string
    gender: string; // e.g., "Male", "Female", etc.
    email: string;
    phoneNumber: number; // Assuming this is a numeric value
    currentCity: string;
    expectedSalary: number; // Salary in numeric format
    coverLetterGdriveID: string; // Google Drive ID for the cover letter
    resumeGdriveID: string; // Google Drive ID for the resume
    resumeString: string; // Text extracted from the resume
    jobId: string; // ID of the associated job
    jobTitle: string; // Title of the job
    company: string; // Name of the company
    workOnsite: boolean; // True if onsite work is required
    employmentStatus: string; // e.g., "Pending", "Approved", etc.
    resumeAccuracy: number; // Accuracy percentage (e.g., 87)
    geminiResponseId: string; // ID for the Gemini response
    month: MonthStringTypes; // Month in string format
    year: number; // Year in numeric format
  }

  interface TopApplicantsProps {
    month: MonthStringTypes,
    year: number
  }
export const TopApplicants:React.FC<TopApplicantsProps> = ({
    month, 
    year
}) => {

    const [data, setData] = useState<UserApplicationTypes[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await fetchTopData(month, year);
            const {topClients} = data;
            setData(topClients);
            setLoading(false);
            console.log("topClients: ", topClients);
        }

        fetchData();
    },[month, year]);

    if(loading) {
        return (
            <Loader/>
        )
    }

    if(data)
    return (
        <div>
            <h3>Top 5 Applicants of 2024</h3>
        </div>
    )
}