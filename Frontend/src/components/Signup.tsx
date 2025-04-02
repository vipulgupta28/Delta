import React, { useState} from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import OTPcomponent from "./OTPcomponent";
import axios from "axios";

 const Signup: React.FC = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const[showPass, setShowPass] = useState(false);
    const[input, setInput] = useState("");
    const[loading ,setLoading] = useState(false);
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
  
    const validEmail = (input:string ) => /\S+@\S+\.\S+/.test(input);

    const showPassword = () =>{
        setShowPass(!showPass);
    }
    const navigate = useNavigate();

    const onClickLogin = () =>{
        navigate("/");
    }

    const sendOTP = async() =>{
      if (!validEmail(input)) {
        alert("Please enter a valid email");
        return;
      }
      try{
        await axios.post("http://localhost:3000/api/v1/get-otp", {data:input});
      }
      catch(error){
        console.error(error);
        alert("Please enter a valid email");
      }
    }

    const verifyOTP = async () =>{
      const otpString = otp.join('');
      try{
        const response = await axios.post("http://localhost:3000/api/v1/verify-otp", {
          otp:otpString,
          userEmail:input
        });
        alert(response.data);
      }
      catch(error){
        console.log(error);
        alert("Invalid OTP");
      }
    }

    const signup = async () =>{

      try{
         const response = await axios.post("http://localhost:3000/api/v1/insert-into-users-table",{
          enteredUsername: username,
          enteredEmail: input,
          enteredPassword: password,
          
          
        })

        if(response.status == 201){
          setTimeout(()=>{
            setLoading(false),
            navigate("/");
          },1000);

            
        }
      }
      catch(error){
        console.error(error);
      }

    }


  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center gap-10">
        <h1 className="text-5xl font-bold selection:bg-white selection:text-black">Signup to DELTA</h1>

        <div className="flex flex-col gap-8 items-center">

          <div className="flex flex-col gap-2 ">
            <label className="selection:bg-white selection:text-black">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Create username"
              className="border p-3 w-105 rounded-[6px] selection:bg-white selection:text-black"
            />
          </div>

        <div className="flex flex-col gap-2">
          <label className="selection:bg-white selection:text-black">Password</label>
          <div className="relative w-105">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              className="border p-3 w-full rounded-[6px] pr-16 selection:bg-white selection:text-black"
            />
            <button
              type="button"
              onClick={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl font-medium text-white hover:cursor-pointer"
            >
               {showPass ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

          <div className="flex flex-col gap-2">
            <label

            className="selection:bg-white selection:text-black">Email</label>
            <div className="flex gap-4">
              <input
                type="mail"
                value={input}
                onChange={(e)=>setInput(e.target.value)}
                placeholder="Enter email"
                className="border p-3 w-80 rounded-[6px] selection:bg-white selection:text-black"
              />
              <button
              onClick={sendOTP} 
              className="bg-white text-black font-medium p-2 rounded-[6px] hover:cursor-pointer hover:bg-gray-200 transition duration-300 selection:bg-black selection:text-white">
                Send OTP
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 ">
            <label className="selection:bg-white selection:text-black">OTP</label>
            <div className="flex gap-4">
            <OTPcomponent otp={otp} setOtp={setOtp} />
              <button
              onClick={verifyOTP}
               className="bg-white text-black font-medium px-6 rounded-[6px] hover:cursor-pointer hover:bg-gray-200 transition duration-300 selection:bg-black selection:text-white">
                Verify
              </button>
            </div>
          </div>

        {loading ? (
          <div className="text-lg font-semibold text-gray-600">Signing up...</div>
        ):(
          <button
          onClick={signup} 
          className="bg-white text-black w-105 p-3 font-medium rounded-[6px] hover:cursor-pointer hover:bg-gray-200 transition duration-300 selection:bg-black selection:text-white">
            SignUp
          </button>
        )}   
          
          <p className="flex text-gray-500 selection:bg-white selection:text-black">Already have an account?</p>
        <button
       onClick={onClickLogin}
        className="bg-white text-black w-105 p-3 font-medium rounded-[6px] hover:cursor-pointer hover:bg-gray-200 animation duration-400 selection:bg-black selection:text-white">
            Login
        </button>
        </div>
      </div>
    </>
  );
};
 export default Signup
