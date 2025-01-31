import React, { useEffect, useState } from "react"
import { DropDown, DropDownDataType } from "../DropDown"
import { ModalLayout } from "../../layouts"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { useModal } from "../../hooks"
import { filterApplicants, FilterOptionsTypes } from "../../redux/slice/admin/applicationsSlice"
import { useDispatch } from "react-redux"
import { filterAdminJobData } from "../../redux/slice/admin/jobSlice"

type AdminFilterTypeValues = "Applicants" | "Jobs" | "Employees"

interface AdminFilterProps {
    visible: boolean;
    type: AdminFilterTypeValues;
    onClickCancel: () => void;
}
export const AdminFilter:React.FC<AdminFilterProps> = ({
    visible,
    onClickCancel,
   type
}) => {

    const dispatch = useDispatch();

    //DROP DOWN DATA FOR APPLICANTS TYPE ADMIN FILTER
    const cityArray = useSelector((state: RootState) => state.adminApplications.cityArray);
    const jobPositionsArray = useSelector((state: RootState) => state.adminApplications.jobPositionsArray);
    const monthsArray = useSelector((state: RootState) => state.adminApplications.monthsArray);
    const yearsArray = useSelector((state: RootState) => state.adminApplications.yearsArray);
    const statusArray = useSelector((state: RootState) => state.adminApplications.statusArray);
 
    const accuracyArray: DropDownDataType[] = [
        {value: "Ascending",label: "Ascending"},
        {value: "Descending",label: "Descending"},
    ]

    const [applicantantsOptions, setApplicantantsOptions] = useState<Partial<FilterOptionsTypes>>({
        currentCity: "",
        employmentStatus: "",
        position: "",
        month: "",
        year: 2025,
    })

    const handleUpdateApplicantsOptions = (field: Partial<keyof FilterOptionsTypes>, value: string | number) => {
        setApplicantantsOptions((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    // FOR JOB TYPE ADMIN FILTER

    const workModes = useSelector((state: RootState) => state.adminJob.workModesArray);
    const jobTitles = useSelector((state: RootState) => state.adminJob.jobTitlesArray);
    const jobMonths = useSelector((state: RootState) => state.adminJob.monthsArray);
    const jobYears = useSelector((state: RootState) => state.adminJob.yearsArray);

    const [jobOptions, setJobOptions] = useState<Partial<FilterOptionsTypes>>({
        workMode: "",
        jobTitle: "",
        month: "",
        year: 2025,
    })

    const handleUpdateJobsOptions = (field: Partial<keyof FilterOptionsTypes>, value: string | number) => {
        setJobOptions((prev) => ({
            ...prev,
            [field]: value
        }));
    }


    const handleFilter = (type: AdminFilterTypeValues) => {
        if(type === "Applicants") {
            dispatch(filterApplicants(applicantantsOptions))
        } else if(type === "Jobs") {
            dispatch(filterAdminJobData(jobOptions))
        } else {
            console.log("Employee")
        }
        onClickCancel();
    }



    const {setIsModalOpen} = useModal();

    useEffect(() => {
        setIsModalOpen(false);
    },[visible, setIsModalOpen])

    
    return(
      <>
        {visible && (
            <ModalLayout>
                <div className="py-4 flex flex-col gap-2 mx-12">
                    <p className="text-center"><strong>Filter Data</strong></p>
                    {type === "Applicants" && (
                        // THESE BUTTONS WILL SHOWN IF ADMIN FILTER TYPE IS APPLICANTS
                        <>
                            <div className="flex items-center justify-between ">
                                <DropDown
                                placeHolder="City"
                                data={cityArray}
                                onChange={(value) => handleUpdateApplicantsOptions("currentCity", value)}
                                />
                                <DropDown
                                placeHolder="Job Title"
                                data={jobPositionsArray}
                                onChange={(value) => handleUpdateApplicantsOptions("position", value)}
                                />
                            </div>
                            <div className="flex items-center justify-between ">
                                <DropDown
                                placeHolder="Month"
                                data={monthsArray}
                                onChange={(value) => handleUpdateApplicantsOptions("month", value)}
                                />
                                <DropDown
                                placeHolder="Year"
                                data={yearsArray}
                                onChange={(value) => handleUpdateApplicantsOptions("year", parseInt(value))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <DropDown
                                placeHolder="Status"
                                data={statusArray}
                                onChange={(value) => handleUpdateApplicantsOptions("employmentStatus", value)}
                                />
                                <DropDown
                                placeHolder="Accuracy"
                                data={accuracyArray}
                                onChange={(value) => handleUpdateApplicantsOptions("resumeAccuracy", value)}
                                />
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <button onClick={() => handleFilter("Applicants")} className="primary">Apply</button>
                                <button onClick={onClickCancel} className="secondary">Cancel</button>
                            </div>
                        </>
                    )}

                    {type === "Jobs" && (
                        // THESE BUTTONS WILL SHOWN IF ADMIN FILTER TYPE IS JOBS
                        <>
                            <div className="flex items-center justify-between ">
                                <DropDown
                                placeHolder="Work Mode"
                                data={workModes}
                                onChange={(value) => handleUpdateJobsOptions("workMode", value)}
                                />
                                <DropDown
                                placeHolder="Job Title"
                                data={jobTitles}
                                onChange={(value) => handleUpdateJobsOptions("jobTitle", value)}
                                />
                            </div>
                            <div className="flex items-center justify-between ">
                                <DropDown
                                placeHolder="Month"
                                data={jobMonths}
                                onChange={(value) => handleUpdateJobsOptions("month", value)}
                                />
                                <DropDown
                                placeHolder="Year"
                                data={jobYears}
                                onChange={(value) => handleUpdateJobsOptions("year", parseInt(value))}
                                />
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <button onClick={() => handleFilter("Jobs")} className="primary">Apply</button>
                                <button onClick={onClickCancel} className="secondary">Cancel</button>
                            </div>
                        </>
                    )}
                </div>
            </ModalLayout>
        )}
      </>
    )
}