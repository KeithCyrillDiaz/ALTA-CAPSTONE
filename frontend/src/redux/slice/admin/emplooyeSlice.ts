


import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TableDataTypes } from "../../../components/admin/table/Table";
import { EmployeeDataTypes } from "../../../pages/admin/employees/Employees";

export type FilterJobOptionsTypes = {
    [key in keyof EmployeeDataTypes]: string | number;
}

export interface EmployeeInitialState {
    employeesData: EmployeeDataTypes[]
    filteredEmployeesData: EmployeeDataTypes[] | TableDataTypes[];
    editableForm: EmployeeDataTypes | null;
}


const initialState: EmployeeInitialState = {
    employeesData: [],
    filteredEmployeesData: [],
    editableForm: null
}

const EmployeesSlice = createSlice({
    name: "Employees",
    initialState,
    reducers: {
        setAdminEmployeesData: (state, action: PayloadAction<EmployeeDataTypes[]>) => {
            // STORE THE DATA IN STATES
            const data = action.payload;
            state.filteredEmployeesData = data;
            state.employeesData =data;
        },
        filterAdminEmployeeData: (state, action: PayloadAction<Partial<FilterJobOptionsTypes>>) => {
            const options = action.payload;
            const data = state.employeesData; //USE THE ORIGINAL DATA
            const filteredData = data.filter((employee) => {
                return Object.entries(options).every(([key, value]) => {
                    return value ? employee[key as keyof EmployeeDataTypes] === value : true;
                });
            });
            console.log("filtered Data: ", JSON.stringify([... new Set(filteredData)], null, 2));
            state.filteredEmployeesData = filteredData;
        },

        setEmployeeEditableForm: (state, action: PayloadAction<EmployeeDataTypes>) => {
            state.editableForm = action.payload;
        },

        updateEmployeeEditableForm: (state, action: PayloadAction<{field: keyof EmployeeDataTypes, value: number | string | boolean}>) => { 
            if(!state.editableForm) {
                console.log("Editable Employee Form is Null");
                return;
            }
           
            const prev = state.editableForm;
            const {field, value} = action.payload;
            const newData: EmployeeDataTypes = {
                ...prev,
                [field]: value
            }

            state.editableForm = newData;
        }
    }
})


export const {
    setAdminEmployeesData,
    filterAdminEmployeeData,
    setEmployeeEditableForm,
    updateEmployeeEditableForm
} = EmployeesSlice.actions;

export default EmployeesSlice.reducer;