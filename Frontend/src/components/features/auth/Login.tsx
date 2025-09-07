import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../../api/api"; // axios instance

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Login
  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
       await api.post(
        "/login",
        {
          enteredUsername: username,
          enteredEmail: email,
          enteredPassword: password,
        },
        { withCredentials: true } // important for cookies
      );

      toast.success("Login successful!");
      navigate("/home"); // redirect to homepage or dashboard
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
      toast.error("Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Signup
  const handleSignup = async () => {
    setError("");
    setLoading(true);
    try {
       await api.post(
        "/signup",
        {
          enteredUsername: username,
          enteredEmail: email,
          enteredPassword: password,
        },
        { withCredentials: true }
      );

      toast.success("Signup successful!");
      navigate("/home"); // redirect to homepage after signup
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Signup failed");
      toast.error("Signup failed. Try again.");
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
        <h1 className="text-5xl font-extrabold tracking-tight text-center">
          Everything, Everywhere, All at Once
        </h1>
      </motion.div>

      <motion.div
        className="w-full lg:w-1/2 bg-white rounded-2xl p-10 max-w-lg shadow-2xl"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h1 className="text-4xl font-extrabold text-black text-center mb-8">
          Welcome Back to <span className="text-gray-800">DELTA</span>
        </h1>

        <div className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-black text-black"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-black text-black"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-black text-black"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center font-medium">
              {error}
            </div>
          )}

          {/* Buttons */}
          {loading ? (
            <div className="text-center text-gray-700 font-medium">
              Processing...
              <motion.div
                className="w-6 h-6 border-2 border-black border-t-transparent rounded-full mx-auto mt-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <motion.button
                onClick={handleLogin}
                className="w-full bg-black text-white p-3 rounded-lg font-semibold shadow-md hover:bg-gray-800 transition-all duration-300"
              >
                Login
              </motion.button>

              <motion.button
                onClick={handleSignup}
                className="w-full bg-gray-700 text-white p-3 rounded-lg font-semibold shadow-md hover:bg-gray-900 transition-all duration-300"
              >
                Signup
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
