import React from "react";
import Sidebar from "./Sidebar";
import { VideoSpace } from "../features/videos";
import Navbar from "./Navbar";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white">
      {/* Top Navbar */}
      <div className="w-full">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - will be fixed or static depending on screen size */}
        <Sidebar />

        {/* Main Video Space Content */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <VideoSpace />
        </div>
      </div>
    </div>
  );
};

export default Layout;
