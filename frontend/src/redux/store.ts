import { configureStore } from '@reduxjs/toolkit';
import { 
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
        adminJob: adminJobReducer
    },
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;