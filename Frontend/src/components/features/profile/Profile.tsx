import { useEffect, useState } from "react";
import api from "../../../api/api";
import { Channel } from "../channels";
import UsersUploads from "./UsersUploads";
import { UserPosts } from "../posts";
import { Shorts } from "../videos";

const Profile = () => {
 

  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [bannerImg, setBannerImg] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [location, setLocation] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await api.get("/me"); // makes request with cookie
      const user = res.data.user;

      setUsername(user.username);
      setUserId(user.user_id);

    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  fetchUser();
}, []);


  const tabClass = (tab:string) =>
    `px-6 py-3 font-medium text-sm cursor-pointer transition-colors ${
      activeTab === tab 
        ? "text-white rounded-full bg-zinc-800" 
        : "text-gray-400 hover:text-white hover:bg-zinc-900 rounded-full"
    }`;

  const toggleProfileModal = () => {
    setIsVisible(!isVisible);
  };

 const handleChanges = async () => {
  if (!userId) return;

  const formData = new FormData();
  
  if (bannerFile) {
    const bannerFileName = `${userId}-banner-${Date.now()}-${bannerFile.name}`;
    formData.append("banner", bannerFile);
    formData.append("bannerFileName", bannerFileName);
  }

  if (profileFile) {
    const profileFileName = `${userId}-profile-${Date.now()}-${profileFile.name}`;
    formData.append("profile", profileFile);
    formData.append("profileFileName", profileFileName);
  }

  formData.append("userId", userId);
  formData.append("bio", bio);
  formData.append("location", location);

  try {
    const response = await api.post("/handleProfileChanges", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      console.log("Profile updated successfully:", response.data);
      setIsVisible(false);
    } else {
      console.error("Error updating profile:", response.data.error);
    }
  } catch (error) {
    console.error("Update failed:", error);
  }
};


  useEffect(() => {
    const fetchProfile = async () => {

      
      try {
        const response = await api.get(`/getProfileChanges/${userId}`);
        if (response.status === 200) {
       
          setBio(response.data.profile.bio || "");
          setBannerImg(response.data.profile.banner_img|| "");
          setProfileImg(response.data.profile.profile_img || "");
          setFollowers(response.data.profile.followers || 0);
          setFollowing(response.data.profile.following || 0);
          setLocation(response.data.profile.location || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  return (
    <div className="min-h-screen bg-black text-white">
   
      <main className="max-w-6xl mx-auto">
        <div className="relative">

            <img
            src={bannerImg || "https://via.placeholder.com/1600x400"}
            alt="Banner"
            className="w-full rounded-xl h-48  border border-zinc-800 md:h-60 object-cover"
          />
          
          <div className="absolute -bottom-16 left-6">
            <div className="w-32 h-32 rounded-full border-2 border-zinc-800 bg-black overflow-hidden">
              <img 
                src={profileImg || "https://via.placeholder.com/150"} 
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
           <button
              onClick={toggleProfileModal}
              className="px-4 py-2 hover:cursor-pointer bg-transparent border border-zinc-800 text-white font-medium rounded-full hover:bg-zinc-900 transition-colors"
            >
              Edit profile
            </button>
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
                <span>{location}</span>
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
          </div>

          {/* Tabs */}
          <div className="">
            <nav className="flex overflow-x-auto">
              <button 
                onClick={() => setActiveTab("upload")} 
                className={tabClass("upload")}
              >
                Upload Long News
              </button>
              <button 
                onClick={() => setActiveTab("shorts")} 
                className={tabClass("shorts")}
              >
                Upload 1-minute News
              </button>
              <button 
                onClick={() => setActiveTab("uploads")} 
                className={tabClass("uploads")}
              >
                My Uploads
              </button>
              <button 
                onClick={() => setActiveTab("posts")} 
                className={tabClass("posts")}
              >
                My Posts
              </button>
             
               
            </nav>
          </div>
        </div>

        <div className="px-6 pb-12">
          {activeTab === "upload" && <Channel />}
          {activeTab === "uploads" && <UsersUploads />}
          {activeTab === "posts" && <UserPosts userId={userId} />}
           {activeTab === "shorts" && <Shorts />}
        </div>
      </main>

      {isVisible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-lg w-full max-w-2xl border border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <button 
                onClick={toggleProfileModal} 
                className="rounded-full p-2 hover:bg-zinc-800 hover:cursor-pointer transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-xl font-bold">Edit profile</h2>
              <button
                onClick={handleChanges}
                className="px-4 py-2 hover:cursor-pointer rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors"
              >
                Save
              </button>
            </div>

            <div className="p-6">
              <div className="relative mb-16">

      <label className="w-full h-40 bg-gray-800 rounded-lg overflow-hidden block  cursor-pointer">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setBannerImg(URL.createObjectURL(file));
              setBannerFile(file); 
            }
          }}
        />
        <img
          src={bannerImg || "https://via.placeholder.com/1600x400"}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </label>

  <div className="absolute -bottom-12 left-4">
    <label className="block cursor-pointer">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setProfileImg(URL.createObjectURL(file));
            setProfileFile(file);
          }
        }}
      />
      <div className="w-24 h-24 rounded-full bg-gray-800 border-4 border-gray-900 overflow-hidden">
        <img
          src={profileImg || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
    </label>
  </div>
</div>


              <div className="space-y-6">
               
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full h-32 bg-black border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-white focus:border-transparent"
                    placeholder="Tell the world about yourself"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-white focus:border-transparent"
                    placeholder="Where in the world are you?"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;