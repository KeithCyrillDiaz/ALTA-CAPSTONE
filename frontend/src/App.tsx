import React, { Suspense} from "react";
import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

import {
  Home,
  ApplyJob,
  ViewJob,
  NotFoundPage,
  Login,
  Dashboard,
  Jobs,
  Applicants,
  ViewApplicantRecord,
  ViewJobDetails,
  AddJobDetails,
} from "./pages";
import Employees from "./pages/admin/Employees/Employees";

const App: React.FC = () => {
  return(
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}></Suspense>
      <Routes>
        {/* CLIENT PAGES */}
        <Route path="/" element={<Home/>}/>
        <Route path="/job/apply/:id" element={<ApplyJob/>}/>

        {/* FOR MOBILE */}
        <Route path="/job/view" element={<ViewJob/>}/>


        {/* ADMIN PAGES */}
        <Route path="/admin/login" element={<Login/>}/>
        
      
        {/*PROTECTED ROUTES */}
          <Route path="/admin/dashboard" element={
            <AdminProtectedRoute>
              <Dashboard/>
            </AdminProtectedRoute>
          }/>

          {/* APPLICANTS */}
          <Route path="/admin/applicants" element={
            <AdminProtectedRoute>
              <Applicants/>
            </AdminProtectedRoute>
          }/>

          <Route path="/admin/applicant/view/:id" element={
            <AdminProtectedRoute>
              <ViewApplicantRecord/>
            </AdminProtectedRoute>
          }/>
          {/* ........ */}


          {/* JOBS */}
          <Route path="/admin/jobs" element={
            <AdminProtectedRoute>
              <Jobs/>
            </AdminProtectedRoute>
          }/>
          
          <Route path="/admin/jobs/view/:id" element={
            <AdminProtectedRoute>
              <ViewJobDetails/>
            </AdminProtectedRoute>
          }/>
        
          <Route path="/admin/jobs/add" element={
            <AdminProtectedRoute>
              <AddJobDetails/>
            </AdminProtectedRoute>
          }/>
          {/* ........ */}

          {/* JOBS */}
          <Route path="/admin/employees" element={
            <AdminProtectedRoute>
              <Employees/>
            </AdminProtectedRoute>
          }/>
          
          {/* ........ */}




        {/* Catch-all 404 route */}
      <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </Provider>
   
  )
}

export default App