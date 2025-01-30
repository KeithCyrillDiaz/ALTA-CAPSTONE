import React from "react";
import { MonthStringTypes } from "../../../helper/date";
import { DropDown, DropDownDataType } from "../../DropDown";
import { useDeviceType } from "../../../hooks";

  interface TopApplicantsCardProps {
    fullName: string; 
    index: number;
    data: Record<string, unknown>;
    onClickView: () => void;
  }

const TopCard: React.FC<TopApplicantsCardProps> = ({fullName, index, onClickView}) => {

    const {isMobile} = useDeviceType();
    return (
        <div className="flex items-center justify-between gap-2">
            <p className={`${isMobile ? "max-w-[150px] overflow-hidden truncate" : ""}`}>{index}. <strong>{fullName}</strong></p>
            <button onClick={onClickView} className="primary">View</button>
        </div>
    )
}

interface TopDataProps {
    title: 'Applicants' | 'Clients' | 'Projects'
    month: MonthStringTypes,
    year: number,
    dropDownData: DropDownDataType[];
    onChangeDropDown: (value: string) => void;
    dropDownValue: string;
    topData: TopDataTypes[]
    onClickView: (id: string) => void;
}

export interface TopDataTypes {
    fullName: string;
    _id: string;
    data: Record<string, unknown>;
}


export const TopDataCard:React.FC<TopDataProps> = ({
    title,
    month, 
    year,
    dropDownData,
    onChangeDropDown,
    dropDownValue,
    topData,
    onClickView,
}) => {
    const formatTitle = topData.length === 1 ? title.replace(/s$/, "") : title;
    return (
        <div className="bg-white shadow p-2 px-4 w-full max-w-[340px] max-h-[325px] min-h-[250px] rounded-[7px] flex flex-col gap-2">
            {dropDownData.length !== 0 && topData.length !== 0 ? (
               <>
                 <h3 className="text-center">Top {topData.length} {formatTitle} of {month} {year}</h3>
                 <div className="w-[175px] self-center"> 
                    <DropDown 
                    data={dropDownData}
                    onChange={onChangeDropDown}
                    placeHolder="Job Position"
                    value={dropDownValue}
                    />
                </div>
            
                <div className="flex flex-col gap-2">
                    {topData.map((item: TopDataTypes, index) => {
                        const {_id, fullName, data} = item;
                        return (
                        <TopCard 
                        key={_id} 
                        onClickView={() => onClickView(_id)}
                        index={index + 1}
                        data={data}
                        fullName={fullName}/>
                        )
                    })}
                </div>
               </>
            ) : (
              <>
                <h3 className="text-center">Top {formatTitle} of {month} {year}</h3>
                <div className="flex h-[150px] w-full items-center justify-center">
                    <p>No Records Found</p>
                </div>
              </>
            )}
            

        </div>
    )
}