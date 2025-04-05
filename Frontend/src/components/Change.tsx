import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Change: React.FC = () => {
  const navigate = useNavigate();
  const [key, setStoredKey] = useState("");

  const savePassword = () => {
    navigate("/loginpage");
  };

  useEffect(() => {
    const storedKey = localStorage.getItem("key");
    setStoredKey(storedKey ?? "0");
  }, []);

  return (
    <>
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

        {/* Inputs Based on Key */}
        {key === "1" && (
          <div className="flex flex-col gap-3">
            <label>New Username</label>
            <input
              type="text"
              className="border w-100 p-3 rounded-[6px]"
              placeholder="New Username"
            />
          </div>
        )}

        {key === "2" && (
          <>
            <div className="flex flex-col gap-3">
              <label>New Password</label>
              <input
                type="password"
                className="border w-100 p-3 rounded-[6px]"
                placeholder="New Password"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label>Confirm Password</label>
              <input
                type="password"
                className="border w-100 p-3 rounded-[6px]"
                placeholder="Confirm Password"
              />
            </div>
          </>
        )}

        {key === "3" && (
          <div className="flex flex-col gap-3">
            <label>New Email</label>
            <input
              type="email"
              className="border w-100 p-3 rounded-[6px]"
              placeholder="New Email"
            />
          </div>
        )}

        {/* Save Button */}
        {["1", "2", "3"].includes(key) && (
          <button
            onClick={savePassword}
            className="bg-white text-black p-3 w-100 rounded-[6px] font-medium hover:cursor-pointer hover:bg-gray-200 transition duration-400"
          >
            Save
          </button>
        )}
      </div>
    </>
  );
};

export default Change;
