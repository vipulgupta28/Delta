import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

const App: React.FC = () => {
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

          body, html {
            font-family: 'Poppins', sans-serif;
            overflow-x: hidden;  /* Remove horizontal scrollbar */
          }
        `}
      </style>
    <UserProvider>
      <BrowserRouter>
        <div
          className="bg-black min-h-screen"
        
        >
          <Toaster
            position="bottom-left"
            toastOptions={{
              style: { background: "#333", color: "#fff" },
            }}
          />
          <AppRoutes />
        </div>
      </BrowserRouter>
    </UserProvider>
    </>
  );
};

export default App;
