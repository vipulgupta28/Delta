import { useEffect, useState } from "react";
import axios from "axios";
import UsersUploads from "./UsersUploads";
import { Shorts } from "../videos";
import api from "../../../api/api";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { UserPosts } from "../posts";



const UsersProfile = () => {

  const { userId: targetUserId } = useParams();


  const [activeTab, setActiveTab] = useState("uploads");
  const [username, setUsername] = useState("");
  const [userId, setuserId] = useState("");
  const [targetId, setTargetuserId] = useState("");
  const [bio, setBio] = useState("");
  const [bannerImg, setBannerImg] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [getlocation, setLocation] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);



  const tabClass = (tab:string) =>
    `px-6 py-3 font-medium text-sm cursor-pointer transition-colors ${
      activeTab === tab 
        ? "text-white border-b-2 border-white" 
        : "text-gray-400 hover:text-white hover:bg-zinc-900 rounded-full"
    }`;


    useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me"); 
       
      
       setuserId(res.data.user.user_id)
      } catch (err) {
        console.error("Failed to fetch user", err);
       
      }
    };

    fetchUser();
  }, []);

  
useEffect(() => {
  if (targetUserId) {
     setTargetuserId(targetUserId);
     console.log("Targetid:",targetUserId);
  }
}, [targetUserId]);

  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/getProfileChanges/${targetId}`);
        if (response.status === 200) {
          setBio(response.data.profile.bio || "");
          setBannerImg(response.data.profile.banner_img || "");
          setUsername(response.data.profile.username || "");
          setProfileImg(response.data.profile.profile_img || "");
          setFollowers(response.data.profile.followers || 0);
          setFollowing(response.data.profile.following || 0);
          setLocation(response.data.profile.location || "");
          setIsFollowing(response.data.isFollowing);

          console.log(response.data.profile.username)

          
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (targetId) fetchProfile();
  }, [targetId]);


 const handleFollow = async (targetUserId: string) => {
  try {
    const response = await api.post("/handleFollow", {
      follower_id: userId,        // logged-in user
      following_id: targetUserId  // the user you want to follow
    });

    if (response.status === 200) {
      toast.success(response.data.message);

       if (response.data.isFollowing) {
        setFollowers((prev) => prev + 1);
      } else {
        setFollowers((prev) => Math.max(0, prev - 1));
      }

    }
  } catch (error) {
    console.error("Follow error:", error);
    toast.error("Failed to follow/unfollow user");
  }
};



  return (
    <div className="min-h-screen bg-black text-white">
     

      {/* Profile Content */}
      <main className="max-w-6xl mx-auto">
        {/* Banner and Profile Image */}
        <div className="relative">
          <img
            src={bannerImg}
            alt="Banner"
            className="w-full border border-zinc-800 rounded-xl h-48 md:h-60 object-cover"
          />
          <div className="absolute -bottom-16 left-6">
            <div className="w-32 h-32 rounded-full border-2 border-zinc-800 bg-black overflow-hidden">
              <img 
                src={profileImg} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="absolute bottom-6 right-6">
           
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-6 pt-20 pb-6">
          <div className="flex justify-between">

         
          <h1 className="text-2xl font-bold mb-2">{username}</h1>
          
             </div>
          
          <p className="text-gray-300 mb-4 max-w-2xl">
            {bio || "No bio yet."}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-[#60A5FA] text-sm mb-4">
            {location && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>{getlocation}</span>
              </div>
            )}
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span>Active since {new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' })}</span>
            </div>
           
          </div>

          <div className="flex gap-6 mb-6">
            <div className="flex items-center">
              <span className="font-semibold mr-1">{followers}</span>
              <span className="text-gray-500">Followers</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-1">{following}</span>
              <span className="text-gray-500">Following</span>
            </div>

            <button
            onClick={()=>handleFollow(targetId)}
             className="bg-white px-3 py-2 rounded-xl text-black hover:cursor-pointer">{isFollowing ? "Unfollow" : "Follow"}</button>
          </div>

          {/* Tabs */}
          <div className="">
            <nav className="flex overflow-x-auto">
             
           
              <button 
                onClick={() => setActiveTab("uploads")} 
                className={tabClass("uploads")}
              >
                All Uploads
              </button>

            
              <button 
                onClick={() => setActiveTab("posts")} 
                className={tabClass("posts")}
              >
                All Posts
              </button>
            
             
              
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 pb-12">
        {activeTab === "uploads" && <UsersUploads />}
        {activeTab === "posts" && <UserPosts userId={targetId} />}
        {activeTab === "shorts" && <Shorts />}
</div>

      </main>
      
    </div>
  );
};

export default UsersProfile;