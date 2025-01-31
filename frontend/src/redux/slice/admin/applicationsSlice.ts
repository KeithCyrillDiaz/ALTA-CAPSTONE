import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserApplicationTypes } from "../../../pages/admin/Dashboard";
import { DropDownDataType } from "../../../components/DropDown";
import { TableDataTypes } from "../../../components/admin/table/Table";
import { JobDataTypes } from "../../../components/client/JobFeed";


export type FilterOptionsTypes = {
    [key in keyof UserApplicationTypes | keyof JobDataTypes]: string | number;
}

export interface ApplicationsInitialState {
    applicationData: UserApplicationTypes[];
    filteredApplicationData: UserApplicationTypes[] | TableDataTypes[];
    cityArray: DropDownDataType[];
    jobPositionsArray: DropDownDataType[];
    monthsArray: DropDownDataType[];
    yearsArray: DropDownDataType[];
    statusArray: DropDownDataType[];
}


const initialState: ApplicationsInitialState = {
    applicationData: [],
    filteredApplicationData: [],
    cityArray: [],
    jobPositionsArray: [],
    monthsArray: [],
    yearsArray: [],
    statusArray: []

}

const formatDataToDropDownDataYpes = (items: string[] | number[]): DropDownDataType[] => {

    const uniqueItems = [...new Set(items.map(item => item.toString()))] //TO REMOVE DUPLICATES

    const formattedItems: DropDownDataType[] = uniqueItems.map((item) => ({
        value: item.toString(),
        label: item.toString()
    }));

    return formattedItems;  
}

const ApplicationsSlice = createSlice({
    name: "applications",
    initialState,
    reducers: {
        setApplicationData: (state, action: PayloadAction<UserApplicationTypes[]>) => {
            // STORE THE DATA IN STATES
            const data = action.payload
            state.applicationData = data; // THIS IS THE ORIG COPY THAT WE CAN USE TO RESTORE THE FILTERED / SHOWN DATA
            state.filteredApplicationData = data; //THIS DATA WILL BE SHOWN SO WE CAN FILTER IT

            // SET UP THE DROP DOWN DATA FOR FILTERS AND FORMAT THEM TO DROP DOWN DATA TYPES
            const cities = data.map((item) => item.currentCity);
            const formattedCities: DropDownDataType[] = formatDataToDropDownDataYpes(cities);
            state.cityArray = formattedCities; //UPDATE STATE
    
            const positionsArray = data.map((item) => item.position);
            const formattedPositions: DropDownDataType[] = formatDataToDropDownDataYpes(positionsArray);
            state.jobPositionsArray = formattedPositions;//UPDATE STATE

            const months = data.map((item) => item.month);
            const formattedMonths: DropDownDataType[] = formatDataToDropDownDataYpes(months);
            state.monthsArray = formattedMonths; //UPDATE STATE

            const years = data.map((item) => item.year);
            const formattedYears: DropDownDataType[] = formatDataToDropDownDataYpes(years);
            state.yearsArray = formattedYears; //UPDATE STATE

            const statuses = data.map((item) => item.employmentStatus);
            const formattedStatuses: DropDownDataType[] = formatDataToDropDownDataYpes(statuses);
            state.statusArray = formattedStatuses; //UPDATE STATE
        },
        filterApplicants: (state, action: PayloadAction<Partial<FilterOptionsTypes>>) => {
            const options = action.payload;
            const data = state.applicationData; //USE THE ORIGINAL DATA
            const filteredData = data.filter((application) => {
                return Object.entries(options).every(([key, value]) => {
                    return value ? application[key as keyof UserApplicationTypes] === value : true;
                });
            });
            console.log("filtered Data: ", JSON.stringify([... new Set(filteredData)], null, 2));
            state.filteredApplicationData = filteredData;
        },
        clearApplicantsFilter: (state) => {
            state.filteredApplicationData = state.applicationData;
        },
        searchApplicantsFilter: (state, action: PayloadAction<string>) => {
            const searchTerm = action.payload.toLowerCase();
            const data = state.filteredApplicationData;
            const filteredData = data.filter((item) => {
                return Object.values(item).some((value) => 
                    value !== null && value !== undefined && value.toString().toLowerCase().includes(searchTerm)
                );
            });

            state.filteredApplicationData = filteredData as UserApplicationTypes[]
        }
    }
})


export const {
    setApplicationData,
    filterApplicants,
    clearApplicantsFilter,
    searchApplicantsFilter
} = ApplicationsSlice.actions;

export default ApplicationsSlice.reducer;