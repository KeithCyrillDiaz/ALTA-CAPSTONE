import React, { useEffect, useState } from "react"
import { DownArrowIcon } from "./icons/DownArrowIcon";
import { Search } from "./client/Search";


export interface DropDownDataType {
    label: string;
    value: string;
}

interface OptionCardProps {
    onClick: (value: string) => void;
    value: string;
    label: string;
}
const OptionCard: React.FC<OptionCardProps> = ({
    onClick,
    value,
    label,

}) => {
    return (
             <div className="optionCard" onClick={() => onClick(value)}>{label}</div>
    )
}

interface DropDownProps {
    value?: string;
    onChange: (value: string) => void;
    data: DropDownDataType[],
    placeHolder: string;
    search?: boolean;
    disabled?: boolean;
}

export const DropDown: React.FC<DropDownProps> = ({
    value = null,
    onChange,
    data,
    placeHolder,
    search,
    disabled = false
}) => {

    const [showOptions, setShowOptions] = useState<boolean>(false)
    const [dropdownValue, setDropDownValue] = useState<string | null>(value);

    const [dropdownData, setDropdownData] = useState<DropDownDataType[]>(data);
    const handleSearch = (text: string) => {
        //CHECK IF TEXT IS AN EMPTY STRING
        if(text === ""){
            //RESET THE DROP DOWN DATA IF SEARCH FIELD IS CLEARED OR EMPTY
            setDropdownData(data);
            return; //EXIT
        }
        //FILTER THE DATE BASED ON THE TEXT INPUT
        const filteredData = dropdownData.filter((item) => item.label.toLowerCase().includes(text.toLowerCase()));
        //ONLY UPDATE THE STATE WHEN THERE IS A VALUE
        if(filteredData.length !== 0) {
            setDropdownData(filteredData)
        }
        
    }

    const handleDropDownIconClick = () => {
        //RESET THE DROP DOWN DATA WHENEVER THE USER REOPENS THE DROPDOWN 
        setDropdownData(data)
        setShowOptions(!showOptions)
    }
    //THIS WILL GET TRIGGER WHEN VALUE CHANGES
    useEffect(() => {
        setDropDownValue(value);
    },[value, setDropDownValue])

    return (
        <div className="inputWithIconContainer">
            <p className={`text-[.8rem] mobile-truncate ${!dropdownValue || dropdownValue === "" ? "text-gray-400" : ""}`}>{!dropdownValue || dropdownValue === '' ?  placeHolder : dropdownValue}</p>
            {disabled !== true && (
                <div className="dropdownButton" onClick={handleDropDownIconClick}>
                    <DownArrowIcon/>
                </div>
            )}
            {showOptions && dropdownData.length !== 0 && (
                <div className="dropdownOption">
                    {search && (
                        <Search
                        hideIcon
                        onChangeText={(text) => handleSearch(text)}
                        onClick={() => {}}
                        />
                    )}
                    {dropdownData.map((item, index) => {
                        const {value, label} = item;
                        return(
                            <OptionCard
                            key={index}
                            value={value}
                            label={label}
                            onClick={(value) => {
                                setDropDownValue(value);
                                onChange(value);
                                setShowOptions(false);
                            }}
                            />
                        )
                    })}
                </div>
                
            )}
        </div>
    )
}
