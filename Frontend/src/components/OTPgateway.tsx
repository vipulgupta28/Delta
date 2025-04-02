import React, { useState } from 'react';
import OTPcomponent from './OTPcomponent';
import { useNavigate } from 'react-router-dom';

const OTPgateway: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const otpValue = otp.join('');
    console.log('OTP Entered:', otpValue);
    // API Call here
    navigate("/ForgotPasswordPage");
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center gap-6">
      <h1 className="text-2xl font-bold mb-4">Enter OTP sent to registered email</h1>
      
      <OTPcomponent otp={otp} setOtp={setOtp} />
      
      <button
        onClick={handleSubmit}
        className="mt-4 bg-white text-black px-6 py-2 rounded hover:cursor-pointer hover:bg-gray-200 animation duration-400"
      >
        Verify OTP
      </button>
    </div>
  );
};

export default OTPgateway;
