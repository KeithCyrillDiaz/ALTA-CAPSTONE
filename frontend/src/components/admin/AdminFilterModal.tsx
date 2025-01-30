import React, { useEffect, useState } from "react"
import { DropDown, DropDownDataType } from "../DropDown"
import { ModalLayout } from "../../layouts"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { useModal } from "../../hooks"
import { filterApplicants, FilterOptionsTypes } from "../../redux/slice/admin/applicationsSlice"
import { useDispatch } from "react-redux"


interface AdminFilterProps {
    visible: boolean;
    type: "Applicants" | "Jobs" | "Employees",
    onClickCancel: () => void;
}
export const AdminFilter:React.FC<AdminFilterProps> = ({
    visible,
    onClickCancel
   
}) => {

    const cityArray = useSelector((state: RootState) => state.applications.cityArray);
    const jobPositionsArray = useSelector((state: RootState) => state.applications.jobPositionsArray);
    const monthsArray = useSelector((state: RootState) => state.applications.monthsArray);
    const yearsArray = useSelector((state: RootState) => state.applications.yearsArray);
    const statusArray = useSelector((state: RootState) => state.applications.statusArray);
    const dispatch = useDispatch();

    const [options, setOptions] = useState<Partial<FilterOptionsTypes>>({
        currentCity: "",
        employmentStatus: "",
        position: "",
        month: "",
        year: 2025,
    })

    const handleUpdateOptions = (field: Partial<keyof FilterOptionsTypes>, value: string | number) => {
        setOptions((prev) => ({
            ...prev,
            [field]: value
        }));
    }


    const handleFilter = () => {
        dispatch(filterApplicants(options))
        onClickCancel();
    }

    const accuracyArray: DropDownDataType[] = [
        {value: "Ascending",label: "Ascending"},
        {value: "Descending",label: "Descending"},
    ]

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
                    <div className="flex items-center justify-between ">
                        <DropDown
                        placeHolder="City"
                        data={cityArray}
                        onChange={(value) => handleUpdateOptions("currentCity", value)}
                        />
                        <DropDown
                        placeHolder="Job Title"
                        data={jobPositionsArray}
                        onChange={(value) => handleUpdateOptions("position", value)}
                        />
                    </div>
                    <div className="flex items-center justify-between ">
                        <DropDown
                        placeHolder="Month"
                        data={monthsArray}
                        onChange={(value) => handleUpdateOptions("month", value)}
                        />
                        <DropDown
                        placeHolder="Year"
                        data={yearsArray}
                        onChange={(value) => handleUpdateOptions("year", parseInt(value))}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <DropDown
                        placeHolder="Status"
                        data={statusArray}
                        onChange={(value) => handleUpdateOptions("employmentStatus", value)}
                        />
                        <DropDown
                        placeHolder="Accuracy"
                        data={accuracyArray}
                        onChange={(value) => handleUpdateOptions("resumeAccuracy", value)}
                        />
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <button onClick={handleFilter} className="primary">Apply</button>
                        <button onClick={onClickCancel} className="secondary">Cancel</button>
                    </div>
                </div>
            </ModalLayout>
        )}
      </>
    )
}