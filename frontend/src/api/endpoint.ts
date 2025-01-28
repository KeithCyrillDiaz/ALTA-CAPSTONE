// API URLs organized in one file


export const endpointClient = {
    jobURL: {
        APPLY_JOB: '/client/job/apply',
        FETCH_JOBS: '/client/job/getOpenJobs',
        FETCH_CHOSEN_JOB: '/client/job/getChosenJob'
    }
}


export const endpointAdmin = {
    ADMIN_LOGIN: '/login',
    ADMIN_LOGOUT: '/logout',
    token: {
        GET_ACCESS_TOKEN: '/getAccessToken',
    },
    ADMIN_TOTAL: '/admin/dashboard/totalCounts',
    dashboard: {
        FETCH_TOP_DATA: '/admin/dashboard/fetchTopData'
    }
 
}