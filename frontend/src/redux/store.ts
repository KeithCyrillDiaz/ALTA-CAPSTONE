import { configureStore } from '@reduxjs/toolkit';
import { 
    applicationSReducer,
    dashBoardReducer, 
    jobReducer 
} from './slice';


export const store = configureStore({
    reducer: {
        job: jobReducer,
        
        // ADMIN
        dashboard: dashBoardReducer,
        applications: applicationSReducer
    },
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;