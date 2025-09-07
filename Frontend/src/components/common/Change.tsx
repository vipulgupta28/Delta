
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";

const Change: React.FC = () => {
  const navigate = useNavigate();
  const [key, setStoredKey] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const updateUsername = async () => {
    try {
      const response = await api.post("/update-username", {
        email: localStorage.getItem("email"),
        newUsername: newUsername,
      });
    
   
      if(response.status === 200){
        toast.success("Username Updated Successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to update username");
    }
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await api.post("/update-password", {
        email: localStorage.getItem("email"),
        newPassword: newPassword,
      });
     
      if(response.status === 200){
        toast.success("Password Updated Successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  const updateEmail = async () => {
    try {
      const response = await api.post("/update-email", {
        oldEmail: localStorage.getItem("email"),
        newEmail: newEmail,
      });
   
      localStorage.setItem("email", newEmail);
      if(response.status === 200){
        toast.success("Email Updated Successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to update email");
    }
  };

  useEffect(() => {
    const storedKey = localStorage.getItem("key");
    setStoredKey(storedKey ?? "0");
  }, []);

  return (
    <div className="min-h-screen text-white flex flex-col justify-center items-center gap-10">
      <h1 className="text-5xl font-bold">
        {key === "1"
          ? "Change Username"
          : key === "2"
          ? "Change Password"
          : key === "3"
          ? "Change Email"
          : "Invalid Action"}
      </h1>

      {key === "1" && (
        <div className="flex flex-col gap-3">
          <label>New Username</label>
          <input
            type="text"
            className="border w-100 p-3 rounded-[6px] text-white"
            placeholder="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <button
            onClick={updateUsername}
            className="bg-white p-3 text-black font-bold mt-2 rounded-[6px] hover:cursor-pointer hover:bg-gray-200 transition duration-300"
          >
            Save
          </button>
        </div>
      )}

      {key === "2" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2"> 
          <label>New Password</label>
          <input
            type="text"
            className="border w-100 p-3 rounded-[6px] text-white"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          </div>
          
          <div className="flex flex-col gap-2">
          <label>Confirm Password</label>
          <input
            type="text"
            className="border w-100 p-3 rounded-[6px] text-ehite"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          </div>
          
          <button
            onClick={updatePassword}
            className="bg-white p-3 text-black font-bold mt-2 rounded-[6px] hover:cursor-pointer hover:bg-gray-200 transition duration-300"
          >
            Save
          </button>
        </div>
      )}

      {key === "3" && (
        <div className="flex flex-col gap-3">
          <label>New Email</label>
          <input
            type="email"
            className="border w-100 p-3 rounded-[6px] text-white"
            placeholder="New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button
            onClick={updateEmail}
            className="bg-white p-3 text-black font-bold mt-2 rounded-[6px] hover:cursor-pointer hover:bg-gray-200 transition duration-300"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default Change;
