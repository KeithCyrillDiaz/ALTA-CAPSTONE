import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { HeroSection } from "../../components/admin/HeroSection";
import { TopDataCard, TopDataTypes } from "../../components/admin/dashboard/TopDataCard";
import { getDateToday, monthArray, MonthStringTypes } from "../../helper/date";
import { fetchTopData } from "../../api/apiCalls/admin";
import { fetchJobPositions } from "../../api/apiCalls/admin/dashboard/dashboard";
import { Loader } from "../../components";
import { DropDownDataType } from "../../components/DropDown";



interface DropDownValuesTypes {
    chosenJobPosition: string
  }
interface UserApplicationTypes {
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


const Dashboard: React.FC = () => {

    const [topApplicantsData, setTopApplicantsData] = useState<TopDataTypes[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [jobPositionData, setJobPositionData] = useState<DropDownDataType[]>();
    const [dropDownValues, setDropDownValues] = useState<DropDownValuesTypes>({
        chosenJobPosition: "",
    })
    const [month, setMonth] = useState<MonthStringTypes>(monthArray[new Date().getMonth() + 1]);
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const handleUpdateDropDownValue = (field: keyof DropDownValuesTypes, value: string) => {
        setDropDownValues((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    // FETCH ALL DATA
    useEffect(() => {
        const fetchJobPositionsData = async () => {
            setLoading(true);
            const data = await fetchJobPositions();

            // ONLY UPDATE THE STATE IF DATA IS EXISTING
            if(data){
                // IF DATA EXIST FORMAT IT AND UPDATE THE STATE

                const formatData = data.map((item: string) => ({
                    value: item,
                    label: item
                }))
                setJobPositionData(formatData);
            }
            setLoading(false);
        }

        const getMonthAndYear = () => {
            const {month, year} = getDateToday();
            setMonth(month);
            setYear(year);
        }

        fetchJobPositionsData();
        getMonthAndYear();
      
    },[jobPositionData]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // GET THE MONTH AND YEAR
            const {month, year} = getDateToday();
            const data = await fetchTopData(month, year, dropDownValues.chosenJobPosition);
            const {topClients} = data;
            
            // FORMAT TOP CLIENTS
            const formatTopClients: TopDataTypes[] = topClients.map((item: UserApplicationTypes) => {
                const {givenName, lastName, _id} = item;
                return {
                    fullName: `${givenName} ${lastName}`,
                    _id: _id,
                    data: item
                }
            })
            setTopApplicantsData(formatTopClients);
            setLoading(false);
        }
        fetchData();
    },[dropDownValues.chosenJobPosition])

    if(loading) {
        return (
            <Loader/>
        )
    }


    return (
        <AdminLayout title="DASHBOARD">
            <div className="flex flex-col justify-center gap-4 relative">
                <HeroSection/>
                <main className="flex gap-2">
                    <section className=" w-[68%] max-w-[700px] flex flex-col gap-2">
                            <div className="h-[200px] w-full bg-white shadow">
                                Line Graph
                            </div>
                            {/* TOP APPLICANTS */}
                            <div className="flex justify-between">
                                <div className="w-[49%]">
                                    {jobPositionData && topApplicantsData && (
                                        <TopDataCard 
                                        month={month} 
                                        year={year}
                                        jobPositionData={jobPositionData}
                                        onChangeDropDown={(value) => handleUpdateDropDownValue("chosenJobPosition", value)}
                                        dropDownValue={dropDownValues.chosenJobPosition}
                                        topData={topApplicantsData}
                                        />
                                    )}
                                </div>
                                <div className="w-[49%]">
                                    {jobPositionData && topApplicantsData && (
                                        <TopDataCard 
                                        month={month} 
                                        year={year}
                                        jobPositionData={jobPositionData}
                                        onChangeDropDown={(value) => handleUpdateDropDownValue("chosenJobPosition", value)}
                                        dropDownValue={dropDownValues.chosenJobPosition}
                                        topData={topApplicantsData}
                                        />
                                    )}
                                </div>
                                
                            </div>
                    </section>
                    <section className="w-[32%] max-w-[350px] flex flex-col gap-2">
                        <div className="w-full h-[200px] bg-white shadow">
                            PieGraph
                        </div>
                        {jobPositionData && topApplicantsData && (
                            <TopDataCard 
                            month={month} 
                            year={year}
                            jobPositionData={jobPositionData}
                            onChangeDropDown={(value) => handleUpdateDropDownValue("chosenJobPosition", value)}
                            dropDownValue={dropDownValues.chosenJobPosition}
                            topData={topApplicantsData}
                            />
                        )}
                    </section>
                     {/* TOP DATA CARDS */}
                   
                </main>
            </div>
        </AdminLayout>
    )
}


export default Dashboard;