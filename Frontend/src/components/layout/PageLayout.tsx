import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = "" }) => {
  return (
    <div className={`flex flex-col w-screen h-screen bg-black text-white ${className}`}>
      {/* Top Navbar */}
      <div className="w-full ">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-60 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
