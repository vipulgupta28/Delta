import React from "react";
import { FaFire } from "react-icons/fa";
import { MdNewspaper } from "react-icons/md";

import { useNavigate } from "react-router-dom";

const DashBoardSidebar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="  w-50  ml-5 text-white flex flex-col gap-10 p-5 ">
        <button
         onClick={()=>navigate("/channelpage")}
         className="hover:hover:bg-[#2c2c2c]  hover:cursor-pointer w-50 animation duration-400 p-2 rounded flex gap-5 justify-left"><MdNewspaper fontSize={24}/>Upload News</button>

        <button
         onClick={()=>navigate("/usersuploadspage")}
         className="hover:hover:bg-[#2c2c2c]  hover:cursor-pointer w-50 animation duration-400 p-2 rounded flex gap-5 justify-left"><MdNewspaper fontSize={24}/>My Uploads</button>

        <button 
         onClick={()=>navigate("/userpostspage")}
         className="hover:hover:bg-[#2c2c2c]  hover:cursor-pointer w-50 animation duration-400 p-2 rounded flex gap-5 justify-left"><FaFire fontSize={24}/>My posts</button>

        
        <button 
        onClick={()=>navigate("/trendingpage")}
        className="hover:hover:bg-[#2c2c2c]  hover:cursor-pointer w-40 animation duration-400 p-2 rounded flex gap-5 justify-left"><FaFire fontSize={24}/>Analytics</button>



                 <button 
        onClick={()=>navigate("/researchpage")}
        className="hover:hover:bg-[#2c2c2c]  hover:cursor-pointer w-70 animation duration-400 p-2 rounded flex gap-5 justify-left"><FaFire fontSize={24}/>Debate Rooms Joined</button>

        <div className="">
         <button className="bg-white p-4 w-40 rounded-[50px] text-black font-medium hover:cursor-pointer hover:bg-gray-200">
              Inbox
            </button>
        </div>
       
      </div>

    </>
  );
};

export default DashBoardSidebar;
