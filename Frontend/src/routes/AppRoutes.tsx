import React from "react";
import { Routes, Route } from 'react-router-dom';
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import OTPgatewaypage from "../pages/OTPgatewaypage";
import HomePage from "../pages/HomePage";
import ChannelPage from "../pages/ChannelPage";

const AppRoutes:React.FC = () =>{
    return(
        <>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="signuppage" element={<SignupPage/>}/>
            <Route path="forgotpasswordpage" element={<ForgotPasswordPage/>}/>
            <Route path="otpgatewaypage" element={<OTPgatewaypage/>}/>
            <Route path="homepage" element={<HomePage/>}/>
            <Route path="channelpage" element={<ChannelPage/>}/>

        </Routes>
        </>
    )
}

export default AppRoutes