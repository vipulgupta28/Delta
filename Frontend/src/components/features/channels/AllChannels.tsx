import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../api/api";

interface User {
  username: string;
}

const AllChannels: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/get-users");
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
    <div className="mt-10">
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
  );
};

export default AllChannels;
