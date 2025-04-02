import React from "react";
import  AppRoutes  from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";

export const App:React.FC = () =>{
  return(
    <>
    <BrowserRouter>
        <AppRoutes />
    </BrowserRouter>
    </>
  )
}

export default App;