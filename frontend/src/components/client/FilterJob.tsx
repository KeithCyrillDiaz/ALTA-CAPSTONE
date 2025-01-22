import React, { useState } from "react"
import { DropDown } from "../DropDown"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { useDispatch } from "react-redux"
import { clearJobFilter, filterJob } from "../../redux/slice/jobSlice"

import { FilterJobModal } from "../modal/FilterJobModal"
import { useDeviceType, useModal } from "../../hooks"


export const FilterJob:React.FC = () => {

    const skills = useSelector((state: RootState) => state.job.allSkillsData);
    const employmentTypes = useSelector((state: RootState) => state.job.allEmploymentTypeData);
    const dispatch = useDispatch();
    const isJobDataFiltered = useSelector((state: RootState) => state.job.isJobDataFiltered);

    const [chosenSkill, setChosenSkill] = useState<string>("");
    const [chosenEmploymentType, setChosenEmploymentType] = useState<string>("");
    
    //CUSTOM HOOKS
    const {isMobile} = useDeviceType();
    const {isModalOpen, setIsModalOpen} = useModal();


    const handleFilterJobs = () => {
        console.log("Filtering Job");
        setIsModalOpen(false);

        // EXIT THE FUNCTION OF DROPDOWN VALUE ARE EMPTY
        if(chosenSkill === "" || 
            !chosenSkill || 
            !chosenEmploymentType ||
            chosenEmploymentType === "") {
            return;
        }

        dispatch(filterJob({skill: chosenSkill, employmentType: chosenEmploymentType}));
    }

    const handleClearFilter = () => {
        console.log("Clearing Filter");
        dispatch(clearJobFilter());
        setChosenSkill("");
        setChosenEmploymentType("");
    }

    return (
       <>
        {!isMobile ? (
             <div className="filterContainer">
                    {/* SKILL DROP DOWN */}
                    <DropDown 
                        data={skills || []} 
                        placeHolder="Skill" 
                        onChange={(value) => setChosenSkill(value)}
                    />
                    <DropDown 
                        data={employmentTypes || []} 
                        placeHolder="Employment Type" 
                        onChange={(value) => setChosenEmploymentType(value)}
                    />
                    {isJobDataFiltered ? (
                        <button onClick={handleClearFilter} className="primary">Clear Filter</button>
                    ) : (
                        <button onClick={handleFilterJobs} className="primary">Filter Jobs</button>
                    )}
                    
            </div>
        ) : (
            <>
                {isJobDataFiltered ? (
                    <button onClick={handleClearFilter} className="primary">Clear Filter</button>
                ) : (
                    <button onClick={() => setIsModalOpen(true)} className="primary">Filter Jobs</button>
                )}
    
            </>
        )}
            {isModalOpen && (
                <FilterJobModal 
                onClose={() => setIsModalOpen(false)}
                onSkillDropDownChange={(value) => setChosenSkill(value)}
                onEmploymentDropDownChange={(value)=> setChosenEmploymentType(value)}
                skillsData={skills || []}
                employmentTypesData={employmentTypes || []}
                onClickFilter={handleFilterJobs}
                />
            )}
       </>
    )
}