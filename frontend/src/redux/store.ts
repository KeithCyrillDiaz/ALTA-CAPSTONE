import { configureStore } from '@reduxjs/toolkit';
import { 
    adminEmployeeReducer,
    adminJobReducer,
    applicationSReducer,
    dashBoardReducer, 
    jobReducer 
} from './slice';


export const store = configureStore({
    reducer: {
        job: jobReducer,
        
        // ADMIN
        adminDashboard: dashBoardReducer,
        adminApplications: applicationSReducer,
        adminJob: adminJobReducer,
        adminEmployee: adminEmployeeReducer
    },
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;