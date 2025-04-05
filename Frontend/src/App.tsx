import React from "react";
import  AppRoutes  from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";

export const App:React.FC = () =>{
  return(
    <>
    <BrowserRouter>
    <div className="bg-black min-h-screen"
     style={{
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      
    }}>
    <AppRoutes />
    </div>
        
    </BrowserRouter>
    </>
  )
}

export default App;