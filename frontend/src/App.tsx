import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home, NotFoundPage, ViewJob } from "./pages";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ApplyJob from "./pages/client/ApplyJob";

const App: React.FC = () => {
  return(
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/job/apply/:id" element={<ApplyJob/>}/>

        {/* FOR MOBILE */}
        <Route path="/job/view" element={<ViewJob/>}/>

        {/* Catch-all 404 route */}
      <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </Provider>
   
  )
}

export default App