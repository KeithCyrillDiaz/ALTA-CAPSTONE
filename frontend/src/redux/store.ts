import { configureStore } from '@reduxjs/toolkit';
import { 
    dashBoardReducer, 
    jobReducer 
} from './slice';


export const store = configureStore({
    reducer: {
        job: jobReducer,
        dashboard: dashBoardReducer
    },
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;