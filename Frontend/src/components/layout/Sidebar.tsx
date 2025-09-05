import React, { useState } from "react";
import {
  FaRegNewspaper,
  FaStopwatch,
  FaRobot,
  FaInbox,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { IoMdGlobe } from "react-icons/io";
import { MdWhatshot } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [

    { path: "/detailnews", icon: <FaRegNewspaper size={18} />, label: "Detailed News" },
    { path: "/home", icon: <FaStopwatch size={18} />, label: "Bullets" },
    { path: "/happenings", icon: <IoMdGlobe size={18} />, label: "Share News" },
    { path: "/trending", icon: <MdWhatshot size={18} />, label: "Hot Topics" },
    { path: "/ai", icon: <FaRobot size={18} />, label: "Anchor AI" },
  ];

  return (
    <>
      {/* Hamburger for Mobile */}
      <div className="lg:hidden bg-[#121212] text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">News App</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#121212] text-white z-50 border-r border-zinc-800 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:flex
        `}
      >
        <nav className="flex-1 px-3 py-4 mt-10 space-y-5 pt-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false); // close sidebar after click (mobile only)
              }}
              className={`flex hover:cursor-pointer items-center w-full px-4 py-2.5 text-sm rounded-xl transition-colors
                ${isActive(item.path)
                  ? "bg-zinc-800 text-white font-medium shadow-sm"
                  : "text-gray-300 hover:bg-zinc-800 hover:text-white"}`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className="px-4 py-4">
            <button
            onClick={()=>navigate("/inbox")}
              className="flex items-center hover:cursor-pointer justify-center w-full bg-white text-black py-2.5 px-4 rounded-md 
              text-sm font-medium focus:ring-2 focus:ring-offset-2"
            >
              <FaInbox className="mr-2" />
              Inbox <span className="px-3 py-1 absolute right-8 bg-red-700 text-black rounded-full">1</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
