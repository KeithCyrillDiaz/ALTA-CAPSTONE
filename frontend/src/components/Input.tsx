import React from "react";

export type InputKeyboardTypes = 'text' | 'email' | 'password' | 'number' | 'tel' 
interface InputProps {
    onChange: (value: string) => void;
    label: string;
    placeholder?: string;
    value?: string | number | boolean;
    required?: boolean,
    type: InputKeyboardTypes,
    disabled?: boolean,
    maxLength?: number,
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
    label = "Given Name",
    onChange,
    placeholder="Enter Text",
    value="",
    required = false,
    type,
    disabled = false,
    onKeyDown = () => {},
    maxLength
}) => {
    return(
        <div className="inputContainer">
            <p className="secondary-text"><strong>{label}</strong></p>
            <input
            disabled={disabled}
            onKeyDown={onKeyDown}
            type={type}
            maxLength={type === "tel" ? 11 : maxLength ? maxLength : undefined}
            className="shadow py-2 px-4"
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            value={value.toString()}
            required={required}
            />
        </div>
    )
}