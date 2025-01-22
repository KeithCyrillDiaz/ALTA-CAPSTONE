import React from "react"
import { BulletIcon } from "./icons/BulletIcon"

  interface SkillCardProps {
    label: string;
    onEdit?: boolean;
    onClick?: (label: string) => void;
}
  export const SkillCard: React.FC<SkillCardProps> = ({
    label,
    onEdit,
    onClick = () => {}
}) => {
    return (
        <div className={`${onEdit ? "highlight" : ""} flex items-center`}>
            {label}
            <div onClick={() => onClick(label)}>
                <BulletIcon/>
            </div>
        </div>
   
    )
  }