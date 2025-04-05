import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePassword = () => {
    setShowPass(!showPass);
  };

  const handleForgotPassword = () => {
    navigate("/OTPgatewayPage");
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/api/v1/login-into", {
        enteredUsername: username,
        enteredPassword: password,
      });

      if (response.status === 200) {

        localStorage.setItem("username",username);
        setTimeout(() => {
          setLoading(false);
          navigate("/homepage");
        }, 1000);
      }
    } catch (error) {
      setLoading(false);
      setError("Invalid username or password.");
    }
  };

  return (
    <motion.div
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
          Welcome Back to <span className="text-gray-800 font-extrabold">DELTA</span>
        </h1>

        <div className="space-y-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <label className="block text-sm font-bold text-gray-800 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-black  text-black transition-all duration-300"
            />
          </motion.div>

          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <label className="block text-sm font-bold text-gray-800 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-black   text-black transition-all duration-300"
              />
              <motion.button
               onClick={togglePassword}
                className="absolute right-3 top-1/2 hover:cursor-pointer -translate-y-1/2 text-gray-600"
             
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
              <motion.button
           
                onClick={handleLogin}
                className="w-full hover:cursor-pointer bg-black text-white p-3 rounded-lg font-semibold shadow-md transition-all duration-300"
              >
                Login
              </motion.button>
            )}
          </motion.div>

          
          <motion.p
            className="text-center text-gray-600 text-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <motion.button
              onClick={handleForgotPassword}
              className="text-black font-semibold hover:cursor-pointer hover:underline"
      
            >
              Forgot Password?
            </motion.button>
          </motion.p>

          
          <motion.p
            className="text-center text-gray-600 text-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            Don't have an account?{" "}
            <motion.button
              onClick={() => navigate("/signuppage")}
              className="text-black hover:cursor-pointer font-semibold hover:underline"
             
            >
              Sign Up
            </motion.button>
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
