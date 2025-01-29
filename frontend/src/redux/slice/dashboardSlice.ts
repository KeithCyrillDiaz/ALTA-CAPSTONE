import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface DashboardInitialState {
    chosenJobPosition: string;
}


const initialState: DashboardInitialState = {
    chosenJobPosition: "",
}

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setJobPosition: (state, action: PayloadAction<{field: keyof DashboardInitialState, value: string}>) => {
            const position = action.payload.value;
            const key = action.payload.field;
            state[key] = position;
        }
    }
})


export const {
    setJobPosition
} = dashboardSlice.actions;

export default dashboardSlice.reducer;