import React from "react";

interface InputProps {
    onChange: (value: string) => void;
    label: string;
    placeholder?: string;
    value?: string | number | boolean;
}

export const Input: React.FC<InputProps> = ({
    label = "Given Name",
    onChange,
    placeholder="Enter Text",
    value=""
}) => {
    return(
        <div className="inputContainer">
            <p className="secondary-text"><strong>{label}</strong></p>
            <input
            className="shadow py-2 px-4"
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            value={value.toString()}
            />
        </div>
    )
}