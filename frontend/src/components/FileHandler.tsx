import React, { useRef } from "react";
import { UploadIcon } from "./icons/UploadIcon";
import { DownloadIcon } from "./icons/DownloadIcon";

interface FileInputEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & { files: FileList };
}
interface UploadFileProps  {
    onChange: (file: File) => void;
    type: 'upload' | 'download';
    value: string;
    placeholder: string;
    required?: boolean,
    fileId?: string;
}

export const FileHandler: React.FC<UploadFileProps> = ({
    onChange,
    type,
    value,
    placeholder,
    required = false,
    fileId
}) => {

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    //MOVE THE CLICK FROM ICON TO INPUT TAG TO ENABLE FILE UPLOAD
    const handleClick = () => {
        fileInputRef.current?.click()
    }
    return (
        <div className="inputWithIconContainer">
            {/* THIS ENABLES THE FILE UPLOAD */}
            <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e: FileInputEvent) => onChange(e.target.files[0])}
            required={required}
            style={{ display: "none" }} //HIDE THE DEFAULT INPUT E.G. "Choose File"
            />

            {/* THIS IS ADDEDD FOR PLACEHOLDER ONLY */}
            <input
            disabled //DISABLED SO ITS NOT CLICKABLE
            placeholder={placeholder}
            value={fileId === "" ? value : "Download PDF"} //PASS THE FILE NAME HERE AS VALUE
            required={required}
            />
            {/* DISPLAY ICON ACCORDINGLY, IF THE TYPE IS UPLOAD THEN UPLOAD ICON WILL BE DISPLAYED */}
            {type === 'upload' ? (
                <div onClick={handleClick}>
                    <UploadIcon/>
                </div>
            ) : (
                <a 
                    href={`https://drive.google.com/uc?export=download&id=${fileId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    <DownloadIcon />
                </a>
            )}
        </div>
    )
}