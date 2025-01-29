import React, { ReactNode } from "react";
import { DashboardIcon } from "../icons/admin/DashboardIcon";
import { ApplicantIcon } from "../icons/admin/ApplicantsIcon";
import { JobIcon } from "../icons/admin/JobIcon";
import { EmployeesIcon } from "../icons/admin/EmployeesIcon";
import { useNavigate } from "react-router-dom";

const IconWithLabel: React.FC<{ label: string; element: ReactNode, path: string }> = ({
    label,
    element,
    path
  }) => {

    const navigate = useNavigate();

    return (
      <div onClick={() => navigate(path)} className="flex gap-2 items-center text-white pl-12 py-1  hover:cursor-pointer hover:bg-color-primary-hover duration-[300ms]">
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
            icon: <DashboardIcon/>,
            path: '/admin/dashboard'
        },
        {
            label: "Applicants",
            icon: <ApplicantIcon/>,
            path: '/admin/applicants'
        },
        {
            label: "Jobs",
            icon: <JobIcon/>,
            path: '/admin/dashboard'
        },
        {
            label: "Employees",
            icon: <EmployeesIcon/>,
            path: '/admin/dashboard'
        },
     ]
    return (
       <>
       {/* RENDER IF VISIBLE IS TRUE */}
        {visible && (
             <div className={`z-10 w-[250px] bg-color-primary py-8 h-[100%] absolute top-0 pt-12`}>
                <div className="flex flex-col">
                    {buttons.map((button, index) => {
                        const {label, icon, path} = button;
                        return (
                            <IconWithLabel
                            key={index}
                            label={label}
                            element={icon}
                            path={path}
                            />
                        )
                    })}
                </div>
            </div>
        )}
       </>
    )
}