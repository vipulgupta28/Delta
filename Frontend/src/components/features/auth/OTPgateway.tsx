import React, { useState, useEffect } from 'react';
import OTPcomponent from './OTPcomponent';
import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';
import api from '../../../api/api';

const OTPgateway: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isMounted, setIsMounted] = useState(false); 
  const [email, setStoredEmail] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setStoredEmail(storedEmail);
    } else {
      setStoredEmail("your email"); 
    }
  }, []);

 
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async () => {
    const otpValue = otp.join('');
    try {
      const response = await api.post("/verify-otp", {
        otp: otpValue,
        userEmail: email,  
      });
  
      toast.success(response.data.message); 
      navigate("/TheChangePage");
  
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "Invalid OTP");
      } else {
        toast.error("Something went wrong while verifying OTP");
      }
      console.error(error);
    }
  };
  
  const resendOtp = async () => {
    try {
      await api.post("/get-otp", {
        data: email
      });
      toast.success("OTP resent successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to resend OTP");
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-white justify-center items-center gap-6">
      <h1
        className={`text-2xl font-bold mb-4 transition-all duration-700 ${
          isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}
      >
        Enter OTP sent to registered email 
      </h1>

      <div
        className={`transition-all duration-700 delay-100 ${
          isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}
      >
        <OTPcomponent otp={otp} setOtp={setOtp} />
      </div>

      <div className='flex gap-20'>
      <button
        onClick={handleSubmit}
        className={`mt-4 bg-black text-white px-6 py-2 rounded hover:cursor-pointer hover:bg-gray-700 transition-all duration-700 delay-200 ${
          isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}
      >
        Verify OTP
      </button>

      <button
      onClick={resendOtp}
           className={`mt-4 bg-black text-white px-6 py-2 rounded hover:cursor-pointer hover:bg-gray-700 transition-all duration-700 delay-200 ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}>
        Resend OTP
      </button>
      </div>
      
    </div>
  );
};

export default OTPgateway;