import React from "react";
import { FaFire } from "react-icons/fa";
import { MdNewspaper } from "react-icons/md";
import { FaTv } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="  w-50  ml-5 text-white flex flex-col gap-10 p-5 ">
        <button
        onClick={()=>navigate("/homepage")}
         className="hover:hover:bg-[#2c2c2c]  hover:cursor-pointer w-40 animation duration-400 p-2 rounded flex gap-5 justify-left"><MdNewspaper fontSize={24}/>Live</button>

        <button
        onClick={()=>navigate("/homepage")}
         className="hover:hover:bg-[#2c2c2c]  hover:cursor-pointer w-40 animation duration-400 p-2 rounded flex gap-5 justify-left"><MdNewspaper fontSize={24}/>Read News</button>

        <button 
        onClick={()=>navigate("/happeningspage")}
        className="hover:hover:bg-[#2c2c2c]  hover:cursor-pointer w-50 animation duration-400 p-2 rounded flex gap-5 justify-left"><FaFire fontSize={24}/>What's happening</button>

        
        <button 
        onClick={()=>navigate("/trendingpage")}
        className="hover:hover:bg-[#2c2c2c]  hover:cursor-pointer w-40 animation duration-400 p-2 rounded flex gap-5 justify-left"><FaFire fontSize={24}/>Trending</button>

         <button 
        onClick={()=>navigate("/researchpage")}
        className="hover:hover:bg-[#2c2c2c]  hover:cursor-pointer w-40 animation duration-400 p-2 rounded flex gap-5 justify-left"><FaFire fontSize={24}/>Our Research</button>

        <div className="">
         <button className="bg-white p-4 w-40 rounded-[50px] text-black font-medium hover:cursor-pointer hover:bg-gray-200">
              Inbox
            </button>
        </div>
       
      </div>

    </>
  );
};

export default Sidebar;
