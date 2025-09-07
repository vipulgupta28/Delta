import React, { useState,useRef,useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import OTPcomponent from "./OTPcomponent";
import axios from "axios";
import toast from 'react-hot-toast';
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha"
import api from "../../../api/api";


const Signup: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showPass, setShowPass] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [availability, setAvailability] = useState<"checking" | "available" | "taken" | null>(null);
  const recaptchaRef = useRef(null);
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState("");


  const validEmail = (input: string) => /\S+@\S+\.\S+/.test(input);  // Email Validation
  const showPassword = () => setShowPass(!showPass);
  const navigate = useNavigate();


  // Username Availability Check
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (username.trim() !== "") {
        checkUsername(username);
      } else {
        setAvailability(null);
      }
    }, 500); 

    return () => clearTimeout(delayDebounce);
  }, [username]);

  const checkUsername = async (username: string) => {
    try {
      setAvailability("checking");
      const res = await api.get(`/check-username?username=${username}`);
      setAvailability(res.data.exists ? "taken" : "available");
    } catch (error) {
      console.error("Error checking username", error);
      setAvailability(null);
    }
  };

//Password Strength Check
  let score = 0;

  const getPasswordStrength = (password: string) => {
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Too Weak", color: "border-red-500" };
  if (score === 2 || score === 3) return { label: "Moderate", color: "border-yellow-400" };
  return { label: "Strong", color: "border-green-500" };
  };
  const strength = getPasswordStrength(password);


  //Captcha Validation
  const handleCaptchaChange = (token: string | null) => {
    setVerified(!!token);
    setToken(token || "");
  };


  // Send OTP to the email.
  const sendOTP = async () => {
    if (!validEmail(input)) {
      toast.error("Please enter a valid email");
      return;
    }
    try {
      setSending(true);
      const res = await api.post("/get-otp", { data: input });

      if(res.status ===  200){
        toast.success("OTP sent to your email");
        setSending(false);
      }
    } catch (error) {
      setSending(false);
      toast.error("Error sending OTP");
    }
  };

  //Verify the entered OTP
  const verifyOTP = async () => {
    const otpString = otp.join("");
    try {
      setVerifying(true);
      const response = await api.post("/verify-otp", {
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

     if (!verified) {
      toast.error("Please complete the CAPTCHA");
      return;
    }

    if(score < 4){
      toast.error("Use a strong password");
      return;
    }

    if(availability === "taken"){
      toast.error("Username already taken")
      return;
    }

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
      const response = await api.post("/signup", {
        enteredUsername: username,
        enteredEmail: input,
        enteredPassword: password,
        captchaToken:token,
      },{ withCredentials: true });

      if (response.status === 201) { 
        setTimeout(() => {
          setLoading(false);
          navigate("/homepage");
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
            <div className="flex justify-between">
                <label className="block text-sm font-semibold text-gray-800 mb-1">Username</label>
                {availability === "checking" && <p className="text-blue-500">Checking...</p>}
                {availability === "available" && <p className="text-green-500">Available</p>}
                {availability === "taken" && <p className="text-red-500">Already taken</p>}
            </div>
            
            <input
              type="text"
              value={username}
               onChange={(e) => {
                      const input = e.target.value;             
                      let sanitized = input.replace(/['"=;()\\#-]/g, "");
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
              placeholder="Create a username"
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-black  text-black transition-all duration-300"
            />
          </motion.div>

          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex justify-between">
              <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
              <span className="text-sm font-medium text-gray-700">{strength.label}</span>
            </div>
            
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => {
                    const input = e.target.value;
                    let sanitized = input.replace(/['"=;()\\#-]/g, "");
                    const sqlKeywords = [
                      "select", "insert", "delete", "update", "drop", "alter",
                      "truncate", "exec", "union", "or", "and", "--", "#", ";"
                    ];
                    sqlKeywords.forEach(keyword => {
                      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
                      sanitized = sanitized.replace(regex, "");
                    });
                    setPassword(sanitized);
                  }}
                placeholder="Create a password"
                className={`w-full p-3 rounded-lg border ${strength.color} text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-gray-100`}
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
                <div className="pt-5 flex justify-center">
                    <ReCAPTCHA
                    sitekey= {import.meta.env.VITE_CAPTCHA_SITE_KEY}
                    onChange={handleCaptchaChange}
                    ref={recaptchaRef}
                    />
                </div>
            
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