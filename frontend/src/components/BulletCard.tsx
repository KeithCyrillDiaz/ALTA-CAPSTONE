import React from "react"
import { BulletIcon } from "./icons/BulletIcon";
import CloseIcon from "./icons/CloseIcon";

  interface BulletCardProps {
    label: string;
    onEdit?: boolean;
    onClick?: (label: string) => void;
}
  export const BulletCard: React.FC<BulletCardProps> = ({
    label,
    onEdit,
    onClick = () => {}
}) => {
    return (
        <div className={`${onEdit ? "highlight" : ""} bulletCardContainer` }>
            <div className="labelContainer">
              <div><BulletIcon/></div>
              <p>{label}</p>
            </div>
           
           {onEdit && (
            <div className="close" onClick={() => onClick(label)}>
              <CloseIcon/>
            </div>
           )}
        </div>
   
    )
  }