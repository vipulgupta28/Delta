import React, { useState, useEffect } from 'react';
import OTPcomponent from './OTPcomponent';
import { useNavigate } from 'react-router-dom';

const OTPgateway: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isMounted, setIsMounted] = useState(false); // To trigger animations on mount
  const [email, setStoredEmail] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setStoredEmail(storedEmail);
    } else {
      setStoredEmail("your email"); // or handle the error as needed
    }
  }, []);

 
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = () => {
    const otpValue = otp.join('');
    console.log('OTP Entered:', otpValue);
    // API Call here
    navigate("/TheChangePage");
  };

  
  

  return (
    <div className="flex flex-col min-h-screen bg-white justify-center items-center gap-6">
      {/* Heading with fade-in and slide-up animation */}
      <h1
        className={`text-2xl font-bold mb-4 transition-all duration-700 ${
          isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}
      >
        Enter OTP sent to registered email <br/>{email}
      </h1>

      {/* OTP Component with fade-in and slide-up animation */}
      <div
        className={`transition-all duration-700 delay-100 ${
          isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}
      >
        <OTPcomponent otp={otp} setOtp={setOtp} />
      </div>

      {/* Button with fade-in and slide-up animation */}
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