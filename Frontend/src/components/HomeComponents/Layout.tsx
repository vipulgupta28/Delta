import React from "react";
import Sidebar from "./Sidebar";
import VideoSpace from "./VideoSpace";
import Navbar from "./Navbar";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen text-black">
      {/* Navbar */}
      <div className="w-full h-16">
        <Navbar />
      </div>

      <div className="flex ">
        {/* Sidebar */}
        <div className="w-60 mt-10 h-full">
          <Sidebar />
        </div>

        {/* Main Video Area */}
        <div className="flex-1 w-50 h-150 flex mt-10">
          <VideoSpace />
        </div>
      </div>
    </div>
  );
};

export default Layout;
