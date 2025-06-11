import React from "react";
import Navbar from "../components/HomeComponents/Navbar";
import DashBoardSidebar from "../components/DashBoardSidebar";
import Channel from "../components/Channel";

const ChannelPage: React.FC = () => {
  return (
    <div className="flex flex-col text-white ">
      <Navbar />

      <div className="flex flex-1 text-white">
        <DashBoardSidebar />

        <div className="flex flex-1 justify-center bg-black w-full">
          <Channel />
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
