import React, { useEffect } from "react"
import { DropDown, DropDownDataType } from "../DropDown"
import { ModalLayout } from "../../layouts"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { useModal } from "../../hooks"


interface AdminFilterProps {
    visible: boolean;
    type: "Applicants" | "Jobs" | "Employees",
    onCityChange?: (value: string) => void;
    onJobTitleChange?: (value: string) => void;
    onMonthChange?: (value: string) => void;
    onYearChange?: (value: number) => void;
    onStatusChange?: (value: string) => void;
    onAccuracyChange?: (value: string) => void;
    onClickApply: () => void;
    onClickCancel: () => void;
}
export const AdminFilter:React.FC<AdminFilterProps> = ({
    visible,
    onCityChange = () => {},
    onJobTitleChange = () => {},
    onMonthChange = () => {},
    onYearChange = () => {},
    onStatusChange = () => {},
    onAccuracyChange = () => {},
    onClickApply,
    onClickCancel
   
}) => {

    const cityArray = useSelector((state: RootState) => state.applications.cityArray);
    const jobPositionsArray = useSelector((state: RootState) => state.applications.jobPositionsArray);
    const monthsArray = useSelector((state: RootState) => state.applications.monthsArray);
    const yearsArray = useSelector((state: RootState) => state.applications.yearsArray);
    const statusArray = useSelector((state: RootState) => state.applications.statusArray);

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
                        onChange={(value) => onCityChange(value)}
                        />
                        <DropDown
                        placeHolder="Job Title"
                        data={jobPositionsArray}
                        onChange={(value) => onJobTitleChange(value)}
                        />
                    </div>
                    <div className="flex items-center justify-between ">
                        <DropDown
                        placeHolder="Month"
                        data={monthsArray}
                        onChange={(value) => onMonthChange(value)}
                        />
                        <DropDown
                        placeHolder="Year"
                        data={yearsArray}
                        onChange={(value) => onYearChange(parseInt(value))}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <DropDown
                        placeHolder="Status"
                        data={statusArray}
                        onChange={(value) => onStatusChange(value)}
                        />
                        <DropDown
                        placeHolder="Accuracy"
                        data={accuracyArray}
                        onChange={(value) => onAccuracyChange(value)}
                        />
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <button className="primary">Apply</button>
                        <button className="secondary">Cancel</button>
                    </div>
                </div>
            </ModalLayout>
        )}
      </>
    )
}