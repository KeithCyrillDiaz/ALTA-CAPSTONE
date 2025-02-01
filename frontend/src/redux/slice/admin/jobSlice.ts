


import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DropDownDataType } from "../../../components/DropDown";

import { JobDataTypes, JobDescription } from "../../../components/client/JobFeed";
import { TableDataTypes } from "../../../components/admin/table/Table";

export type FilterJobOptionsTypes = {
    [key in keyof JobDataTypes]: string | number;
}

export interface JobsInitialState {
    JobData: JobDataTypes[]
    filteredJobData: JobDataTypes[] | TableDataTypes[];
    workModesArray: DropDownDataType[];
    jobTitlesArray: DropDownDataType[];
    monthsArray: DropDownDataType[];
    yearsArray: DropDownDataType[];

    editableForm: JobDataTypes | null;
    skillsArray: DropDownDataType[],
    educationArray: DropDownDataType[],
}


const initialState: JobsInitialState = {
    JobData: [],
    filteredJobData: [],
    workModesArray: [],
    jobTitlesArray: [],
    monthsArray: [],
    yearsArray: [],
    editableForm: null,
    skillsArray: [],
    educationArray: []
}

const formatDataToDropDownDataYpes = (items: string[] | number[]): DropDownDataType[] => {

    const uniqueItems = [...new Set(items.map(item => item.toString()))] //TO REMOVE DUPLICATES

    const formattedItems: DropDownDataType[] = uniqueItems.map((item) => ({
        value: item.toString(),
        label: item.toString()
    }));

    return formattedItems;  
}

const JobsSlice = createSlice({
    name: "Jobs",
    initialState,
    reducers: {
        setAdminJobData: (state, action: PayloadAction<JobDataTypes[]>) => {
            // STORE THE DATA IN STATES
            const data = action.payload
            state.JobData = data; // THIS IS THE ORIG COPY THAT WE CAN USE TO RESTORE THE FILTERED / SHOWN DATA
            state.filteredJobData = data; //THIS DATA WILL BE SHOWN SO WE CAN FILTER IT
            
            const workModes = data.map((item) => item.workMode);
            const formattedWorkModes = formatDataToDropDownDataYpes(workModes);
            state.workModesArray = formattedWorkModes;

            const jobTitles = data.map((item) => item.jobTitle);
            const formattedJobTitles = formatDataToDropDownDataYpes(jobTitles);
            state.jobTitlesArray = formattedJobTitles;

            const months = data.map((item) => item.month);
            const formattedMonths: DropDownDataType[] = formatDataToDropDownDataYpes(months);
            state.monthsArray = formattedMonths; //UPDATE STATE

            const years = data.map((item) => item.year);
            const formattedYears: DropDownDataType[] = formatDataToDropDownDataYpes(years);
            state.yearsArray = formattedYears; //UPDATE STATE

            // SET EXISTING THE SKILLS ARRAY AND EDUCATION ARRAY FOR FUTURE EDITING AND ADDING NEW JOB
            const skills = data.flatMap((item) => item.skills); //I USED FLAT MAP SINCE THE ITEM.SKILLS IS AN ARRAY, SO THE NESTED skills VARIABLE WILL BE FLATTED OR REMOVED THE NESTED
            const education = data.flatMap((item) => item.education);

            state.skillsArray = formatDataToDropDownDataYpes(skills); 
            state.educationArray = formatDataToDropDownDataYpes(education);

        },
        filterAdminJobData: (state, action: PayloadAction<Partial<FilterJobOptionsTypes>>) => {
            const options = action.payload;
            const data = state.JobData; //USE THE ORIGINAL DATA
            const filteredData = data.filter((Job) => {
                return Object.entries(options).every(([key, value]) => {
                    return value ? Job[key as keyof JobDataTypes] === value : true;
                });
            });
            console.log("filtered Data: ", JSON.stringify([... new Set(filteredData)], null, 2));
            state.filteredJobData = filteredData;
        },
        clearAdminJobFilter: (state) => {
            console.log("click");
            console.log("jobData", JSON.stringify(state.JobData, null, 2));
            state.filteredJobData = state.JobData;
        },
        searchAdminJobFilter: (state, action: PayloadAction<string>) => {
            const searchTerm = action.payload.toLowerCase();
            const data = state.filteredJobData;
            const filteredData = data.filter((item) => {
                return Object.values(item).some((value) => 
                    value !== null && value !== undefined && value.toString().toLowerCase().includes(searchTerm)
                );
            });

            state.filteredJobData = filteredData as JobDataTypes[]
        },

        setEditableForm: (state, action: PayloadAction<JobDataTypes>) => {
            state.editableForm = action.payload;
        },

        updateEditableForm: (state, action: PayloadAction<{field: keyof JobDataTypes, value: unknown | JobDescription}>) => {
           if(!state.editableForm) {
                console.log("Editable form is null");
                return;
           }

           const {field, value} = action.payload;
           let newForm: JobDataTypes;
           if(field === "isSalaryRange" && value === false) {
            newForm = {
                ...state.editableForm,
                [field]: value as boolean,
                maxSalary: state.editableForm.minSalary
            }
           } else {
            newForm = {
                ...state.editableForm,
                [field]: value
            }
           }
           
        //    UPDATE BOTH MIN AND MAX SALARY IF IS SALARY RANGE IS SET TO TRUE
           const isSalarySetToRange = state.editableForm.isSalaryRange;
           if((field === "minSalary" || field === "maxSalary") && isSalarySetToRange === false) {
            // SINCE SALARY RANGE IS FALSE, MINIMUM AND MAXIMUM SALARY SHOULD HAS THE SAME VALUE
                const salaryValue = parseInt(value as string);
                newForm.minSalary = salaryValue;
                newForm.maxSalary = salaryValue;
           }

           state.editableForm = newForm
        },
        updateEducationOrSkillArray: (state, action: PayloadAction<{field: "education" | "skills", value: string}>) => {
            if(!state.editableForm) {
                console.log("Editable form is null");
                return;
            }
            
            const {field, value} = action.payload;
            state.editableForm = {
                ...state.editableForm,
                [field]: [...state.editableForm[field] ?? [], value ]
            }
        },

        removeItemInEducationOrSkillArray: (state, action: PayloadAction<{field: "education" | "skills", value: string}>) => {
            if(!state.editableForm) {
                console.log("Editable form is null");
                return;
            }

            const {field, value} = action.payload;
            const {skills, education} = state.editableForm;
            const array = field === "skills" ? skills : education;

            const filteredArray = array.filter((item) => item.toLocaleLowerCase() !== value.toLocaleLowerCase());
            state.editableForm = {
                ...state.editableForm,
                [field]: filteredArray
            }
        },

        addAdminJobdescription: (state, action: PayloadAction<JobDescription>) => {
            if(!state.editableForm) {
                console.log("Editable form is null");
                return;
            }
            const newJobDescription = action.payload;
            const prev =  state.editableForm.jobDescription;
            state.editableForm.jobDescription = [
                ...prev,
                newJobDescription
            ]
        },

        removeAdminJobDescriptionField: (state, action: PayloadAction<{id: string}>) => {
            if(!state.editableForm) {
                console.log("Editable form is null");
                return;
            }
            const {id} = action.payload;
      
            const data = state.editableForm.jobDescription;
            const chosenField = data.find((item) => item._id === id || item.dummyId === id);

            if(!chosenField) {
                console.log("Field Not Found");
                return;
            }
            const {dummyId, _id} = chosenField;

            const filteredData = data.filter((item) => {
                if(item.dummyId === undefined && dummyId === undefined) {
                    if(_id !== item._id) {
                        return true;
                    }
                } else if (item.dummyId !== dummyId) {
                    return true;
                } else {
                    return false
                }
            });
            state.editableForm.jobDescription = filteredData;
        },

        updateAdminJobDescription :(state, action: PayloadAction<{prev: JobDescription, field: keyof JobDescription, value: string | boolean}>) => {
            if(!state.editableForm) {
                console.log("Editable form is null");
                return;
            }

           
            const {field, value, prev} = action.payload;
            console.log(`field: ${field}, value: ${value}, prev: ${prev}`)
            const jobDescription = state.editableForm.jobDescription

                const newJobDescription: JobDescription = {
                    ...prev,
                   [field]: field === "bulletData" 
                   ?  [ ...prev.bulletData, value as string] //IF COMPARISON IS TRUE
                   : value // IF COMPARISON IS FALSE
                }

                const newJobDescriptionArray = jobDescription.map((item) => {
                    if(item.dummyId=== undefined && prev.dummyId === undefined) {
                        if(item._id === prev._id){
                            return newJobDescription;
                        } else {
                            return item
                        }
                    } else if(item.dummyId === prev.dummyId){
                        return newJobDescription
                    } else {
                        return item
                    }
                })
                state.editableForm.jobDescription = newJobDescriptionArray;
        },

        removeItemOnBulletData: (state, action: PayloadAction<{prev: JobDescription, value: string}>) => {
            if(!state.editableForm) {
                console.log("Editable form is null");
                return;
            }
            const {prev, value} = action.payload;
            const {jobDescription} = state.editableForm;
            const {dummyId: prevDummyId, _id: prev_id} = prev;

            const newJobDescription = jobDescription.map((item) => {
                if(
                    (prevDummyId === undefined && item.dummyId === undefined && prevDummyId === item.dummyId) || prev_id === item._id
                ) {
                    if(prev_id === item._id) {
                        const {bulletData} = item;
                        const newBulletData = bulletData.filter((str) => str.toLowerCase() !== value.toLowerCase())
                        return {
                            ...item,
                            bulletData: newBulletData
                        }
                    } 
                } 
                return item;
            });
            state.editableForm.jobDescription = newJobDescription;
        }   

    }
})


export const {
    setAdminJobData,
    filterAdminJobData,
    clearAdminJobFilter,
    searchAdminJobFilter,
    setEditableForm,
    updateEditableForm,
    updateEducationOrSkillArray,
    removeItemInEducationOrSkillArray,

    addAdminJobdescription,
    removeAdminJobDescriptionField,
    updateAdminJobDescription,
    removeItemOnBulletData
} = JobsSlice.actions;

export default JobsSlice.reducer;