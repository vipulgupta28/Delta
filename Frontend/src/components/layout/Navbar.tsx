import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";


const Navbar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setVisible((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const requestOtp = async (key: string) => {
    try {
      await api.post("/get-otp", { data: email });
      localStorage.setItem("key", key);
      navigate("/otpgateway");
    } catch (error) {
      console.error("Failed to request OTP:", error);
    }
  };

  const [placeholderText, setPlaceholderText] = useState("Search for Topics, Channels, Creators");

useEffect(() => {
  const updatePlaceholder = () => {
    if (window.innerWidth < 640) {
      setPlaceholderText("Search for News");
    } else {
      setPlaceholderText("Search for Topics, Channels, Creators");
    }
  };

  // Initial set
  updatePlaceholder();

  // Add resize event listener
  window.addEventListener("resize", updatePlaceholder);
  return () => window.removeEventListener("resize", updatePlaceholder);
}, []);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        setEmail(res.data.user.email);
        setUsername(res.data.user.username);
      } catch (err) {
        console.error("Failed to fetch user", err);
        setEmail("Not logged in");
      }
    };

    fetchUser();
  }, []);

  const signOut = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <nav className="w-full px-4 sm:px-6 py-4 border-b border-zinc-800 bg-black ">
      <div className="flex items-center justify-between flex-wrap gap-4">
        
        {/* Logo */}
        <div onClick={() => navigate("/home")} className="cursor-pointer">


  {/* Show text on desktop */}
  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-white hidden sm:block whitespace-nowrap">
    [Deltanews]
  </h1>
</div>


        {/* Search Bar (flex-1 keeps it centered and stretchy) */}
        <div className="flex-1 flex justify-center">
        <input
  type="text"
  placeholder={placeholderText}
  className="bg-zinc-900 text-white rounded-full px-5 py-2 w-full max-w-xl focus:outline-none focus:ring-1 focus:ring-[#0057A0]"
/>

        </div>

        <button
          onClick={toggleDropdown}
          className="bg-white text-black hover:cursor-pointer font-semibold rounded-full px-6 py-2 hover:bg-gray-200 transition duration-300 whitespace-nowrap"
        >
          {username || "User"}
        </button>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={dropdownRef}
            className="absolute right-4 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="flex flex-col py-2 text-sm text-black font-medium">
              <li
                onClick={() => navigate("/profile")}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
              >
                My Channel
              </li>
              <li
                onClick={() => requestOtp("1")}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
              >
                Change Username
              </li>
              <li
                onClick={() => requestOtp("2")}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
              >
                Change Password
              </li>
              <li
                onClick={() => requestOtp("3")}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
              >
                Change Email
              </li>
              <li
                onClick={signOut}
                className="px-4 py-3 hover:bg-red-100 text-red-600 cursor-pointer transition font-semibold"
              >
                Sign Out
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
