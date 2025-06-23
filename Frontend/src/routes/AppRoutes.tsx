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
import ResearchPage from "../pages/ResearchPage";
import HappeningsPage from "../pages/HappeningsPage";
import UserPostsPage from "../pages/UserPostsPage";
import DetailNewsPage from "../pages/DetailNewsPage";
import UsersUploadsPage from "../pages/UsersUploadPage";
import ProfilePage from "../pages/ProfilePage";
import DebateRoomsPage from "../pages/DebateRoomsPage";
import UsersProfilePage from "../pages/UsersProfilePage";

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
            <Route path="researchpage" element={<ResearchPage/>}/>
            <Route path="happeningspage" element={<HappeningsPage/>}/>
            <Route path="detailnewspage" element={<DetailNewsPage/>}/>
            <Route path="userpostspage" element={<UserPostsPage/>}/>
            <Route path="usersuploadspage" element={<UsersUploadsPage/>}/>
            <Route path="debateroomspage" element={<DebateRoomsPage/>}/>
            <Route path="profilepage" element={<ProfilePage/>}/>
            <Route path="/usersprofilepage/:userId" element={<UsersProfilePage />} />


        </Routes>
        </>
    )
}

export default AppRoutes