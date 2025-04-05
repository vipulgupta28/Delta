import React from "react";
import { Routes, Route } from 'react-router-dom';
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import TheChangePage from "../pages/TheChangePage";
import OTPgatewaypage from "../pages/OTPgatewaypage";
import HomePage from "../pages/HomePage";
import ChannelPage from "../pages/ChannelPage";
import AllChannelsPage from "../pages/AllChannelsPage";
import TrendingPage from "../pages/TrendingPage";

const AppRoutes:React.FC = () =>{
    return(
        <>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="signuppage" element={<SignupPage/>}/>
            <Route path="thechangepage" element={<TheChangePage/>}/>
            <Route path="otpgatewaypage" element={<OTPgatewaypage/>}/>
            <Route path="homepage" element={<HomePage/>}/>
            <Route path="channelpage" element={<ChannelPage/>}/>
            <Route path="allchannelspage" element={<AllChannelsPage/>}/>
            <Route path="trendingpage" element={<TrendingPage/>}/>

        </Routes>
        </>
    )
}

export default AppRoutes