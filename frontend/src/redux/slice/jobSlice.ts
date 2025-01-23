import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JobDataTypes } from "../../components/JobFeed";
import { DropDownDataType } from "../../components/DropDown";
import { formatDropDownData } from "../../utils";



interface JobInitialState {
    jobData: JobDataTypes[]; //THE ORIGINAL COPY TO FOR RESET FILTER PURPOSES
    filteredJob: JobDataTypes[]; //THIS IS THE DATA SHOWN IN FRONT PAGE
    isJobDataFiltered: boolean;
    chosenJob: JobDataTypes | null;
    jobMap: Record<string, JobDataTypes> //CREATE A HASH MAP FOR 0(1) SEARCH/LOOKUPS
    allSkillsData: DropDownDataType[] | null;
    allEmploymentTypeData: DropDownDataType[] | null;
}

const initialState: JobInitialState = {
    jobData: [],
    filteredJob: [],
    isJobDataFiltered: false,
    chosenJob: null,
    jobMap: {},
    allSkillsData: null,
    allEmploymentTypeData: null
}

const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {
        setJobs: (state, action: PayloadAction<JobDataTypes[]>) => {
            state.jobData = action.payload;
            state.filteredJob = action.payload;

            const jobDataArray = action.payload;

            //CREATE THE HASH MAP LIKE {"123": {_id: "123", jobTitle: "Software Engineer", ...}}
            state.jobMap = jobDataArray.reduce<Record<string, JobDataTypes>>(
                (map, job) => {
                    map[job._id] = job; //USE JOB OBJECT ID AS KEY
                    return map;
            },{});

            //SET CHOSEN JOB TO FIRST INDEX OF THE FILTERED JOB DATA ARRAY
            const jobArray = state.filteredJob;
            state.chosenJob = jobArray[0];

            //SET UP ALL SKILLS
            const allSkills = jobDataArray.map((item) => item.skills).flat();
            //USE NEW SET TO REMOVE DUPLICATES
            const uniqueSkills = [...new Set(allSkills)];
            //STORE IN STATE REDUX
            state.allSkillsData = formatDropDownData(uniqueSkills);

            //SET UP EMPLOYEMENT TYPE DROP DOWN
            const allEmploymentType = jobDataArray.map((item) => item.employmentType);
            //USE NEW SET TO REMOVE DUPLICATES
            const uniqueEmploymentType = [...new Set(allEmploymentType)];
            //STORE IN STATE REDUX
            state.allEmploymentTypeData = formatDropDownData(uniqueEmploymentType);
            
        },

        findJob:(state, action: PayloadAction<string>) => {
            const id = action.payload;
            // THIS IS WERE THE HASH MAP BECOMES HANDY, IT DOES NOT NEED ITERATION TO LOOK FOR THE DESIRED JOB DATA
            state.chosenJob = state.jobMap[id] || null;
        },

        filterJob: (state, action: PayloadAction<{skill: string, employmentType:string}>) => {
            const {skill, employmentType} = action.payload;

            //CHECK IF THE JOB DATA IS ALREADY FILTERED
            const isFiltered = state.isJobDataFiltered;
            //ASSIGN THE ORIGINAL DATA IF ITS FILTERED ELSE USE THE FILTERED JOB DATA
            const jobArray = isFiltered ? state.jobData : state.filteredJob;

            const filteredJob = jobArray.filter((item) => item.skills.includes(skill) && item.employmentType === employmentType);
            state.filteredJob = filteredJob;
            state.isJobDataFiltered = true;
        },

        clearJobFilter: (state) => {
            state.filteredJob = state.jobData
            state.isJobDataFiltered = false;
        },

        deleteSkill: (state, action: PayloadAction<string>) => {
            const deletedSkill = action.payload;
            //IF CHOSEN JOB IS NULL OR UNDEFINED, RETURN/EXIT THE REDUCER FUNCTION TO PREVENT ERROR
            if(!state.chosenJob) return;
            const skills = state.chosenJob.skills;
            state.chosenJob.skills = skills.filter((skill) => skill !== deletedSkill);
        },

        getSkills: (state) => {
            const allJobsArray = state.jobData;
            //USE MAP TO ITERATE ALL JOB AND RETURN THE ITEM.SKILLS AND USE FLAT FUNCTION TO REMOVE THE NESTED ARRAY LIKE THIS [[SKILL], [SKILL]] => [SKILL, SKILL]
            const allSkills = allJobsArray.map((item) => item.skills).flat();
            //USE NEW SET TO REMOVE DUPLICATES
            const formatSKills = [...new Set(allSkills)].map((item) => {
                const format = {
                    value: item,
                    label: item
                };
                //RETURN THE FORMAT TO ADD THE NEW ARRAY CREATED BY MAP METHOD
                return format;
            })
            state.allSkillsData = formatSKills;
        }
    }
})

export const {
    setJobs, 
    findJob, 
    filterJob,
    clearJobFilter,
    deleteSkill, 
    getSkills,
 
} = jobSlice.actions;

export default jobSlice.reducer;