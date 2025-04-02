import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 

  const showPassword = () => {
    setShowPass(!showPass);
  };

  const onClickSignUp = () => {
    navigate("/SignUpPage");
  };

  const onClickForgotPassword = () => {
    navigate("/OTPgatewayPage");
  };

  const onClickLogin = async () => {
    try {
      setLoading(true); 

      const response = await axios.post("http://localhost:3000/api/v1/login-into", {
        enteredUsername: username,
        enteredPassword: password
      });

      if (response.status === 200) {
        setTimeout(() => {
          setLoading(false); 
          navigate("/homepage"); 
        }, 1000);
      }
    } catch (error) {
      setLoading(false); 
      console.error(error);
      alert("Invalid credentials");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center gap-10">
        <h1 className="text-5xl font-bold selection:bg-white selection:text-black">
          Login To DELTA
        </h1>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <label className="selection:bg-white selection:text-black">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="border p-3 w-100 rounded-[6px] selection:bg-white selection:text-black"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="selection:bg-white selection:text-black">Password</label>
            <div className="relative w-100">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="border p-3 w-full rounded-[6px] pr-12 selection:bg-white selection:text-black"
              />
              <button
                type="button"
                onClick={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-white hover:cursor-pointer"
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <button
              onClick={onClickForgotPassword}
              className="text-sm font-medium hover:cursor-pointer hover:underline transition duration-400 self-end"
            >
              Forgot Password
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-lg font-semibold text-gray-600">Logging in...</div>
        ) : (
          <button
            onClick={onClickLogin}
            className="bg-white text-black w-100 p-3 font-medium rounded-[6px] hover:cursor-pointer hover:bg-gray-200 transition duration-300 selection:bg-black selection:text-white"
          >
            Login
          </button>
        )}

        <p className="flex text-gray-500 selection:bg-white selection:text-black">
          Don't have an account yet?
        </p>
        <button
          onClick={onClickSignUp}
          className="bg-white text-black w-100 p-3 font-medium rounded-[6px] hover:cursor-pointer hover:bg-gray-200 transition duration-300 selection:bg-black selection:text-white"
        >
          SignUp
        </button>
      </div>
    </>
  );
};

export default Login;
