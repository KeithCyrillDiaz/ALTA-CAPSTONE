import React, { ReactNode } from "react";

interface HeroCardProps {
    title: string;
    icon: ReactNode;
    value: number;
    percentageIncrease: number
}
export const HeroCard: React.FC<HeroCardProps> = ({
    title,
    icon,
    value,
    percentageIncrease
}) => {
    return (
        <div className="flex flex-col bg-white rounded-[7px] shadow p-2 px-4 max-w-[200px] max-h-[100px] w-[200px] h-[100px]">
            <p className="secondary-text"><strong>{title}</strong></p>
            <div className="flex justify-between">
            <div className="flex items-center gap-1">
                <p className="text-[32px]"><strong>{value}</strong></p>
                {/* ONLY SHOW PERCENTAGE INCREASE IF ITS NOT EQUAL TO 0 */}
                {percentageIncrease !== 0 && (<p className="text-positive text=[16px]"><strong> + {percentageIncrease}%</strong></p>)}
            </div>
            {icon}
            </div>
        </div>
    )
}