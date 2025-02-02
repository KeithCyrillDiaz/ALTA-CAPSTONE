import { Router } from "express";
import { authentication } from "../middleware/authentication";
import { adminLogIn, adminLogOut } from "../controllers/admin/adminController";
import { createJob, deleteJobDetailsById, getJobApplications, getJobDetails, updateJobInformation, updateJobStatus } from "../controllers/admin/jobController";
import { deleteUserApplication, getAllUserApplicants, getUserApplicantRecord, updateEmploymentStatus } from "../controllers/admin/userApplicationController";
import { getJobPositions, getTopData, getTotalData } from "../controllers/admin/dashboardController";
import { createEmployee, getAllEmployees, updateEmployeeDetails } from "../controllers/admin/employeeController";


export default (router: Router) => {

    router.post('/login', adminLogIn);
    router.post('/logout', adminLogOut);
    
    //APPLY TOKEN AUTHENTICATION FOR SECURING API
    router.use('/admin', authentication);

    //PROTECTED API ROUTES

    //JOB
    router.post('/admin/job/create', createJob);
    router.get('/admin/job/fetch', getJobApplications);
    router.get('/admim/job/fetchOne/:id', getJobDetails)
    router.patch('/admin/job/updateStatus/:id', updateJobStatus);
    router.patch('/admin/job/updateInformation/:id', updateJobInformation);
    router.delete('/admin/job/deleteOne/:id', deleteJobDetailsById);

    //APPLICATION
    router.patch('/admin/application/updateStatus/:id', updateEmploymentStatus);
    router.get('/admin/application/fetchAll', getAllUserApplicants);
    router.get('/admin/applicantion/fetchOne/:id', getUserApplicantRecord)
    router.delete('/admin/application/delete/:id', deleteUserApplication);

    //DASHBOARD
    router.post('/admin/dashboard/totalCounts', getTotalData);
    router.post('/admin/dashboard/fetchTopData', getTopData);
    router.get('/admin/dashboard/fetchJobPositions', getJobPositions);

    // EMPLOYEES
    router.post('/admin/employees/create', createEmployee);
    router.get('/admin/employees/fetchAll', getAllEmployees)
    router.patch('/admin/employees/update/:id', updateEmployeeDetails)
}