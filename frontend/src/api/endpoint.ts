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
        FETCH_TOP_DATA: '/admin/dashboard/fetchTopData',
        FETCH_JOB_POSITIONS: '/admin/dashboard/fetchJobPositions'
    },
    applicants: {
        FETCH_ALL_USER_APPLICANTS: '/admin/application/fetchAll',
        FETCH_USER_APPLICANTS: '/admin/applicantion/fetchOne',//NEED ID
        UPDATE_STATUS: '/admin/application/updateStatus'//NEED ID
    },
    job: {
        FETCH_ALL_JOBS: '/admin/job/fetch',
        FETCH_ONE_JOB: '/admim/job/fetchOne',
        UPDATE_ALL: '/admin/job/updateInformation', //NEED ID
        UPDATE_STATUS: '/admin/job/updateStatus', //NEED ID
    }
 
}