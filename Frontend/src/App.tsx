import React from "react";
import  AppRoutes  from "./routes/AppRoutes";
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from "react-router-dom";

export const App:React.FC = () =>{
  return(
    <>
    <BrowserRouter>
    <div className="bg-black min-h-screen"
     style={{
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      
    }}>
       <Toaster
        position="bottom-left"
        toastOptions={{
          className: '',
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    <AppRoutes />
    </div>
        
    </BrowserRouter>
    </>
  )
}

export default App;