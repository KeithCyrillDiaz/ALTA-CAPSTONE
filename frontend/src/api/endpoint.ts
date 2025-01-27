// API URLs organized in one file


export const endpointClient = {
    jobURL: {
        APPLY_JOB: '/client/job/apply',
        FETCH_JOBS: '/client/job/getOpenJobs',
        FETCH_CHOSEN_JOB: '/client/job/getChosenJob'
    }
}


export const endpointAdmin = {
    token: {
        GET_ACCESS_TOKEN: '/getAccessToken',
    },
    ADMIN_LOGIN: '/login',
}