import React from "react";
import { MonthStringTypes } from "../../../helper/date";
import { DropDown, DropDownDataType } from "../../DropDown";
import { useDeviceType } from "../../../hooks";

  interface TopApplicantsCardProps {
    fullName: string; 
    index: number;
    data: Record<string, unknown>;
  }

const TopCard: React.FC<TopApplicantsCardProps> = ({fullName, index}) => {

    const {isMobile} = useDeviceType();
    return (
        <div className="flex items-center justify-between gap-2">
            <p className={`${isMobile ? "max-w-[150px] overflow-hidden truncate" : ""}`}>{index}. <strong>{fullName}</strong></p>
            <button className="primary">View</button>
        </div>
    )
}

interface TopApplicantsProps {
    month: MonthStringTypes,
    year: number,
    jobPositionData: DropDownDataType[];
    onChangeDropDown: (value: string) => void;
    dropDownValue: string;
    topData: TopDataTypes[]
}

export interface TopDataTypes {
    fullName: string;
    _id: string;
    data: Record<string, unknown>;
}


export const TopDataCard:React.FC<TopApplicantsProps> = ({
    month, 
    year,
    jobPositionData,
    onChangeDropDown,
    dropDownValue,
    topData
}) => {
    return (
        <div className="bg-white shadow p-2 px-4 w-full max-w-[340px] max-h-[325px] rounded-[7px] flex flex-col gap-2">
            <h3 className="text-center">Top 5 Applicants of {month} {year}</h3>
            {jobPositionData && (
                <div className="w-[175px] self-center"> 
                    <DropDown 
                    data={jobPositionData}
                    onChange={onChangeDropDown}
                    placeHolder="Job Position"
                    value={dropDownValue}
                    />
                </div>
            )}
            <div className="flex flex-col gap-2">
                {topData.map((item: TopDataTypes, index) => {
                    const {_id, fullName, data} = item;
                    return (
                    <TopCard 
                    key={_id} 
                    index={index + 1}
                    data={data}
                    fullName={`${fullName} test test`}/>
                    )
                })}
            </div>

        </div>
    )
}