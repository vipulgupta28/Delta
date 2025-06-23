import React from "react";
import { FaFire } from "react-icons/fa";
import { MdNewspaper } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to determine if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-50 ml-5 text-white flex flex-col gap-10 p-5">
      <button
        onClick={() => navigate("/detailnewspage")}
        className={`hover:bg-[#2c2c2c] hover:cursor-pointer w-50 animation duration-400 p-2 rounded flex gap-5 justify-left ${
          isActive("/detailnewspage") ? "bg-[#2c2c2c]" : ""
        }`}
      >
        <MdNewspaper fontSize={24} /> Detailed News
      </button>

      <button
        onClick={() => navigate("/homepage")}
        className={`hover:bg-[#2c2c2c] hover:cursor-pointer w-50 animation duration-400 p-2 rounded flex gap-5 justify-left ${
          isActive("/homepage") ? "bg-[#2c2c2c]" : ""
        }`}
      >
        <MdNewspaper fontSize={24} /> 1-minute News
      </button>

      <button
        onClick={() => navigate("/happeningspage")}
        className={`hover:bg-[#2c2c2c] hover:cursor-pointer w-50 animation duration-400 p-2 rounded flex gap-5 justify-left ${
          isActive("/happeningspage") ? "bg-[#2c2c2c]" : ""
        }`}
      >
        <FaFire fontSize={24} /> What's happening
      </button>

      <button
        onClick={() => navigate("/trendingpage")}
        className={`hover:bg-[#2c2c2c] hover:cursor-pointer w-40 animation duration-400 p-2 rounded flex gap-5 justify-left ${
          isActive("/trendingpage") ? "bg-[#2c2c2c]" : ""
        }`}
      >
        <FaFire fontSize={24} /> Hot Topics
      </button>

      <button
        onClick={() => navigate("/debateroomspage")}
        className={`hover:bg-[#2c2c2c] hover:cursor-pointer w-50 animation duration-400 p-2 rounded flex gap-5 justify-left ${
          isActive("/debateroomspage") ? "bg-[#2c2c2c]" : ""
        }`}
      >
        <FaFire fontSize={24} /> Debate Rooms
      </button>

      <div>
        <button className="bg-white p-4 w-40 rounded-[50px] text-black font-medium hover:cursor-pointer hover:bg-gray-200">
          Inbox
        </button>
      </div>
    </div>
  );
};

export default Sidebar;