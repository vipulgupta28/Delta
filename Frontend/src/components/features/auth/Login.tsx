import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../../api/api";
import GoogleButton from "./GoogleButton";


const Login: React.FC = () => {
  const navigate = useNavigate();
 
  
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");





  useEffect(() => {
    const verifyMagicLink = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        toast.error("Invalid login link.");
        navigate("/");
        return;
      }

      try {
        const res = await api.post(
          "/magic-login",
          { token },
          { withCredentials: true }
        );

        toast.success("Login successful!");
        localStorage.setItem("authToken", res.data.token); // if JWT
        navigate("/home");
      } catch (err: any) {
        console.error("Verification failed", err);
        toast.error("Invalid or expired link.");
        navigate("/");
      }
    };

    verifyMagicLink();
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me", {
          withCredentials: true,
        });
        setEmail(res.data.user?.email || "Not logged in");
      } catch (err) {
        console.error("Fetch user failed", err);
        setEmail("Not logged in");
      }
    };
    fetchUser();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
  
    try {

      if (email && username){
       await api.post("/send-magic-link", { email });
        toast.success("Magic link sent! Check your email.");
        setLoading(false);
        return;
      }







  
  
      throw new Error("Please enter your email (and username if registered).");
  
    } catch (err: any) {
      console.error("Login failed", err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "Please try again.";
      toast.error("Login failed. " + errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-black px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="hidden lg:flex flex-col items-center justify-center w-1/2 text-white"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1 className="text-5xl font-extrabold tracking-tight text-center selection:bg-white selection:text-black">
          Everything, Everywhere, All at Once
        </h1>
      </motion.div>

      <motion.div
        className="w-full lg:w-1/2 bg-white rounded-2xl p-10 max-w-lg shadow-2xl"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h1 className="text-4xl selection:bg-black selection:text-white font-extrabold text-black text-center mb-8">
          Welcome Back to <span className="text-gray-800 font-extrabold">DELTA</span>
        </h1>

        <div className="space-y-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <label className="block text-sm selection:bg-black selection:text-white font-bold text-gray-800 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                let sanitized = e.target.value.replace(/['"=;()\\#-]/g, "");
                const sqlKeywords = [
                  "select", "insert", "delete", "update", "drop", "alter",
                  "truncate", "exec", "union", "or", "and", "--", "#", ";"
                ];
                sqlKeywords.forEach(keyword => {
                  const regex = new RegExp(`\\b${keyword}\\b`, "gi");
                  sanitized = sanitized.replace(regex, "");
                });
                setUsername(sanitized);
              }}
              placeholder="Enter your username"
              className="w-full selection:bg-black selection:text-white p-3 rounded-lg border border-gray-300 focus:border-black text-black transition-all duration-300"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <label className="block text-sm selection:bg-black selection:text-white font-bold text-gray-800 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  let sanitized = e.target.value.replace(/['"=;()\\#-]/g, "");
                  const sqlKeywords = [
                    "select", "insert", "delete", "update", "drop", "alter",
                    "truncate", "exec", "union", "or", "and", "--", "#", ";"
                  ];
                  sqlKeywords.forEach(keyword => {
                    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
                    sanitized = sanitized.replace(regex, "");
                  });
                  setEmail(sanitized);
                }}
                placeholder="Enter your email"
                className="w-full p-3 selection:bg-black selection:text-white rounded-lg border border-gray-300 focus:border-black text-black transition-all duration-300"
              />
         
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {error && (
              <motion.div
                className="text-red-600 text-sm text-center font-medium mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            {loading ? (
              <div className="text-center text-gray-700 font-medium">
                Logging in...
                <motion.div
                  className="w-6 h-6 border-2 border-black border-t-transparent rounded-full mx-auto mt-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : (

              <div className="flex flex-col gap-5">
  {/* Normal login button */}
  <motion.button
    onClick={handleLogin}
    className="w-full selection:bg-white selection:text-black hover:cursor-pointer bg-black text-white p-3 rounded-lg font-semibold shadow-md transition-all duration-300"
  >
    Login
  </motion.button>

  {/* Divider */}
  <div className="flex items-center gap-3">
    <div className="flex-1 h-px bg-gray-300"></div>
    <span className="text-gray-500 text-sm font-medium selection:bg-black selection:text-white">Or</span>
    <div className="flex-1 h-px bg-gray-300"></div>
  </div>

  {/* Google button */}
  <motion.button
    className="w-full selection:bg-white selection:text-black bg-black text-white p-3 rounded-lg font-semibold shadow-md transition-all duration-300 flex items-center justify-center gap-2"
  >
    <GoogleButton />
  </motion.button>
</div>

              
            )}
           

            
          </motion.div>
          

        
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
