import React from "react";
import { CheckedCheckBoxIcon, UncheckedCheckBoxIcon } from "./icons/CheckBoxIcons";


interface CheckBoxProps {
    onClick: (bool: boolean) => void;
    value: boolean
}

const CheckBox: React.FC<CheckBoxProps> = ({
    onClick,
    value
}) => {
    return (
        <div onClick={() => onClick(!value)}>
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
}

export const CheckBoxContainer:React.FC<CheckBoxContainerProps> = ({
    onClick,
    value,
    label
}) => {
    return (
        <div className="flex items-center gap-1">
        <CheckBox
        onClick={onClick}
        value={value}
        />
        <p><strong>{label}</strong></p>
    </div>
    )
}