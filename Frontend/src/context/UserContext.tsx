import React, { createContext, useContext, useEffect, useState } from "react";

// Define the type for your context
interface UserContextType {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  email:string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

// Create context with default undefined values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  // Load from localStorage on app start
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("user_id");
    const storedEmail = localStorage.getItem("email");

    if (storedUsername) setUsername(storedUsername);
    if (storedUserId) setUserId(storedUserId);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, userId, setUserId, email,setEmail }}>
      {children}
    </UserContext.Provider>
  );
};
