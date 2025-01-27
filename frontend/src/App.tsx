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
} from "./pages";

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
        <Route path="/admin/dashboard" element={<Dashboard/>}/>

        {/* Catch-all 404 route */}
      <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </Provider>
   
  )
}

export default App