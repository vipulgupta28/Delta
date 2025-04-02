import React from "react";
import { FaFire } from "react-icons/fa";
import { MdNewspaper } from "react-icons/md";
import { FaTv } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className=" left-5 h-screen w-50 pt-10 text-black flex flex-col gap-10 p-5">
        <button
        onClick={()=>navigate("/homepage")}
         className="hover:bg-black hover:text-white hover:cursor-pointer w-40 animation duration-400 p-2 rounded flex gap-5 justify-left"><MdNewspaper fontSize={24}/>News</button>
        <button className="hover:bg-black hover:text-white hover:cursor-pointer w-40 animation duration-400 p-2 rounded flex gap-5 justify-left"><FaTv fontSize={24}/>Channels</button>
        <button className="hover:bg-black hover:text-white hover:cursor-pointer w-40 animation duration-400 p-2 rounded flex gap-5 justify-left"><FaFire fontSize={24}/>Trending</button>
      </div>
    </>
  );
};

export default Sidebar;
