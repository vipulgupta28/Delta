import { useState, useRef } from "react";
import { useUser } from "../context/UserContext";

const Profile = () => {
  const { username } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [bannerImage, setBannerImage] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const bannerInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const toggleProfileModal = () => {
    setIsVisible(!isVisible);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(URL.createObjectURL(file));
    }
  };

  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full mx-auto text-white">
      {/* Banner */}
      <div className="relative">
        <img
          src={
            bannerImage ||
            "https://via.placeholder.com/800x200?text=Your+Banner+Image"
          }
          alt="Banner"
          className="h-48 w-full object-cover rounded-t-xl"
        />

        <input
          type="file"
          accept="image/*"
          ref={bannerInputRef}
          className="hidden"
          onChange={handleBannerChange}
        />
        <button
          onClick={() => bannerInputRef.current?.click()}
          className="absolute top-2 right-2 px-3 py-1 bg-black/60 text-xs rounded-full hover:bg-black/80"
        >
          Change Banner
        </button>

        {/* Profile Picture */}
        <div className="absolute -bottom-12 left-4">
          <img
            src={
              profileImage ||
              "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
            }
            className="w-24 h-24 rounded-full border-4 border-zinc-900 object-cover"
            alt="Profile"
          />

          <input
            type="file"
            accept="image/*"
            ref={profileInputRef}
            className="hidden"
            onChange={handleProfileChange}
          />
          <button
            onClick={() => profileInputRef.current?.click()}
            className="absolute bottom-1 right-1 px-2 py-0.5 text-xs bg-black/60 rounded-full hover:bg-black/80"
          >
            Edit
          </button>
        </div>

        {/* Edit Profile Button */}
        <div className="absolute bottom-2 right-4">
          <button
            onClick={toggleProfileModal}
            className="px-4 py-1 border border-zinc-500 rounded-full text-sm hover:bg-zinc-700 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Modal */}
      {isVisible && (
        <div className="fixed inset-0 bg-white/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black text-white rounded-xl w-full max-w-lg p-6 shadow-lg">
            <h1 className="text-xl font-bold mb-4">Edit Your Profile</h1>

            <input
              type="text"
              placeholder="Enter new username"
              className="w-full border border-zinc-700 p-2 rounded mb-4"
            />
            <textarea
              placeholder="Enter bio"
              className="w-full h-40 border border-zinc-700 p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={toggleProfileModal}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded bg-white text-black hover:bg-gray-200 ">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Info */}
      <div className="mt-16 px-4">
        <h1 className="text-xl font-bold">{username}</h1>
        <p className="text-sm text-zinc-400">@{username?.toLowerCase()}</p>

        <p className="mt-2 text-base">
          Passionate developer. Building cool stuff. 🚀
        </p>

        <div className="flex gap-4 mt-2 text-sm text-zinc-400">
          <span>📍 India</span>
          <span>📅 Joined June 2025</span>
        </div>

        <div className="flex gap-4 mt-3 text-sm">
          <span>
            <strong>120</strong> Following
          </span>
          <span>
            <strong>80</strong> Followers
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
