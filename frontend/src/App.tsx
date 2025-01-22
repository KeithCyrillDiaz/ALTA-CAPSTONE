import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const App: React.FC = () => {
  return(
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </Provider>
   
  )
}

export default App