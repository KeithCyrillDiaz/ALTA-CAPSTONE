import React, { ReactNode } from "react";
import { DashboardIcon } from "../icons/admin/DashboardIcon";
import { ApplicantIcon } from "../icons/admin/ApplicantsIcon";
import { JobIcon } from "../icons/admin/JobIcon";
import { EmployeesIcon } from "../icons/admin/EmployeesIcon";
import { useDeviceType } from "../../hooks";


const IconWithLabel: React.FC<{ label: string; element: ReactNode }> = ({
    label,
    element,
  }) => {
    return (
      <div className="flex gap-2 items-center text-white">
        {element}
        <p className="text-white">
          <strong>{label}</strong>
        </p>
      </div>
    );
  };

export const AdminMenu: React.FC<{visible: boolean}> = ({visible}) => {

    const buttons = [
        {
            label: "Dashboard",
            icon: <DashboardIcon/>
        },
        {
            label: "Applicants",
            icon: <ApplicantIcon/>
        },
        {
            label: "Jobs",
            icon: <JobIcon/>
        },
        {
            label: "Employees",
            icon: <EmployeesIcon/>
        },
     ]

     const {isMobile} = useDeviceType();
    return (
       <>
       {/* RENDER IF VISIBLE IS TRUE */}
        {visible && (
             <div className={`z-10 w-[250px] bg-color-primary pl-12 py-8 h-full  ${isMobile ? "fixed top-[0] pt-24" : ""}`}>
                <div className="flex flex-col gap-3">
                    {buttons.map((button, index) => {
                        const {label, icon} = button;
                        return (
                            <IconWithLabel
                            key={index}
                            label={label}
                            element={icon}
                            />
                        )
                    })}
                </div>
            </div>
        )}
       </>
    )
}