import React from "react";
import DashBoardSidebar from "../components/DashBoardSidebar";
import UsersUploads from "../components/UsersUploads";
import Navbar from "../components/HomeComponents/Navbar";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-black text-white">
      
      <div className="w-full">
        <Navbar />
      </div>

      <div className="flex flex-1">
       
        <div className="w-60 mt-10">
          <DashBoardSidebar />
        </div>

        
        <div className="flex-1 mt-10 px-10">
          <UsersUploads />
        </div>
      </div>
    </div>
  );
};

export default Layout;
