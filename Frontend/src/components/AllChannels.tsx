import React, { useEffect, useState } from "react";
import Navbar from "./HomeComponents/Navbar";
import Sidebar from "./HomeComponents/Sidebar";
import axios from "axios";

interface User {
  username: string;
}

const Layout: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/get-users");
        if (res.data && res.data.success) {
          setUsers(res.data.users);
          console.log("Fetched users:", res.data.users);
        } else {
          console.error("API response error:", res.data);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
  
    fetchUsers();
  }, []);
  

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white">
      <Navbar />

      <div className="flex flex-1">
        <div className="w-60 mt-10">
          <Sidebar />
        </div>

        <div className="flex-1 mt-10 px-10 ml-10">
          <h1 className="text-3xl font-extrabold tracking-tight border-b border-gray-700 pb-2">
              Users Channels
            </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-6 text-center shadow-lg hover:bg-gray-200 hover:cursor-pointer transition duration-300"
              >
                <p className="text-xl font-medium text-black">{user.username}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
