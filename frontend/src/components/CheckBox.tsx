import React from "react";
import { CheckedCheckBoxIcon, UncheckedCheckBoxIcon } from "./icons/CheckBoxIcons";


interface CheckBoxProps {
    onClick: (bool: boolean) => void;
    value: boolean;
    disabled?: boolean;
}

const CheckBox: React.FC<CheckBoxProps> = ({
    onClick,
    value,
    disabled
}) => {
    const handleClick = () => {
        if(disabled === true){
            return //EARLY EXIT IF ITS DISABLED
        }
        onClick(!value);
    }
    return (
        <div onClick={handleClick}>
            {value? (
                <CheckedCheckBoxIcon/>
            ) : (
                <UncheckedCheckBoxIcon/>
            )}
        </div>
    )
}

interface CheckBoxContainerProps {
    onClick: (bool: boolean) => void;
    value: boolean;
    label:  string;
    disabled?: boolean;
}

export const CheckBoxContainer:React.FC<CheckBoxContainerProps> = ({
    onClick,
    value,
    label,
    disabled
}) => {
    return (
        <div className="flex items-center gap-1">
        <CheckBox
        disabled = {disabled}
        onClick={onClick}
        value={value}
        />
        <p><strong>{label}</strong></p>
    </div>
    )
}