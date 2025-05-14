import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Navbar: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [storedUsername, setStoredUsername] = useState<string | null>(null);
    const [email, setStoredEmail] = useState("");
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const toggleDropdown = () => {
        setVisible((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const username = localStorage.getItem("username");
        setStoredUsername(username);
    }, []);

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
          setStoredEmail(storedEmail);
        } else {
          setStoredEmail("your email"); 
        }
      }, []);

    const changeUsername = async () =>{
        navigate("/otpgatewaypage")
         await axios.post("http://localhost:3000/api/v1/get-otp",{
                data:email
        })
        localStorage.setItem('key',"1");       
    }

    const changePassword = async () =>{
        navigate("/otpgatewaypage")
        await axios.post("http://localhost:3000/api/v1/get-otp",{
               data:email
       })
       localStorage.setItem('key',"2");
   }

   const changeEmail = async () =>{
    
   navigate("/otpgatewaypage")
    await axios.post("http://localhost:3000/api/v1/get-otp",{
           data:email
   })
   localStorage.setItem('key',"3");
  }

    const signout = () =>{
        localStorage.removeItem("username");
        navigate("/");
    } 

    return (
        <>
            <nav className="relative">
                <div className="flex justify-between p-10 items-center">
                    <h1
                    onClick={()=> navigate("/homepage")}
                     className="text-5xl hover:cursor-pointer font-extrabold">DELTA</h1>
                    
                    <input 
                        type="text"
                        placeholder="Search for Topics, Channels, Creators"
                        className="border border-gray-400 rounded-[100px]  p-3 w-250"
                    />
                    
                    <button
                        onClick={toggleDropdown}
                        className="bg-white hover:cursor-pointer hover:bg-gray-200 rounded-full font-bold transition duration-400 w-auto px-5 h-13 flex items-center justify-center text-black"
                    >
                        {storedUsername ?? "User"}
                    </button>
                </div>

                <AnimatePresence>
                    {visible && (
                        <motion.div
                            ref={dropdownRef}
                            className="absolute right-10 bg-white shadow-lg border border-gray-200 rounded-md w-60 p-3 z-50"
                            initial={{ opacity: 0, y: -10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <ul className="flex flex-col gap-2 font-bold">
                                <li
                                onClick={()=>navigate("/ChannelPage")}
                                 className="hover:bg-gray-100 p-2 rounded cursor-pointer text-black font-medium ">My Channel</li>
                               
                                <li 
                                onClick={changeUsername}
                                className="hover:bg-gray-100 p-2 rounded cursor-pointer text-black font-medium ">
                                Change Username
                                </li>

                                <li
                                onClick={changePassword}
                                className="hover:bg-gray-100 p-2 rounded cursor-pointer text-black font-medium ">
                                Change Password
                                </li>

                                <li
                                onClick={changeEmail}
                                className="hover:bg-gray-100 p-2 rounded cursor-pointer text-black font-medium ">
                                Change Email
                                </li>

                                <li
                                onClick={signout} 
                                className="hover:bg-gray-100 p-2 rounded cursor-pointer text-black font-medium ">Sign Out</li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
};

export default Navbar;
