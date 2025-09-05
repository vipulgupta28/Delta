import React from "react";
import { Routes, Route } from 'react-router-dom';
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import TheChangePage from "../pages/TheChangePage";
import OTPgatewaypage from "../pages/OTPgatewaypage";
import HomePage from "../pages/HomePage";
import ChannelPage from "../pages/ChannelPage";
import TrendingPage from "../pages/TrendingPage";

import HappeningsPage from "../pages/HappeningsPage";
import UserPostsPage from "../pages/UsersPostsPage";
import DetailNewsPage from "../pages/DetailNewsPage";
import UsersUploadsPage from "../pages/UsersUploadPage";
import ProfilePage from "../pages/ProfilePage";
import DebateRoomsPage from "../pages/DebateRoomsPage";
import UsersProfilePage from "../pages/UsersProfilePage";
import AIpage from "../pages/AIpage";

import InboxPage from "../pages/InboxPage";

import MagicLogin from "../components/features/auth/MagicLogin";

const AppRoutes:React.FC = () =>{
    return(
        <>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="signup" element={<SignupPage/>}/>
            <Route path="thechangepage" element={<TheChangePage/>}/>
            <Route path="otpgateway" element={<OTPgatewaypage/>}/>
            <Route path="home" element={<HomePage/>}/>
            <Route path="channel" element={<ChannelPage/>}/>
          
            <Route path="trending" element={<TrendingPage/>}/>
       
            <Route path="happenings" element={<HappeningsPage/>}/>
            <Route path="detailnews" element={<DetailNewsPage/>}/>
            <Route path="userposts" element={<UserPostsPage/>}/>
            <Route path="usersuploads" element={<UsersUploadsPage/>}/>
            <Route path="debaterooms" element={<DebateRoomsPage/>}/>
            <Route path="profile" element={<ProfilePage/>}/>
            <Route path="inbox" element={<InboxPage/>}/>
         
            <Route path="ai" element={<AIpage/>}/>
            <Route path="/usersprofilepage/:userId" element={<UsersProfilePage />} />

            <Route path="/magic-login" element={<MagicLogin />} />


        </Routes>
        </>
    )
}

export default AppRoutes