import React from "react";
import Sidebar from "../components/HomeComponents/Sidebar";
import LongVideos from "../components/LongVideos";
import Navbar from "../components/HomeComponents/Navbar";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-black text-white">
      
      <div className="w-full">
        <Navbar />
      </div>

      <div className="flex flex-1">
       
        <div className="w-60 mt-10">
          <Sidebar />
        </div>

        
        <div className="flex-1 mt-10 px-10">
          <LongVideos />
        </div>
      </div>
    </div>
  );
};

export default Layout;
