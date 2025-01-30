import React, { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { HeroSection } from "../../components/admin/HeroSection";
import { TopDataCard, TopDataTypes } from "../../components/admin/dashboard/TopDataCard";
import { getDateToday, monthArray, MonthStringTypes } from "../../helper/date";
import { fetchTopData } from "../../api/apiCalls/admin";
import { fetchJobPositions } from "../../api/apiCalls/admin/dashboard/dashboard";
import { Loader } from "../../components";
import { DropDownDataType } from "../../components/DropDown";
import { DashboardInitialState} from "../../redux/slice/admin/dashboardSlice";
import { JobDataTypes } from "../../components/client/JobFeed";
import { useNavigate } from "react-router-dom";


export interface UserApplicationTypes {
    _id: string;
    givenName: string;
    lastName: string;
    birthday: string; 
    gender: string; 
    email: string;
    phoneNumber: number; 
    currentCity: string;
    expectedSalary: number; 
    coverLetterGdriveID: string; 
    resumeGdriveID: string;
    resumeString: string; 
    jobId: string | JobDataTypes; // IT HAS TWO TYPES BECAUSE OF POPULATE METHOD OF MONGOOSE
    position: string;
    jobTitle: string; // TITLE OF THE PREVIOUS JOB 
    company: string;
    workOnsite: boolean; 
    employmentStatus: string; 
    resumeAccuracy: number; 
    geminiResponseId: string; 
    month: MonthStringTypes; 
    year: number;
}


const Dashboard: React.FC = () => {

    const navigate = useNavigate();
    const [topApplicantsData, setTopApplicantsData] = useState<TopDataTypes[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [jobPositionData, setJobPositionData] = useState<DropDownDataType[]>();
    const [month, setMonth] = useState<MonthStringTypes>(monthArray[new Date().getMonth() + 1]);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [dropDownValues, setDropDownValues] = useState<DashboardInitialState>({
        chosenJobPosition: "",
    })
    const handleUpdateDropDownValue = useCallback((field: keyof DashboardInitialState, value: string) => {
        setDropDownValues((prev) => ({
            ...prev,
            [field]: value
        }));
    }, [])

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
                // SET THE INITIAL JOB POSITION TO FIRST VALUE OF DATA IN INDEX 0
                handleUpdateDropDownValue("chosenJobPosition", data[0]);
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
    },[handleUpdateDropDownValue]);

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
        // ONLY FETCH DATA IF THE POSITION IS NOT AN EMPTY STRING TO AVOID INFINITE LOOP
        if(dropDownValues.chosenJobPosition !== "") {
            fetchData();
        }

    },[dropDownValues.chosenJobPosition])

    if(loading) {
        return (
            <Loader/>
        )
    }


    return (
        <AdminLayout title="DASHBOARD">
            <div className="flex flex-col justify-center gap-4 relative pb-12">
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
                                        title="Applicants"
                                        month={month} 
                                        year={year}
                                        dropDownData={jobPositionData}
                                        onChangeDropDown={(value) => handleUpdateDropDownValue("chosenJobPosition", value)}
                                        dropDownValue={dropDownValues.chosenJobPosition}
                                        topData={topApplicantsData}
                                        onClickView={(id) => navigate(`/admin/applicant/view/${id}`)}
                                        />
                                    )}
                                </div>
                                <div className="w-[49%]">
                                    {jobPositionData && topApplicantsData && (
                                        <TopDataCard 
                                        title="Clients"
                                        month={month} 
                                        year={year}
                                        dropDownData={[]}
                                        onChangeDropDown={() =>{}}
                                        dropDownValue={""}
                                        topData={[]}
                                        onClickView={() => {}}
                                        />
                                    )}
                                </div>
                                
                            </div>
                    </section>
                    <section className="w-[32%] max-w-[350px] flex flex-col gap-2 items-end">
                        <div className="w-full h-[200px] bg-white shadow">
                            PieGraph
                        </div>
                        {jobPositionData && topApplicantsData && (
                            <TopDataCard 
                            title="Projects"
                            month={month} 
                            year={year}
                            dropDownData={[]}
                            onChangeDropDown={() =>{}}
                            dropDownValue={""}
                            topData={[]}
                            onClickView={() => {}}
                            />
                        )}
                    </section>
                </main>
            </div>
        </AdminLayout>
    )
}


export default Dashboard;