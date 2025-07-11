import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import OTPcomponent from "./OTPcomponent";
import axios from "axios";
import toast from 'react-hot-toast';
import { motion } from "framer-motion";



const Signup: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showPass, setShowPass] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const validEmail = (input: string) => /\S+@\S+\.\S+/.test(input);
  const showPassword = () => setShowPass(!showPass);
  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!validEmail(input)) {
      toast.error("Please enter a valid email");
      return;
    }
    try {
      setSending(true);
      const res = await axios.post("http://localhost:3000/api/v1/get-otp", { data: input });

      if(res.status ===  200){
        toast.success("OTP sent to your email");
        setSending(false);
      }
    } catch (error) {
      setSending(false);
      toast.error("Error sending OTP");
    }
  };

  const verifyOTP = async () => {
    const otpString = otp.join("");
    try {
      setVerifying(true);
      const response = await axios.post("http://localhost:3000/api/v1/verify-otp", {
        otp: otpString,
        userEmail: input,
      });
      if(response.status === 200){
        toast.success("OTP Verified Successfully");
        setVerifying(false);
      }
    } catch (error) {
      toast.error("Invalid OTP");
      setVerifying(false);
    }
  };

  const signup = async () => {

    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    if (!password.trim()) {
      toast.error("Password cannot be empty");
      return;
    }

    if(!input.trim()){
      toast.error("Email cannot be empty");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/v1/insert-into-users-table", {
        enteredUsername: username,
        enteredEmail: input,
        enteredPassword: password,
      });

      if (response.status === 201) {
         const userId = response.data.user_id; 
        localStorage.setItem('email',input);
        localStorage.setItem('username',username);
        localStorage.setItem('user_id', userId);
        
        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <motion.div
    style={{
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      
    }}
      className="min-h-screen flex items-center justify-center bg-black px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >

      <motion.div
        className="hidden lg:flex flex-col items-center justify-center w-1/2 text-white"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        
        <h1 className="text-5xl font-extrabold tracking-tight selection:bg-white selection:text-black">
          The Real, Unbiased News.
        </h1>
      
      </motion.div>

      
      <motion.div
        className="w-full lg:w-1/2 bg-white rounded-2xl p-10 max-w-lg shadow-2xl"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-extrabold text-black text-center mb-8">
          Join DELTA
        </h1>

        <div className="space-y-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <label className="block text-sm font-semibold text-gray-800 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Create a username"
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-black  text-black transition-all duration-300"
            />
          </motion.div>

          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-black  text-black transition-all duration-300"
              />
              <motion.button
                onClick={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </motion.button>
            </div>
          </motion.div>

         
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <label className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
            <div className="flex gap-3">
              <input
                type="email"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 p-3 rounded-lg border border-gray-300 focus:border-black text-black transition-all duration-300"
              />
              <motion.button
           
                onClick={sendOTP}
                className="bg-black hover:cursor-pointer text-white px-5 py-3 rounded-lg font-semibold shadow-md"
              >
                {sending ? (
                  <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                ):(
                  "Send OTP"
                )}
       
              </motion.button>
            </div>
          </motion.div>

          
          <motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.9 }}
>
  <label className="block text-sm font-semibold text-gray-800 mb-1">OTP</label>
  <div className="flex gap-2 items-center">
    <OTPcomponent otp={otp} setOtp={setOtp} />

    <motion.button
      onClick={verifyOTP}
      className="bg-black hover:cursor-pointer text-white px-8 py-3 rounded-lg font-semibold shadow-md flex items-center justify-center min-w-[100px]"
    >
      {verifying ? (
        <motion.div
          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        "Verify"
      )}
    </motion.button>
  </div>
</motion.div>


          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            {loading ? (
              <div className="text-center text-gray-700 font-medium">
                Signing up...
                <motion.div
                  className="w-6 h-6 border-2 border-black border-t-transparent rounded-full mx-auto mt-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : (
              <motion.button
              
                onClick={signup}
                className="w-full bg-black hover:cursor-pointer text-white p-3 rounded-lg font-semibold shadow-md transition-all duration-300"
              >
                Sign Up
              </motion.button>
            )}
          </motion.div>

         
          <motion.p
            className="text-center text-gray-600 text-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            Already have an account?{" "}
            <motion.button
              onClick={() => navigate("/")}
              className="text-black font-semibold hover:cursor-pointer hover:underline"
            
            >
              Login
            </motion.button>
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Signup;