import React from "react";
import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ApplyJob from "./pages/client/ApplyJob";


import { 
  
  // CLIENT
  Home, 
  NotFoundPage, 
  ViewJob,

  //ADMIN
  Login, 
  Dashboard,
  Jobs, 
} from "./pages";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import Applicants from "./pages/admin/Applicants/Applicants";
import ViewApplicantRecord from "./pages/admin/Applicants/ViewApplicantRecord";
import ViewJobDetails from "./pages/admin/Job/ViewJobDetails";

const App: React.FC = () => {
  return(
    <Provider store={store}>
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
        
      

        {/* Catch-all 404 route */}
      <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </Provider>
   
  )
}

export default App