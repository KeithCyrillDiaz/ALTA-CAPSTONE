import React, { useState } from "react"
import { DownArrowIcon } from "./icons/DownArrowIcon";


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
    label
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
}

export const DropDown: React.FC<DropDownProps> = ({
    value = null,
    onChange,
    data,
    placeHolder
}) => {

    const [showOptions, setShowOptions] = useState<boolean>(false)
    const [dropdownValue, setDropDownValue] = useState<string | null>(value);
    return (
        <div className="dropdown">
            <p>{!dropdownValue || dropdownValue === '' ?  placeHolder : dropdownValue}</p>
            <div className="dropdownButton" onClick={() => setShowOptions(!showOptions)}>
                <DownArrowIcon/>
            </div>
            {showOptions && (
                <div className="dropdownOption">
                    {data.map((item, index) => {
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
